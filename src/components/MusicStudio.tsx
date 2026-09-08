import React, { useState, useEffect } from 'react';
import { 
  Search, Music, User, ListMusic, Download, Play, Pause, 
  Copy, Check, FileText, ExternalLink, Code2, Heart, Headphones, 
  X, RefreshCw, AlertCircle, Share2, Sparkles
} from 'lucide-react';
import type { RJSong, RJArtist, RJPlaylist } from '../types';

interface MusicStudioProps {
  currentTrack: RJSong | null;
  isPlaying: boolean;
  onPlayTrack: (song: RJSong) => void;
  onTogglePlay: () => void;
}

export const MusicStudio: React.FC<MusicStudioProps> = ({
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay
}) => {
  const [query, setQuery] = useState('Shadmehr Aghili');
  const [activeCategory, setActiveCategory] = useState<'songs' | 'artists' | 'playlists'>('songs');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search Results
  const [songs, setSongs] = useState<RJSong[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);

  // Detailed views
  const [selectedArtist, setSelectedArtist] = useState<RJArtist | null>(null);
  const [artistLoading, setArtistLoading] = useState(false);

  const [selectedPlaylist, setSelectedPlaylist] = useState<RJPlaylist | null>(null);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  // Lyrics modal
  const [lyricsSong, setLyricsSong] = useState<RJSong | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);

  // JSON modal
  const [jsonModalData, setJsonModalData] = useState<any | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const quickSearches = ['Shadmehr Aghili', 'Ebi', 'Hayedeh', 'Sogand', 'Alireza Talischi', 'Mohsen Yeganeh', 'Donya'];

  const executeSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'خطا در جستجوی موزیک');

      setSongs(data.results?.songs || []);
      setArtists(data.results?.artists || []);
      setPlaylists(data.results?.playlists || []);
    } catch (err: any) {
      setError(err.message || 'خطا در واکشی اطلاعات از رادیو جوان');
    } finally {
      setLoading(false);
    }
  };

  const loadArtistDetails = async (artistName: string) => {
    setArtistLoading(true);
    setSelectedArtist(null);
    setError(null);

    try {
      const res = await fetch(`/api/music/artist?name=${encodeURIComponent(artistName)}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'خطا در دریافت اطلاعات خواننده');
      setSelectedArtist(data.artist);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setArtistLoading(false);
    }
  };

  const loadPlaylistDetails = async (playlistId: string) => {
    setPlaylistLoading(true);
    setSelectedPlaylist(null);
    setError(null);

    try {
      const res = await fetch(`/api/music/playlist?id=${encodeURIComponent(playlistId)}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'خطا در دریافت پلی‌لیست');
      setSelectedPlaylist(data.playlist);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPlaylistLoading(false);
    }
  };

  const viewLyrics = async (song: RJSong) => {
    setLyricsSong(song);
    // If lyrics not present, fetch detailed song endpoint
    if (!song.lyrics) {
      setLyricsLoading(true);
      try {
        const res = await fetch(`/api/music/song?id=${encodeURIComponent(song.id)}`);
        const data = await res.json();
        if (data.success && data.song?.lyrics) {
          setLyricsSong((prev) => (prev ? { ...prev, lyrics: data.song.lyrics } : null));
        }
      } catch (e) {
      } finally {
        setLyricsLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Initial load
  useEffect(() => {
    executeSearch('Shadmehr Aghili');
  }, []);

  return (
    <div className="space-y-6">

      {/* Music Search & Category Selector */}
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
              placeholder="جستجوی نام آهنگ، خواننده یا پلی‌لیست رادیو جوان (شادمهر، ابی، تتلو...)"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-11 pl-4 py-3 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>جستجو در رادیو جوان</span>
          </button>
        </form>

        {/* Quick suggestions & Category tabs */}
        <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">آرتیست‌های محبوب:</span>
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
              onClick={() => setActiveCategory('songs')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                activeCategory === 'songs' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>آهنگ‌ها ({songs.length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('artists')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                activeCategory === 'artists' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>خواننده‌ها ({artists.length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('playlists')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                activeCategory === 'playlists' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>پلی‌لیست‌ها ({playlists.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error banner */}
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
          <p className="text-sm font-medium">در حال ارتباط با API اختصاصی رادیو جوان (play.radiojavan.com)...</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <div className="space-y-6">

          {/* 1. Songs Grid */}
          {activeCategory === 'songs' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-cyan-400" />
                  <span>آهنگ‌های یافت شده ({songs.length})</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  کیفیت‌های مستقیم: 320kbps • 256kbps • 128kbps • M4A
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {songs.map((song) => {
                  const isCurrent = currentTrack?.id === song.id;
                  return (
                    <div
                      key={song.id}
                      className={`bg-slate-900/60 border rounded-2xl p-4 transition-all flex flex-col justify-between group shadow-lg ${
                        isCurrent ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Song info with artwork */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 shadow-md group/art">
                          <img
                            src={song.photo || song.thumbnail}
                            alt={song.title}
                            className="w-full h-full object-cover group-hover/art:scale-105 transition-transform"
                          />
                          <button
                            onClick={() => {
                              if (isCurrent) onTogglePlay();
                              else onPlayTrack(song);
                            }}
                            className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover/art:opacity-100 transition-opacity"
                          >
                            {isCurrent && isPlaying ? (
                              <Pause className="w-7 h-7 fill-white text-white" />
                            ) : (
                              <Play className="w-7 h-7 fill-white text-white ml-0.5" />
                            )}
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 mb-0.5" title={song.song || song.title}>
                            {song.song_farsi || song.song || song.title}
                          </h3>
                          <button
                            onClick={() => {
                              setActiveCategory('artists');
                              loadArtistDetails(song.artist);
                            }}
                            className="text-xs text-cyan-400 hover:underline line-clamp-1 mb-2 font-medium"
                          >
                            {song.artist_farsi || song.artist}
                          </button>

                          {/* Stats */}
                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            {song.plays && (
                              <span className="flex items-center gap-1">
                                <Headphones className="w-3 h-3 text-slate-500" />
                                {typeof song.plays === 'number' ? song.plays.toLocaleString('fa-IR') : song.plays}
                              </span>
                            )}
                            {song.likes && (
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3 text-rose-500" />
                                {typeof song.likes === 'number' ? song.likes.toLocaleString('fa-IR') : song.likes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Download Links & Lyrics */}
                      <div className="pt-3 border-t border-slate-800/70 space-y-2">
                        {/* Download Buttons grid */}
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          {song.download_links.mp3_320 && (
                            <a
                              href={song.download_links.mp3_320}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-200 py-1.5 px-2.5 rounded-lg flex items-center justify-between transition-colors"
                            >
                              <span>دانلود 320</span>
                              <Download className="w-3 h-3 text-cyan-400" />
                            </a>
                          )}

                          {song.download_links.mp3_128 && (
                            <a
                              href={song.download_links.mp3_128}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 py-1.5 px-2.5 rounded-lg flex items-center justify-between transition-colors"
                            >
                              <span>دانلود 128</span>
                              <Download className="w-3 h-3 text-slate-400" />
                            </a>
                          )}
                        </div>

                        {/* Lyrics & JSON action line */}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <button
                            onClick={() => viewLyrics(song)}
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            <span>متن ترانه (شعر)</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {song.download_links.mp3_320 && (
                              <button
                                onClick={() => copyToClipboard(song.download_links.mp3_320!)}
                                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                                title="کپی لینک مستقیم MP3 320"
                              >
                                {copiedUrl === song.download_links.mp3_320 ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                <span>کپی لینک</span>
                              </button>
                            )}

                            <button
                              onClick={() => setJsonModalData(song)}
                              className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                            >
                              <Code2 className="w-3 h-3" />
                              <span>JSON</span>
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Artists Tab */}
          {activeCategory === 'artists' && (
            <div className="space-y-6">
              {/* Detailed Artist Profile if selected */}
              {artistLoading && (
                <div className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
                  <p className="text-xs">در حال دریافت بیوگرافی و دیسکوگرافی کامل خواننده...</p>
                </div>
              )}

              {selectedArtist && !artistLoading && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Banner header */}
                  <div className="relative h-48 sm:h-64 bg-slate-950 overflow-hidden">
                    {selectedArtist.header ? (
                      <img
                        src={selectedArtist.header}
                        alt={selectedArtist.name}
                        className="w-full h-full object-cover opacity-60"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    {/* Artist avatar and stats over banner */}
                    <div className="absolute bottom-4 right-4 sm:right-6 flex items-end gap-4">
                      <img
                        src={selectedArtist.photo || selectedArtist.thumbnail}
                        alt={selectedArtist.name}
                        className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border-4 border-slate-900 object-cover shadow-2xl bg-slate-900"
                      />
                      <div className="text-white pb-1">
                        <h2 className="text-xl sm:text-2xl font-bold">
                          {selectedArtist.name_farsi || selectedArtist.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-cyan-300 font-mono">{selectedArtist.name}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedArtist(null)}
                      className="absolute top-4 left-4 p-2 bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white rounded-xl backdrop-blur-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stats bar */}
                  <div className="p-4 sm:p-6 border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">دنبال‌کنندگان</span>
                      <strong className="text-cyan-300 text-base font-bold">
                        {typeof selectedArtist.followers === 'number'
                          ? selectedArtist.followers.toLocaleString('fa-IR')
                          : selectedArtist.followers || 'N/A'}
                      </strong>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">مجموع پخش‌ها</span>
                      <strong className="text-white text-base font-bold">{selectedArtist.total_plays || 'N/A'}</strong>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">پخش ماهانه</span>
                      <strong className="text-white text-base font-bold">{selectedArtist.monthly_plays || 'N/A'}</strong>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">رتبه در رادیو جوان</span>
                      <strong className="text-amber-400 text-base font-bold">#{selectedArtist.rank || 1}</strong>
                    </div>
                  </div>

                  {/* Artist tracks list */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white text-base flex items-center gap-2">
                        <Music className="w-4 h-4 text-cyan-400" />
                        <span>تمام آهنگ‌های {selectedArtist.name} ({selectedArtist.songs?.length || 0})</span>
                      </h3>
                      <button
                        onClick={() => setJsonModalData(selectedArtist)}
                        className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>JSON صفحه آرتیست</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedArtist.songs?.map((song) => (
                        <div
                          key={song.id}
                          className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs gap-2"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={song.photo || song.thumbnail}
                              alt={song.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate">{song.song || song.title}</span>
                              <span className="text-[10px] text-slate-400">{song.release_date || song.album}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => onPlayTrack(song)}
                              className="p-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg"
                              title="پخش"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                            {song.download_links.mp3_320 && (
                              <a
                                href={song.download_links.mp3_320}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                                title="دانلود 320"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => viewLyrics(song)}
                              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg"
                              title="متن ترانه"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Artists Search Result cards */}
              {!selectedArtist && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {artists.map((artist, i) => (
                    <div
                      key={i}
                      onClick={() => loadArtistDetails(artist.name || artist.query)}
                      className="bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/60 rounded-2xl p-4 text-center cursor-pointer transition-all group shadow-lg flex flex-col items-center"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-950 mb-3 border-2 border-slate-800 group-hover:border-cyan-400 transition-colors shadow-lg">
                        <img
                          src={artist.photo || artist.thumbnail}
                          alt={artist.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                        {artist.name_farsi || artist.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{artist.name}</p>
                      <span className="mt-3 text-[11px] bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
                        مشاهده دیسکوگرافی
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Playlists Tab */}
          {activeCategory === 'playlists' && (
            <div className="space-y-6">
              {playlistLoading && (
                <div className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
                  <p className="text-xs">در حال واکشی آهنگ‌های پلی‌لیست...</p>
                </div>
              )}

              {/* Detailed Playlist Tracklist */}
              {selectedPlaylist && !playlistLoading && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
                    <div className="flex items-center gap-4">
                      {selectedPlaylist.photo && (
                        <img
                          src={selectedPlaylist.photo}
                          alt={selectedPlaylist.title}
                          className="w-20 h-20 rounded-xl object-cover shadow-lg"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-white">{selectedPlaylist.title}</h3>
                        <p className="text-xs text-slate-400">
                          {selectedPlaylist.tracks?.length} آهنگ • {selectedPlaylist.followers?.toLocaleString('fa-IR')} دنبال‌کننده
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPlaylist(null)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tracks list */}
                  <div className="space-y-2">
                    {selectedPlaylist.tracks?.map((track, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-mono w-4">{idx + 1}</span>
                          <img
                            src={track.photo || track.thumbnail}
                            alt={track.title}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-bold text-white block">{track.song || track.title}</span>
                            <span className="text-slate-400 text-[11px]">{track.artist}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onPlayTrack(track)}
                            className="p-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                          {track.download_links.mp3_320 && (
                            <a
                              href={track.download_links.mp3_320}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Playlists cards list */}
              {!selectedPlaylist && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playlists.map((pl) => (
                    <div
                      key={pl.id}
                      onClick={() => loadPlaylistDetails(pl.id)}
                      className="bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all group shadow-lg"
                    >
                      <img
                        src={pl.photo}
                        alt={pl.title}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate group-hover:text-cyan-300 transition-colors">
                          {pl.title}
                        </h4>
                        <span className="text-xs text-slate-400 block mt-1">
                          {pl.items_count || 0} آهنگ
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Lyrics Modal */}
      {lyricsSong && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={lyricsSong.photo || lyricsSong.thumbnail}
                  alt={lyricsSong.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{lyricsSong.song || lyricsSong.title}</h3>
                  <p className="text-xs text-slate-400">{lyricsSong.artist}</p>
                </div>
              </div>

              <button
                onClick={() => setLyricsSong(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 text-center">
              {lyricsLoading && (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                  <p className="text-xs">در حال واکشی متن شعر...</p>
                </div>
              )}

              {!lyricsLoading && lyricsSong.lyrics ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <button
                      onClick={() => copyToClipboard(lyricsSong.lyrics!)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      {copiedUrl === lyricsSong.lyrics ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>کپی متن شعر</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm sm:text-base leading-loose whitespace-pre-line text-slate-200 font-medium select-text">
                    {lyricsSong.lyrics}
                  </p>
                </div>
              ) : !lyricsLoading ? (
                <p className="text-xs text-slate-400 py-12">متن شعری برای این آهنگ ثبت نشده است.</p>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* JSON Modal */}
      {jsonModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">خروجی خام JSON جهت استفاده در وب‌سایت شما</h3>
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
