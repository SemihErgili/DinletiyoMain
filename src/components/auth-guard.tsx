'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Kullanıcı durumu kontrol edilirken gösterilecek yüklenme ekranı
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-white text-lg">Oturum durumu kontrol ediliyor...</p>
    </div>
  );
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Tarayıcının Local Storage'ından kullanıcı bilgisini alıyoruz
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (loggedInUser) {
      // Kullanıcı giriş yapmışsa, durumu güncelliyoruz
      setIsAuth(true);
    } else {
      // Kullanıcı giriş yapmamışsa, yetkisiz erişim sayfasına yönlendiriyoruz
      router.replace('/unauthorized');
    }
    setChecking(false);
  }, [router]);

  // Kontrol devam ederken yüklenme ekranı göster
  if (checking) {
    return <LoadingScreen />;
  }

  // Eğer kullanıcı giriş yapmışsa, korunan sayfayı göster
  if (isAuth) {
    return <>{children}</>;
  }

  // Yönlendirme gerçekleşene kadar hiçbir şey gösterme
  return null;
}
