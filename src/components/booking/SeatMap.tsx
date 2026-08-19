'use client';

import React, { useEffect, useState } from 'react';
import { Info, Clock, AlertCircle } from 'lucide-react';
import { Trip } from '@/types';

export const SEAT_DEFINITIONS = [
  { row: 1, left: [{ num: 1, label: 'a' }, { num: 2, label: 'b' }], right: [{ num: 3, label: 'c' }, { num: 4, label: 'd' }] },
  { row: 2, left: [{ num: 5, label: 'e' }, { num: 6, label: 'f' }], right: [{ num: 7, label: 'g' }, { num: 8, label: 'h' }] },
  { row: 3, left: [{ num: 9, label: 'i' }, { num: 10, label: 'j' }], right: [{ num: 11, label: 'k' }, { num: 12, label: 'l' }] },
  { row: 4, left: [{ num: 13, label: 'm' }, { num: 14, label: 'n' }], right: [{ num: 15, label: 'o' }, { num: 16, label: 'p' }] },
  { row: 5, left: [{ num: 17, label: 'q' }, { num: 18, label: 'r' }], right: [{ num: 19, label: '5c' }, { num: 20, label: '5d' }] },
  { row: 6, left: [{ num: 21, label: '6a' }, { num: 22, label: '6b' }], right: [{ num: 23, label: '6c' }, { num: 24, label: '6d' }] },
  { row: 7, left: [{ num: 25, label: '7a' }, { num: 26, label: '7b' }], right: [{ num: 27, label: '7c' }, { num: 28, label: '7d' }] },
  { row: 8, left: [{ num: 29, label: '8a' }, { num: 30, label: '8b' }], right: [{ num: 31, label: '8c' }, { num: 32, label: '8d' }] },
  { row: 9, left: [{ num: 33, label: '9a' }, { num: 34, label: '9b' }], right: [{ num: 35, label: '9c' }, { num: 36, label: '9d' }] },
  { row: 10, left: [{ num: 37, label: '10a' }, { num: 38, label: '10b' }], right: [{ num: 39, label: '10c' }, { num: 40, label: '10d' }] },
];

export function getSeatLabel(seatNum: number): string {
  for (const r of SEAT_DEFINITIONS) {
    const found = [...r.left, ...r.right].find((s) => s.num === seatNum);
    if (found) return found.label;
  }
  return String(seatNum);
}

interface SeatMapProps {
  trip: Trip;
  passengerCount: number;
  selectedSeats: number[];
  onSeatsChange: (seats: number[]) => void;
  sessionId: string;
  onLockExpire?: () => void;
}

