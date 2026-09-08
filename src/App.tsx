import React, { useState } from 'react';
import { Header } from './components/Header';
import { MovieExplorer } from './components/MovieExplorer';
import { MusicStudio } from './components/MusicStudio';
import { CrawlerSandbox } from './components/CrawlerSandbox';
import { ApiDocs } from './components/ApiDocs';
import { AudioPlayer } from './components/AudioPlayer';
import type { RJSong } from './types';
import { ExternalLink, Terminal, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'movies' | 'music' | 'crawler' | 'docs'>('movies');

  // Global audio player state
  const [currentTrack, setCurrentTrack] = useState<RJSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayTrack = (song: RJSong) => {
    setCurrentTrack(song);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f1f5f9] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32">
        {activeTab === 'movies' && <MovieExplorer />}
        {activeTab === 'music' && (
          <MusicStudio
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={handlePlayTrack}
            onTogglePlay={handleTogglePlay}
          />
        )}
        {activeTab === 'crawler' && <CrawlerSandbox />}
        {activeTab === 'docs' && <ApiDocs />}
      </main>

      {/* Floating Audio Player when a song is playing */}
      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onClose={handleClosePlayer}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-semibold">MediaCrawler REST API Engine</span>
            <span>—</span>
            <span>ارائه‌دهنده وب‌سرویس مستقیم فیلم، سریال و موزیک</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://darknama.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <span>دارک نما</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://cenamaflix.ir/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <span>سینما فلیکس</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://play.radiojavan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <span>رادیو جوان</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
