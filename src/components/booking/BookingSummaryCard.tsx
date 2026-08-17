'use client';

import React from 'react';
import { Bus, Calendar, Clock, Armchair, ArrowRight, Receipt, MapPin } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@/lib/formatters';
import { Trip } from '@/types';

interface BookingSummaryCardProps {
  trip?: Trip | null;
  selectedSeats: number[];
  passengerCount: number;
  currency: string;
  currentStep: number;
  onContinue: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  continueText?: string;
  canContinue?: boolean;
}

export default function BookingSummaryCard({
  trip,
  selectedSeats,
  passengerCount,
  currency,
  currentStep,
  onContinue,
  onBack,
  isSubmitting,
  continueText,
  canContinue = true,
}: BookingSummaryCardProps) {
  if (!trip) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
          <Bus className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm font-heading">Booking Summary</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Select an available bus trip to view route pricing and seat breakdown.
        </p>
      </div>
    );
  }

  const getPerTicketPrice = () => {
    switch (currency) {
      case 'UGX': return trip.priceUgx;
      case 'KES': return trip.priceKes;
      case 'USD': return trip.priceUsd;
      case 'SSP': return trip.priceSsp || 0;
      default: return trip.priceRwf;
    }
  };

  const count = selectedSeats.length > 0 ? selectedSeats.length : passengerCount;
  const unitPrice = getPerTicketPrice();
  const total = unitPrice * count;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24 font-sans">

      {/* Header */}
      <div className="bg-[#0B1E38] px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Receipt className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="font-bold text-white text-sm">Booking Summary</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#38BDF8]">
          Step {currentStep} of 6
        </span>
      </div>

      <div className="p-5 space-y-4">

        {/* Route */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center justify-between font-bold text-slate-900 text-sm mb-1.5">
            <span>{trip.route.origin.name}</span>
            <ArrowRight className="w-4 h-4 text-[#0072C6] flex-shrink-0" />
            <span>{trip.route.destination.name}</span>
          </div>
          <div className="flex items-start justify-between text-[11px] text-slate-400 gap-1">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate max-w-[100px]">{trip.route.origin.terminalName}</span>
            </span>
            <span className="flex items-center space-x-1 text-right">
              <span className="truncate max-w-[100px]">{trip.route.destination.terminalName}</span>
              <MapPin className="w-3 h-3 flex-shrink-0" />
            </span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-[#0072C6] flex-shrink-0" />
            <span className="text-[11px] text-slate-600 truncate font-medium">{formatDate(trip.departureDate)}</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-[#0072C6] flex-shrink-0" />
            <span className="text-[11px] text-slate-600 font-medium">Dep: {formatTime(trip.departureTime)}</span>
          </div>
        </div>

        {/* Bus & Seats info */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between items-start">
            <span className="text-slate-500">Bus Model</span>
            <span className="font-semibold text-slate-800 text-right max-w-[150px] leading-tight">{trip.bus?.busModel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Passengers</span>
            <span className="font-semibold text-slate-800">{count} {count === 1 ? 'Person' : 'People'}</span>
          </div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-slate-500 flex-shrink-0">Selected Seats</span>
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-1 justify-end">
                {[...selectedSeats].sort((a, b) => a - b).map(seat => (
                  <span
                    key={seat}
                    className="inline-flex items-center space-x-0.5 bg-[#0072C6]/10 text-[#0072C6] px-1.5 py-0.5 rounded text-[10px] font-bold"
                  >
                    <Armchair className="w-2.5 h-2.5" />
                    <span>{seat}</span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="font-semibold text-amber-500">Not selected yet</span>
            )}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="pt-1 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Ticket Fare ({count} × {formatCurrency(unitPrice, currency)})</span>
            <span className="font-medium text-slate-700">{formatCurrency(unitPrice * count, currency)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Cross-Border Tax</span>
            <span className="text-emerald-600 font-medium">Included</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Luggage (20kg/person)</span>
            <span className="text-emerald-600 font-medium">Free</span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-800">Total Amount</span>
            <span className="text-xl font-black text-[#0072C6] font-heading">
              {formatCurrency(total, currency)}
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            disabled={!canContinue || isSubmitting}
            onClick={onContinue}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm ${
              !canContinue || isSubmitting
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#0072C6] hover:bg-[#005FA5] text-white'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Processing...</span>
              </span>
            ) : (
              <>
                <span>{continueText || 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {onBack && currentStep > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-700 transition"
            >
              ← Back to previous step
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
