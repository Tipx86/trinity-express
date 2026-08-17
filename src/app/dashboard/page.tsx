'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Bus, 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  ArrowRight, 
  LogOut, 
  ShieldCheck, 
  Download,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@/lib/formatters';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push('/auth/login');
        } else {
          setUser(data.user);
          // Fetch user's bookings
          fetchUserBookings(data.user.email);
        }
      })
      .catch(() => {
        router.push('/auth/login');
      });
  }, []);

  const fetchUserBookings = async (email: string) => {
    try {
      const res = await fetch(`/api/admin/bookings?search=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.bookings) setBookings(data.bookings);
    } catch {
      // Continue
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-trinity-navy-950 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-trinity-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Header Card */}
        <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-0.5 shadow-glow-emerald">
              <div className="w-full h-full bg-trinity-navy-950 rounded-[14px] flex items-center justify-center text-2xl font-black text-emerald-400">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
                  {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {user?.email} • {user?.phone || 'No phone added'} • {user?.nationality || 'Rwanda'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Link
              href="/book"
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg transition text-center"
            >
              Book New Journey
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-semibold text-xs border border-white/10 transition flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Travel History / Bookings List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-heading">
              My Bus Reservations ({bookings.length})
            </h3>
          </div>

          {bookings.length === 0 ? (
            <div className="glass-panel-dark rounded-3xl p-12 border border-white/10 text-center space-y-4">
              <Bus className="w-12 h-12 text-slate-500 mx-auto" />
              <h4 className="text-lg font-bold text-white font-heading">No Bookings Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You have not booked any bus trips yet. Search our daily cross-border routes to Kigali, Kampala, Nairobi, or Juba.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-lg"
              >
                <span>Book Your First Bus</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="glass-panel-dark rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-emerald-500/40 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-emerald-400 text-base">
                        {b.bookingRef}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="text-lg font-bold text-white font-heading">
                      {b.trip?.route?.origin?.name} ➔ {b.trip?.route?.destination?.name}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{formatDate(b.trip?.departureDate)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dep: {formatTime(b.trip?.departureTime)}</span>
                      </span>
                      <span>
                        Seat(s): <strong className="text-white">{b.passengers?.map((p: any) => p.seatNumber).join(', ')}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Paid</span>
                      <span className="text-lg font-black text-white font-heading">
                        {formatCurrency(b.totalAmount, b.currency)}
                      </span>
                    </div>

                    <Link
                      href={`/my-booking?ref=${b.bookingRef}`}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-emerald-500 text-white font-bold text-xs border border-white/15 transition flex items-center space-x-1.5"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>View Ticket</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
