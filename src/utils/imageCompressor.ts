/**
 * Target-size iterative JPEG compressor
 * Dynamically adjusts quality and resolution using binary search to achieve target KB within ±1–2 KB.
 */

export interface CompressionProgress {
  message: string;
  currentKb?: number;
  targetKb: number;
  stage?: 'analyzing' | 'searching' | 'scaling' | 'finalizing';
}

export interface CompressImageResult {
  blob: Blob;
  finalBytes: number;
  finalKb: number;
  targetKb: number;
  quality: number;
  scale: number;
  differenceKb: number;
  message: string;
}

/**
 * Inserts safe standard JPEG comment (COM) marker padding to match exact target bytes if needed.
 * ISO/IEC 10918-1 specifies 0xFF 0xFE as COM (Comment) marker, which all standard JPEG decoders ignore.
 */
function padJpegToTarget(jpegBytes: Uint8Array, targetBytes: number): Uint8Array {
  if (jpegBytes.length >= targetBytes) return jpegBytes;
  const paddingNeeded = targetBytes - jpegBytes.length;
  // A COM segment needs at least 4 bytes: 0xFF, 0xFE, len_hi, len_lo
  if (paddingNeeded < 4) return jpegBytes;

  // Ensure file starts with SOI (0xFF, 0xD8)
  if (jpegBytes[0] !== 0xFF || jpegBytes[1] !== 0xD8) return jpegBytes;

  // Insert after SOI (index 2)
  const segments: Uint8Array[] = [];
  let remainingPadding = paddingNeeded;

  while (remainingPadding >= 4) {
    // Max COM segment size is 65535 bytes
    const segLen = Math.min(remainingPadding, 65535);
    const seg = new Uint8Array(segLen);
    seg[0] = 0xFF;
    seg[1] = 0xFE;
    seg[2] = (segLen >> 8) & 0xFF;
    seg[3] = segLen & 0xFF;
    // fill payload with spaces or zeros
    seg.fill(0x20, 4);
    segments.push(seg);
    remainingPadding -= segLen;
  }

  const result = new Uint8Array(jpegBytes.length + (paddingNeeded - remainingPadding));
  result.set(jpegBytes.subarray(0, 2), 0);
  let offset = 2;
  for (const seg of segments) {
    result.set(seg, offset);
    offset += seg.length;
  }
  result.set(jpegBytes.subarray(2), offset);
  return result;
}

/**
 * Compresses an image to a target size in KB with tolerance within ±1–2 KB.
 */
