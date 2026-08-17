'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bus, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  CreditCard,
  Smartphone
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Don't render public footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-trinity-navy-950 text-slate-400 border-t border-white/10 pt-16 pb-12 font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-trinity-navy-950 rounded-[10px] flex items-center justify-center">
                  <Bus className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight font-heading">
                  TRINITY <span className="text-emerald-400">EXPRESS</span>
                </span>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Bus Tickets Across East Africa
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed pr-6">
              The premier cross-border passenger transportation company connecting Rwanda, Uganda, Kenya, and South Sudan. Experience safe, comfortable, and seamless travel with VIP luxury coaches.
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>RURA Licensed & Regulated</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>SONARWA Insured</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/book" className="hover:text-emerald-400 transition flex items-center space-x-1.5">
                  <span>Book a Bus Ticket</span>
                </Link>
              </li>
              <li>
                <Link href="/my-booking" className="hover:text-emerald-400 transition flex items-center space-x-1.5">
                  <span>My Booking / Ticket</span>
                </Link>
              </li>
              <li>
                <Link href="/routes" className="hover:text-emerald-400 transition flex items-center space-x-1.5">
                  <span>Popular Routes</span>
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-emerald-400 transition flex items-center space-x-1.5">
                  <span>Destinations & Cities</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition flex items-center space-x-1.5">
                  <span>About Trinity Express</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition flex items-center space-x-1.5">
                  <span>FAQs & Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Express Routes */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading">
              Popular Routes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/book?from=Kigali&to=Kampala" className="hover:text-emerald-400 transition">
                  Kigali ➔ Kampala Daily
                </Link>
              </li>
              <li>
                <Link href="/book?from=Kampala&to=Kigali" className="hover:text-emerald-400 transition">
                  Kampala ➔ Kigali Daily
                </Link>
              </li>
              <li>
                <Link href="/book?from=Kigali&to=Nairobi" className="hover:text-emerald-400 transition">
                  Kigali ➔ Nairobi Express
                </Link>
              </li>
              <li>
                <Link href="/book?from=Kampala&to=Juba" className="hover:text-emerald-400 transition">
                  Kampala ➔ Juba Direct
                </Link>
              </li>
              <li>
                <Link href="/book?from=Kigali&to=Mbarara" className="hover:text-emerald-400 transition">
                  Kigali ➔ Mbarara Shuttle
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Regional Terminal Contacts */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading">
              Terminal Stations
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-semibold text-slate-200">Nairobi Terminal:</p>
                <p className="text-slate-400">River Road / Accra Rd</p>
                <p className="text-emerald-400">+254 7146613385</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Payment Badges and Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-medium">Accepted Payments:</span>
            <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded font-bold">
              M-Pesa
            </span>
            <span className="bg-red-950/80 border border-red-500/30 text-red-300 px-2.5 py-1 rounded font-bold">
              Airtel Money
            </span>
            <span className="bg-yellow-950/80 border border-yellow-500/30 text-yellow-300 px-2.5 py-1 rounded font-bold">
              MTN MoMo
            </span>
            <span className="bg-blue-950/80 border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded font-bold">
              Visa / Mastercard
            </span>
          </div>

          <div className="text-slate-400 text-center md:text-right">
            <p>© {new Date().getFullYear()} Trinity Express. All rights reserved. Bus Tickets Across East Africa.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
