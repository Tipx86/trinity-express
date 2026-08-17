'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldCheck, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't render public navbar on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'Routes', href: '/routes' },
    { name: 'Booking', href: '/book' },
    { name: 'Contact', href: '/contact' },
    { name: 'News', href: '/#news' },
    { name: 'FAQ', href: '/contact#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#81A9D0] shadow-md border-b border-white/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo matching image 1 (Trinity Express with dove icon) */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center space-x-2">
              <svg className="w-10 h-10 text-trinity-navy-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-trinity-navy-900 tracking-tight font-heading uppercase leading-none">
                  TRINITY
                </span>
                <span className="text-xs font-bold text-slate-800 tracking-widest lowercase italic -mt-1">
                  express
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-bold transition-colors ${isActive
                      ? 'text-white underline underline-offset-4 decoration-2'
                      : 'text-trinity-navy-900 hover:text-white'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/book"
              className="px-5 py-2.5 rounded-full bg-[#0072C6] hover:bg-[#005FA5] text-white font-bold text-xs shadow-md transition duration-200"
            >
              Book Now
            </Link>
            <Link
              href="/my-booking"
              className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-trinity-navy-900 font-bold text-xs transition"
            >
              My Ticket
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-trinity-navy-900 hover:bg-white/20"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#6B99C4] border-b border-white/20 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-base font-bold text-trinity-navy-900 hover:text-white rounded-lg"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/20 flex flex-col space-y-2">
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-[#0072C6] text-white font-bold text-sm"
            >
              Book Ticket
            </Link>
            <Link
              href="/my-booking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-full bg-white/20 text-trinity-navy-900 font-bold text-xs"
            >
              My Booking
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
