import React, { useState } from 'react';
import { 
  Globe, Play, Download, Copy, Check, ExternalLink, 
  Code2, AlertCircle, RefreshCw, FileText, CheckCircle2, Video, Music
} from 'lucide-react';

export const CrawlerSandbox: React.FC = () => {
  const [url, setUrl] = useState('https://cenamaflix.ir/batman-the-dark-knight-returns-part-1-2012-bluray/');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleUrls = [
    { label: 'پست بتمن در سینمافلیکس', url: 'https://cenamaflix.ir/batman-the-dark-knight-returns-part-1-2012-bluray/' },
    { label: 'آهنگ تجربه کن شادمهر در رادیو جوان', url: 'https://play.radiojavan.com/song/shadmehr-aghili-tajrobeh-kon' },
    { label: 'صفحه دارک‌نما', url: 'https://darknama.pages.dev/' },
    { label: 'صفحه آرتیست شادمهر', url: 'https://play.radiojavan.com/artist/Shadmehr-Aghili' },
  ];

  const handleCrawl = async (targetUrl = url) => {
    if (!targetUrl.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const start = performance.now();

    try {
      const res = await fetch('/api/crawler/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() })
      });
      const data = await res.json();
      setLatency(Math.round(performance.now() - start));

      if (!data.success) {
        throw new Error(data.error || 'خطا در کرول صفحه');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'خطا در ارتباط با کرولر');
    } finally {
      setLoading(false);
    }
  };

  const copyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* URL Input & Launch Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xl">
        <h2 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span>کرولر هوشمند و استخراج‌کننده آنی (On-Demand Universal Scraper)</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          هر آدرسی از دارک‌نما، سینمافلیکس، رادیو جوان یا هر سایت فیلم و موزیک را وارد کنید تا تمام لینک‌های دانلود مستقیم، زیرنویس‌ها، فایل‌های صوتی و متاداده به صورت JSON استخراج شوند.
        </p>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleCrawl(); }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://cenamaflix.ir/movie-... یا هر لینک مدنظر"
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-11 pl-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono dir-ltr text-left"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
            <span>استخراج و کرول URL</span>
          </button>
        </form>

        {/* Sample preset links */}
        <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400">آدرس‌های نمونه برای تست:</span>
          {sampleUrls.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrl(s.url);
                handleCrawl(s.url);
              }}
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition-colors truncate max-w-xs"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 p-4 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm font-medium">در حال خزش (Crawling)، پردازش ساختار HTML و استخراج لینک‌های دانلود...</p>
        </div>
      )}

      {/* Results View */}
      {result && !loading && (
        <div className="space-y-6">

          {/* Metrics bar */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                کرول موفقیت‌آمیز
              </span>
              <span className="text-slate-400">
                زمان پردازش: <strong className="text-white font-mono">{latency} ms</strong>
              </span>
              <span className="text-slate-400">
                منبع تشخیص داده شده: <strong className="text-cyan-300 font-mono">{result.source}</strong>
              </span>
            </div>

            <button
              onClick={copyJson}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>کپی کل خروجی JSON</span>
            </button>
          </div>

          {/* Parsed Media Cards (If Song, Post or Generic) */}
          {result.song && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4">
              <img
                src={result.song.photo}
                alt={result.song.title}
                className="w-24 h-24 rounded-xl object-cover bg-slate-950 shadow-lg shrink-0"
              />
              <div className="flex-1">
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/60">
                  موزیک استخراج شده از رادیو جوان
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{result.song.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{result.song.artist}</p>

                <div className="flex flex-wrap gap-2 text-xs">
                  {result.song.download_links?.mp3_320 && (
                    <a
                      href={result.song.download_links.mp3_320}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود 320</span>
                    </a>
                  )}
                  {result.song.download_links?.mp3_128 && (
                    <a
                      href={result.song.download_links.mp3_128}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود 128</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* If Cenamaflix Post */}
          {result.post && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-4">
                {result.post.poster && (
                  <img
                    src={result.post.poster}
                    alt={result.post.title}
                    className="w-20 h-28 rounded-xl object-cover bg-slate-950 shrink-0 shadow-lg"
                  />
                )}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{result.post.title}</h3>
                  {result.post.imdb && (
                    <span className="text-xs text-amber-400 font-bold block mt-1">
                      ⭐ امتیاز IMDb: {result.post.imdb}
                    </span>
                  )}
                  {result.post.synopsis && (
                    <p className="text-xs text-slate-300 mt-2 line-clamp-3">{result.post.synopsis}</p>
                  )}
                </div>
              </div>

              {/* Download Links */}
              {result.post.download_links?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 mb-2">لینک‌های دانلود استخراج شده:</h4>
                  <div className="space-y-1.5">
                    {result.post.download_links.map((dl: any, i: number) => (
                      <div
                        key={i}
                        className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-300">{dl.label || dl.quality}</span>
                        <a
                          href={dl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>دانلود</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* If Generic Scrape results */}
          {result.media_links && result.media_links.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <span>فایل‌های ویدیویی و دانلودی کشف شده ({result.media_links.length})</span>
              </h3>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {result.media_links.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs gap-2"
                  >
                    <span className="text-slate-300 truncate">{item.label || item.url}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 px-2.5 py-1 rounded flex items-center gap-1 shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      <span>دانلود</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JSON Tree Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                خروجی کامل JSON (Payload آماده استفاده در وب‌سرویس شما)
              </span>
              <span className="text-slate-500 font-mono">application/json</span>
            </div>
            <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>

        </div>
      )}

    </div>
  );
};
