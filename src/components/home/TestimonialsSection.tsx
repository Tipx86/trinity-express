'use client';

import React from 'react';
import { Star, Quote, CheckCircle2, User } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      name: 'Emmanuel Habimana',
      role: 'Cross-Border Business Trader',
      route: 'Kigali ➔ Kampala',
      date: 'Traveled August 2026',
      rating: 5,
      comment: 'Trinity Express has transformed my weekly business trips between Kigali and Kampala. Booking online took less than 2 minutes, the seat was comfortable and clean, and the Wi-Fi kept me working throughout the journey.',
      avatar: 'EH',
    },
    {
      name: 'Sarah Akello',
      role: 'NGO Program Officer',
      route: 'Kampala ➔ Juba',
      date: 'Traveled July 2026',
      rating: 5,
      comment: 'Travelling from Kampala to Juba can be challenging, but Trinity Express made it feel seamless and secure. The VIP coach was punctual, air-conditioned, and the drivers were highly professional at border control.',
      avatar: 'SA',
    },
    {
      name: 'David Mwangi',
      role: 'Software Consultant',
      route: 'Kigali ➔ Nairobi',
      date: 'Traveled August 2026',
      rating: 5,
      comment: 'I really appreciated being able to choose my window seat on the digital seat map and paying directly via M-Pesa. The QR ticket on my phone meant zero queueing at the station counter.',
      avatar: 'DM',
    },
  ];

  return (
    <section className="py-20 bg-trinity-navy-900 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Passenger Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
            Trusted by Thousands of East African Travelers
          </h2>
          <p className="text-slate-400 text-base">
            Read real reviews from passengers who travel with Trinity Express across Rwanda, Uganda, Kenya, and South Sudan.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="glass-panel-dark rounded-2xl p-7 border border-white/10 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-300 ml-2">5.0</span>
                </div>

                {/* Quote text */}
                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Passenger info */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs">
                    {rev.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-heading">
                      {rev.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{rev.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-400 block">
                    {rev.route}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {rev.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
