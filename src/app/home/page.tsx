"use client";

import { useEffect, useState } from 'react';
import { SongCard } from "@/components/song-card";
import { RecommendationForm } from "@/components/recommendation-form";
import { YoutubeSearch } from "@/components/youtube-search";
import AudiusTrending from "@/components/audius-trending";
import { getRecentlyPlayed, getMadeForYou, getNewReleases, Playlist } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Play, Pause } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  position: number;
}

function PlaylistSection({ title, fetchData }: { title: string; fetchData: () => Promise<Playlist[]> }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const data = await fetchData();
        setPlaylists(data);
      } catch (error) {
        console.error('Playlist yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, [fetchData]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {playlists.map((playlist) => (
          <SongCard 
            key={playlist.id} 
            item={playlist}
          />
        ))}
      </div>
    </section>
  );
}

function Top10Songs() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchTop10 = async () => {
      try {
        const response = await fetch('/api/youtube/top10');
        if (!response.ok) throw new Error('Top 10 yüklenirken hata oluştu');
        const data = await response.json();
        setVideos(data.videos || []);
      } catch (error) {
        console.error('Top 10 hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTop10();
  }, []);

  const togglePlay = (videoId: string) => {
    if (currentSong === videoId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(videoId);
      setIsPlaying(true);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Türkiye Top 10</h2>
      <div className="space-y-2">
        {videos.map((video) => (
          <div 
            key={video.id}
            className="flex items-center p-3 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <span className="text-muted-foreground w-6 text-center">{video.position}</span>
            <div className="flex-shrink-0 w-12 h-12 relative ml-2">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-full object-cover rounded"
              />
              <button 
                onClick={() => togglePlay(video.id)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded opacity-0 hover:opacity-100 transition-opacity"
              >
                {currentSong === video.id && isPlaying ? (
                  <Pause className="h-6 w-6 text-white" />
                ) : (
                  <Play className="h-6 w-6 text-white" />
                )}
              </button>
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <p className="font-medium truncate">{video.title}</p>
              <p className="text-sm text-muted-foreground truncate">{video.channelTitle}</p>
            </div>
            {currentSong === video.id && isPlaying && (
              <div className="ml-4 flex items-center">
                <span className="text-sm text-primary">Çalıyor</span>
                <div className="ml-2 flex space-x-1">
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="font-headline text-4xl font-bold">Merhaba!</h1>
        <p className="text-muted-foreground text-lg">Sana özel önerilerimiz var.</p>
      </div>

      <RecommendationForm />

      <div className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight">Müzik Ara</h2>
        <YoutubeSearch />
      </div>

      <AudiusTrending />
      <Top10Songs />

      <PlaylistSection title="Playlist'ler" fetchData={() => getRecentlyPlayed(6)} />
      <PlaylistSection title="Senin için Derlendi" fetchData={() => getMadeForYou(6)} />
      <PlaylistSection title="Yeni Çıkanlar" fetchData={() => getNewReleases(6)} />
    </div>
  );
}
