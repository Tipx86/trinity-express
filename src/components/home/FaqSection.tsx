'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import Link from 'next/link';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FaqSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: '1',
      question: 'What travel documents do I need for cross-border trips?',
      answer: 'For cross-border journeys (e.g. Rwanda to Uganda, Kenya, or South Sudan), passengers must carry a valid Passport, East African National ID card (for EAC citizens between Rwanda, Uganda, Kenya), or Temporary Travel Permit issued by immigration, plus a valid Yellow Fever vaccination certificate.',
      category: 'BORDER_CROSSING',
    },
    {
      id: '2',
      question: 'How early should I arrive at the bus terminal before departure?',
      answer: 'We recommend arriving at least 45 minutes prior to scheduled departure. This allows sufficient time for baggage tagging, seat check-in, and pre-departure immigration briefing.',
      category: 'BOOKING',
    },
    {
      id: '3',
      question: 'What is the free luggage allowance per passenger?',
      answer: 'Each passenger is entitled to 1 standard suitcase or duffel bag (up to 20kg) to be stowed in the undercarriage luggage bay, plus 1 small personal cabin bag (up to 5kg) for the overhead bin.',
      category: 'LUGGAGE',
    },
    {
      id: '4',
      question: 'Can I select my preferred seat in advance?',
      answer: 'Yes! Trinity Express provides an interactive real-time visual seat map during online booking where you can choose your exact window, aisle, or VIP seat before checkout.',
      category: 'BOOKING',
    },
    {
      id: '5',
      question: 'Which payment methods are supported?',
      answer: 'We accept M-Pesa, Airtel Money, MTN MoMo, Visa, Mastercard, and direct bank transfers. All transactions are protected by bank-grade encryption.',
      category: 'PAYMENT',
    },
    {
      id: '6',
      question: 'Can I cancel or reschedule my ticket?',
      answer: 'Yes. Tickets can be rescheduled or cancelled up to 6 hours before departure via the "My Booking" self-service portal or at any Trinity Express station counter.',
      category: 'BOOKING',
    },
  ]);

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/faqs')
      .then((res) => res.json())
      .then((data) => {
        if (data.faqs && data.faqs.length > 0) setFaqs(data.faqs);
      })
      .catch(() => {});
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-white rounded-3xl border border-slate-200 shadow-sm font-sans">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">

        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 text-[#0072C6] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#0072C6]/10 border border-[#0072C6]/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We've Got Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
            Everything you need to know about booking bus tickets, border crossing documents, luggage rules, and payment options.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#0072C6]/30 shadow-sm bg-white'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                >
                  <span className={`text-sm sm:text-base font-bold transition-colors ${
                    isOpen ? 'text-[#0072C6]' : 'text-slate-800'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 border ${
                    isOpen
                      ? 'bg-[#0072C6]/10 border-[#0072C6]/30 text-[#0072C6] rotate-180'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <div className="pt-3">{faq.answer}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Still have questions about your trip?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Our customer support agents are ready to assist you 24/7.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-[#0072C6] hover:bg-[#005FA5] text-white font-bold text-xs shadow-sm transition flex items-center space-x-1.5 whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
