import type { Song } from "./data";

const API_KEY = "AIzaSyBZIZ3kOiQ_qOPmx6zlQNtsvXuOn5I8L8E";
const API_ROOT = "https://www.googleapis.com/youtube/v3";

// Belirli bir arama sorgusuyla YouTube'dan müzik videoları çeker
export async function fetchYoutubeSongs(query: string, maxResults = 10): Promise<Song[]> {
  const url = `${API_ROOT}/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.items) return [];
  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    album: '',
    duration: '',
    imageUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
    audioUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));
} 