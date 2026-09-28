import { useState } from 'react';
import {
  Search,
  Wrench,
  FileImage,
  FileText,
  AlignLeft,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { TOOLS_DATA } from '../data/toolsData';
import { ToolCategory } from '../types';

interface HomeProps {
  onNavigate: (path: string) => void;
  onSelectTool: (toolId: string) => void;
}

export function Home({ onNavigate, onSelectTool }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');

  const filteredTools = TOOLS_DATA.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularTools = TOOLS_DATA.filter((t) => t.popular);

  const categories: { id: ToolCategory | 'all'; name: string; icon: any; desc: string; count: number }[] = [
    {
      id: 'all',
      name: 'All Tools',
      icon: Wrench,
      desc: 'Browse all 30 daily-use online tools',
      count: TOOLS_DATA.length,
    },
    {
      id: 'image',
      name: 'Image Tools',
      icon: FileImage,
      desc: 'Compress, resize, convert & edit images',
      count: TOOLS_DATA.filter((t) => t.category === 'image').length,
    },
    {
      id: 'pdf',
      name: 'PDF Tools',
      icon: FileText,
      desc: 'Merge, split, compress & convert PDFs',
      count: TOOLS_DATA.filter((t) => t.category === 'pdf').length,
    },
    {
      id: 'text',
      name: 'Text Tools',
      icon: AlignLeft,
      desc: 'Clean, convert and analyze text documents',
      count: TOOLS_DATA.filter((t) => t.category === 'text').length,
    },
    {
      id: 'utility',
      name: 'Utility Tools',
      icon: QrCode,
      desc: 'QR codes, password generator, age calculator',
      count: TOOLS_DATA.filter((t) => t.category === 'utility').length,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-400" />
            All Tool — Shashi Ranjan Muzaffarpur
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            All Your Daily Online Tools <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">in One Place</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Free, fast and easy-to-use tools for images, PDFs, documents and everyday tasks. No registration required.
          </p>

          {/* Large Search Box */}
          <div className="max-w-2xl mx-auto relative shadow-2xl rounded-2xl">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools (e.g. Compress JPG, PDF to JPG, QR Code)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white text-slate-900 placeholder-slate-400 rounded-2xl text-base sm:text-lg font-medium focus:outline-hidden focus:ring-4 focus:ring-blue-500/50 shadow-lg"
              />
            </div>
            {/* Search Suggestions dropdown if typing */}
            {searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-left">
                {filteredTools.slice(0, 6).map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool.id);
                      onNavigate(tool.path);
                    }}
                    className="px-5 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 flex items-center justify-between text-slate-800"
                  >
                    <div>
                      <div className="font-bold text-sm">{tool.name}</div>
                      <div className="text-xs text-slate-500">{tool.shortDesc}</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded-lg">
                      {tool.category}
                    </span>
                  </div>
                ))}
                {filteredTools.length === 0 && (
                  <div className="px-5 py-4 text-sm text-slate-500 text-center">
                    No tools found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs sm:text-sm text-slate-300">
            <span className="font-semibold text-slate-400">Popular Searches:</span>
            {[
              { name: 'Compress JPG', id: 'compress-jpg' },
              { name: 'PDF to JPG', id: 'pdf-to-jpg' },
              { name: 'Image to PDF', id: 'image-to-pdf' },
              { name: 'QR Code Generator', id: 'qr-generator' },
              { name: 'Age Calculator', id: 'age-calculator' },
            ].map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  onSelectTool(tag.id);
                  onNavigate(`/tools/${tag.id}`);
                }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-colors"
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`bg-white rounded-2xl p-5 shadow-md border cursor-pointer transition-all hover:scale-102 flex flex-col justify-between ${
                  isActive ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                    {cat.count} tools
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{cat.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured / All Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {selectedCategory === 'all' ? 'Featured & All Tools' : `${selectedCategory.toUpperCase()} Tools`}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Choose a tool below to get started instantly. Free & secure client-side processing.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/tools')}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            View All 30 Tools <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => {
                onSelectTool(tool.id);
                onNavigate(tool.path);
              }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    {tool.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  {tool.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {tool.shortDesc}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Free to use
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  Use Tool <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Features Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 mx-auto md:mx-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white mb-1">Lightning Fast</h3>
              <p className="text-sm text-slate-400">
                Optimized client-side processing runs directly in your browser for instant results without waiting.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 mx-auto md:mx-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white mb-1">100% Private & Secure</h3>
              <p className="text-sm text-slate-400">
                Your files remain secure on your device. We never expose or store uploaded files publicly.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center shrink-0 mx-auto md:mx-0">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white mb-1">No Registration Needed</h3>
              <p className="text-sm text-slate-400">
                Access all 30 daily tools instantly without creating an account or paying subscription fees.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
