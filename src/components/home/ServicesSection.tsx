'use client';

import React from 'react';

export default function ServicesSection() {
  const services = [
    {
      title: 'Cross-Border Trips',
      desc: 'Travelling for business, family, or adventure across East Africa? Trinity Express connects key East African cities with reliable transportation services.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Courier Delivery',
      desc: 'Trinity Express Courier Delivery provides a fast and reliable package delivery service across Kenya, Rwanda, Uganda, and South Sudan.',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Luggages',
      desc: 'At Trinity, we strive to make your journey as comfortable and hassle-free as possible with our generous luggage handling services.',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section id="services" className="py-16 bg-[#F4F7FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        
        {/* Section Title matching Image 2 */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#0072C6] uppercase tracking-widest block">
            OUR SERVICES
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-heading">
            What We Provide
          </h2>
        </div>

        {/* 3 Service Cards matching Image 2 layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:shadow-md transition text-left space-y-4"
            >
              <div className="h-44 rounded-xl overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading mb-1.5">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
