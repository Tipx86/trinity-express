'use client';

import React from 'react';
import { 
  Wifi, 
  Zap, 
  Wind, 
  Coffee, 
  ShieldCheck, 
  Sparkles, 
  Armchair, 
  Tv, 
  Navigation,
  Check
} from 'lucide-react';

export default function FleetAmenities() {
  const fleetFeatures = [
    {
      icon: Armchair,
      title: 'Ergonomic VIP Reclining Seats',
      desc: 'Generous legroom with adjustable footrests and plush memory cushioning for maximum cross-border comfort.',
      badge: 'First Class Comfort',
    },
    {
      icon: Wifi,
      title: 'High-Speed 4G/5G Wi-Fi',
      desc: 'Stay connected throughout your journey with continuous cross-border satellite-boosted internet.',
      badge: 'Free On-Board',
    },
    {
      icon: Zap,
      title: 'Individual USB & Power Sockets',
      desc: 'Dedicated fast-charging power points at every single window and aisle seat for phones and laptops.',
      badge: 'All Seats',
    },
    {
      icon: Wind,
      title: 'Climate-Controlled Air Conditioning',
      desc: 'Advanced air filtration and individual overhead passenger vents maintaining ideal cabin temperature.',
      badge: 'Dual Climate',
    },
    {
      icon: Navigation,
      title: 'Real-Time GPS Fleet Tracking',
      desc: 'Central operations monitoring 24/7 with speed governors and automated cross-border status updates.',
      badge: '24/7 Monitored',
    },
    {
      icon: ShieldCheck,
      title: 'Dual Certified Driver Policy',
      desc: 'Strict road safety compliance with two fully vetted professional drivers alternating on long routes.',
      badge: 'Safety First',
    },
  ];

  return (
    <section className="py-20 bg-trinity-navy-900 border-t border-white/10 relative overflow-hidden">
      {/* Background glowing sphere */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Modern Cross-Border Fleet</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
            Travel In Unmatched Luxury & Safety
          </h2>
          <p className="text-slate-400 text-base">
            Every Trinity Express coach is equipped with premium passenger amenities tailored specifically for long-distance East African travel.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleetFeatures.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel-dark rounded-2xl p-7 border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600/30 to-amber-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-heading group-hover:text-emerald-300 transition">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Fleet highlight banner */}
        <div className="mt-14 glass-panel-dark rounded-3xl p-8 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-trinity-navy-950 via-trinity-navy-900 to-trinity-navy-950">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Scania & Marcopolo Executive Coaches
            </span>
            <h4 className="text-2xl font-black text-white font-heading">
              Ready for your next cross-border adventure?
            </h4>
            <p className="text-sm text-slate-300">
              Book online in less than 2 minutes. Instant seat assignment, scannable QR ticket, and direct terminal boarding.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/book"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 transition hover:scale-105"
            >
              Book Your Seat Now
            </a>
            <a
              href="/about"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition"
            >
              Learn About Our Fleet
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
