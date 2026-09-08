import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, X, Music } from 'lucide-react';
import type { RJSong } from '../types';

interface AudioPlayerProps {
  currentTrack: RJSong | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onClose
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  const audioSrc = currentTrack?.download_links?.mp3_320 ||
                   currentTrack?.download_links?.mp3_256 ||
                   currentTrack?.download_links?.mp3_128 ||
                   currentTrack?.download_links?.hq_m4a;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack || !audioSrc) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-cyan-500/30 backdrop-blur-2xl shadow-2xl px-4 sm:px-8 py-3">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => onTogglePlay()}
      />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Track info */}
        <div className="flex items-center gap-3 w-full sm:w-1/4 min-w-0">
          <img
            src={currentTrack.photo || currentTrack.thumbnail}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-xl object-cover border border-slate-800 shadow-md shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-white text-xs sm:text-sm truncate">
              {currentTrack.song_farsi || currentTrack.song || currentTrack.title}
            </h4>
            <p className="text-[11px] text-cyan-400 truncate">
              {currentTrack.artist_farsi || currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Controls & Scrubber */}
        <div className="flex flex-col items-center gap-1.5 w-full sm:w-2/4">
          <div className="flex items-center gap-4">
            <button
              onClick={onTogglePlay}
              className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-all shadow-md shadow-cyan-500/30"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
            </button>
          </div>

          {/* Scrubber line */}
          <div className="w-full flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>{formatSeconds(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span>{formatSeconds(duration)}</span>
          </div>
        </div>

        {/* Volume, Download & Close */}
        <div className="flex items-center justify-end gap-3 w-full sm:w-1/4">
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white p-1"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <a
            href={audioSrc}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
            title="دانلود فایل MP3"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">دانلود 320</span>
          </a>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-900 rounded-lg transition-colors"
            title="بستن پخش‌کننده"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
