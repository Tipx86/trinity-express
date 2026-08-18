'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatters';

export default function PopularRoutes() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [currency, setCurrency] = useState('RWF');

  useEffect(() => {
    const savedCur = localStorage.getItem('trinity_currency') || 'RWF';
    setCurrency(savedCur);

    const onCurChange = (e: CustomEvent) => setCurrency(e.detail);
    window.addEventListener('currency-changed' as any, onCurChange);

    fetch('/api/routes')
      .then((res) => res.json())
      .then((data) => {
        if (data.routes) setRoutes(data.routes);
      })
      .catch(() => {});

    return () => window.removeEventListener('currency-changed' as any, onCurChange);
  }, []);

  const getPrice = (r: any) => {
    const fromName = r.origin?.name || '';
    const fromLower = fromName.toLowerCase();
    
    if (fromLower.includes('kigali') || fromLower.includes('rwanda')) {
      return formatCurrency(r.basePriceRwf, 'RWF');
    }
    if (fromLower.includes('kampala')) {
      return formatCurrency(r.basePriceUgx, 'UGX');
    }
    if (fromLower.includes('nairobi') || fromLower.includes('mombasa') || fromLower.includes('kisumu') || fromLower.includes('busia')) {
      return formatCurrency(r.basePriceKes, 'KES');
    }
    if (fromLower.includes('juba') || fromLower.includes('bor')) {
      return formatCurrency(r.basePriceSsp || 0, 'SSP');
    }
    return formatCurrency(r.basePriceRwf, 'RWF');
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80',
    '/images/trinity_bus_fleet.png',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80',
  ];

  const getRouteImage = (route: any, idx: number) => {
    const origin = (route.origin?.name || '').toLowerCase();
    const dest = (route.destination?.name || '').toLowerCase();

    if (origin.includes('kigali') && dest.includes('busia')) {
      return '/images/trinity_bus_fleet.png';
    }

    return sampleImages[idx % sampleImages.length];
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        
        {/* Section Header matching Image 2 */}
        <h2 className="text-3xl font-black text-slate-900 font-heading">
          Our Routes
        </h2>

        {/* 6 Route cards matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.slice(0, 6).map((route, idx) => (
            <div
              key={route.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition text-left flex flex-col justify-between"
            >
              <div>
                <div className="h-40 relative bg-slate-100">
                  <img
                    src={getRouteImage(route, idx)}
                    alt={`${route.origin.name} to ${route.destination.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/trinity_bus_fleet.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white font-black text-lg font-heading">
                    {route.origin.name} ➔ {route.destination.name}
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    3 Buses daily
                  </span>
                  <span className="font-black text-[#0072C6] text-base font-heading">
                    {getPrice(route)}
                  </span>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/book?from=${encodeURIComponent(route.origin.name)}&to=${encodeURIComponent(route.destination.name)}`}
                  className="w-full block text-center py-2 rounded-xl border border-[#0072C6] text-[#0072C6] hover:bg-[#0072C6] hover:text-white font-bold text-xs transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