export default function SeatMap({
  trip,
  selectedSeats,
  onSeatsChange,
  sessionId,
  onLockExpire,
}: SeatMapProps) {
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
  const [lockedSeats, setLockedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockTimeRemaining, setLockTimeRemaining] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAvailability = async () => {
    try {
      const res = await fetch(`/api/trips/${trip.id}/seats?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.occupiedSeats) setOccupiedSeats(data.occupiedSeats);
      else if (trip.occupiedSeats) setOccupiedSeats(trip.occupiedSeats);
      if (data.lockedByOthers) setLockedSeats(data.lockedByOthers);
      setLoading(false);
    } catch {
      if (trip.occupiedSeats) setOccupiedSeats(trip.occupiedSeats);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
    const interval = setInterval(fetchAvailability, 10000);
    return () => clearInterval(interval);
  }, [trip.id, sessionId]);

  // Hold timer countdown
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setLockTimeRemaining(null);
      return;
    }
    if (lockTimeRemaining === null) {
      setLockTimeRemaining(10 * 60);
    }
    const timer = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          if (onLockExpire) onLockExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedSeats.length]);

  const handleSeatClick = async (seatNum: number) => {
    setErrorMsg(null);
    if (occupiedSeats.includes(seatNum)) return;
    if (lockedSeats.includes(seatNum)) {
      setErrorMsg(`Seat ${getSeatLabel(seatNum)} is temporarily held by another customer.`);
      return;
    }

    let newSelected = [...selectedSeats];
    if (newSelected.includes(seatNum)) {
      newSelected = newSelected.filter((s) => s !== seatNum);
    } else {
      newSelected.push(seatNum);
    }

    if (newSelected.length > 0) {
      try {
        await fetch('/api/seats/lock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tripId: trip.id, seatNumbers: newSelected, sessionId }),
        });
      } catch {
        // smooth client fallback
      }
    }

    onSeatsChange(newSelected);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const selectedSeatsText =
    selectedSeats.length > 0
      ? selectedSeats.map((num) => getSeatLabel(num)).join(', ')
      : 'None';

  return (
    <div className="space-y-6 font-sans">
      {/* Top Legend matching Screenshot 2 */}
      <div className="flex items-center justify-center space-x-6 py-2 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md border border-slate-300 bg-white"></div>
          <span className="font-medium text-slate-600">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md border-2 border-[#0072C6] bg-white"></div>
          <span className="font-medium text-[#0072C6]">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-slate-200"></div>
          <span className="font-medium text-slate-500">Booked</span>
        </div>
      </div>

      {/* Timer & Error Messages */}
      {selectedSeats.length > 0 && lockTimeRemaining !== null && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Seats held for you</span>
          </div>
          <span className="font-mono font-bold text-amber-700">{formatTimer(lockTimeRemaining)}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Bus Blueprint Container matching Screenshot 2 */}
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Top Driver Icon Section */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full border-2 border-slate-400 flex items-center justify-center mb-1 bg-slate-50 shadow-inner">
            <svg
              className="w-7 h-7 text-slate-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 0 0 20" />
              <path d="M12 12 5 8" />
              <path d="M12 12l7-4" />
              <path d="M12 12v8" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </div>
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider font-heading">
            DRIVER
          </span>
        </div>

        {/* Window & Aisle Column Headers */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-4 sm:px-8">
          <span>Window</span>
          <span>Aisle</span>
        </div>

        {/* 2x2 Grid of Seats */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#0072C6] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading seat availability...</p>
          </div>
        ) : (
          <div className="space-y-3.5 px-2 sm:px-6">
            {SEAT_DEFINITIONS.map((rowDef) => (
              <div key={`row-${rowDef.row}`} className="flex items-center justify-between">
                {/* Left 2 Seats (Window, Aisle) */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {rowDef.left.map((seat) => {
                    const isSel = selectedSeats.includes(seat.num);
                    const isOcc = occupiedSeats.includes(seat.num);

                    return (
                      <button
                        key={`seat-${seat.num}`}
                        type="button"
                        disabled={isOcc}
                        onClick={() => handleSeatClick(seat.num)}
                        title={`Seat ${seat.label} — ${isOcc ? 'Booked' : isSel ? 'Selected' : 'Available'}`}
                        className={`w-11 h-13 sm:w-12 sm:h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-150 p-1 ${
                          isOcc
                            ? 'bg-slate-200 border border-transparent text-slate-400 cursor-not-allowed'
                            : isSel
                            ? 'bg-white border-2 border-[#0072C6] text-[#0072C6] ring-2 ring-[#0072C6]/20 shadow-sm cursor-pointer'
                            : 'bg-white border border-slate-300 text-slate-700 hover:border-[#0072C6] hover:shadow-sm cursor-pointer'
                        }`}
                      >
                        <span className={`text-xs font-bold leading-none mb-1.5 ${isOcc ? 'text-slate-400' : isSel ? 'text-[#0072C6]' : 'text-slate-700'}`}>
                          {seat.label}
                        </span>
                        <svg
                          className={`w-4 h-4 ${isOcc ? 'text-slate-400' : isSel ? 'text-[#0072C6]' : 'text-slate-700'}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                          <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
                          <path d="M5 18v2" />
                          <path d="M19 18v2" />
                        </svg>
                      </button>
                    );
                  })}
                </div>

                {/* Right 2 Seats (Aisle, Window) */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {rowDef.right.map((seat) => {
                    const isSel = selectedSeats.includes(seat.num);
                    const isOcc = occupiedSeats.includes(seat.num);

                    return (
                      <button
                        key={`seat-${seat.num}`}
                        type="button"
                        disabled={isOcc}
                        onClick={() => handleSeatClick(seat.num)}
                        title={`Seat ${seat.label} — ${isOcc ? 'Booked' : isSel ? 'Selected' : 'Available'}`}
                        className={`w-11 h-13 sm:w-12 sm:h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-150 p-1 ${
                          isOcc
                            ? 'bg-slate-200 border border-transparent text-slate-400 cursor-not-allowed'
                            : isSel
                            ? 'bg-white border-2 border-[#0072C6] text-[#0072C6] ring-2 ring-[#0072C6]/20 shadow-sm cursor-pointer'
                            : 'bg-white border border-slate-300 text-slate-700 hover:border-[#0072C6] hover:shadow-sm cursor-pointer'
                        }`}
                      >
                        <span className={`text-xs font-bold leading-none mb-1.5 ${isOcc ? 'text-slate-400' : isSel ? 'text-[#0072C6]' : 'text-slate-700'}`}>
                          {seat.label}
                        </span>
                        <svg
                          className={`w-4 h-4 ${isOcc ? 'text-slate-400' : isSel ? 'text-[#0072C6]' : 'text-slate-700'}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                          <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
                          <path d="M5 18v2" />
                          <path d="M19 18v2" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bus Back Indicator */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="w-24 h-1.5 bg-slate-300 rounded-full mb-2"></div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider font-heading">
            BACK
          </span>
        </div>

      </div>

      {/* Bottom info: Selected seats indicator */}
      <div className="flex items-center space-x-2 text-xs text-slate-600 px-1">
        <Info className="w-4 h-4 text-[#0072C6] flex-shrink-0" />
        <span>
          Selected seats: <strong className="text-[#0072C6]">{selectedSeatsText}</strong>
        </span>
      </div>
    </div>
  );
}
