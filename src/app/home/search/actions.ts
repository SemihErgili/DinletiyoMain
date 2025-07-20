
'use server';

import type { Song } from "@/lib/data";

const placeholderAudioUrl = 'https://storage.googleapis.com/stolo-public-assets/gemini-studio/royalty-free-music/scott-buckley-jul.mp3';

interface LastFmImage {
    '#text': string;
    size: 'small' | 'medium' | 'large' | 'extralarge';
}

interface LastFmTrack {
    name: string;
    artist: string;
    url: string;
    streamable: string;
    listeners: string;
    image: LastFmImage[];
    mbid: string;
}

export async function searchTracks(query: string): Promise<Song[]> {
    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) {
        console.error('Last.fm API key is not configured.');
        return [];
    }

    const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${apiKey}&format=json&limit=24`;

    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            console.error('Last.fm API request failed:', response.statusText);
            return [];
        }

        const data = await response.json();
        const tracks = data.results?.trackmatches?.track;

        if (!Array.isArray(tracks)) {
            return [];
        }

        const formattedSongs: Song[] = tracks
            .map((track: LastFmTrack): Song | null => {
                const imageUrl = track.image.find(img => img.size === 'extralarge')?.['#text'] || track.image[track.image.length - 1]?.['#text'];

                // If no image URL is found, filter out this track
                if (!imageUrl || imageUrl.includes('2a96cbd8b46e442fc41c2b86b821562f')) { // Filter out default Last.fm placeholder
                    return null;
                }

                return {
                    id: track.mbid || `${track.name}-${track.artist}`,
                    title: track.name,
                    artist: track.artist,
                    album: 'Bilinmiyor',
                    duration: '0:00',
                    imageUrl: imageUrl,
                    audioUrl: placeholderAudioUrl,
                    aiHint: 'album cover music',
                };
            })
            .filter((song): song is Song => song !== null); // Remove null entries

        return formattedSongs;
    } catch (error) {
        console.error('Error fetching from Last.fm API:', error);
        return [];
    }
}
