import { Wrench, Heart, Shield, FileText, Mail, Home } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleNavClick = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight">
                  All Tool
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Shashi Ranjan Muzaffarpur
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your ultimate collection of professional, fast, and free online tools for images, PDFs, text processing, and everyday utility tasks.
            </p>
            <div className="pt-2 text-xs text-slate-400 opacity-70">
              Powered by Shashi Ranjan
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNavClick('/')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Home className="w-4 h-4 text-blue-500" /> Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/tools')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4 text-blue-500" /> All Tools (30)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/about')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-blue-500" /> About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/contact')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-blue-500" /> Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Tools */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Popular Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNavClick('/tools/compress-jpg')}
                  className="hover:text-white transition-colors"
                >
                  Compress JPG / JPEG
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/tools/increase-jpg-size')}
                  className="hover:text-white transition-colors"
                >
                  Increase JPG Size (KB)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/tools/image-to-pdf')}
                  className="hover:text-white transition-colors"
                >
                  Image to PDF Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/tools/merge-pdf')}
                  className="hover:text-white transition-colors"
                >
                  Merge PDF Documents
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/tools/qr-generator')}
                  className="hover:text-white transition-colors"
                >
                  QR Code Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/tools/age-calculator')}
                  className="hover:text-white transition-colors"
                >
                  Age Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Privacy */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Legal & Security
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNavClick('/privacy')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-emerald-400" /> Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/terms')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-400" /> Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/admin/login')}
                  className="hover:text-white transition-colors flex items-center gap-2 text-blue-400 font-semibold"
                >
                  <Shield className="w-4 h-4" /> Admin Login
                </button>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-400">
              <p className="font-semibold text-slate-300 mb-1">Secure & Private</p>
              Processed files are handled securely. No registration required.
            </div>
          </div>
        </div>

        {/* Shashi Ranjan Muzaffarpur Detailed Footer Info */}
        <div className="mb-10 bg-slate-800/90 rounded-2xl p-6 sm:p-8 border border-slate-700/80 text-slate-300 text-sm leading-relaxed space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
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
            यह वेबसाइट <a href="http://alltoolbyshashiranjan.netlify.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-semibold underline">http://alltoolbyshashiranjan.netlify.app</a> पर चलती है और इसका पूरा कंट्रोल शशि रंजन मुजफ्फरपुर के पास है। हमारा उद्देश्य है कि मुजफ्फरपुर और पूरे बिहार के लोगों को फ्री, फास्ट और सुरक्षित टूल मिले। यहाँ कोई रजिस्ट्रेशन नहीं, कोई पैसा नहीं।
          </p>
          <p className="font-semibold text-white pt-2 border-t border-slate-700">
            अगर आप छात्र हैं, CSC चलाते हैं, या साइबर कैफे चलाते हैं तो यह टूल आपके लिए ही बना है।
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} All Tool — Shashi Ranjan Muzaffarpur. All rights reserved.
          </div>
          <div className="flex items-center gap-1 font-medium text-slate-300" style={{ opacity: 0.7 }}>
            Powered by Shashi Ranjan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mx-1" /> Muzaffarpur, Bihar
          </div>
        </div>
      </div>
    </footer>
  );
}
