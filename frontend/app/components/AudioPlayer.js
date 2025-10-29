'use client';
import { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

export default function AudioPlayer({ audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  if (!audioUrl) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Volume2 className="w-6 h-6 text-story-purple" />
          <h3 className="text-lg font-bold text-gray-800 font-story">Story Narration</h3>
        </div>
        <button
          onClick={togglePlay}
          className="p-3 bg-gradient-to-r from-story-purple to-story-pink rounded-full text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-story-purple to-story-pink h-2 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={handlePlay}
        onPause={handlePause}
      >
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}