
'use server';

// !!! UYARI: Bu, GÖSTERİM AMAÇLI sahte bir kimlik doğrulama servisidir. !!!
// !!! Üretim ortamında KESİNLİKLE kullanılmamalıdır. !!!
// Gerçek bir uygulamada, Firebase Authentication, Auth.js (NextAuth),
// veya başka bir güvenli kimlik doğrulama sağlayıcısı kullanın.

interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string; // Gerçekte şifreyi asla düz metin olarak saklamayın.
  avatar?: string;
}

// -- START: Sahte Veritabanı Düzeltmesi --
// Next.js'in geliştirme modunda her istekte modülleri yeniden yüklemesi nedeniyle,
// kullanıcı listesini global bir değişkende saklıyoruz.
// Bu, kullanıcıların uygulama yeniden başlatılana kadar korunmasını sağlar.
declare global {
  var __users_db__: User[];
}

if (!global.__users_db__) {
  global.__users_db__ = [
    {
      id: '1',
      username: 'demo',
      email: 'demo@dinletiyo.com',
      // "password123" için sahte hash
      passwordHash: 'hashed:password123',
      avatar: 'https://placehold.co/100x100.png',
    },
  ];
}

const users = global.__users_db__;
// -- END: Sahte Veritabanı Düzeltmesi --


export async function signup(userData: Omit<User, 'id' | 'passwordHash'> & { password: string }) {
  // E-postanın zaten kullanımda olup olmadığını kontrol et
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('Bu e-posta adresi zaten kullanılıyor.');
  }

  // Yeni kullanıcı oluştur
  const newUser: User = {
    id: String(users.length + 1),
    username: userData.username,
    email: userData.email,
    // Gerçek bir uygulamada burada bcrypt gibi bir kütüphane ile şifre hash'lenir.
    passwordHash: `hashed:${userData.password}`,
    avatar: 'https://placehold.co/100x100.png', // Default avatar
  };

  users.push(newUser);
  console.log('Kullanıcı kaydedildi:', newUser.email);
  console.log('Tüm kullanıcılar:', users.map(u => u.email));
  return { id: newUser.id, username: newUser.username, email: newUser.email, avatar: newUser.avatar };
}

export async function login(email: string, password_raw: string) {
  console.log('Giriş denemesi:', email);
  console.log('Tüm kullanıcılar:', users.map(u => u.email));
  
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error('Böyle bir kullanıcı bulunamadı.');
  }

  // Şifre kontrolü (sahte)
  const isPasswordCorrect = `hashed:${password_raw}` === user.passwordHash;

  if (!isPasswordCorrect) {
    throw new Error('Şifre yanlış.');
  }

  console.log('Giriş başarılı:', user.email);
  return { id: user.id, username: user.username, email: user.email, avatar: user.avatar };
}

export async function updateProfile(userId: string, data: { username?: string; avatar?: string }) {
    console.log(`Profil güncelleniyor: userId=${userId}, data=`, data);
    console.log('Güncelleme öncesi kullanıcılar:', users);
    
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        console.error('Güncellenecek kullanıcı bulunamadı! ID:', userId);
        throw new Error('Güncellenecek kullanıcı bulunamadı.');
    }

    const user = users[userIndex];

    if (data.username) {
        user.username = data.username;
    }
    if (data.avatar !== undefined) {
        user.avatar = data.avatar;
    }
    
    users[userIndex] = user;

    console.log('Profil güncellendi:', user);
    console.log('Güncelleme sonrası kullanıcılar:', users);
    return { id: user.id, username: user.username, email: user.email, avatar: user.avatar };
}
