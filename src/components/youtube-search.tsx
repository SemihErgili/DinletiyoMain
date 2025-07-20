'use client';

import { useState } from 'react';
import { Search, Music, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

export function YoutubeSearch() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchVideos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Arama sırasında bir hata oluştu');
      }
      
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Arama hatası:', err);
      setError('Müzik aranırken bir hata oluştu');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const playVideo = (videoId: string) => {
    // Burada müzik çalma işlevselliğini ekleyeceğiz
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={searchVideos} className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Müzik ara..."
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aranıyor...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Ara
            </>
          )}
        </Button>
      </form>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative h-40">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => playVideo(video.id)}
                className="w-full"
                variant="outline"
              >
                <Music className="mr-2 h-4 w-4" />
                Dinle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
