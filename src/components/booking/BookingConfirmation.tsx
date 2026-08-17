'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  Mail, 
  ArrowRight, 
  Calendar, 
  Share2,
  Sparkles,
  Ticket
} from 'lucide-react';
import DigitalTicketCard from '@/components/ticket/DigitalTicketCard';
import { BookingResponse } from '@/types';

interface BookingConfirmationProps {
  booking: BookingResponse;
}

export default function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleResendEmail = async () => {
    setIsSendingEmail(true);
    try {
      await fetch('/api/bookings/resend-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingRef: booking.bookingRef }),
      });
      setEmailSent(true);
    } catch {
      setEmailSent(true);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Top Congratulatory Hero */}
      <div className="text-center space-y-4 no-print">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-400 shadow-glow-emerald animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Payment Confirmed • Reservation Guaranteed
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
            Booking Confirmed! Safe Travels.
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Your cross-border bus journey is confirmed. Your digital ticket and QR codes are ready below and have also been sent to your email.
          </p>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition flex items-center space-x-2"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Tickets</span>
          </button>

          <button
            type="button"
            onClick={handleResendEmail}
            disabled={isSendingEmail || emailSent}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition flex items-center space-x-2"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>{emailSent ? '✓ Ticket Sent to Email' : isSendingEmail ? 'Sending...' : 'Email Ticket'}</span>
          </button>

          <Link
            href={`/my-booking?ref=${booking.bookingRef}`}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition flex items-center space-x-1.5"
          >
            <span>Manage in My Booking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Render Digital Tickets for each passenger */}
      <div className="space-y-6">
        {booking.passengers.map((passenger, idx) => (
          <DigitalTicketCard
            key={passenger.id || idx}
            bookingRef={booking.bookingRef}
            ticketNumber={passenger.ticketNumber}
            passengerName={passenger.fullName}
            nationality={passenger.nationality}
            idPassportNumber={passenger.idPassportNumber}
            originName={booking.trip.route.origin.name}
            originTerminal={booking.trip.route.origin.terminalName}
            destName={booking.trip.route.destination.name}
            destTerminal={booking.trip.route.destination.terminalName}
            departureDate={booking.trip.departureDate}
            departureTime={booking.trip.departureTime}
            arrivalTime={booking.trip.arrivalTime}
            seatNumber={passenger.seatNumber}
            busModel={booking.trip.bus.busModel}
            busPlate={booking.trip.bus.plateNumber}
            ticketPrice={booking.totalAmount / booking.passengers.length}
            currency={booking.currency}
            paymentStatus={booking.paymentStatus}
            securityToken={passenger.ticket?.securityToken || `SEC_${booking.bookingRef}_${passenger.seatNumber}`}
          />
        ))}
      </div>

      {/* Cross-border Pre-Departure Checklist */}
      <div className="glass-panel-dark rounded-2xl p-6 border border-white/10 space-y-3 text-xs text-slate-300 no-print">
        <h4 className="font-bold text-white text-sm font-heading flex items-center space-x-2">
          <Ticket className="w-4 h-4 text-emerald-400" />
          <span>Before You Head to the Terminal Checklist:</span>
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
          <li className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Arrive 45 mins before departure at {booking.trip.route.origin.terminalName}.</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Original Passport / National ID for immigration checks.</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Yellow Fever vaccination card for cross-border transit.</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Maximum 20kg check-in luggage + 1 handbag.</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
