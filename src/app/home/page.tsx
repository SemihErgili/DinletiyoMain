
import { SongCard } from "@/components/song-card";
import { RecommendationForm } from "@/components/recommendation-form";
import { getRecentlyPlayed, getMadeForYou, getNewReleases, Playlist } from "@/lib/data";

async function PlaylistSection({ title, fetchData }: { title: string; fetchData: () => Promise<Playlist[]> }) {
  const playlists = await fetchData();
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

export default async function HomePage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="font-headline text-4xl font-bold">Merhaba!</h1>
        <p className="text-muted-foreground text-lg">Sana özel önerilerimiz var.</p>
      </div>

      <RecommendationForm />

      <PlaylistSection title="Yakında Çalanlar" fetchData={() => getRecentlyPlayed(6)} />
      <PlaylistSection title="Senin için Derlendi" fetchData={() => getMadeForYou(6)} />
      <PlaylistSection title="Yeni Çıkanlar" fetchData={() => getNewReleases(6)} />
    </div>
  );
}
