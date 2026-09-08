import React, { useState } from 'react';
import { Film, Music, Globe, Code2, Copy, Check, Sparkles, Terminal, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: 'movies' | 'music' | 'crawler' | 'docs';
  setActiveTab: (tab: 'movies' | 'music' | 'crawler' | 'docs') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/api` : 'https://your-domain.com/api';

  const copyBaseUrl = () => {
    navigator.clipboard.writeText(baseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  MediaCrawler <span className="text-cyan-400 font-semibold">API</span>
                </h1>
                <span className="text-[11px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  v1.0 Live
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                موتور هوشمند استخراج و وب‌سرویس RESTful فیلم، سریال، زیرنویس و موزیک
              </p>
            </div>
          </div>

          {/* API Base URL Banner */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            <span className="text-slate-400">Base API:</span>
            <code className="text-cyan-300 font-semibold">{baseUrl}</code>
            <button
              onClick={copyBaseUrl}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
              title="کپی آدرس پایه API"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('movies')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'movies'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>فیلم و سریال</span>
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'music'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>رادیو جوان</span>
            </button>

            <button
              onClick={() => setActiveTab('crawler')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'crawler'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>کرولر اختصاصی</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'docs'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>مستندات API</span>
            </button>
          </nav>
        </div>

        {/* Live Engine Status bar */}
        <div className="py-2 border-t border-slate-900/60 flex items-center justify-between text-[11px] text-slate-400 overflow-x-auto gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              سایت فیلم 1: <strong className="text-slate-200">دارک نما (darknama.pages.dev)</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              سایت فیلم 2: <strong className="text-slate-200">سینما فلیکس (cenamaflix.ir)</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              سایت موزیک: <strong className="text-slate-200">رادیو جوان (play.radiojavan.com)</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>آماده مصرف در وب‌سایت‌های وردپرس، ری‌اکت، اپلیکیشن و وبلاگ</span>
          </div>
        </div>

      </div>
    </header>
  );
};
