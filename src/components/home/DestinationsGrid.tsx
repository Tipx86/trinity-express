'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Globe, Bus } from 'lucide-react';

interface DestinationItem {
  id: string;
  name: string;
  code: string;
  country: string;
  countryCode: string;
  terminalName: string;
  image: string;
  description: string;
  isPopular: boolean;
}

export default function DestinationsGrid() {
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => {
        if (data.destinations) setDestinations(data.destinations);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-trinity-navy-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Globe className="w-4 h-4" />
              <span>Regional Hubs & Terminals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
              Cross-Border Destinations
            </h2>
            <p className="text-slate-400 mt-2 text-base max-w-2xl">
              Connecting primary commercial capitals and regional centers across Rwanda, Uganda, Kenya, and South Sudan.
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-bold text-sm group"
          >
            <span>Explore All Cities</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Destinations Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-trinity-navy-900 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-500/40 flex flex-col h-[340px]"
            >
              {/* Background Image with Gradient Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${dest.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-trinity-navy-950 via-trinity-navy-950/70 to-transparent"></div>
              </div>

              {/* Top Badges */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-emerald-400 text-xs font-bold border border-white/10">
                  {dest.country}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-trinity-navy-950 font-black text-xs">
                  {dest.code}
                </span>
              </div>

              {/* Bottom Details Content */}
              <div className="relative z-10 p-5 mt-auto space-y-3">
                <div>
                  <h3 className="text-2xl font-black text-white font-heading group-hover:text-emerald-300 transition">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-emerald-400 font-semibold flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{dest.terminalName}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                <div className="pt-2">
                  <Link
                    href={`/book?from=Kigali&to=${encodeURIComponent(dest.name)}`}
                    className="inline-flex items-center justify-between w-full px-4 py-2 rounded-xl bg-white/10 hover:bg-emerald-500 text-white hover:text-white text-xs font-bold transition duration-200 border border-white/10 group-hover:border-emerald-400"
                  >
                    <span>Book Bus to {dest.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
