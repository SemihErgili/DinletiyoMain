import { Sidebar } from '@/components/layout/sidebar';
import { Player } from '@/components/layout/player';
import AuthGuard from '@/components/auth-guard';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-0">
          <main className="flex-1 overflow-y-auto p-8 lg:p-10 lg:pb-28">
            {children}
          </main>
          <Player />
        </div>
      </div>
    </AuthGuard>
  );
}
