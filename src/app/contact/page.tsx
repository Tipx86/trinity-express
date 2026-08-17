'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import FaqSection from '@/components/home/FaqSection';

const inputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0072C6]/30 focus:border-[#0072C6] transition';

const labelClass = 'block text-xs font-bold text-slate-600 mb-1.5';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-14">

        {/* Page Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-[#0072C6] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#0072C6]/10 border border-[#0072C6]/20">
            <Phone className="w-3.5 h-3.5" />
            <span>24/7 Customer Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading leading-tight">
            Get in Touch With<br className="hidden sm:block" /> Trinity Express
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Have questions about booking tickets, terminal schedules, luggage, or cross-border travel requirements? Our operations team is here to help.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left — Terminal Info */}
          <div className="lg:col-span-4 space-y-5">

            {/* Nairobi Terminal Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-[#0B1E38] px-5 py-3.5 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Nairobi Terminal</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#38BDF8]">
                  Terminal Station
                </span>
              </div>

              <div className="p-5 space-y-3.5">
                <div className="flex items-start space-x-2.5 text-sm text-slate-700">
                  <MapPin className="w-4 h-4 text-[#0072C6] flex-shrink-0 mt-0.5" />
                  <span className="font-medium">River Road / Accra Rd</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm">
                  <Phone className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                  <span className="font-mono font-bold text-slate-900">+254 7146613385</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Station Counter: 05:00 AM – 10:00 PM Daily</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Contact */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-800">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                For fastest support, reach us directly on WhatsApp. Our team responds within minutes.
              </p>
              <a
                href="https://wa.me/254714661385"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Open WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right — Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="bg-[#0B1E38] px-6 py-4">
                <h3 className="font-bold text-white text-base">Send Customer Care a Message</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill out the form below and an agent will reply via email or WhatsApp within 2 hours.
                </p>
              </div>

              <div className="p-6">
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 font-heading">Message Received!</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out to Trinity Express. Our passenger relations desk has received your inquiry and will respond shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl bg-[#0072C6] hover:bg-[#005FA5] text-white font-bold text-xs shadow-sm transition"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="e.g. Kevin Mugisha"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="kevin@example.com"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Phone / WhatsApp</label>
                        <input
                          type="tel"
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          placeholder="+254 788 123 456"
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Inquiry Subject *</label>
                        <input
                          type="text"
                          required
                          value={formState.subject}
                          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                          placeholder="Booking change, luggage, or schedule"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Your Message *</label>
                      <textarea
                        rows={5}
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Please include your booking reference if asking about an existing reservation..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-[#0072C6] hover:bg-[#005FA5] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-sm transition flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Customer Inquiry</span>
                        </>
                      )}
                    </button>

                  </form>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* FAQs */}
        <FaqSection />

      </div>
    </div>
  );
}
