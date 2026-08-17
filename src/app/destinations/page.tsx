'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Globe, ArrowRight, ShieldCheck, Bus } from 'lucide-react';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([]);
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
    <div className="min-h-screen bg-trinity-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Globe className="w-4 h-4" />
            <span>East Africa Regional Network</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-heading">
            Destinations & Terminal Stations
          </h1>
          <p className="text-slate-400 text-base">
            Discover the vibrant East African capitals and trade corridors connected daily by Trinity Express coaches.
          </p>
        </div>

        {/* Destinations List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="glass-panel-dark rounded-3xl overflow-hidden border border-white/10 hover:border-emerald-500/40 transition-all duration-300 group hover:-translate-y-1.5 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  {/* City Image */}
                  <div className="h-56 relative overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-trinity-navy-950 via-trinity-navy-950/40 to-transparent"></div>
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 font-bold text-xs border border-white/10">
                        {dest.country}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-trinity-navy-950 font-black text-xs font-mono shadow">
                        {dest.code}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-black text-white font-heading">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-emerald-400 font-semibold flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{dest.terminalName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-6 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {dest.description}
                    </p>

                    {dest.address && (
                      <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
                        <strong>Terminal Address:</strong> {dest.address}
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Action */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/book?from=Kigali&to=${encodeURIComponent(dest.name)}`}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-emerald-500 text-white font-bold text-xs border border-white/10 hover:border-emerald-400 transition duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Book Bus to {dest.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
