'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Bus, 
  LayoutDashboard, 
  Map, 
  CalendarClock, 
  Truck, 
  Receipt, 
  Users, 
  Settings, 
  LogOut, 
  Home,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setAdminUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const navItems = [
    { label: 'Operations Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Routes & Fares', href: '/admin#routes', icon: Map },
    { label: 'Trips & Schedule', href: '/admin#trips', icon: CalendarClock },
    { label: 'Bus Fleet & Seats', href: '/admin#buses', icon: Truck },
    { label: 'Bookings & Ledger', href: '/admin#bookings', icon: Receipt },
    { label: 'CMS & Site Settings', href: '/admin#settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-trinity-navy-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-trinity-navy-900 border-r border-white/10 p-5 space-y-6 flex-shrink-0 h-screen sticky top-0">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-trinity-navy-950 rounded-[10px] flex items-center justify-center">
              <Bus className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black text-white font-heading block leading-tight">
              TRINITY <span className="text-emerald-400">ADMIN</span>
            </span>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Control Center
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href.includes('#') && typeof window !== 'undefined' && window.location.hash === item.href.split('#')[1]);
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition text-slate-300 hover:text-white hover:bg-white/10"
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin profile & shortcuts */}
        <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs">
                A
              </div>
              <div className="truncate">
                <p className="font-bold text-white truncate">{adminUser?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400 truncate">{adminUser?.email || 'admin@trinityexpress.rw'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Link
              href="/"
              className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-center font-medium flex items-center justify-center space-x-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-center font-medium"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-trinity-navy-900 border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <Bus className="w-6 h-6 text-emerald-400" />
          <span className="font-black text-white font-heading">TRINITY ADMIN</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-white/5 text-slate-300"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content View */}
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8">
        {children}
      </main>

    </div>
  );
}
