'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Bus, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Armchair,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@/lib/formatters';

export default function VerifyTicketPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInMessage, setCheckInMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/verify-ticket/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.ticket) {
          setTicketData(data.ticket);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const res = await fetch(`/api/verify-ticket/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conductorName: 'Terminal Conductor' }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketData(data.ticket);
        setCheckInMessage(data.message);
      }
    } catch {
      setCheckInMessage('Failed to update check-in status.');
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-trinity-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Conductor Verification Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
            Ticket Verification
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : !ticketData ? (
          <div className="glass-panel-dark rounded-3xl p-8 border border-red-500/30 text-center space-y-4">
            <XCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h3 className="text-xl font-bold text-white font-heading">Invalid or Fraudulent Ticket</h3>
            <p className="text-xs text-slate-400">
              The scanned security token does not match any valid record in the Trinity Express passenger manifest.
            </p>
          </div>
        ) : (
          <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-6">
            
            {/* Status Banner */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <h4 className="font-bold text-white text-base font-heading">
                    {ticketData.status === 'CHECKED_IN' ? 'Boarded / Checked In' : 'Valid Ticket — Authorized for Boarding'}
                  </h4>
                  <span className="text-[11px] text-slate-300 font-mono">
                    Ticket ID: {ticketData.ticketNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Passenger Name:</span>
                  <span className="font-bold text-white text-sm">{ticketData.passenger?.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Nationality & ID/Passport:</span>
                  <span className="font-bold text-slate-200">{ticketData.passenger?.idPassportNumber} ({ticketData.passenger?.nationality})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Booking Reference:</span>
                  <span className="font-mono font-bold text-emerald-400">{ticketData.booking?.bookingRef}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Assigned Seat:</span>
                  <span className="text-base font-black text-amber-400 font-heading">Seat #{ticketData.passenger?.seatNumber}</span>
                </div>
              </div>

              {/* Journey details */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold text-white text-sm">
                  <span>{ticketData.booking?.trip?.route?.origin?.name}</span>
                  <span className="text-emerald-400">➔</span>
                  <span>{ticketData.booking?.trip?.route?.destination?.name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Date: {formatDate(ticketData.booking?.trip?.departureDate)}</span>
                  <span>Time: {formatTime(ticketData.booking?.trip?.departureTime)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Coach Plate: {ticketData.booking?.trip?.bus?.plateNumber}</span>
                  <span>Model: {ticketData.booking?.trip?.bus?.busModel}</span>
                </div>
              </div>
            </div>

            {/* Check-In Action Button */}
            {ticketData.status !== 'CHECKED_IN' ? (
              <button
                type="button"
                disabled={checkingIn}
                onClick={handleCheckIn}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition"
              >
                {checkingIn ? 'Authorizing Check-In...' : 'Authorize Boarding & Check In'}
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-white/5 text-center text-xs text-slate-400">
                Checked in at {ticketData.checkedInAt ? new Date(ticketData.checkedInAt).toLocaleTimeString() : 'Terminal'} by {ticketData.checkedInBy || 'Conductor'}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
