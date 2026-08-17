'use client';

import React from 'react';

// Custom high-fidelity Vector Partner Logos
function SonarwaLogo() {
  return (
    <div className="flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300">
      <svg viewBox="0 0 100 90" className="h-12 w-auto drop-shadow-sm" fill="none">
        {/* Top red dot */}
        <circle cx="50" cy="14" r="8" fill="#991B1B" />
        {/* Curved stylized shield body */}
        <path
          d="M50 26 C36 26, 26 38, 26 54 C26 70, 38 82, 54 82 C68 82, 74 72, 74 62 C74 54, 68 50, 60 50 C52 50, 46 54, 42 60 C40 63, 37 61, 37 56 C37 44, 43 33, 54 29 Z"
          fill="#991B1B"
        />
        {/* Inner gold circular crest */}
        <circle cx="53" cy="56" r="8" fill="#F59E0B" opacity="0.95" />
        <text
          x="53"
          y="60"
          textAnchor="middle"
          fontSize="9"
          fontWeight="900"
          fill="#78350F"
          fontFamily="system-ui, sans-serif"
        >
          G
        </text>
      </svg>
      <span className="text-[11px] font-black text-slate-900 tracking-tight mt-1 font-heading uppercase">
        SONARWA <span className="font-semibold text-slate-600 lowercase">General</span>
      </span>
    </div>
  );
}

function ZionLogo() {
  return (
    <div className="flex items-center space-x-2.5 group-hover:scale-105 transition-transform duration-300">
      {/* Orange Flame Emblem */}
      <svg viewBox="0 0 80 100" className="h-12 w-auto drop-shadow-sm" fill="none">
        <path
          d="M40 5 C45 25, 68 45, 68 68 C68 85, 55 96, 40 96 C25 96, 12 85, 12 68 C12 45, 35 25, 40 5 Z"
          fill="#EA580C"
        />
        <path
          d="M40 30 C43 45, 56 55, 56 72 C56 82, 49 88, 40 88 C31 88, 24 82, 24 72 C24 55, 37 45, 40 30 Z"
          fill="#F97316"
        />
        <path
          d="M40 52 C42 60, 48 66, 48 76 C48 82, 44 86, 40 86 C36 86, 32 82, 32 76 C32 66, 38 60, 40 52 Z"
          fill="#FDE047"
        />
        <rect x="22" y="80" width="36" height="14" rx="2" fill="#C2410C" />
        <text
          x="40"
          y="90"
          textAnchor="middle"
          fontSize="8"
          fontWeight="bold"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
        >
          Z.I.B
        </text>
      </svg>

      {/* Zion text layout */}
      <div className="flex flex-col text-left">
        <span className="text-lg font-black text-[#C2410C] tracking-wider leading-none font-serif">
          Z I O N
        </span>
        <span className="text-[8px] font-bold text-slate-800 tracking-widest leading-tight uppercase font-sans mt-0.5">
          INSURANCE
        </span>
        <span className="text-[8px] font-bold text-slate-800 tracking-widest leading-tight uppercase font-sans">
          BROKERS
        </span>
      </div>
    </div>
  );
}

function RuraLogo() {
  return (
    <div className="flex items-center space-x-2 group-hover:scale-105 transition-transform duration-300">
      <div className="flex items-center">
        <svg viewBox="0 0 160 60" className="h-10 w-auto" fill="none">
          {/* Green / Yellow curved accent */}
          <path d="M15 45 C10 30, 25 15, 42 12 C35 22, 28 32, 24 45 Z" fill="#84CC16" />
          <path d="M22 45 C20 32, 32 20, 46 16 C38 25, 32 35, 29 45 Z" fill="#EAB308" />
          {/* 'rura' text */}
          <text
            x="35"
            y="44"
            fontSize="36"
            fontWeight="900"
            fill="#005B96"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-1.5"
          >
            rura
          </text>
        </svg>

        <div className="flex flex-col text-left pl-2 border-l border-slate-300 ml-1">
          <span className="text-[6.5px] font-extrabold text-slate-800 leading-[8px] uppercase tracking-tighter">
            RWANDA<br />UTILITIES<br />REGULATORY<br />AUTHORITY
          </span>
          <span className="text-[6.5px] italic text-[#005B96] font-semibold leading-tight mt-0.5">
            Inspiring development
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PartnersSection() {
  const partners = [
    {
      name: 'SONARWA General Insurance',
      url: 'https://sonarwa.co.rw',
      component: <SonarwaLogo />,
    },
    {
      name: 'Zion Insurance Brokers',
      url: 'https://zionbrokers.com',
      component: <ZionLogo />,
    },
    {
      name: 'RURA Rwanda Utilities Regulatory Authority',
      url: 'https://rura.rw',
      component: <RuraLogo />,
    },
    {
      name: 'SONARWA General Insurance',
      url: 'https://sonarwa.co.rw',
      component: <SonarwaLogo />,
    },
    {
      name: 'Zion Insurance Brokers',
      url: 'https://zionbrokers.com',
      component: <ZionLogo />,
    },
  ];

  return (
    <section className="bg-white py-6 sm:py-8 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Live Banner Container matching exact user design */}
        <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
          
          {/* Top Navy Blue Header Bar */}
          <div className="bg-[#0B1E38] py-3.5 px-4 text-center">
            <h2 className="text-xs sm:text-sm md:text-base font-black text-white uppercase tracking-widest font-heading">
              EMPOWERING SUCCESS THROUGH TRUSTED PARTNERSHIPS
            </h2>
          </div>

          {/* White Interactive Logos Row */}
          <div className="bg-white py-6 sm:py-8 px-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-around gap-6 sm:gap-8 md:gap-12">
              {partners.map((p, idx) => (
                <a
                  key={idx}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={p.name}
                  className="group flex items-center justify-center p-2 rounded-xl hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                >
                  {p.component}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Navy Blue Divider Bar */}
          <div className="bg-[#0B1E38] h-3.5 w-full"></div>

        </div>

      </div>
    </section>
  );
}
