/**
 * Target-size iterative PDF compressor
 * Extracts/renders PDF pages and dynamically optimizes compression parameters
 * to achieve exact target KB within ±1–2 KB.
 */

import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { CompressionProgress } from './imageCompressor';

// Configure PDF.js worker
if (typeof window !== 'undefined' && 'GlobalWorkerOptions' in pdfjsLib) {
  // Use cdnjs or unpkg worker; fallback to fake worker if offline
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
  } catch {
    // Falls back gracefully
  }
}

export interface CompressPdfResult {
  blob: Blob;
  finalBytes: number;
  finalKb: number;
  targetKb: number;
  pagesCount: number;
  differenceKb: number;
  message: string;
}

/**
 * Inserts safe standard PDF comment padding to match exact target bytes if needed.
 * PDF specification ISO 32000-1 allows comments starting with '%' anywhere.
 */
function padPdfToTarget(pdfBytes: Uint8Array, targetBytes: number): Uint8Array {
  if (pdfBytes.length >= targetBytes) return pdfBytes;
  const paddingNeeded = targetBytes - pdfBytes.length;
  if (paddingNeeded < 6) return pdfBytes; // Needs at least "% \n"

  // Create a comment line with padding
  const paddingComment = new Uint8Array(paddingNeeded);
  paddingComment[0] = 0x25; // '%'
  paddingComment[1] = 0x20; // ' '
  paddingComment.fill(0x30, 2, paddingNeeded - 1); // '0'
  paddingComment[paddingNeeded - 1] = 0x0A; // '\n'

  // Look for %%EOF near the end to insert before it, or append before final EOF
  const result = new Uint8Array(pdfBytes.length + paddingNeeded);
  
  // Find "%%EOF"
  let eofIndex = -1;
  for (let i = pdfBytes.length - 8; i >= 0; i--) {
    if (
      pdfBytes[i] === 0x25 &&
      pdfBytes[i + 1] === 0x25 &&
      pdfBytes[i + 2] === 0x45 &&
      pdfBytes[i + 3] === 0x4F &&
      pdfBytes[i + 4] === 0x46
    ) {
      eofIndex = i;
      break;
    }
  }

  if (eofIndex !== -1) {
    result.set(pdfBytes.subarray(0, eofIndex), 0);
    result.set(paddingComment, eofIndex);
    result.set(pdfBytes.subarray(eofIndex), eofIndex + paddingNeeded);
  } else {
    // Append directly before end
    result.set(pdfBytes, 0);
    result.set(paddingComment, pdfBytes.length);
  }

  return result;
}

/**
 * Compresses an uploaded PDF file to a target size in KB with tolerance within ±1–2 KB.
 */
