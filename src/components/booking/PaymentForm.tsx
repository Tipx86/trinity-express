'use client';

import React from 'react';
import { MessageCircle, ShieldCheck, MapPin, Calendar, Clock, Armchair, ArrowRight } from 'lucide-react';

interface PaymentFormProps {
  bookingRef: string;
  passengerName: string;
  passengerPhone: string;
  idPassportNumber: string;
  origin: string;
  destination: string;
  travelDate: string;
  departureTime: string;
  seatNumbers: number[];
  totalAmountFormatted: string;
}

export default function PaymentForm({
  bookingRef,
  passengerName,
  passengerPhone,
  idPassportNumber,
  origin,
  destination,
  travelDate,
  departureTime,
  seatNumbers,
  totalAmountFormatted,
}: PaymentFormProps) {

  const getLongDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch { return dateStr; }
  };

  const formattedDateLong = getLongDate(travelDate);
  const seatCount = seatNumbers.length;
  const seatText = `${seatNumbers.sort((a, b) => a - b).join(', ')} (${seatCount} seat${seatCount > 1 ? 's' : ''})`;

  // Pre-filled WhatsApp message (hidden from UI — sent directly via URL)
  const messageTemplate =
`Good day, Trinity Bus Service.

I would like to make a seat reservation. Please find my booking details below:

Booking Ref: ${bookingRef}
Route:       ${origin} to ${destination}
Departure:   ${departureTime} Departure
Date:        ${formattedDateLong}
Seat(s):     ${seatText}
Passenger:   ${passengerName}
Phone:       ${passengerPhone}
ID/Passport: ${idPassportNumber || 'N/A'}
Amount Due:  ${totalAmountFormatted}

Kindly confirm availability and share payment instructions.

Thank you.`;

  const WHATSAPP_NUMBER = '254714661385';
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageTemplate)}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl mx-auto font-sans">

      {/* Top header bar */}
      <div className="bg-[#0B1E38] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
          <h3 className="font-bold text-white text-sm">Booking Confirmation</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
          Ref: {bookingRef}
        </span>
      </div>

      <div className="p-6 space-y-5">

        {/* Success badge */}
        <div className="flex flex-col items-center text-center py-4 space-y-2">
          <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-[#25D366]/30 flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-[#25D366]" />
          </div>
          <h4 className="text-lg font-black text-slate-900">Your booking is ready!</h4>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Click the button below to open WhatsApp. Your full booking details will be pre-filled and ready to send to Trinity Express.
          </p>
        </div>

        {/* Booking summary tiles */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100 text-sm">

          {/* Route */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2 text-slate-500">
              <MapPin className="w-4 h-4 text-[#0072C6]" />
              <span>Route</span>
            </div>
            <div className="flex items-center space-x-1.5 font-bold text-slate-800">
              <span>{origin}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span>{destination}</span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2 text-slate-500">
              <Calendar className="w-4 h-4 text-[#0072C6]" />
              <span>Date</span>
            </div>
            <span className="font-semibold text-slate-800 text-right">{formattedDateLong}</span>
          </div>

          {/* Departure */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2 text-slate-500">
              <Clock className="w-4 h-4 text-[#0072C6]" />
              <span>Departure</span>
            </div>
            <span className="font-semibold text-slate-800">{departureTime}</span>
          </div>

          {/* Seats */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2 text-slate-500">
              <Armchair className="w-4 h-4 text-[#0072C6]" />
              <span>Seat(s)</span>
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
              {seatNumbers.sort((a, b) => a - b).map(s => (
                <span key={s} className="bg-[#0072C6]/10 text-[#0072C6] text-xs font-bold px-2 py-0.5 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between px-4 py-3 bg-white rounded-b-2xl">
            <span className="font-bold text-slate-700">Total Amount</span>
            <span className="font-black text-[#0072C6] text-lg">{totalAmountFormatted}</span>
          </div>
        </div>

        {/* WhatsApp CTA Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-3 w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-base shadow-lg shadow-green-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        >
          <MessageCircle className="w-6 h-6 fill-white flex-shrink-0" />
          <span>Proceed to Pay on WhatsApp</span>
        </a>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center space-x-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secure • Official Trinity Express reservation line</span>
        </div>

      </div>
    </div>
  );
}
