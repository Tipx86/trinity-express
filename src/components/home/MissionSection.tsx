'use client';

import React from 'react';

export default function MissionSection() {
  const cards = [
    {
      title: 'Vision',
      text: 'To be the leading provider of reliable and efficient cross-border transportation in the region.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'Mission',
      text: 'To connect communities and foster economic growth through enhanced trade, tourism, and safe travel for local connections.',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'Values',
      text: 'Reliability, Safety, Comfort, Customer Focus, Innovation.',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        
        {/* Section Header matching Image 3 */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#0072C6] uppercase tracking-widest block">
            OUR FOUNDATION
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-heading">
            Mission, Vision & Values
          </h2>
        </div>

        {/* 3 Cards matching Image 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F4F7FA] border border-slate-200 rounded-2xl p-5 text-left space-y-3 shadow-sm hover:shadow-md transition"
            >
              <div className="h-40 rounded-xl overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
