'use client';

import React from 'react';
import { 
  Clock, 
  MapPin,
  Bus, 
  Wifi, 
  Wind,
  Armchair
} from 'lucide-react';
import { formatCurrency, formatDuration, formatTime } from '@/lib/formatters';
import { Trip } from '@/types';

interface TripCardProps {
  trip: Trip;
  currency: string;
  selectedPassengers: number;
  isSelected?: boolean;
  onSelect: (trip: Trip) => void;
}

// Pick a bus image per bus type
const getBusImage = (busType?: string, plateNumber?: string) => {
  // Use the real Trinity Express fleet photo saved locally
  return '/images/trinity_bus_fleet.png';
};

export default function TripCard({
  trip,
  currency,
  selectedPassengers,
  isSelected,
  onSelect,
}: TripCardProps) {
  const getPrice = () => {
    switch (currency) {
      case 'UGX': return formatCurrency(trip.priceUgx, 'UGX');
      case 'KES': return formatCurrency(trip.priceKes, 'KES');
      case 'USD': return formatCurrency(trip.priceUsd, 'USD');
      case 'SSP': return formatCurrency(trip.priceSsp || 0, 'SSP');
      default: return formatCurrency(trip.priceRwf, 'RWF');
    }
  };

  const availableSeatsCount = trip.availableSeats !== undefined
    ? trip.availableSeats
    : (trip.bus?.seatCount || 48) - ((trip.occupiedSeats?.length || 0) + (trip.lockedSeats?.length || 0));

  const isLowSeats = availableSeatsCount <= 6;
  const isSoldOut = availableSeatsCount <= 0;

  const isVip = trip.bus?.busType?.includes('VIP') || trip.bus?.busType?.includes('EXECUTIVE');
  const busTypeLabel = isVip ? 'VIP Luxury' : 'Classic';
  const plateNumber = trip.bus?.plateNumber || 'N/A';

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden font-sans ${
        isSelected
          ? 'border-[#0072C6] ring-2 ring-[#0072C6]/20 shadow-md'
          : 'border-slate-200 hover:border-[#0072C6]/40 hover:shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-stretch">

        {/* Left Bus Thumbnail Image */}
        <div className="relative w-full sm:w-52 md:w-60 flex-shrink-0 h-44 sm:h-auto bg-slate-900 overflow-hidden">
          <img
            src={getBusImage(trip.bus?.busType, plateNumber)}
            alt={`Trinity Express ${busTypeLabel}`}
            className="w-full h-full object-cover opacity-90"
          />
          {/* Plate Number Badge */}
          <div className="absolute top-2.5 left-2.5 bg-[#F59E0B] text-[#78350F] text-[10px] font-black px-2 py-0.5 rounded">
            # {plateNumber}
          </div>
          {/* Bus Type Badge */}
          <div className={`absolute top-2.5 right-2.5 text-[10px] font-black px-2 py-0.5 rounded ${
            isVip
              ? 'bg-[#7C3AED] text-white'
              : 'bg-slate-700 text-white'
          }`}>
            {busTypeLabel}
          </div>
          {/* Rating Badge */}
          <div className="absolute bottom-2.5 left-2.5 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
            <span>★</span>
            <span>{isVip ? '4.8' : '4.5'}</span>
          </div>
        </div>

        {/* Middle: Route & Schedule */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3">
          
          {/* Bus Name + Plate */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-black text-slate-900">
              Trinity Express {busTypeLabel}
            </span>
            <span className="text-[11px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
              {plateNumber}
            </span>
          </div>

          {/* Times Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Departure */}
            <div className="flex items-center space-x-1.5 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="font-black text-sm">{formatTime(trip.departureTime)}</span>
              <span className="text-xs text-slate-500">{trip.route.origin.name}</span>
            </div>

            {/* Duration line */}
            <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
              <div className="w-4 sm:w-12 h-px bg-slate-300"></div>
              <span className="whitespace-nowrap">~{formatDuration(trip.route.durationMinutes)}</span>
              <div className="w-4 sm:w-12 h-px bg-slate-300"></div>
            </div>

            {/* Arrival */}
            <div className="flex items-center space-x-1.5 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="font-black text-sm">{formatTime(trip.arrivalTime)}</span>
              <span className="text-xs text-slate-500">{trip.route.destination.name}</span>
            </div>
          </div>

          {/* Amenity Tags */}
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
            {trip.bus?.amenities?.includes('WIFI') && (
              <span className="flex items-center space-x-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                <Wifi className="w-3 h-3 text-[#0072C6]" />
                <span>WIFI</span>
              </span>
            )}
            {trip.bus?.amenities?.includes('AC') && (
              <span className="flex items-center space-x-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                <Wind className="w-3 h-3 text-[#0072C6]" />
                <span>AC</span>
              </span>
            )}
            <span className="flex items-center space-x-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
              <Armchair className="w-3 h-3 text-[#0072C6]" />
              <span>
                {isSoldOut
                  ? 'Fully Booked'
                  : isLowSeats
                  ? `Only ${availableSeatsCount} seats left`
                  : `${availableSeatsCount} seats left`}
              </span>
            </span>
          </div>

        </div>

        {/* Right: Price & CTA */}
        <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center sm:w-48 px-5 py-4 sm:py-5 border-t sm:border-t-0 sm:border-l border-slate-100 gap-4 sm:gap-3 flex-shrink-0">
          <div className="text-center sm:text-right">
            <div className="text-lg sm:text-xl font-black text-[#0072C6] leading-tight">
              {getPrice()}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">per seat</div>
          </div>

          <button
            type="button"
            disabled={isSoldOut}
            onClick={() => onSelect(trip)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap shadow-sm ${
              isSoldOut
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isSelected
                ? 'bg-[#005FA5] text-white ring-2 ring-[#0072C6]/30'
                : 'bg-[#0072C6] hover:bg-[#005FA5] text-white'
            }`}
          >
            {isSelected ? '✓ Selected' : 'Select Seats'}
          </button>
        </div>

      </div>
    </div>
  );
}
