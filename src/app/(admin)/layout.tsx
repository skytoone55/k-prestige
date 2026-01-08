'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/reservations', icon: FileText, label: 'Réservations' },
    { href: '/admin/clients', icon: Users, label: 'Clients' },
    { href: '/admin/settings', icon: Settings, label: 'Paramètres' },
  ];

  if (!user) {
    return null; // Ou un loader
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-[#B8860B] flex items-center justify-center">
                <span className="text-[#B8860B] font-bold text-xl" style={{ fontFamily: 'var(--font-cormorant)' }}>K</span>
              </div>
              <span className="text-lg tracking-[0.2em] text-[#B8860B]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                PRESTIGE
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Administration
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-700 hover:bg-amber-50 hover:text-[#B8860B] transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-stone-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-stone-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-stone-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-stone-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {user.email}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

