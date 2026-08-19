'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Globe, FileText, ShieldAlert, Sparkles } from 'lucide-react';
import { PassengerInput } from '@/types';

interface PassengerFormProps {
  selectedSeats: number[];
  passengers: PassengerInput[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  onPassengersChange: (passengers: PassengerInput[]) => void;
  onContactChange: (contact: { name: string; email: string; phone: string }) => void;
}

// Shared white input style
const inputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0072C6]/30 focus:border-[#0072C6] transition';

const selectClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0072C6]/30 focus:border-[#0072C6] transition cursor-pointer';

const labelClass = 'block text-xs font-bold text-slate-600 mb-1.5';

export default function PassengerForm({
  selectedSeats,
  passengers,
  contactName,
  contactEmail,
  contactPhone,
  onPassengersChange,
  onContactChange,
}: PassengerFormProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [autoFilled, setAutoFilled] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          if (!contactName && !contactEmail) {
            onContactChange({
              name: data.user.name,
              email: data.user.email,
              phone: data.user.phone || contactPhone,
            });
          }
        }
      })
      .catch(() => {});
  }, []);

  const handlePassengerChange = (index: number, field: keyof PassengerInput, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    onPassengersChange(updated);

    // Auto-sync Passenger 1 → Primary Contact Details
    if (index === 0) {
      if (field === 'fullName') {
        onContactChange({ name: value, email: contactEmail, phone: contactPhone });
      }
      if (field === 'phone') {
        onContactChange({ name: contactName, email: contactEmail, phone: value });
      }
      if (field === 'email') {
        onContactChange({ name: contactName, email: value, phone: contactPhone });
      }
    }
  };

  const handleAutoFillPassengerOne = () => {
    if (currentUser && passengers.length > 0) {
      const updated = [...passengers];
      updated[0] = {
        ...updated[0],
        fullName: currentUser.name || updated[0].fullName,
        email: currentUser.email || updated[0].email,
        phone: currentUser.phone || updated[0].phone,
        nationality: currentUser.nationality || 'Rwanda',
        idPassportNumber: currentUser.idNumber || updated[0].idPassportNumber,
      };
      onPassengersChange(updated);
      setAutoFilled(true);
    }
  };

  const eastAfricaCountries = [
    'Rwanda', 'Uganda', 'Kenya', 'South Sudan',
    'Tanzania', 'Burundi', 'DR Congo', 'Other International',
  ];

  return (
    <div className="space-y-6 font-sans">

      {/* Cross-border notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs sm:text-sm">
        <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-700 block font-bold">
            East African Immigration &amp; Border Clearance Requirement
          </strong>
          <p className="mt-1 text-amber-600 text-xs leading-relaxed">
            Please enter passenger details matching their official travel document (National ID, Passport, or Temporary Travel Permit). Conductor and immigration officials will verify this information at border crossings (Gatuna/Katuna, Busia/Malaba, Nimule/Elegu).
          </p>
        </div>
      </div>

      {/* Primary Contact Details — auto-synced from Passenger 1 */}
      <div className="bg-white rounded-2xl border border-[#0072C6]/40 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="bg-[#0B1E38] px-5 py-3.5 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Primary Contact Details</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatically filled from Passenger 1 below. Booking confirmation, digital ticket, and SMS alerts are sent here.
            </p>
          </div>
          <span className="ml-3 mt-0.5 flex-shrink-0 inline-flex items-center space-x-1 bg-[#0072C6]/20 border border-[#0072C6]/40 text-[#38BDF8] text-[10px] font-bold px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>Auto-filled</span>
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-[#0072C6]" />
                <span>Contact Full Name</span>
              </span>
            </label>
            <input
              type="text"
              readOnly
              tabIndex={-1}
              value={contactName}
              placeholder="Fill in Passenger 1 name below"
              className={`${inputClass} bg-slate-100 text-slate-500 cursor-default`}
            />
          </div>

          <div>
            <label className={labelClass}>
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-[#0072C6]" />
                <span>Email Address</span>
              </span>
            </label>
            <input
              type="email"
              readOnly
              tabIndex={-1}
              value={contactEmail}
              placeholder="Fill in Passenger 1 email below"
              className={`${inputClass} bg-slate-100 text-slate-500 cursor-default`}
            />
          </div>

          <div>
            <label className={labelClass}>
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-[#0072C6]" />
                <span>Phone / WhatsApp</span>
              </span>
            </label>
            <input
              type="tel"
              readOnly
              tabIndex={-1}
              value={contactPhone}
              placeholder="Fill in Passenger 1 phone below"
              className={`${inputClass} bg-slate-100 text-slate-500 cursor-default font-mono`}
            />
          </div>
        </div>
      </div>

      {/* Individual Passenger Forms */}
      <div className="space-y-4">
        {/* Section heading + autofill */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">
            Passenger Information
            <span className="ml-2 text-xs font-semibold text-slate-500">
              ({selectedSeats.length} {selectedSeats.length === 1 ? 'Person' : 'People'})
            </span>
          </h3>

          {currentUser && !autoFilled && (
            <button
              type="button"
              onClick={handleAutoFillPassengerOne}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0072C6]/10 hover:bg-[#0072C6]/20 text-[#0072C6] text-xs font-bold border border-[#0072C6]/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Passenger 1 as Me</span>
            </button>
          )}
        </div>

        {selectedSeats.map((seatNum, idx) => {
          const pass = passengers[idx] || {
            seatNumber: seatNum,
            fullName: '',
            nationality: 'Rwanda',
            idPassportNumber: '',
            phone: '',
            email: '',
          };

          return (
            <div
              key={`pass-form-${seatNum}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Passenger card header */}
              <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#0072C6] text-white font-black text-xs flex items-center justify-center shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    Passenger {idx + 1}
                  </span>
                  {idx === 0 && (
                    <span className="inline-flex items-center space-x-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Primary Contact</span>
                    </span>
                  )}
                </div>
                <span className="px-3 py-1 rounded-full bg-[#0072C6]/10 text-[#0072C6] font-black text-xs border border-[#0072C6]/20">
                  Seat #{seatNum}
                </span>
              </div>
              {idx === 0 && (
                <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center space-x-2 text-xs text-emerald-700">
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Details entered here will automatically become the <strong>Primary Contact</strong> where tickets and booking confirmations are sent.</span>
                </div>
              )}

              {/* Fields */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Full Name */}
                <div className="lg:col-span-2">
                  <label className={labelClass}>
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Full Legal Name *</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pass.fullName}
                    onChange={(e) => handlePassengerChange(idx, 'fullName', e.target.value)}
                    placeholder="As shown in Passport / ID"
                    className={inputClass}
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label className={labelClass}>
                    <span className="flex items-center space-x-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>Nationality *</span>
                    </span>
                  </label>
                  <select
                    value={pass.nationality}
                    onChange={(e) => handlePassengerChange(idx, 'nationality', e.target.value)}
                    className={selectClass}
                  >
                    {eastAfricaCountries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* ID / Passport */}
                <div>
                  <label className={labelClass}>
                    <span className="flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span>National ID / Passport *</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pass.idPassportNumber}
                    onChange={(e) => handlePassengerChange(idx, 'idPassportNumber', e.target.value)}
                    placeholder="e.g. 1199580023456789"
                    className={`${inputClass} font-mono`}
                  />
                </div>

                {/* Passenger Phone */}
                <div>
                  <label className={labelClass}>
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>Mobile Phone</span>
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={pass.phone || ''}
                    onChange={(e) => handlePassengerChange(idx, 'phone', e.target.value)}
                    placeholder="+250 783 987 654"
                    className={`${inputClass} font-mono`}
                  />
                </div>

                {/* Passenger Email */}
                <div className="lg:col-span-3">
                  <label className={labelClass}>
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>Passenger Email</span>
                      <span className="text-slate-400 font-normal">(Optional)</span>
                    </span>
                  </label>
                  <input
                    type="email"
                    value={pass.email || ''}
                    onChange={(e) => handlePassengerChange(idx, 'email', e.target.value)}
                    placeholder="passenger@example.com"
                    className={inputClass}
                  />
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
