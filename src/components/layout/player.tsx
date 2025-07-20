
"use client";

import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Mic2, ListMusic, Volume2, Maximize2, Home, Search, Library, Shuffle, Repeat } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Song } from "@/lib/data";

const mobileNavLinks = [
  { href: "/home", label: "Ana Sayfa", icon: Home },
  { href: "/home/search", label: "Ara", icon: Search },
  { href: "/home/library", label: "Kitaplığın", icon: Library },
];

const placeholderSong: Song = {
  id: '0',
  title: 'Şarkı Seçilmedi',
  artist: 'Dinletiyo',
  album: '',
  duration: '0:00',
  imageUrl: 'https://placehold.co/64x64.png',
  audioUrl: '',
  aiHint: 'album cover'
}

type RepeatMode = 'off' | 'one' | 'all';

export function Player() {
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song>(placeholderSong);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handlePlaySong = (event: Event) => {
      const customEvent = event as CustomEvent<Song>;
      setCurrentSong(customEvent.detail);
      setIsPlaying(true);
    };

    window.addEventListener('playSong', handlePlaySong);
    return () => {
      window.removeEventListener('playSong', handlePlaySong);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentSong.audioUrl) {
      if (isPlaying) {
        audioRef.current.src = currentSong.audioUrl;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);
  
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      setCurrentTime(formatTime(audioRef.current.currentTime));
    }
  };
  
  const handleLoadedMetadata = () => {
     if (audioRef.current) {
        setDuration(formatTime(audioRef.current.duration));
     }
  }

  const handleSongEnd = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
       // Placeholder for skipping to the next song (part of a future queue feature)
       // For now, it just stops playing unless repeat all is on.
       // With repeat all, we would go to next song, but we don't have a playlist context here.
       // For now, we will just stop.
       setIsPlaying(false);
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const togglePlay = () => {
    if (!currentSong.audioUrl) return;
    setIsPlaying(!isPlaying);
  };
  
  const toggleShuffle = () => setIsShuffling(!isShuffling);

  const toggleRepeat = () => {
    setRepeatMode(current => {
      if (current === 'off') return 'all';
      if (current === 'all') return 'one';
      return 'off';
    });
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnd}
      />
      {/* Desktop Player */}
      <footer className="hidden lg:flex items-center justify-between w-full bg-card/80 backdrop-blur-sm border-t border-border px-6 py-3">
        <div className="flex items-center gap-4 w-1/4">
          <Image src={currentSong.imageUrl} alt={currentSong.title} width={56} height={56} className="rounded-md" data-ai-hint={currentSong.aiHint}/>
          <div>
            <p className="font-semibold">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-1/2 max-w-xl">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={toggleShuffle} className={cn("h-10 w-10 text-muted-foreground hover:text-foreground", isShuffling && "text-primary")}>
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="default" size="icon" onClick={togglePlay} className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90">
              {isPlaying ? <Pause className="h-6 w-6 text-primary-foreground" /> : <Play className="h-6 w-6 fill-primary-foreground text-primary-foreground" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
              <SkipForward className="h-5 w-5" />
            </Button>
             <Button variant="ghost" size="icon" onClick={toggleRepeat} className={cn("h-10 w-10 text-muted-foreground hover:text-foreground", repeatMode !== 'off' && "text-primary")}>
              <Repeat className="h-5 w-5" />
              {repeatMode === 'one' && <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[8px] rounded-full h-3 w-3 flex items-center justify-center">1</span>}
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground">{currentTime}</span>
            <Slider value={[progress]} onValueChange={handleProgressChange} max={100} step={1} />
            <span className="text-xs text-muted-foreground">{duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-1/4 justify-end">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Mic2 className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><ListMusic className="h-5 w-5" /></Button>
          <div className="flex items-center gap-2 w-[120px]">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Maximize2 className="h-5 w-5" /></Button>
        </div>
      </footer>
      
      {/* Mobile Player & Nav */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border flex flex-col z-50">
        <div className="flex items-center w-full px-4 py-2">
           <Image src={currentSong.imageUrl} alt={currentSong.title} width={40} height={40} className="rounded-md" data-ai-hint={currentSong.aiHint}/>
           <div className="flex-1 mx-3">
              <p className="font-semibold text-sm truncate">{currentSong.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
           </div>
           <Button variant="ghost" size="icon" onClick={togglePlay}>
             {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
           </Button>
        </div>
        <nav className="w-full grid grid-cols-3 items-center border-t border-border">
          {mobileNavLinks.map((link) => (
             <Link key={link.href} href={link.href} className={cn(
                "flex flex-col items-center justify-center py-2 text-muted-foreground hover:text-primary",
                pathname === link.href && "text-primary bg-primary/10"
             )}>
                <link.icon className="h-6 w-6"/>
                <span className="text-xs mt-1">{link.label}</span>
             </Link>
          ))}
        </nav>
      </footer>
    </>
  );
}
