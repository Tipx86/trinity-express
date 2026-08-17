'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  Bus, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  ShieldCheck, 
  Printer, 
  Download, 
  Share2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@/lib/formatters';

interface DigitalTicketProps {
  bookingRef: string;
  ticketNumber: string;
  passengerName: string;
  nationality: string;
  idPassportNumber: string;
  originName: string;
  originTerminal: string;
  destName: string;
  destTerminal: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  seatNumber: number;
  busModel: string;
  busPlate: string;
  ticketPrice: number;
  currency: string;
  paymentStatus: string;
  securityToken: string;
}

export default function DigitalTicketCard({
  bookingRef,
  ticketNumber,
  passengerName,
  nationality,
  idPassportNumber,
  originName,
  originTerminal,
  destName,
  destTerminal,
  departureDate,
  departureTime,
  arrivalTime,
  seatNumber,
  busModel,
  busPlate,
  ticketPrice,
  currency,
  paymentStatus,
  securityToken,
}: DigitalTicketProps) {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const verificationUrl = `${window.location.origin}/verify-ticket/${securityToken}`;
    QRCode.toDataURL(
      verificationUrl,
      {
        width: 180,
        margin: 1,
        color: {
          dark: '#070F1E',
          light: '#FFFFFF',
        },
      },
      (err, url) => {
        if (!err && url) setQrUrl(url);
      }
    );
  }, [securityToken]);

  return (
    <div className="ticket-container bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-w-3xl mx-auto my-6 font-sans relative">
      
      {/* Top Header Banner */}
      <div className="bg-trinity-navy-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-emerald-500">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-trinity-navy-950 flex items-center justify-center font-black">
            <Bus className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight font-heading">
              TRINITY <span className="text-emerald-400">EXPRESS</span>
            </h2>
            <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              BUS TICKET — EAST AFRICA
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Booking Reference
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-wider">
            {bookingRef}
          </span>
        </div>
      </div>

      {/* Main Ticket Body (with perforated separation) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        
        {/* Left Flight / Journey Details (8 cols) */}
        <div className="md:col-span-8 p-6 sm:p-8 space-y-6">
          
          {/* Passenger Name & ID */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Passenger Name
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900 font-heading">
                {passengerName}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Document / ID No.
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-800 font-mono">
                {idPassportNumber || 'N/A'} ({nationality})
              </span>
            </div>
          </div>

          {/* Route & Timings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  {formatTime(departureTime)}
                </span>
                <p className="text-sm font-bold text-emerald-700">{originName}</p>
                <p className="text-xs text-slate-500">{originTerminal}</p>
              </div>

              <div className="flex flex-col items-center px-4">
                <span className="text-xs font-bold text-slate-400 uppercase">Cross-Border</span>
                <div className="flex items-center space-x-1 my-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  <div className="w-16 sm:w-24 h-0.5 bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{departureDate}</span>
              </div>

              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  {formatTime(arrivalTime)}
                </span>
                <p className="text-sm font-bold text-amber-700">{destName}</p>
                <p className="text-xs text-slate-500">{destTerminal}</p>
              </div>
            </div>
          </div>

          {/* Fleet and Seat Details */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Seat Number</span>
              <span className="text-xl font-black text-emerald-600 font-heading">
                #{seatNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Coach / Plate</span>
              <span className="font-bold text-slate-800 truncate block">
                {busPlate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Fare Status</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] inline-block">
                {paymentStatus}
              </span>
            </div>
          </div>

          {/* Boarding Notice */}
          <div className="text-[11px] text-slate-500 space-y-1">
            <p>• Arrive at departure terminal 45 minutes before scheduled time for baggage check.</p>
            <p>• Original passport or East African national ID must be presented upon boarding.</p>
          </div>

        </div>

        {/* Right Perforated Stub with QR Code (4 cols) */}
        <div className="md:col-span-4 p-6 sm:p-8 bg-slate-50 border-t md:border-t-0 md:border-l-2 md:border-dashed md:border-slate-300 flex flex-col items-center justify-between text-center relative">
          
          {/* Perforated Notch for visual authentic pass */}
          <div className="hidden md:block absolute -left-3 top-0 w-6 h-6 rounded-full bg-trinity-navy-950"></div>
          <div className="hidden md:block absolute -left-3 bottom-0 w-6 h-6 rounded-full bg-trinity-navy-950"></div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Official Boarding Pass
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 block mb-3">
              {ticketNumber}
            </span>

            {/* QR Code Canvas */}
            {qrUrl ? (
              <div className="p-2 bg-white rounded-2xl shadow-md border border-slate-200 inline-block mb-3">
                <img src={qrUrl} alt="Ticket QR Verification Code" className="w-32 h-32" />
              </div>
            ) : (
              <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-xl mb-3 flex items-center justify-center text-xs text-slate-400">
                Generating QR...
              </div>
            )}

            <p className="text-[10px] text-slate-500 max-w-[150px] mx-auto">
              Scan at terminal gate or with conductor hand scanner.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 w-full">
            <span className="text-[10px] text-slate-400 block">Ticket Price</span>
            <span className="text-lg font-black text-slate-900 font-heading">
              {formatCurrency(ticketPrice, currency)}
            </span>
          </div>

        </div>

      </div>

      {/* Ticket Footer Security Watermark */}
      <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Security Hash: {securityToken.substring(0, 18)}...</span>
        <span>RURA / EAC Licensed Carrier</span>
      </div>

    </div>
  );
}
