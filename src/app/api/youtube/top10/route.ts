import { NextResponse } from 'next/server';

// Örnek veri - API çalışmazsa kullanılacak
const sampleData = {
  videos: [
    {
      id: 'dQw4w9WgXc1',
      title: 'Türkçe Pop Hit 1',
      description: '2024 yılının en çok dinlenen pop şarkılarından',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: 'Resmi Müzik',
      position: 1
    },
    {
      id: 'dQw4w9WgXc2',
      title: 'Türkçe Rock Klasik',
      description: 'Efsanevi Türkçe rock şarkısı',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: 'Rock FM',
      position: 2
    },
    {
      id: 'dQw4w9WgXc3',
      title: 'Arabesk Fırtınası',
      description: 'Gönülleri fetheden arabesk şarkı',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: 'Arabesk TV',
      position: 3
    },
    {
      id: 'dQw4w9WgXc4',
      title: 'Türkçe Rap Hit',
      description: 'Yeni nesil Türkçe rap şarkısı',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: 'Rap Life',
      position: 4
    },
    {
      id: 'dQw4w9WgXc5',
      title: '90lar Klasik',
      description: '90ların unutulmaz şarkısı',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: '90lar FM',
      position: 5
    },
    {
      id: 'dQw4w9WgXc6',
      title: 'Slow Akustik',
      description: 'Hafif müzik sevenler için',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: 'Akustik Dünya',
      position: 6
    },
    {
      id: 'dQw4w9WgXc7',
      title: 'Türk Halk Müziği',
      description: 'Yöresel tınılarla dolu bir şaheser',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: 'TRT Müzik',
      position: 7
    },
    {
      id: 'dQw4w9WgXc8',
      title: 'Yaz Hitleri 2024',
      description: 'Bu yazın en çok çalınan şarkısı',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: 'Yaz FM',
      position: 8
    },
    {
      id: 'dQw4w9WgXc9',
      title: 'Türkçe Alternatif',
      description: 'Alternatif müzik sevenler için',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: 'Açık Radyo',
      position: 9
    },
    {
      id: 'dQw4w9WgX10',
      title: 'En Sevilen Türkçe Şarkılar',
      description: 'Tüm zamanların en sevilenleri',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: 'Hit FM',
      position: 10
    }
  ]
};

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.warn('YouTube API anahtarı bulunamadı. Örnek veri kullanılıyor.');
      return NextResponse.json(sampleData);
    }
    
    // Türkiye'de popüler müzik araması yap
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=TR&videoCategoryId=10&maxResults=10&key=${apiKey}`
    );

    if (!response.ok) {
      console.warn('YouTube API hatası. Örnek veri kullanılıyor.');
      return NextResponse.json(sampleData);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json(sampleData);
    }
    
    // Sadece gerekli bilgileri filtrele
    const videos = data.items.map((item: any, index: number) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || 
                item.snippet.thumbnails?.medium?.url || 
                item.snippet.thumbnails?.default?.url ||
                'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: item.snippet.channelTitle,
      position: index + 1,
    }));

    return NextResponse.json({ videos });
  } catch (error: any) {
    console.error('YouTube API Hatası:', error);
    // Hata durumunda örnek veri döndür
    return NextResponse.json(sampleData);
  }
}
