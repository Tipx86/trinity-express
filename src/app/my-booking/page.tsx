'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Ticket,
  Printer,
  Mail,
  AlertCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import DigitalTicketCard from '@/components/ticket/DigitalTicketCard';

const inputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0072C6]/30 focus:border-[#0072C6] transition';

function MyBookingContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [bookingRef, setBookingRef] = useState(initialRef);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchBooking = async (ref: string, contact?: string) => {
    if (!ref) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/bookings/my-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingRef: ref, emailOrPhone: contact }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Booking reservation not found.');
        setBooking(null);
      } else {
        setBooking(data.booking);
      }
    } catch {
      setErrorMsg('Failed to connect to the server.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) fetchBooking(initialRef);
  }, [initialRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooking(bookingRef, emailOrPhone);
  };

  const handlePrint = () => window.print();

  const handleResendEmail = async () => {
    if (!booking) return;
    setResendStatus('Sending...');
    try {
      await fetch('/api/bookings/resend-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingRef: booking.bookingRef }),
      });
      setResendStatus('✓ Digital ticket sent to ' + booking.contactEmail);
    } catch {
      setResendStatus('Failed to send email.');
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    setCancelling(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/bookings/my-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingRef: booking.bookingRef,
          action: 'CANCEL',
          reason: cancelReason,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to cancel reservation.');
      } else {
        setBooking(data.booking);
        setShowCancelModal(false);
      }
    } catch {
      setErrorMsg('An error occurred during cancellation.');
    } finally {
      setCancelling(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === 'CONFIRMED') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'CANCELLED') return 'bg-red-50 text-red-600 border-red-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="text-center space-y-3 no-print max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-[#0072C6] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#0072C6]/10 border border-[#0072C6]/20">
            <Ticket className="w-3.5 h-3.5" />
            <span>Self-Service Passenger Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            Manage My Booking &amp; Tickets
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Retrieve your digital ticket, print boarding passes, change travel seats, or view cross-border travel requirements.
          </p>
        </div>

        {/* Search Lookup Form */}
        <div className="no-print">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Booking Reference (e.g. TE-894271)"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                className={`${inputClass} font-mono uppercase`}
              />
              <input
                type="text"
                placeholder="Email or Phone Number (Optional)"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0072C6] hover:bg-[#005FA5] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-sm transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching Reservation...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Retrieve Reservation</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center space-x-3 max-w-2xl mx-auto no-print">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Booking Details */}
        {booking && (
          <div className="space-y-5">

            {/* Booking Header Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden no-print">
              <div className="bg-[#0B1E38] px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-black text-white">
                      Reservation {booking.bookingRef}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Booked for <strong className="text-slate-300">{booking.contactName}</strong>
                    {' '}· {booking.contactEmail} · {booking.contactPhone}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition flex items-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendEmail}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition flex items-center space-x-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Ticket</span>
                  </button>

                  {booking.status === 'CONFIRMED' && (
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold border border-red-500/30 transition flex items-center space-x-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Trip</span>
                    </button>
                  )}
                </div>
              </div>

              {resendStatus && (
                <div className="px-5 py-2.5 bg-emerald-50 border-t border-emerald-100 text-emerald-700 text-xs font-medium">
                  {resendStatus}
                </div>
              )}
            </div>

            {/* Digital Ticket Cards */}
            <div className="space-y-5">
              {booking.passengers.map((passenger: any, idx: number) => (
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

          </div>
        )}

        {/* Cancellation Modal */}
        {showCancelModal && booking && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Cancel Booking {booking.bookingRef}?
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Tickets cancelled at least 6 hours before departure are eligible for a refund according to Trinity Express terms of carriage.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Reason for Cancellation
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Change of travel schedule"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleCancelBooking}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-red-300 text-white text-xs font-bold shadow-sm transition"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function MyBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0072C6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <MyBookingContent />
    </Suspense>
  );
}
