'use client';

import React from 'react';
import { 
  Bus, 
  ShieldCheck, 
  Globe, 
  Clock, 
  Sparkles, 
  Award, 
  HeartHandshake, 
  CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-trinity-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Bus className="w-4 h-4" />
            <span>Connecting East Africa Safely</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-heading">
            About Trinity Express
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Trinity Express is a premier cross-border passenger transportation company dedicated to connecting the vibrant cities, trade hubs, and communities of Rwanda, Uganda, Kenya, and South Sudan.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel-dark rounded-3xl p-7 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Passenger Safety First
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We uphold strict passenger safety protocols, including mandatory dual-driver shifts on long cross-border journeys, routine fleet maintenance, and full passenger insurance coverage backed by SONARWA General.
            </p>
          </div>

          <div className="glass-panel-dark rounded-3xl p-7 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Seamless Digital Booking
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our modern booking platform enables travelers to select their exact window or VIP seats, pay instantly with mobile money (M-Pesa, Airtel Money) or card, and receive digital QR tickets on their phones.
            </p>
          </div>

          <div className="glass-panel-dark rounded-3xl p-7 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Cross-Border Expertise
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              With deep experience navigating East African border crossings (Gatuna/Katuna, Busia/Malaba, Nimule/Elegu), our station agents provide smooth immigration guidance for every passenger.
            </p>
          </div>
        </div>

        {/* Story & Commitment */}
        <div className="glass-panel-dark rounded-3xl p-8 sm:p-12 border border-white/10 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            Our Mission: Reliable, Dignified Transportation Across Borders
          </h2>
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              Cross-border road travel is the lifeblood of East African trade, family ties, tourism, and economic integration. Trinity Express was founded on the conviction that regional long-distance travel should be comfortable, punctual, transparent, and dignified.
            </p>
            <p>
              By investing in state-of-the-art European Scania and Marcopolo coach chassis equipped with climate-controlled air conditioning, high-speed Wi-Fi, and individual seat USB power sockets, we ensure every passenger arrives at their destination refreshed and prepared.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Licensed by Rwanda Utilities Regulatory Authority (RURA)</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Passenger Transit Liability Insured by SONARWA</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-white font-heading">
            Ready to experience the Trinity Express difference?
          </h3>
          <Link
            href="/book"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition"
          >
            <span>Book Your Bus Ticket Now</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
