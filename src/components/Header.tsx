import { useState } from 'react';
import { Menu, X, Wrench, Sparkles, Search } from 'lucide-react';
import { TOOLS_DATA } from '../data/toolsData';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onSelectTool?: (toolId: string) => void;
}

export function Header({ currentPath, onNavigate, onSelectTool }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredTools = searchQuery.trim()
    ? TOOLS_DATA.filter(
        t =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  All Tool
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  FREE
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 tracking-wide">
                Shashi Ranjan Muzaffarpur
              </p>
            </div>
          </div>

          {/* Quick Search bar in Header (Desktop) */}
          <div className="hidden md:block relative max-w-xs w-full lg:max-w-sm mx-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools (e.g. Compress JPG)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            {searchFocused && filteredTools.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onMouseDown={() => {
                      if (onSelectTool) onSelectTool(tool.id);
                      onNavigate(tool.path);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {tool.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[240px]">
                        {tool.shortDesc}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {tool.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('/')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('/tools')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/tools'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Tools
            </button>
            <button
              onClick={() => handleNavClick('/about')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/about'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('/contact')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/contact'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Special Header Buttons for New Tools */}
          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              onClick={() => window.open('/tools/passport-photo-print', '_blank')}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>📷 Passport Photo</span>
            </button>
            <button
              onClick={() => window.open('/tools/id-card-crop-pdf', '_blank')}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>🪪 ID Card Crop PDF</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 30+ tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {filteredTools.length > 0 && (
              <div className="mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => {
                      if (onSelectTool) onSelectTool(tool.id);
                      onNavigate(tool.path);
                      setMobileMenuOpen(false);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 text-sm font-medium text-slate-800 flex justify-between items-center"
                  >
                    <span>{tool.name}</span>
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">
                      {tool.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('/')}
              className={`p-3 rounded-xl text-left font-medium text-sm transition-colors ${
                currentPath === '/'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('/tools')}
              className={`p-3 rounded-xl text-left font-medium text-sm transition-colors ${
                currentPath === '/tools'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
              }`}
            >
              All Tools (30)
            </button>
            <button
              onClick={() => handleNavClick('/about')}
              className={`p-3 rounded-xl text-left font-medium text-sm transition-colors ${
                currentPath === '/about'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('/contact')}
              className={`p-3 rounded-xl text-left font-medium text-sm transition-colors ${
                currentPath === '/contact'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
              }`}
            >
              Contact Us
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 px-1">
            <span>Shashi Ranjan Muzaffarpur</span>
            <span className="flex items-center gap-1 font-semibold text-blue-600">
              <Sparkles className="w-3.5 h-3.5" /> 100% Free
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