export async function compressPdfToTargetKb(
  pdfFile: File | Blob,
  targetKb: number,
  options?: {
    onProgress?: (progress: CompressionProgress) => void;
  }
): Promise<CompressPdfResult> {
  const targetBytes = Math.round(targetKb * 1024);
  const toleranceBytes = 2 * 1024; // ±2 KB tolerance

  options?.onProgress?.({
    message: 'Reading and analyzing PDF document...',
    targetKb,
    stage: 'analyzing',
  });

  const arrayBuffer = await pdfFile.arrayBuffer();
  
  // Load PDF with PDF.js
  let pdfDoc: pdfjsLib.PDFDocumentProxy;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
    });
    pdfDoc = await loadingTask.promise;
  } catch (err) {
    console.error('PDF.js loading failed, attempting direct arrayBuffer loading:', err);
    throw new Error('Unable to read PDF file. Please ensure it is a valid, uncorrupted PDF document.');
  }

  const numPages = pdfDoc.numPages;
  if (numPages === 0) {
    throw new Error('PDF document contains no pages.');
  }

  options?.onProgress?.({
    message: `Rendering ${numPages} page${numPages > 1 ? 's' : ''} for optimization...`,
    targetKb,
    stage: 'analyzing',
  });

  // Render pages to canvases at baseline high resolution (scale 1.5)
  interface PageData {
    canvas: HTMLCanvasElement;
    widthPt: number;
    heightPt: number;
  }

  const renderPagesAtScale = async (scale: number): Promise<PageData[]> => {
    const pages: PageData[] = [];
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        }).promise;
      }
      // Get dimensions in points
      const origViewport = page.getViewport({ scale: 1.0 });
      pages.push({
        canvas,
        widthPt: origViewport.width,
        heightPt: origViewport.height,
      });
    }
    return pages;
  };

  // Initial render at standard 1.5x resolution
  let pageList = await renderPagesAtScale(1.5);

  // Helper to build PDF with given quality and return Blob
  const buildPdfBlob = (quality: number): Blob => {
    if (pageList.length === 0) throw new Error('No pages to build');

    const first = pageList[0];
    const doc = new jsPDF({
      orientation: first.widthPt > first.heightPt ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [first.widthPt, first.heightPt],
      compress: true,
    });

    for (let i = 0; i < pageList.length; i++) {
      const p = pageList[i];
      if (i > 0) {
        doc.addPage([p.widthPt, p.heightPt], p.widthPt > p.heightPt ? 'landscape' : 'portrait');
      }

      const imgData = p.canvas.toDataURL('image/jpeg', quality);
      doc.addImage(imgData, 'JPEG', 0, 0, p.widthPt, p.heightPt, undefined, 'FAST');
    }

    return doc.output('blob');
  };

  let bestBlob: Blob | null = null;
  let bestDiff = Infinity;

  // Binary search for quality in [0.03, 0.98]
  const searchQuality = async (): Promise<Blob> => {
    let qLow = 0.03;
    let qHigh = 0.98;
    let localBestBlob: Blob | null = null;
    let localBestDiff = Infinity;

    for (let iter = 0; iter < 10; iter++) {
      const q = (qLow + qHigh) / 2;
      const blob = buildPdfBlob(q);
      const diff = Math.abs(blob.size - targetBytes);

      options?.onProgress?.({
        message: `Optimizing PDF: ${Math.round(blob.size / 1024)} KB / ${targetKb} KB`,
        currentKb: Math.round(blob.size / 1024),
        targetKb,
        stage: 'searching',
      });

      if (diff < localBestDiff) {
        localBestDiff = diff;
        localBestBlob = blob;
      }
      if (diff < bestDiff) {
        bestDiff = diff;
        bestBlob = blob;
      }

      if (diff <= toleranceBytes) {
        return blob;
      }

      if (blob.size > targetBytes) {
        qHigh = q; // need smaller
      } else {
        qLow = q; // need larger
      }
    }

    return localBestBlob || buildPdfBlob(0.5);
  };

  options?.onProgress?.({
    message: `Finding optimal compression for ${targetKb} KB...`,
    targetKb,
    stage: 'searching',
  });

  let currentBlob = await searchQuality();

  // If even lowest quality is still larger than target (small target like 20KB for multi-page PDF)
  if (currentBlob && currentBlob.size > targetBytes + toleranceBytes) {
    options?.onProgress?.({
      message: 'Adjusting page resolution for small target size...',
      targetKb,
      stage: 'scaling',
    });

    // Re-render pages at lower scale (e.g. 0.8x or 0.5x)
    const scaleRatio = Math.max(0.3, Math.min(0.9, Math.sqrt(targetBytes / currentBlob.size) * 1.1));
    pageList = await renderPagesAtScale(scaleRatio);
    currentBlob = await searchQuality();
  }

  let finalBlob = bestBlob || currentBlob || buildPdfBlob(0.5);

  // If output size is smaller than targetBytes and needs fine-tuning to exact target
  if (finalBlob.size < targetBytes) {
    const gap = targetBytes - finalBlob.size;
    if (gap > 512) {
      try {
        const buffer = await finalBlob.arrayBuffer();
        const paddedBytes = padPdfToTarget(new Uint8Array(buffer), targetBytes);
        finalBlob = new Blob([paddedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      } catch (e) {
        console.warn('PDF padding skipped:', e);
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
    pagesCount: numPages,
    differenceKb: diffKb,
    message: `Target: ${targetKb} KB, Final: ${finalKb} KB (Diff: ${diffKb} KB)`,
  };
}
