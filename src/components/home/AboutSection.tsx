'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const points = [
    'Real-time seat availability and booking',
    'Trusted bus operators and route options',
    'Secure online payment processing',
    'Instant ticket confirmation via SMS',
    '24/7 customer support assistance',
    'Easy rescheduling and cancellation',
  ];

  return (
    <section className="py-16 bg-[#F4F7FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left 4-Image Grid matching Image 3 */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 relative">
            <div className="h-36 rounded-2xl overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80" alt="Bus Driver" className="w-full h-full object-cover" />
            </div>
            <div className="h-36 rounded-2xl overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80" alt="Bus Interior" className="w-full h-full object-cover" />
            </div>
            <div className="h-36 rounded-2xl overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80" alt="Bus Fleet" className="w-full h-full object-cover" />
            </div>
            <div className="h-36 rounded-2xl overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1609137144822-7773f3246eb3?auto=format&fit=crop&w=400&q=80" alt="Trinity Coach" className="w-full h-full object-cover" />
            </div>

            {/* Badge 50+ Routes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0072C6] text-white px-4 py-3 rounded-2xl shadow-xl text-center">
              <span className="text-xl font-black block font-heading">50+</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">Routes</span>
            </div>
          </div>

          {/* Right Text Content matching Image 3 */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-[#0072C6] uppercase tracking-widest block">
              ABOUT US
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading leading-tight">
              Simplifying Bus Ticket Booking & Seat Reservation
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We provide a powerful platform designed to streamline bus ticket bookings and seat reservations. Our platform connects you with the best bus operators across East Africa, ensuring a comfortable and reliable journey every time.
            </p>

            <ul className="space-y-2 pt-2">
              {points.map((p, idx) => (
                <li key={idx} className="flex items-center space-x-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0072C6] flex-shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <Link
                href="/about"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#0072C6] hover:bg-[#005FA5] text-white font-bold text-xs shadow-md transition"
              >
                More About Us
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
