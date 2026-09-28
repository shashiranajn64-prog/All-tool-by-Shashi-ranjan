import { useState } from 'react';
import { Search, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TOOLS_DATA } from '../data/toolsData';
import { ToolCategory } from '../types';

interface AllToolsProps {
  onNavigate: (path: string) => void;
  onSelectTool: (toolId: string) => void;
}

export function AllTools({ onNavigate, onSelectTool }: AllToolsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');

  const filteredTools = TOOLS_DATA.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: { id: ToolCategory | 'all'; name: string }[] = [
    { id: 'all', name: 'All Tools (30)' },
    { id: 'image', name: 'Image Tools (10)' },
    { id: 'pdf', name: 'PDF Tools (10)' },
    { id: 'text', name: 'Text Tools (5)' },
    { id: 'utility', name: 'Utility Tools (5)' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            Complete Suite
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mt-3 mb-4">
            All 30 Online Tools
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Free, fast, and secure daily-use tools for images, PDFs, text, and utilities by Shashi Ranjan Muzaffarpur.
          </p>

          {/* Search bar */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search across all 30 tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => {
                window.open(tool.path, '_blank');
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
                  <CheckCircle2 className="w-3.5 h-3.5" /> Free
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  Use Tool <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 mt-8">
            <p className="text-slate-600 font-medium text-lg">No tools found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
