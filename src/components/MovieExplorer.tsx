import React, { useState, useEffect } from 'react';
import { 
  Search, Film, Tv, Download, Copy, Check, Star, Clock, 
  ExternalLink, Code2, Layers, AlertCircle, RefreshCw, X, PlayCircle
} from 'lucide-react';
import type { MovieItem, CenamaflixItem } from '../types';

export const MovieExplorer: React.FC = () => {
  const [query, setQuery] = useState('Batman');
  const [source, setSource] = useState<'all' | 'darknama' | 'cenamaflix'>('all');
  const [activeTab, setActiveTab] = useState<'search' | 'latest_movies' | 'latest_series'>('search');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [darknamaResults, setDarknamaResults] = useState<MovieItem[]>([]);
  const [cenamaflixResults, setCenamaflixResults] = useState<CenamaflixItem[]>([]);
  const [latestResults, setLatestResults] = useState<MovieItem[]>([]);

  // Selected item for detail / seasons / json modal
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [seasonsData, setSeasonsData] = useState<any | null>(null);
  const [seasonsLoading, setSeasonsLoading] = useState(false);
  const [jsonModalData, setJsonModalData] = useState<any | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Cenamaflix post crawler
  const [cenamaflixPostData, setCenamaflixPostData] = useState<any | null>(null);
  const [cenamaflixLoading, setCenamaflixLoading] = useState(false);

  // Quick suggestions
  const quickSearches = ['بتمن', 'Joker', 'Interstellar', 'Breaking Bad', 'Loki', 'Inception', 'Spider-Man'];

  const executeSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setActiveTab('search');

    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery.trim())}&source=${source}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'خطا در جستجو');

      setDarknamaResults(data.darknama || []);
      setCenamaflixResults(data.cenamaflix || []);
    } catch (err: any) {
      setError(err.message || 'خطایی در ارتباط با سرور رخ داد');
    } finally {
      setLoading(false);
    }
  };

  const loadLatest = async (type: 'movie' | 'serie') => {
    setLoading(true);
    setError(null);
    setActiveTab(type === 'movie' ? 'latest_movies' : 'latest_series');

    try {
      const res = await fetch(`/api/movies/latest?type=${type}&count=24`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'خطا در دریافت عناوین جدید');
      setLatestResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  const loadSeasons = async (serie: MovieItem) => {
    setSelectedMovie(serie);
    setSeasonsLoading(true);
    setSeasonsData(null);

    try {
      const res = await fetch(`/api/movies/seasons?id=${serie.id}`);
      const data = await res.json();
      if (data.success) {
        setSeasonsData(data);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(`خطا در دریافت فصل‌ها: ${err.message}`);
    } finally {
      setSeasonsLoading(false);
    }
  };

  const loadCenamaflixPost = async (item: CenamaflixItem) => {
    setCenamaflixLoading(true);
    setCenamaflixPostData(null);

    try {
      const res = await fetch(`/api/movies/cenamaflix-post?url=${encodeURIComponent(item.url)}`);
      const data = await res.json();
      if (data.success) {
        setCenamaflixPostData(data.post);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(`خطا در کرول پست سینمافلیکس: ${err.message}`);
    } finally {
      setCenamaflixLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Initial search on mount
  useEffect(() => {
    executeSearch('Batman');
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Search & Filter Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xl">
        <form 
          onSubmit={(e) => { e.preventDefault(); executeSearch(); }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی نام فیلم یا سریال (فارسی یا انگلیسی، مانند: بتمن، Joker، Breaking Bad...)"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-11 pl-4 py-3 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={source}
              onChange={(e: any) => setSource(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">همه منابع (دارک‌نما + سینمافلیکس)</option>
              <option value="darknama">فقط دارک‌نما (Darknama)</option>
              <option value="cenamaflix">فقط سینمافلیکس (Cenamaflix)</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 shrink-0"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>جستجو</span>
            </button>
          </div>
        </form>

        {/* Quick search chips & tabs */}
        <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">پیشنهادات سریع:</span>
            {quickSearches.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  executeSearch(item);
                }}
                className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => executeSearch()}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'search' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              نتایج جستجو
            </button>
            <button
              onClick={() => loadLatest('movie')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'latest_movies' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              جدیدترین فیلم‌ها
            </button>
            <button
              onClick={() => loadLatest('serie')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'latest_series' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              جدیدترین سریال‌ها
            </button>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 p-4 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm font-medium">در حال کرول و واکشی اطلاعات فیلم‌ها و سریال‌ها...</p>
        </div>
      )}

      {/* Content Display */}
      {!loading && (
        <div className="space-y-8">
          
          {/* 1. Darknama / Latest Results Section */}
          {(activeTab === 'search' ? darknamaResults : latestResults).length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {activeTab === 'search' ? `عناوین دارک‌نما (Darknama) (${darknamaResults.length})` : 'جدیدترین عناوین دارک‌نما'}
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  منبع: server-hi-speed-iran.info (دارک‌نما)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {(activeTab === 'search' ? darknamaResults : latestResults).map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col group shadow-lg"
                  >
                    {/* Poster */}
                    <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                      {movie.cover || movie.image ? (
                        <img
                          src={movie.cover || movie.image}
                          alt={movie.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Film className="w-12 h-12" />
                        </div>
                      )}

                      {/* Type Badge */}
                      <span className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] px-2 py-0.5 rounded-md font-semibold text-cyan-300 flex items-center gap-1">
                        {movie.type === 'serie' ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                        {movie.type === 'serie' ? 'سریال' : 'فیلم'}
                      </span>

                      {/* IMDb Badge */}
                      {movie.imdb && (
                        <span className="absolute top-2.5 left-2.5 bg-amber-500/90 text-slate-950 text-xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-slate-950" />
                          {movie.imdb}
                        </span>
                      )}
                    </div>

                    {/* Content info */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base line-clamp-1 mb-1" title={movie.title}>
                          {movie.title}
                        </h3>

                        {/* Meta info */}
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                          {movie.year && <span>{movie.year}</span>}
                          {movie.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {movie.duration}
                            </span>
                          )}
                        </div>

                        {/* Genres */}
                        {movie.genres && movie.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {movie.genres.slice(0, 3).map((genre, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}

                        {movie.description && (
                          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                            {movie.description}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-slate-800/60 space-y-2">
                        {/* If movie with direct links */}
                        {movie.type === 'movie' && movie.sources && movie.sources.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] text-slate-400 font-medium block">
                              لینک‌های دانلود مستقیم ({movie.sources.length} کیفیت):
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {movie.sources.map((src, idx) => (
                                <a
                                  key={idx}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/50 text-cyan-200 text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors group/link"
                                >
                                  <span className="truncate">{src.quality || 'دانلود'}</span>
                                  <Download className="w-3.5 h-3.5 text-cyan-400 group-hover/link:translate-y-0.5 transition-transform shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* If TV Serie: open seasons */}
                        {movie.type === 'serie' && (
                          <button
                            onClick={() => loadSeasons(movie)}
                            className="w-full bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 text-indigo-200 text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>مشاهده فصل‌ها و لینک دانلود قسمت‌ها</span>
                          </button>
                        )}

                        {/* Raw JSON inspection button */}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <button
                            onClick={() => setJsonModalData(movie)}
                            className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                          >
                            <Code2 className="w-3 h-3" />
                            <span>مشاهده JSON اندپوینت</span>
                          </button>

                          {movie.sources?.[0]?.url && (
                            <button
                              onClick={() => copyToClipboard(movie.sources![0].url)}
                              className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                            >
                              {copiedUrl === movie.sources[0].url ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">کپی شد</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>کپی لینک 1</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Cenamaflix Results Section */}
          {activeTab === 'search' && cenamaflixResults.length > 0 && (
            <div className="pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    نتایج سینمافلیکس (Cenamaflix.ir) ({cenamaflixResults.length})
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  منبع: cenamaflix.ir (کرول آنلاین)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {cenamaflixResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col group shadow-lg"
                  >
                    <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Film className="w-12 h-12" />
                        </div>
                      )}

                      <span className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] px-2 py-0.5 rounded-md font-semibold text-amber-400">
                        سینمافلیکس
                      </span>

                      {item.imdb && (
                        <span className="absolute top-2.5 left-2.5 bg-amber-500/90 text-slate-950 text-xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-slate-950" />
                          {item.imdb}
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base line-clamp-2 mb-2" title={item.title}>
                          {item.title}
                        </h3>
                        {item.snippet && (
                          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                            {item.snippet}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800/60 space-y-2">
                        <button
                          onClick={() => loadCenamaflixPost(item)}
                          className="w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-semibold"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>استخراج لینک‌های دانلود و پخش آنلاین</span>
                        </button>

                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>مشاهده در cenamaflix.ir</span>
                          </a>

                          <button
                            onClick={() => setJsonModalData(item)}
                            className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                          >
                            <Code2 className="w-3 h-3" />
                            <span>پاسخ API</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {activeTab === 'search' && darknamaResults.length === 0 && cenamaflixResults.length === 0 && (
            <div className="py-16 text-center text-slate-400 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8">
              <Film className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="font-semibold text-white mb-1">عنوانی یافت نشد</p>
              <p className="text-xs text-slate-400">عبارت دیگری مانند «بتمن»، «Interstellar» یا «Joker» را جستجو کنید.</p>
            </div>
          )}

        </div>
      )}

      {/* Series Seasons Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                  <Tv className="w-5 h-5 text-indigo-400" />
                  <span>فصل‌ها و قسمت‌های: {selectedMovie.title}</span>
                </h3>
                <p className="text-xs text-slate-400">دانلود مستقیم تمام قسمت‌ها بر اساس فصل و کیفیت</p>
              </div>
              <button
                onClick={() => setSelectedMovie(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {seasonsLoading && (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                  <p className="text-xs">در حال دریافت اطلاعات فصل‌ها و قسمت‌ها...</p>
                </div>
              )}

              {!seasonsLoading && seasonsData?.seasons && (
                <div className="space-y-4">
                  {seasonsData.seasons.map((season: any) => (
                    <div key={season.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
                        <h4 className="font-bold text-cyan-300 text-sm">{season.title}</h4>
                        <span className="text-xs text-slate-400">{season.episodes_count} قسمت</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {season.episodes.map((ep: any) => (
                          <div
                            key={ep.id}
                            className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs"
                          >
                            <span className="font-medium text-slate-200">{ep.title}</span>
                            <div className="flex items-center gap-1">
                              {ep.download_links?.map((link: any, i: number) => (
                                <a
                                  key={i}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                  title={link.url}
                                >
                                  <Download className="w-3 h-3" />
                                  <span>{link.quality || 'دانلود'}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cenamaflix Post Links Modal */}
      {cenamaflixPostData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-400" />
                  <span>{cenamaflixPostData.title}</span>
                </h3>
                <p className="text-xs text-slate-400">لینک‌های استخراج شده مستقیم از cenamaflix.ir</p>
              </div>
              <button
                onClick={() => setCenamaflixPostData(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {cenamaflixPostData.synopsis && (
                <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <strong className="text-slate-200 block mb-1">خلاصه داستان:</strong>
                  <p className="line-clamp-4 leading-relaxed">{cenamaflixPostData.synopsis}</p>
                </div>
              )}

              {/* Online streams */}
              {cenamaflixPostData.online_streams?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                    <PlayCircle className="w-4 h-4" />
                    <span>پخش آنلاین ویدیو:</span>
                  </h4>
                  <div className="space-y-1.5">
                    {cenamaflixPostData.online_streams.map((stream: any, i: number) => (
                      <a
                        key={i}
                        href={stream.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/50 text-emerald-200 text-xs p-2.5 rounded-lg flex items-center justify-between transition-colors"
                      >
                        <span className="truncate">{stream.url}</span>
                        <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Download links */}
              {cenamaflixPostData.download_links?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                    <Download className="w-4 h-4" />
                    <span>لینک‌های دانلود مستقیم:</span>
                  </h4>
                  <div className="space-y-2">
                    {cenamaflixPostData.download_links.map((link: any, i: number) => (
                      <div
                        key={i}
                        className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs gap-2"
                      >
                        <div>
                          <span className="font-semibold text-white block">{link.quality}</span>
                          <span className="text-[11px] text-slate-400 truncate max-w-xs block">{link.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(link.url)}
                            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                            title="کپی لینک"
                          >
                            {copiedUrl === link.url ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>دانلود</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtitles */}
              {cenamaflixPostData.subtitle_links?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 mb-2">لینک‌های زیرنویس:</h4>
                  <div className="space-y-1">
                    {cenamaflixPostData.subtitle_links.map((sub: any, i: number) => (
                      <a
                        key={i}
                        href={sub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-300 hover:underline block truncate"
                      >
                        {sub.label || sub.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Raw JSON inspection Modal */}
      {jsonModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">خروجی خام JSON جهت استفاده در سایت شما</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(jsonModalData, null, 2))}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                >
                  {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>کپی JSON</span>
                </button>
                <button
                  onClick={() => setJsonModalData(null)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-cyan-300 bg-slate-950 rounded-b-2xl">
              <pre className="whitespace-pre-wrap leading-relaxed">{JSON.stringify(jsonModalData, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
