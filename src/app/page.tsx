
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { SongCard } from '@/components/song-card';
import { Playlist } from '@/lib/data';

const sections = [
  { title: "Popüler Listeler", items: 6 },
  { title: "Yeni Çıkanlar", items: 6 },
];

const cardData: Omit<Playlist, 'id' | 'songs'>[] = [
    { title: "Türkçe Pop Hits", description: "En popüler parçalar", imageUrl: "/Fotoğraflar/TÜRKÇE POP HİTS.063Z.png", aiHint: "pop music" },
    { title: "Haftanın Keşifleri", description: "Yeni müzikler keşfet", imageUrl: "/Fotoğraflar/haftanın keşifleri.341Z.png", aiHint: "discovery playlist" },
    { title: "Akustik Akşamlar", description: "Sakin ve huzurlu", imageUrl: "/Fotoğraflar/akustik akşamlar.911Z.png", aiHint: "acoustic guitar" },
    { title: "Türkçe Rock", description: "Efsanevi riffler", imageUrl: "/Fotoğraflar/TÜKRÇE ROCK.037Z.png", aiHint: "rock concert" },
    { title: "Yolculuk Şarkıları", description: "Yol arkadaşların", imageUrl: "/Fotoğraflar/YOLCULUK ŞARKILARI.740Z.png", aiHint: "road trip" },
    { title: "90'lar Pop", description: "Geçmişe yolculuk", imageUrl: "/Fotoğraflar/90lar.973Z.png", aiHint: "retro cassette" },
    { title: "Yeni Nesil Rap", description: "Sokakların sesi", imageUrl: "/Fotoğraflar/YENİNESİLRAP.797Z.png", aiHint: "urban graffiti" },
    { title: "Elektronik Dans", description: "Enerjini yükselt", imageUrl: "/Fotoğraflar/elektronik dans.885Z.png", aiHint: "dj turntable" },
    { title: "Damar Şarkılar", description: "Duygusal anlar", imageUrl: "/Fotoğraflar/damarşarkılar.917Z.png", aiHint: "rainy window" },
    { title: "Antrenman Modu", description: "Limitleri zorla", imageUrl: "/Fotoğraflar/ANTREMANMODU.333Z.png", aiHint: "gym workout" },
    { title: "Odaklanma Zamanı", description: "Derin konsantrasyon", imageUrl: "/Fotoğraflar/ODAKLANMA ZAMANI.013Z.png", aiHint: "zen stones" },
    { title: "Efsane Şarkılar", description: "Unutulmaz klasikler", imageUrl: "/Fotoğraflar/Efsaneşarkılar.885Z.png", aiHint: "vinyl record" },
];


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-auto">
            <Logo />
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Üye Ol</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container py-12">
        <section className="text-center py-20">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter">
            Müziğin Ritmini Yakala
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Milyonlarca şarkı, podcast ve sana özel çalma listeleri. Dinletiyo ile müziğin keyfini çıkar.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/signup">Hemen Başla</Link>
          </Button>
        </section>

        {sections.map((section, sectionIndex) => (
          <section key={section.title} className="mt-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">{section.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {cardData.slice(sectionIndex * section.items, (sectionIndex + 1) * section.items).map((item, index) => (
                <SongCard 
                    key={index} 
                    item={{
                        id: `promo-${index}`,
                        title: item.title,
                        description: item.description,
                        imageUrl: item.imageUrl,
                        aiHint: item.aiHint,
                        songs: []
                    }} 
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="container py-8 mt-16 border-t border-border/40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Dinletiyo. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <Link href="/gizlilik" className="text-sm hover:underline">Gizlilik</Link>
            <Link href="/kosullar" className="text-sm hover:underline">Koşullar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
