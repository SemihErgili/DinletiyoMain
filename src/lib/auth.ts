
'use server';

import { Resend } from 'resend';
import crypto from 'crypto';
import VerifyEmail from '@/components/emails/verify-email';

// !!! UYARI: Bu, GÖSTERİM AMAÇLI sahte bir kimlik doğrulama servisidir. !!!
// Gerçek bir uygulamada, Firebase Authentication, Auth.js (NextAuth), vb. kullanın.

// Doğrudan API anahtarını kullanıyoruz (test amaçlı)
const resend = new Resend('re_Akamv5kD_CMywTwktHwfR1FyWocUS8ojm');
const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  emailVerified: boolean;
  verificationToken: string | null;
}

// -- START: Sahte Veritabanı Düzeltmesi --
declare global {
  var __users_db__: User[];
}

if (!global.__users_db__) {
  global.__users_db__ = [
    {
      id: '1',
      username: 'demo',
      email: 'demo@dinletiyo.com',
      passwordHash: 'hashed:password123',
      avatar: 'https://placehold.co/100x100.png',
      emailVerified: true, // Demo kullanıcısı doğrulanmış olsun
      verificationToken: null,
    },
  ];
}

const users = global.__users_db__;
// -- END: Sahte Veritabanı Düzeltmesi --

export async function signup(userData: Omit<User, 'id' | 'passwordHash' | 'emailVerified' | 'verificationToken'> & { password: string }) {
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('Bu e-posta adresi zaten kullanılıyor.');
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');

  const newUser: User = {
    id: String(users.length + 1),
    username: userData.username,
    email: userData.email,
    passwordHash: `hashed:${userData.password}`,
    avatar: 'https://placehold.co/100x100.png',
    emailVerified: false,
    verificationToken: verificationToken,
  };

  users.push(newUser);

  const verificationLink = `${domain}/api/verify-email?token=${verificationToken}`;

  try {
    await resend.emails.send({
      from: 'Dinletiyo <onboarding@resend.dev>',
      to: newUser.email,
      subject: 'Dinletiyo Hesabınızı Doğrulayın',
      react: VerifyEmail({ verificationLink }),
    });
    console.log('Doğrulama e-postası gönderildi:', newUser.email);
  } catch (error) {
    console.error('E-posta gönderim hatası:', error);
    // Hata durumunda kullanıcıyı silmek veya başka bir işlem yapmak isteyebilirsiniz.
    throw new Error('Doğrulama e-postası gönderilemedi.');
  }

  return { message: 'Kayıt başarılı! Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın.' };
}

export async function login(email: string, password_raw: string) {
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error('Böyle bir kullanıcı bulunamadı.');
  }

  const isPasswordCorrect = `hashed:${password_raw}` === user.passwordHash;

  if (!isPasswordCorrect) {
    throw new Error('Şifre yanlış.');
  }

  if (!user.emailVerified) {
    throw new Error('Giriş yapmadan önce lütfen e-posta adresinizi doğrulayın.');
  }

  console.log('Giriş başarılı:', user.email);
  return { id: user.id, username: user.username, email: user.email, avatar: user.avatar };
}

export async function verifyEmailToken(token: string) {
  const user = users.find(u => u.verificationToken === token);

  if (!user) {
    throw new Error('Geçersiz veya süresi dolmuş doğrulama kodu.');
  }

  user.emailVerified = true;
  user.verificationToken = null; // Token'ı kullandıktan sonra temizle

  console.log('E-posta doğrulandı:', user.email);
  return { message: 'E-posta adresiniz başarıyla doğrulandı!' };
}

export async function updateProfile(userId: string, data: { username?: string; avatar?: string }) {
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
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

    return { id: user.id, username: user.username, email: user.email, avatar: user.avatar };
}
