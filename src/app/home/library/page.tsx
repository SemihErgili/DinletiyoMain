
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SongCard } from "@/components/song-card";
import { getPlaylists } from "@/lib/data";

export default async function LibraryPage() {
  const playlists = await getPlaylists();

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-4xl font-bold">Kitaplığın</h1>
      <Tabs defaultValue="playlists" className="w-full">
        <TabsList>
          <TabsTrigger value="playlists">Çalma Listeleri</TabsTrigger>
          <TabsTrigger value="artists">Sanatçılar</TabsTrigger>
          <TabsTrigger value="albums">Albümler</TabsTrigger>
        </TabsList>
        <TabsContent value="playlists" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {playlists.map((playlist) => (
               <SongCard 
                key={playlist.id} 
                item={playlist}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="artists" className="mt-6">
          <div className="text-center text-muted-foreground py-16">
            <p className="text-lg">Henüz sanatçı takip etmiyorsun.</p>
            <p>Sanatçıları takip ederek güncel kal.</p>
          </div>
        </TabsContent>
        <TabsContent value="albums" className="mt-6">
           <div className="text-center text-muted-foreground py-16">
            <p className="text-lg">Kaydedilmiş albümün bulunmuyor.</p>
            <p>Beğendiğin albümleri kitaplığına ekle.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
