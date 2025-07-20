"use client";

"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import YouTube from 'react-youtube';
import { Song } from '@/lib/data';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

export function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handlePlaySong = (event: CustomEvent<Song>) => {
      if (currentSong?.id === event.detail.id) {
        // Toggle play/pause for the same song
        setIsPlaying(prev => !prev);
      } else {
        // Play new song
        setCurrentSong(event.detail);
        setIsPlaying(true);
      }
    };

    window.addEventListener('playSong', handlePlaySong as EventListener);
    return () => window.removeEventListener('playSong', handlePlaySong as EventListener);
  }, [currentSong]);

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    if (isPlaying) {
        playerRef.current.playVideo();
    }
  };

  const onPlayerStateChange = (event: any) => {
    // Clear existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    // When playing, update progress every second
    if (event.data === 1) { // 1 = Playing
      setIsPlaying(true);
      setDuration(playerRef.current.getDuration());
      progressIntervalRef.current = setInterval(() => {
        setProgress(playerRef.current.getCurrentTime());
      }, 1000);
    } else {
      setIsPlaying(false);
      // Clear interval when paused, ended, etc.
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value[0], true);
      setProgress(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentSong) return null;

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t">
      <div style={{ display: 'none' }}>
        <YouTube
          videoId={currentSong.audioUrl} // audioUrl is now the YouTube video ID
          opts={{ height: '0', width: '0', playerVars: { autoplay: 1 } }}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      </div>
      <div className="container mx-auto p-2 flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/4">
          <Image src={currentSong.imageUrl} alt={currentSong.title} width={56} height={56} className="rounded-md" />
          <div>
            <p className="font-semibold truncate">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-1/2">
          <div className="flex items-center gap-4">
            <button className="p-2"><SkipBack className="h-5 w-5" /></button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-primary text-primary-foreground rounded-full">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <button className="p-2"><SkipForward className="h-5 w-5" /></button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
            <Slider 
              value={[progress]}
              max={duration || 100}
              onValueChange={handleSeek}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end w-1/4">
            <button onClick={() => { setIsPlaying(false); setCurrentSong(null); }} className="p-2">
                <X className="h-5 w-5 text-muted-foreground" />
            </button>
        </div>
      </div>
    </Card>
  );
}
