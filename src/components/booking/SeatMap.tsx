'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle, Check, Info, Armchair } from 'lucide-react';
import { Trip } from '@/types';

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
  passengerCount,
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

  const totalSeats = trip.bus?.seatCount || 48;
  const is2x1 = trip.bus?.seatLayout === '2x1';

  const fetchAvailability = async () => {
    try {
      const res = await fetch(`/api/trips/${trip.id}/seats?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.occupiedSeats) setOccupiedSeats(data.occupiedSeats);
      if (data.lockedByOthers) setLockedSeats(data.lockedByOthers);
      setLoading(false);
    } catch {
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
      setErrorMsg(`Seat ${seatNum} is temporarily held by another customer.`);
      return;
    }

    let newSelected = [...selectedSeats];
    if (newSelected.includes(seatNum)) {
      // Deselect
      newSelected = newSelected.filter((s) => s !== seatNum);
    } else {
      // Allow selecting any number of seats freely
      newSelected.push(seatNum);
    }

    // Lock seats on server (fail-safe)
    if (newSelected.length > 0) {
      try {
        await fetch('/api/seats/lock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tripId: trip.id, seatNumbers: newSelected, sessionId }),
        });
      } catch {
        // Smooth local seat selection
      }
    }

    onSeatsChange(newSelected);
  };

  const rowsCount = Math.ceil(totalSeats / (is2x1 ? 3 : 4));
  const rows = Array.from({ length: rowsCount }, (_, i) => i + 1);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getSeatType = (isWindow: boolean) => isWindow ? 'Window' : 'Aisle';

  return (
    <div className="space-y-5 font-sans">

      {/* Info bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-50 border border-blue-100">
        <div className="flex items-center space-x-2 text-xs text-slate-700">
          <Info className="w-4 h-4 text-[#0072C6] flex-shrink-0" />
          <span>
            Click any <strong>available seat</strong> to select it. You can select as many seats as you need.
          </span>
        </div>
        {selectedSeats.length > 0 && lockTimeRemaining !== null && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>Held for: {formatTimer(lockTimeRemaining)}</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-2 text-xs text-slate-600">
        <div className="flex items-center space-x-1.5">
          <div className="w-7 h-7 rounded-lg bg-white border-2 border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">01</div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-7 h-7 rounded-lg bg-[#0072C6] border-2 border-[#0072C6] flex items-center justify-center text-white font-bold">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-[#0072C6] font-semibold">Selected</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-600 text-[10px] font-bold">⏳</div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-7 h-7 rounded-lg bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-400 text-[10px] font-bold">✕</div>
          <span>Occupied</span>
        </div>
      </div>

      {/* Bus Blueprint - WHITE BG */}
      {loading ? (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-4 border-[#0072C6] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading seat availability...</p>
        </div>
      ) : (
        <div className="max-w-sm mx-auto bg-white rounded-3xl px-5 py-6 border-2 border-slate-200 shadow-sm">

          {/* Bus front */}
          <div className="border-b border-slate-100 pb-4 mb-5">
            <div className="w-full h-7 rounded-xl bg-[#0072C6]/10 border border-[#0072C6]/20 flex items-center justify-center text-[10px] uppercase font-bold text-[#0072C6] tracking-widest mb-3">
              Front Windshield · Direction of Travel
            </div>
            <div className="flex items-center justify-between px-2 text-xs text-slate-500">
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-[#0072C6]"></span>
                <span className="font-bold text-slate-700">Driver Cabin</span>
              </div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Entrance Door →</span>
            </div>
          </div>

          {/* Seat grid */}
          <div className="space-y-2.5">
            {rows.map((rowIdx) => {
              let leftSeats: number[] = [];
              let rightSeats: number[] = [];

              if (is2x1) {
                const start = (rowIdx - 1) * 3 + 1;
                leftSeats = [start, start + 1].filter(s => s <= totalSeats);
                rightSeats = [start + 2].filter(s => s <= totalSeats);
              } else {
                const start = (rowIdx - 1) * 4 + 1;
                leftSeats = [start, start + 1].filter(s => s <= totalSeats);
                rightSeats = [start + 2, start + 3].filter(s => s <= totalSeats);
              }

              const isBackRow = rowIdx === rowsCount;

              const renderSeat = (seatNum: number, isWindow: boolean, side: 'left' | 'right') => {
                const isSel = selectedSeats.includes(seatNum);
                const isOcc = occupiedSeats.includes(seatNum);
                const isLocked = lockedSeats.includes(seatNum);

                return (
                  <button
                    key={`seat-${seatNum}`}
                    type="button"
                    disabled={isOcc}
                    onClick={() => handleSeatClick(seatNum)}
                    title={`Seat ${seatNum} (${getSeatType(isWindow)}) — ${isOcc ? 'Occupied' : isLocked ? 'Reserved' : 'Available'}`}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex flex-col items-center justify-center font-bold text-[11px] transition-all duration-150 border-2 ${
                      isSel
                        ? 'bg-[#0072C6] border-[#0072C6] text-white shadow-md scale-105'
                        : isOcc
                        ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                        : isLocked
                        ? 'bg-amber-50 border-amber-300 text-amber-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-[#0072C6] hover:bg-blue-50 hover:text-[#0072C6] hover:scale-105 cursor-pointer'
                    }`}
                  >
                    <Armchair className="w-3.5 h-3.5 mb-px" />
                    <span>{seatNum}</span>
                  </button>
                );
              };

              return (
                <div key={`row-${rowIdx}`} className="flex items-center justify-between">
                  {/* Left seats */}
                  <div className="flex items-center space-x-1.5">
                    {leftSeats.map((seatNum, idx) => renderSeat(seatNum, idx === 0, 'left'))}
                  </div>

                  {/* Centre aisle */}
                  <div className="text-[10px] text-slate-300 font-mono select-none w-6 text-center">
                    {isBackRow ? '═══' : '·'}
                  </div>

                  {/* Right seats */}
                  <div className="flex items-center space-x-1.5">
                    {rightSeats.map((seatNum, idx) => renderSeat(seatNum, idx === rightSeats.length - 1, 'right'))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bus rear */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Emergency Exit &amp; Baggage Compartment (Rear)
          </div>
        </div>
      )}

      {/* Selected Seats Info Cards */}
      {selectedSeats.length === 0 ? (
        <p className="text-center text-xs text-slate-400 py-2">No seats selected yet. Click on available seats above.</p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800">
              Selected Seats ({selectedSeats.length})
            </h4>
            <button
              type="button"
              onClick={() => onSeatsChange([])}
              className="text-xs text-red-500 hover:text-red-700 font-semibold transition"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[...selectedSeats].sort((a, b) => a - b).map((seatNum, idx) => {
              // Determine seat type
              const col = ((seatNum - 1) % 4);
              const seatType = col === 0 || col === 3 ? 'Window' : 'Aisle';
              const side = col < 2 ? 'Left' : 'Right';

              return (
                <div
                  key={seatNum}
                  className="bg-white border-2 border-[#0072C6]/30 rounded-2xl p-3 relative hover:border-[#0072C6]/60 transition"
                >
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => onSeatsChange(selectedSeats.filter(s => s !== seatNum))}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center text-[10px] font-bold transition"
                    title={`Remove seat ${seatNum}`}
                  >
                    ✕
                  </button>

                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0072C6] flex items-center justify-center">
                      <Armchair className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Seat {seatNum}</p>
                      <p className="text-[10px] text-slate-400">Passenger {idx + 1}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className="font-semibold text-slate-700">{seatType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Side</span>
                      <span className="font-semibold text-slate-700">{side}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
