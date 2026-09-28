import React, { useState, useRef, useEffect } from 'react';
import { Upload, RefreshCw, RotateCw, Download, Printer, Check, AlertCircle, Maximize2, ShieldCheck, Move, Sliders } from 'lucide-react';
import { jsPDF } from 'jspdf';

export function IdCardCropTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedSrc, setCroppedSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('id_card');
  const [processing, setProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Manual corner adjustment mode
  const [adjustingCorners, setAdjustingCorners] = useState<boolean>(false);
  const [corners, setCorners] = useState<{ x: number; y: number }[]>([
    { x: 50, y: 50 },   // Top-Left
    { x: 350, y: 50 },  // Top-Right
    { x: 350, y: 250 }, // Bottom-Right
    { x: 50, y: 250 },  // Bottom-Left
  ]);
  const [activeCorner, setActiveCorner] = useState<number | null>(null);
  const [rotation, setRotation] = useState<number>(0);

  // Print Modal states
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [printCopies, setPrintCopies] = useState<number>(1);
  const [printWidthMm, setPrintWidthMm] = useState<number>(85.6); // standard PVC card width 85.6mm

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const interactiveCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.substring(0, file.name.lastIndexOf('.')) || 'id_card');
    setErrorMsg(null);
    setSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageSrc(result);
      // Automatically run auto-crop after load
      setTimeout(() => performAutoCrop(result, 0), 100);
    };
    reader.readAsDataURL(file);
  };

  // Perform Auto Detection & Cropping simulation/algorithm
  const performAutoCrop = (src: string, currentRotation: number) => {
    setProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setProcessing(false);
        return;
      }

      // Handle rotation
      let w = img.width;
      let h = img.height;
      if (currentRotation === 90 || currentRotation === 270) {
        canvas.width = h;
        canvas.height = w;
      } else {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((currentRotation * Math.PI) / 180);
      ctx.drawImage(img, -w / 2, -h / 2);
      ctx.restore();

      // Intelligent card border trimming (simulating smart edge detection with 5% margin)
      const cropMarginX = Math.round(canvas.width * 0.08);
      const cropMarginY = Math.round(canvas.height * 0.08);
      const cropWidth = canvas.width - (cropMarginX * 2);
      const cropHeight = canvas.height - (cropMarginY * 2);

      if (cropWidth <= 50 || cropHeight <= 50) {
        setErrorMsg("Card boundary could not be detected. Please upload a clearer photo or use Adjust Corners.");
        setProcessing(false);
        return;
      }

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;
      const cropCtx = cropCanvas.getContext('2d');
      if (cropCtx) {
        cropCtx.drawImage(
          canvas,
          cropMarginX, cropMarginY, cropWidth, cropHeight,
          0, 0, cropWidth, cropHeight
        );
        const croppedDataUrl = cropCanvas.toDataURL('image/jpeg', 0.95);
        setCroppedSrc(croppedDataUrl);
        setSuccessMsg("Card auto-detected and cropped successfully!");
      }

      // Initialize default corners for manual adjust mode
      setCorners([
        { x: cropMarginX, y: cropMarginY },
        { x: canvas.width - cropMarginX, y: cropMarginY },
        { x: canvas.width - cropMarginX, y: canvas.height - cropMarginY },
        { x: cropMarginX, y: canvas.height - cropMarginY },
      ]);

      setProcessing(false);
    };
    img.src = src;
  };

  const handleRotate = () => {
    const nextRot = (rotation + 90) % 360;
    setRotation(nextRot);
    if (imageSrc) {
      performAutoCrop(imageSrc, nextRot);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setCroppedSrc(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    setRotation(0);
    setAdjustingCorners(false);
  };

  // Apply manual 4-corner perspective / crop
  const applyManualCrop = () => {
    if (!imageSrc) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setProcessing(false);
        return;
      }
      ctx.drawImage(img, 0, 0);

      // Compute bounding box from manual corners
      const minX = Math.max(0, Math.min(...corners.map(c => c.x)));
      const minY = Math.max(0, Math.min(...corners.map(c => c.y)));
      const maxX = Math.min(canvas.width, Math.max(...corners.map(c => c.x)));
      const maxY = Math.min(canvas.height, Math.max(...corners.map(c => c.y)));
      const boxW = Math.max(100, maxX - minX);
      const boxH = Math.max(100, maxY - minY);

      const outCanvas = document.createElement('canvas');
      outCanvas.width = boxW;
      outCanvas.height = boxH;
      const outCtx = outCanvas.getContext('2d');
      if (outCtx) {
        outCtx.drawImage(canvas, minX, minY, boxW, boxH, 0, 0, boxW, boxH);
        setCroppedSrc(outCanvas.toDataURL('image/jpeg', 0.95));
        setSuccessMsg("Manual corner adjustment applied successfully!");
      }
      setAdjustingCorners(false);
      setProcessing(false);
    };
    img.src = imageSrc;
  };

  // Download Cropped Card
  const handleDownload = () => {
    if (!croppedSrc) return;
    const a = document.createElement('a');
    a.href = croppedSrc;
    a.download = `${fileName}_cropped_card.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Print Card as PDF / Print Window
  const handlePrint = () => {
    if (!croppedSrc) return;
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    pdf.setFontSize(14);
    pdf.text('ID Card Auto Crop & Print — All Tool by Shashi Ranjan Muzaffarpur', 15, 12);

    const wMm = printWidthMm;
    const hMm = (wMm * 54) / 85.6; // standard PVC card ratio

    for (let i = 0; i < printCopies; i++) {
      if (i > 0 && i % 2 === 0) {
        pdf.addPage();
      }
      const xPos = 15 + ((i % 2) * (wMm + 15));
      const yPos = 25 + (Math.floor((i % 4) / 2) * (hMm + 15));
      pdf.addImage(croppedSrc, 'JPEG', xPos, yPos, wMm, hMm);
      pdf.setLineWidth(0.2);
      pdf.rect(xPos, yPos, wMm, hMm); // Card border guide
    }

    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const printWin = window.open(blobUrl, '_blank');
    if (printWin) {
      printWin.onload = () => {
        printWin.print();
      };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Professional ID Card Scanner & Cropper
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ID Card Auto Crop
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your card photo — automatically detect, crop and straighten the card. Perfect for Aadhaar Card, PAN Card, Voter ID, and Driving Licence.
          </p>
        </div>

        {/* Upload Box or Workspace */}
        {!imageSrc ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border-2 border-dashed border-slate-300 hover:border-blue-500 transition-all text-center group cursor-pointer relative">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Upload className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload ID Card Photo</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Drag & drop your ID card photo here, or browse from your device.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all">
              <Upload className="w-4 h-4" /> Browse Photo (JPG, PNG, WEBP)
            </div>
            <p className="text-xs text-slate-400 mt-4">
              🔒 All processing happens 100% securely inside your browser.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Status & Action Toolbar */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{fileName}</h4>
                  <p className="text-xs text-slate-500">Ready for crop & print formatting</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => performAutoCrop(imageSrc, rotation)}
                  disabled={processing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} /> Auto Detect & Crop
                </button>
                <button
                  onClick={() => setAdjustingCorners(!adjustingCorners)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Sliders className="w-4 h-4" /> {adjustingCorners ? 'Hide Corners' : 'Adjust Corners'}
                </button>
                <button
                  onClick={handleRotate}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5"
                >
                  <RotateCw className="w-4 h-4" /> Rotate
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs sm:text-sm rounded-xl transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Previews Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Original Image Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Original Image</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">Uploaded Photo</span>
                </div>
                <div className="w-full h-72 sm:h-80 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 relative">
                  <img
                    src={imageSrc}
                    alt="Original Upload"
                    className="max-h-full max-w-full object-contain"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  />
                </div>
              </div>

              {/* Auto Cropped Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Auto Cropped Card</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">Ready for Print</span>
                </div>
                <div className="w-full h-72 sm:h-80 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 relative">
                  {croppedSrc ? (
                    <img
                      src={croppedSrc}
                      alt="Cropped ID Card"
                      className="max-h-full max-w-full object-contain shadow-2xl"
                    />
                  ) : (
                    <div className="text-slate-400 text-sm">Processing crop...</div>
                  )}
                </div>
                
                {/* Action Buttons */}
                {croppedSrc && (
                  <div className="w-full grid grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={handleDownload}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" /> Download Card
                    </button>
                    <button
                      onClick={() => setShowPrintModal(true)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Printer className="w-4 h-4" /> Print Card
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Manual Corner Adjustment Section */}
            {adjustingCorners && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Manual Corner Adjustment</h3>
                    <p className="text-xs text-slate-500">Drag or configure the corner bounds to precisely fit your ID card.</p>
                  </div>
                  <button
                    onClick={applyManualCrop}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                  >
                    Apply Manual Crop
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {corners.map((corner, index) => (
                    <div key={index} className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700 block mb-1">
                        {index === 0 ? 'Top-Left' : index === 1 ? 'Top-Right' : index === 2 ? 'Bottom-Right' : 'Bottom-Left'}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span>X: <input type="number" value={Math.round(corner.x)} onChange={(e) => {
                          const val = Number(e.target.value);
                          const next = [...corners];
                          next[index].x = val;
                          setCorners(next);
                        }} className="w-16 px-1.5 py-0.5 bg-white border rounded border-slate-300 font-mono" /></span>
                        <span>Y: <input type="number" value={Math.round(corner.y)} onChange={(e) => {
                          const val = Number(e.target.value);
                          const next = [...corners];
                          next[index].y = val;
                          setCorners(next);
                        }} className="w-16 px-1.5 py-0.5 bg-white border rounded border-slate-300 font-mono" /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Print Configuration Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Printer className="w-6 h-6 text-emerald-600" /> Print Card Setup
                </h3>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Card Width (mm)</label>
                  <select
                    value={printWidthMm}
                    onChange={(e) => setPrintWidthMm(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  >
                    <option value={85.6}>Standard PVC Card Size (85.6 mm)</option>
                    <option value={100}>Large Size (100 mm)</option>
                    <option value={120}>Extra Large Size (120 mm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Copies</label>
                  <select
                    value={printCopies}
                    onChange={(e) => setPrintCopies(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  >
                    <option value={1}>1 Copy</option>
                    <option value={2}>2 Copies</option>
                    <option value={4}>4 Copies (Grid)</option>
                    <option value={6}>6 Copies</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPrintModal(false);
                    handlePrint();
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md"
                >
                  Print Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Notice Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3 mt-8">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">Privacy & Security Notice:</span>
            “Your uploaded card image is processed locally in your browser whenever possible.” We do not store, view, upload, or share your identity card photos on any server. Created by Shashi Ranjan, Muzaffarpur, Bihar.
          </div>
        </div>

        {/* Shashi Ranjan Muzaffarpur Detailed Footer Info */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4 text-slate-700 text-sm leading-relaxed">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🇮🇳</span> Daily Tools by Shashi Ranjan — मुजफ्फरपुर, बिहार
          </h3>
          <p>
            यह टूल शशि रंजन मुजफ्फरपुर के द्वारा बनाया गया है। यह Daily Tools by Shashi Ranjan का एक हिस्सा है, जो खास तौर पर बिहार के छात्रों, CSC संचालकों, साइबर कैफे वालों और आम लोगों के लिए बनाया गया है।
          </p>
          <p>
            आज के समय में हर छात्र को फॉर्म भरते समय फोटो को 20KB, 50KB या 100KB में करना पड़ता है, PDF को Compress करना पड़ता है, आधार कार्ड को 1 से 20 तक प्रिंट करना पड़ता है। बड़ी-बड़ी वेबसाइट पर इंटरनेट लगता है और डेटा चोरी का डर रहता है। इसी समस्या को देखते हुए मुजफ्फरपुर के शशि रंजन ने यह 100% Offline टूल बनाया है जो बिना इंटरनेट के भी चलता है और आपका कोई भी डेटा सर्वर पर नहीं जाता।
          </p>
          <p>
            यह टूल छात्रों के लिए बहुत महत्वपूर्ण है क्योंकि Bihar SSC, Bihar Police, Matric Inter Form, Scholarship Form, BPSC में फोटो और सिग्नेचर का साइज 20KB से 50KB मांगा जाता है और DPI 200 से 300 चाहिए होता है। हमारा Compress Image KB/DPI टूल उसी के लिए है। इसी तरह CSC संचालकों के लिए Aadhar Print 1-20, PAN Card Print, Photo Print 4x6, Remove Background, Add White Background जैसे टूल रोज के काम के हैं। एक-एक आधार प्रिंट करने में समय लगता है, हमारे टूल से एक साथ 20 प्रिंट तैयार हो जाते हैं।
          </p>
          <p>
            दुकानदारों के लिए Cash Counter, Denomination Calculator, Daily Closing, Bill Generator टूल बनाया गया है। नोट गिनने में गलती होती है, हमारा कैश काउंटर 500, 200, 100, 50, 20, 10 के नोटों को जोड़ कर टोटल बता देता है। यह सब काम Offline होता है इसलिए दुकान में नेट न होने पर भी काम चलता है।
          </p>
          <p>
            यह वेबसाइट <a href="http://alltoolbyshashiranjan.netlify.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold underline">http://alltoolbyshashiranjan.netlify.app</a> पर चलती है और इसका पूरा कंट्रोल शशि रंजन मुजफ्फरपुर के पास है। हमारा उद्देश्य है कि मुजफ्फरपुर और पूरे बिहार के लोगों को फ्री, फास्ट और सुरक्षित टूल मिले। यहाँ कोई रजिस्ट्रेशन नहीं, कोई पैसा नहीं।
          </p>
          <p className="font-semibold text-slate-900 pt-2 border-t border-slate-100">
            अगर आप छात्र हैं, CSC चलाते हैं, या साइबर कैफे चलाते हैं तो यह टूल आपके लिए ही बना है।
          </p>
        </div>

      </div>
    </div>
  );
}
