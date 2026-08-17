'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, ArrowRightLeft, Search } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  const [fromCity, setFromCity] = useState('Kigali');
  const [toCity, setToCity] = useState('Kampala');

  const getInitialDate = () => new Date().toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState(getInitialDate());

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/book?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${travelDate}`);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Background Image: Bus Fleet as shown in reference Image 1 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        {/* Sky Blue Overlay to match photo aesthetic in Image 1 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#6B99C4]/90 via-[#6B99C4]/70 to-[#81A9D0]/60"></div>
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10 text-center space-y-8">

        {/* Main Headline from Image 1 */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none font-heading drop-shadow-md">
            Trinity Express Bus Tickets <br />
            <span className="text-[#B9E0FF]">Across East Africa</span>
          </h1>

          <p className="text-sm sm:text-base text-white/95 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow">
            Search Trinity Express routes from Kigali to Kampala, Kigali to Nairobi, Kampala to Juba and other trusted cross-border bus journeys.
          </p>
        </div>

        {/* Search Widget Box matching exact rounded pill design in Image 1 */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-full p-2 sm:p-3 shadow-2xl border border-white/40 backdrop-blur-md">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">

            {/* Origin */}
            <div className="flex-1 w-full bg-slate-50 hover:bg-slate-100 rounded-xl sm:rounded-full px-4 py-3 flex items-center space-x-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
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

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition flex-shrink-0"
              title="Swap cities"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* Destination */}
            <div className="flex-1 w-full bg-slate-50 hover:bg-slate-100 rounded-xl sm:rounded-full px-4 py-3 flex items-center space-x-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
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

            {/* Travel Date */}
            <div className="flex-1 w-full bg-slate-50 hover:bg-slate-100 rounded-xl sm:rounded-full px-4 py-3 flex items-center space-x-2 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="date"
                min={getInitialDate()}
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>

            {/* Ocean Blue Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl sm:rounded-full bg-[#0072C6] hover:bg-[#005FA5] text-white font-bold text-sm shadow-lg transition flex items-center justify-center space-x-2 flex-shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
