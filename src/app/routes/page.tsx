'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [currency, setCurrency] = useState('RWF');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCur = localStorage.getItem('trinity_currency') || 'RWF';
    setCurrency(savedCur);

    const onCurChange = (e: CustomEvent) => setCurrency(e.detail);
    window.addEventListener('currency-changed' as any, onCurChange);

    fetch('/api/routes')
      .then((res) => res.json())
      .then((data) => {
        if (data.routes) setRoutes(data.routes);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => window.removeEventListener('currency-changed' as any, onCurChange);
  }, []);

  const getPrice = (r: any) => {
    switch (currency) {
      case 'UGX': return formatCurrency(r.basePriceUgx, 'UGX');
      case 'KES': return formatCurrency(r.basePriceKes, 'KES');
      case 'USD': return formatCurrency(r.basePriceUsd, 'USD');
      case 'SSP': return formatCurrency(r.basePriceSsp || 0, 'SSP');
      default: return formatCurrency(r.basePriceRwf, 'RWF');
    }
  };

  // High-quality bus fleet images matching the user reference design
  const cardImages = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1609137144822-7773f3246eb3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  ];

  // Specific routes requested to use the provided Trinity Express fleet image
  const getRouteImage = (route: any, idx: number) => {
    const origin = route.origin?.name?.toLowerCase();
    const dest = route.destination?.name?.toLowerCase();

    if (
      (origin === 'juba' && dest === 'kampala') ||
      (origin === 'nairobi' && dest === 'mombasa') ||
      (origin === 'kigali' && dest === 'nairobi')
    ) {
      return '/images/trinity_bus_fleet.png';
    }

    return cardImages[idx % cardImages.length];
  };

  const filteredRoutes = routes.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.origin.name.toLowerCase().includes(q) ||
      r.destination.name.toLowerCase().includes(q) ||
      r.origin.country.toLowerCase().includes(q) ||
      r.destination.country.toLowerCase().includes(q) ||
      (r.stops && r.stops.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Page Header matching user screenshot */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <p className="text-xs font-bold text-[#0072C6] tracking-widest uppercase">
            ROUTE NETWORK
          </p>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Explore Trinity Express Bus Routes
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Trinity Express provides reliable cross-border bus travel across East Africa, including Kigali, Kampala, Nairobi, Juba and Bor routes, with comfortable buses and trusted customer support.
          </p>

          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Find route pages for Kigali, Kampala, Nairobi, Juba and Bor with fares, departure times and cross-border travel details.
          </p>

          {/* Search bar */}
          <div className="pt-2 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search routes by city, country, or stop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#0072C6] focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Routes Grid matching user screenshot */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-[#0072C6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-600 font-bold text-sm">No routes found matching &quot;{searchTerm}&quot;.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 text-xs text-[#0072C6] font-bold underline"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredRoutes.map((route, idx) => (
              <div
                key={route.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  {/* Card Image */}
                  <div className="rounded-2xl overflow-hidden h-48 w-full mb-4 relative bg-slate-100">
                    <img
                      src={getRouteImage(route, idx)}
                      alt={`${route.origin.name} to ${route.destination.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/trinity_bus_fleet.png';
                      }}
                    />
                  </div>

                  {/* Route Label */}
                  <p className="text-[11px] font-extrabold text-[#0072C6] tracking-wider uppercase mb-1">
                    ROUTE
                  </p>

                  {/* Route Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading mb-2">
                    {route.origin.name} to {route.destination.name}
                  </h3>

                  {/* Route Description Text */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    Book Trinity Express {route.origin.name} to {route.destination.name} bus tickets for cross-border travel from {route.origin.country} to {route.destination.country}. Check departures, fares, seats and route details for the {route.origin.name} {route.destination.name} bus route.
                  </p>
                </div>

                {/* Card Footer: Price & View Route CTA Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                  <span className="text-xs font-bold text-[#0072C6]">
                    From {getPrice(route)}
                  </span>

                  <Link
                    href={`/book?from=${encodeURIComponent(route.origin.name)}&to=${encodeURIComponent(route.destination.name)}`}
                    className="px-5 py-2 rounded-xl bg-[#0072C6] hover:bg-[#005FA5] text-white font-bold text-xs transition duration-200 shadow-sm"
                  >
                    View Route
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