export async function compressImageToTargetKb(
  imageSource: HTMLImageElement | File | Blob,
  targetKb: number,
  options?: {
    dpi?: number;
    onProgress?: (progress: CompressionProgress) => void;
  }
): Promise<CompressImageResult> {
  const targetBytes = Math.round(targetKb * 1024);
  const toleranceBytes = 2 * 1024; // ±2 KB tolerance

  options?.onProgress?.({
    message: 'Analyzing image...',
    targetKb,
    stage: 'analyzing',
  });

  // Load image if File or Blob
  let img: HTMLImageElement;
  if (imageSource instanceof HTMLImageElement) {
    img = imageSource;
  } else {
    img = new Image();
    const url = URL.createObjectURL(imageSource);
    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  // Helper to render canvas to JPEG Blob at given scale and quality
  const renderToJpegBlob = (scale: number, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const w = Math.max(10, Math.round(origWidth * scale));
      const h = Math.max(10, Math.round(origHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create JPEG blob'));
        },
        'image/jpeg',
        quality
      );
    });
  };

  let bestBlob: Blob | null = null;
  let bestQuality = 0.8;
  let bestScale = 1.0;
  let bestDiff = Infinity;

  // Function to search quality in range [qLow, qHigh] at a fixed scale
  const searchQualityAtScale = async (scale: number): Promise<Blob | null> => {
    let qLow = 0.02;
    let qHigh = 0.99;
    let localBestBlob: Blob | null = null;
    let localBestDiff = Infinity;

    for (let iter = 0; iter < 10; iter++) {
      const q = (qLow + qHigh) / 2;
      const blob = await renderToJpegBlob(scale, q);
      const diff = Math.abs(blob.size - targetBytes);

      options?.onProgress?.({
        message: `Optimizing: ${Math.round(blob.size / 1024)} KB / ${targetKb} KB (Quality: ${Math.round(q * 100)}%)`,
        currentKb: Math.round(blob.size / 1024),
        targetKb,
        stage: 'searching',
      });

      if (diff < localBestDiff) {
        localBestDiff = diff;
        localBestBlob = blob;
        bestQuality = q;
        bestScale = scale;
      }

      if (diff < bestDiff) {
        bestDiff = diff;
        bestBlob = blob;
      }

      // Check if within acceptable tolerance (±1–2 KB)
      if (diff <= toleranceBytes) {
        return blob;
      }

      if (blob.size > targetBytes) {
        qHigh = q; // need more compression
      } else {
        qLow = q; // need higher quality
      }
    }

    return localBestBlob;
  };

  // Step 1: Try at full scale (scale = 1.0)
  options?.onProgress?.({
    message: `Finding optimal compression for ${targetKb} KB...`,
    targetKb,
    stage: 'searching',
  });

  let currentBlob = await searchQualityAtScale(1.0);

  // Step 2: Check if even lowest quality at scale=1.0 is still larger than target (small target like 5KB, 10KB, 20KB)
  if (currentBlob && currentBlob.size > targetBytes + toleranceBytes) {
    options?.onProgress?.({
      message: 'Adjusting resolution for small target size...',
      targetKb,
      stage: 'scaling',
    });

    // Test with smaller scales proportionally
    let scaleLow = 0.05;
    let scaleHigh = 0.95;

    // Estimate initial scale from area ratio
    const areaRatio = Math.min(0.9, Math.sqrt(targetBytes / currentBlob.size) * 1.05);
    scaleHigh = Math.min(scaleHigh, Math.max(0.1, areaRatio));

    for (let sIter = 0; sIter < 6; sIter++) {
      const testScale = (scaleLow + scaleHigh) / 2;
      const scaledBlob = await searchQualityAtScale(testScale);
      if (!scaledBlob) continue;

      if (Math.abs(scaledBlob.size - targetBytes) <= toleranceBytes) {
        currentBlob = scaledBlob;
        break;
      }

      if (scaledBlob.size > targetBytes) {
        scaleHigh = testScale;
      } else {
        scaleLow = testScale;
      }
    }
  }

  let finalBlob = bestBlob || currentBlob || (await renderToJpegBlob(1.0, 0.8));

  // Step 3: Check if the file is slightly under target and needs fine-tuning to exact target
  // If size is smaller than targetBytes and we want exact match within ±1 KB
  if (finalBlob.size < targetBytes) {
    const gap = targetBytes - finalBlob.size;
    // If the gap is more than 1 KB and target is respected, pad with standard JPEG comment segment
    if (gap > 512) {
      try {
        const buffer = await finalBlob.arrayBuffer();
        const paddedBytes = padJpegToTarget(new Uint8Array(buffer), targetBytes);
        finalBlob = new Blob([paddedBytes.buffer as ArrayBuffer], { type: 'image/jpeg' });
      } catch (e) {
        console.warn('JPEG padding skipped:', e);
      }
    }
  }

  const finalBytes = finalBlob.size;
  const finalKb = parseFloat((finalBytes / 1024).toFixed(1));
  const diffKb = parseFloat(Math.abs(finalKb - targetKb).toFixed(1));

  options?.onProgress?.({
    message: `Target: ${targetKb} KB | Final: ${finalKb} KB`,
    currentKb: finalKb,
    targetKb,
    stage: 'finalizing',
  });

  return {
    blob: finalBlob,
    finalBytes,
    finalKb,
    targetKb,
    quality: parseFloat(bestQuality.toFixed(2)),
    scale: parseFloat(bestScale.toFixed(2)),
    differenceKb: diffKb,
    message: `Target: ${targetKb} KB, Final: ${finalKb} KB (Diff: ${diffKb} KB)`,
  };
}
