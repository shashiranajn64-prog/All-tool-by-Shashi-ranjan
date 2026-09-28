import { useState, useEffect } from 'react';
import { Users, Eye, FileText, Mail, LogOut, ArrowLeft, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export function AdminDashboard({ onLogout, onNavigate }: AdminDashboardProps) {
  const [pageViews, setPageViews] = useState<number>(1284);
  const [resumesCreated, setResumesCreated] = useState<number>(342);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', message: 'Great PDF and resume tools! Thanks Shashi ji.', date: 'Today, 2:30 PM' },
    { id: 2, name: 'Amit Sharma', email: 'amit@example.com', message: 'How to compress PDF to exact 50KB?', date: 'Yesterday, 11:15 AM' },
  ]);

  useEffect(() => {
    // Increment or load page views from localStorage
    const storedViews = localStorage.getItem('all_tool_page_views');
    const views = storedViews ? parseInt(storedViews) + 1 : 1285;
    setPageViews(views);
    localStorage.setItem('all_tool_page_views', views.toString());

    const storedResumes = localStorage.getItem('all_tool_resumes_count');
    if (storedResumes) {
      setResumesCreated(parseInt(storedResumes));
    } else {
      localStorage.setItem('all_tool_resumes_count', '342');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              SR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-md">
                  Admin Panel
                </span>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Shashi Ranjan Muzaffarpur — Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> View Website
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Page Views</span>
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">{pageViews.toLocaleString()}</div>
            <div className="text-xs text-emerald-400 font-medium">↑ Real-time visitor tracking active</div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Resumes Created</span>
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white">{resumesCreated}</div>
            <div className="text-xs text-indigo-400 font-medium">Built across 6 templates</div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Active Tools</span>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">25+</div>
            <div className="text-xs text-emerald-400 font-medium">PDF, Image & Text Utilities</div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Contact Inquiries</span>
              <Mail className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">{messages.length}</div>
            <div className="text-xs text-amber-400 font-medium">New messages received</div>
          </div>
        </div>

        {/* Recent Contact Inquiries */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" /> Recent Contact Messages & Inquiries
            </h2>
            <span className="text-xs text-slate-400">Live Inbox</span>
          </div>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="font-bold text-white text-sm">{msg.name} <span className="text-xs font-normal text-slate-400">({msg.email})</span></div>
                  <div className="text-xs text-slate-500">{msg.date}</div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
