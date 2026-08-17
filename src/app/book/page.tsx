'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StepIndicator from '@/components/booking/StepIndicator';
import TripCard from '@/components/booking/TripCard';
import SeatMap from '@/components/booking/SeatMap';
import PassengerForm from '@/components/booking/PassengerForm';
import PaymentForm from '@/components/booking/PaymentForm';
import BookingSummaryCard from '@/components/booking/BookingSummaryCard';
import { Trip, PassengerInput } from '@/types';
import { AlertCircle, Bus, MapPin } from 'lucide-react';
import { formatCurrency, formatDate, formatTime, generateBookingRef } from '@/lib/formatters';

function BookingWizardContent() {
  const searchParams = useSearchParams();

  // URL Query defaults
  const initialFrom = searchParams.get('from') || 'Kigali';
  const initialTo = searchParams.get('to') || 'Kampala';
  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const initialPassengers = parseInt(searchParams.get('passengers') || '1', 10);

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currency, setCurrency] = useState<string>('RWF');
  const [sessionId, setSessionId] = useState<string>('');

  // Step 1 & 2: Search Parameters & Trips list
  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [travelDate, setTravelDate] = useState(initialDate);
  const [passengerCount, setPassengerCount] = useState(initialPassengers);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Step 3: Seat selection
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  // Step 4: Passenger details
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [passengers, setPassengers] = useState<PassengerInput[]>([]);

  // Generated Booking Reference
  const [generatedRef, setGeneratedRef] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let sid = localStorage.getItem('trinity_session_id');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem('trinity_session_id', sid);
    }
    setSessionId(sid);

    const savedCur = localStorage.getItem('trinity_currency') || 'RWF';
    setCurrency(savedCur);

    if (initialFrom && initialTo) {
      searchTrips(initialFrom, initialTo, initialDate);
      setCurrentStep(2);
    }
  }, []);

  // Generate reference when reaching step 5
  useEffect(() => {
    if (currentStep === 5 && !generatedRef) {
      setGeneratedRef(generateBookingRef());
    }
  }, [currentStep]);

  // Synchronize passenger form array when selectedSeats changes
  useEffect(() => {
    const newPassengers: PassengerInput[] = selectedSeats.map((seatNum, idx) => {
      const existing = passengers.find((p) => p.seatNumber === seatNum);
      if (existing) return existing;
      return {
        seatNumber: seatNum,
        fullName: idx === 0 && contactName ? contactName : '',
        nationality: 'Rwanda',
        idPassportNumber: '',
        phone: idx === 0 && contactPhone ? contactPhone : '',
        email: idx === 0 && contactEmail ? contactEmail : '',
        emergencyContact: '',
      };
    });
    setPassengers(newPassengers);
  }, [selectedSeats]);

  const searchTrips = async (from: string, to: string, date: string) => {
    setLoadingTrips(true);
    setErrorMessage(null);
    try {
      const res = await fetch(
        `/api/trips/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&sessionId=${sessionId}`
      );
      const data = await res.json();
      if (data.trips) setTrips(data.trips);
      else setTrips([]);
    } catch {
      setErrorMessage('Unable to connect to the booking server.');
      setTrips([]);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchTrips(fromCity, toCity, travelDate);
    setCurrentStep(2);
  };

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setSelectedSeats([]);
    setCurrentStep(3);
  };

  const canContinueStep = () => {
    if (currentStep === 2) return !!selectedTrip;
    // Allow any number of seats ≥ 1 (free selection)
    if (currentStep === 3) return selectedSeats.length >= 1;
    if (currentStep === 4) {
      if (!contactName.trim() || !contactPhone.trim()) return false;
      return passengers.length === selectedSeats.length && passengers.every((p) => p.fullName.trim() && p.idPassportNumber.trim());
    }
    return true;
  };

  const handleNextStep = async () => {
    setErrorMessage(null);

    if (currentStep === 1) {
      searchTrips(fromCity, toCity, travelDate);
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!selectedTrip) return setErrorMessage('Please select a bus trip.');
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (selectedSeats.length < 1) {
        return setErrorMessage('Please select at least 1 seat to continue.');
      }
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      if (!contactName.trim() || !contactPhone.trim()) {
        return setErrorMessage('Please enter your full name and phone number.');
      }
      const missing = passengers.find((p) => !p.fullName.trim() || !p.idPassportNumber.trim());
      if (missing) {
        return setErrorMessage(`Please fill in passenger name and ID/passport number for Seat #${missing.seatNumber}.`);
      }
      setCurrentStep(5);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} onStepClick={(s) => s < currentStep && setCurrentStep(s)} />

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-2 max-w-4xl mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEPS 1 TO 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STEP 1: Search Form */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <h2 className="text-2xl font-black text-slate-900 font-heading">
                  Search Bus Routes
                </h2>

                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">From (Origin)</label>
                      <select
                        value={fromCity}
                        onChange={(e) => setFromCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold"
                      >
                        <option value="Kigali">Kigali (Rwanda)</option>
                        <option value="Kampala">Kampala (Uganda)</option>
                        <option value="Nairobi">Nairobi (Kenya)</option>
                        <option value="Mombasa">Mombasa (Kenya)</option>
                        <option value="Kisumu">Kisumu (Kenya)</option>
                        <option value="Busia">Busia (Border)</option>
                        <option value="Mbarara">Mbarara (Uganda)</option>
                        <option value="Goma">Goma (DR Congo)</option>
                        <option value="Juba">Juba (South Sudan)</option>
                        <option value="Bor">Bor (South Sudan)</option>
                        <option value="Musanze">Musanze (Rwanda)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">To (Destination)</label>
                      <select
                        value={toCity}
                        onChange={(e) => setToCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold"
                      >
                        <option value="Kampala">Kampala (Uganda)</option>
                        <option value="Kigali">Kigali (Rwanda)</option>
                        <option value="Nairobi">Nairobi (Kenya)</option>
                        <option value="Mombasa">Mombasa (Kenya)</option>
                        <option value="Kisumu">Kisumu (Kenya)</option>
                        <option value="Busia">Busia (Border)</option>
                        <option value="Mbarara">Mbarara (Uganda)</option>
                        <option value="Goma">Goma (DR Congo)</option>
                        <option value="Juba">Juba (South Sudan)</option>
                        <option value="Bor">Bor (South Sudan)</option>
                        <option value="Musanze">Musanze (Rwanda)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Travel Date</label>
                      <input
                        type="date"
                        value={travelDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Passengers</label>
                      <select
                        value={passengerCount}
                        onChange={(e) => setPassengerCount(parseInt(e.target.value, 10))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#0072C6] hover:bg-[#005FA5] text-white font-bold text-sm shadow-md"
                  >
                    Search Available Buses
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: Available Trips */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {/* Route Header matching reference design */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                        <span className="text-slate-900">{fromCity}</span>
                        <span className="text-slate-400 mx-2 font-bold">to</span>
                        <span className="text-slate-900">{toCity}</span>
                      </h2>
                      <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(travelDate)}</span>
                        {!loadingTrips && trips.length > 0 && (
                          <span className="text-slate-400">| {trips.length} buses available</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-[#0072C6] hover:underline flex-shrink-0 mt-1"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {loadingTrips ? (
                  <div className="p-12 text-center">
                    <div className="w-8 h-8 border-4 border-[#0072C6] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-slate-500 text-sm">Searching available buses...</p>
                  </div>
                ) : trips.length === 0 ? (
                  <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
                    <Bus className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-600">No buses found for this route and date.</p>
                    <p className="text-xs text-slate-400 mt-1">Try a different date or route.</p>
                  </div>
                ) : (
                  trips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      currency={currency}
                      selectedPassengers={passengerCount}
                      isSelected={selectedTrip?.id === trip.id}
                      onSelect={handleSelectTrip}
                    />
                  ))
                )}
              </div>
            )}


            {/* STEP 3: Seat Selection */}
            {currentStep === 3 && selectedTrip && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-2">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">Select Your Seats</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Choose one or more available seats from the bus layout below.</p>
                </div>
                <SeatMap
                  trip={selectedTrip}
                  passengerCount={passengerCount}
                  selectedSeats={selectedSeats}
                  onSeatsChange={setSelectedSeats}
                  sessionId={sessionId}
                />
              </div>
            )}

            {/* STEP 4: Passenger Details */}
            {currentStep === 4 && (
              <div className="space-y-0">
                <PassengerForm
                  selectedSeats={selectedSeats}
                  passengers={passengers}
                  contactName={contactName}
                  contactEmail={contactEmail}
                  contactPhone={contactPhone}
                  onPassengersChange={setPassengers}
                  onContactChange={(c) => {
                    setContactName(c.name);
                    setContactEmail(c.email);
                    setContactPhone(c.phone);
                  }}
                />
              </div>
            )}


            {/* STEP 5: WHATSAPP DIRECT PAY LINK WITH EXACT USER TEMPLATE */}
            {currentStep === 5 && selectedTrip && (
              <PaymentForm
                bookingRef={generatedRef || 'TE-984210'}
                passengerName={passengers[0]?.fullName || contactName || 'Passenger'}
                passengerPhone={contactPhone || passengers[0]?.phone || ''}
                idPassportNumber={passengers[0]?.idPassportNumber || ''}
                origin={selectedTrip.route.origin.name}
                destination={selectedTrip.route.destination.name}
                travelDate={selectedTrip.departureDate}
                departureTime={formatTime(selectedTrip.departureTime)}
                seatNumbers={selectedSeats}
                totalAmountFormatted={formatCurrency(
                  (currency === 'UGX'
                    ? selectedTrip.priceUgx
                    : currency === 'KES'
                    ? selectedTrip.priceKes
                    : currency === 'USD'
                    ? selectedTrip.priceUsd
                    : currency === 'SSP'
                    ? (selectedTrip.priceSsp || 0)
                    : selectedTrip.priceRwf) * passengerCount,
                  currency
                )}
              />
            )}

          </div>

          {/* Right Summary Sidebar (4 cols) */}
          {currentStep < 5 && (
            <div className="lg:col-span-4">
              <BookingSummaryCard
                trip={selectedTrip}
                selectedSeats={selectedSeats}
                passengerCount={passengerCount}
                currency={currency}
                currentStep={currentStep}
                onContinue={handleNextStep}
                onBack={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                isSubmitting={false}
                canContinue={canContinueStep()}
                continueText={
                  currentStep === 1
                    ? 'Search Buses'
                    : currentStep === 2
                    ? 'Select Seats'
                    : currentStep === 3
                    ? 'Passenger Details'
                    : 'Proceed to Pay on WhatsApp'
                }
              />
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0072C6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <BookingWizardContent />
    </Suspense>
  );
}
