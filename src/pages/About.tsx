import { Wrench, Heart, Shield, Zap } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            About All Tool — Shashi Ranjan Muzaffarpur
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
            <strong>All Tool — Shashi Ranjan Muzaffarpur</strong> is an online platform providing useful free tools for image processing, PDF management, document conversion, text utilities, and everyday digital tasks.
          </p>
          <p className="text-slate-600 text-base leading-relaxed mb-6">
            Created and maintained by <strong>Shashi Ranjan</strong> from <strong>Muzaffarpur, Bihar</strong>, our mission is to deliver fast, clean, and reliable web utilities accessible to students, professionals, and everyday internet users without requiring registration or paid subscriptions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <Zap className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">Fast & Lightweight</h3>
              <p className="text-xs text-slate-500">Built for speed on all mobile and desktop devices.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <Shield className="w-6 h-6 text-emerald-600 mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">Secure Processing</h3>
              <p className="text-xs text-slate-500">Client-side tools keep your files private and secure.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <Heart className="w-6 h-6 text-red-500 mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">100% Free</h3>
              <p className="text-xs text-slate-500">No login walls, no ads, and no hidden subscription fees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
