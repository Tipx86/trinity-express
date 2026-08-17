'use client';

import React from 'react';
import { Search, Bus, Armchair, UserCheck, CreditCard, CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  const steps = [
    { num: 1, label: 'Search',     icon: Search },
    { num: 2, label: 'Buses',      icon: Bus },
    { num: 3, label: 'Seats',      icon: Armchair },
    { num: 4, label: 'Passengers', icon: UserCheck },
    { num: 5, label: 'Payment',    icon: CreditCard },
    { num: 6, label: 'Ticket',     icon: CheckCircle2 },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm py-4 px-4 mb-2 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">

          {/* Background track */}
          <div className="absolute left-0 top-[18px] sm:top-[22px] w-full h-0.5 bg-slate-200 -z-0"></div>

          {/* Active progress fill */}
          <div
            className="absolute left-0 top-[18px] sm:top-[22px] h-0.5 bg-[#0072C6] transition-all duration-500 -z-0"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.num < currentStep;
            const isCurrent  = step.num === currentStep;
            const isClickable = step.num < currentStep && !!onStepClick;

            return (
              <div
                key={step.num}
                onClick={() => isClickable && onStepClick!(step.num)}
                className={`flex flex-col items-center relative z-10 gap-1.5 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {/* Circle */}
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    isCompleted
                      ? 'bg-[#0072C6] border-[#0072C6] text-white shadow-md'
                      : isCurrent
                      ? 'bg-white border-[#0072C6] text-[#0072C6] shadow-md ring-4 ring-[#0072C6]/15 scale-110'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] sm:text-xs font-semibold hidden sm:block ${
                    isCompleted
                      ? 'text-[#0072C6]'
                      : isCurrent
                      ? 'text-[#0072C6]'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
