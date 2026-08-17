'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  CalendarClock, 
  Truck, 
  Receipt, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  Users, 
  Bus, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  Eye,
  Mail
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@/lib/formatters';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'trips' | 'buses' | 'bookings' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState<any>({});
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);

  // Search & Filter
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');

  // Modals
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showBusModal, setShowBusModal] = useState(false);
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<any>(null);

  // Forms
  const [routeForm, setRouteForm] = useState({
    originId: '',
    destinationId: '',
    distanceKm: '510',
    durationMinutes: '570',
    basePriceRwf: '16000',
    basePriceUgx: '45000',
    basePriceKes: '1600',
    basePriceUsd: '13',
    stops: 'Gatuna/Katuna Border, Mbarara',
  });

  const [tripForm, setTripForm] = useState({
    routeId: '',
    busId: '',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '06:00',
    arrivalTime: '15:30',
    priceRwf: '16000',
    priceUgx: '45000',
    priceKes: '1600',
    priceUsd: '13',
  });

  const [busForm, setBusForm] = useState({
    plateNumber: '',
    busModel: 'Scania Touring HD VIP',
    busType: 'VIP_EXECUTIVE',
    seatCount: '48',
    seatLayout: '2x2',
    amenities: 'WIFI,USB,AC,WATER,TOILET',
  });

  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const fetchOverviewData = async () => {
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      if (data.recentBookings) setRecentBookings(data.recentBookings);
    } catch {}
  };

  const fetchRoutesData = async () => {
    try {
      const res = await fetch('/api/admin/routes');
      const data = await res.json();
      if (data.routes) setRoutes(data.routes);
      if (data.destinations) {
        setDestinations(data.destinations);
        if (!routeForm.originId && data.destinations.length >= 2) {
          setRouteForm((prev) => ({
            ...prev,
            originId: data.destinations[0].id,
            destinationId: data.destinations[1].id,
          }));
        }
      }
    } catch {}
  };

  const fetchTripsData = async () => {
    try {
      const res = await fetch('/api/admin/trips');
      const data = await res.json();
      if (data.trips) setTrips(data.trips);
      if (data.routes && data.routes.length > 0 && !tripForm.routeId) {
        setTripForm((prev) => ({ ...prev, routeId: data.routes[0].id }));
      }
      if (data.buses && data.buses.length > 0 && !tripForm.busId) {
        setTripForm((prev) => ({ ...prev, busId: data.buses[0].id }));
      }
    } catch {}
  };

  const fetchBusesData = async () => {
    try {
      const res = await fetch('/api/admin/buses');
      const data = await res.json();
      if (data.buses) setBuses(data.buses);
    } catch {}
  };

  const fetchBookingsData = async () => {
    try {
      const res = await fetch(`/api/admin/bookings?search=${encodeURIComponent(bookingSearch)}&status=${bookingStatusFilter}`);
      const data = await res.json();
      if (data.bookings) setAllBookings(data.bookings);
    } catch {}
  };

  const fetchSettingsData = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) setSiteSettings(data.settings);
      if (data.partners) setPartners(data.partners);
    } catch {}
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchOverviewData(),
      fetchRoutesData(),
      fetchTripsData(),
      fetchBusesData(),
      fetchBookingsData(),
      fetchSettingsData(),
    ]).finally(() => setLoading(false));
  }, []);

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routeForm),
      });
      if (res.ok) {
        setShowRouteModal(false);
        fetchRoutesData();
        setStatusNotice('New cross-border route created successfully');
      }
    } catch {}
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripForm),
      });
      if (res.ok) {
        setShowTripModal(false);
        fetchTripsData();
        setStatusNotice('New scheduled trip added successfully');
      }
    } catch {}
  };

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/buses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(busForm),
      });
      if (res.ok) {
        setShowBusModal(false);
        fetchBusesData();
        setStatusNotice('New bus added to Trinity Express fleet');
      }
    } catch {}
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status }),
      });
      if (res.ok) {
        fetchOverviewData();
        fetchBookingsData();
        setStatusNotice(`Booking status updated to ${status}`);
      }
    } catch {}
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: siteSettings }),
      });
      if (res.ok) {
        setStatusNotice('Website content & settings updated successfully');
      }
    } catch {}
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
            Trinity Express Backoffice
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-Border Fleet Management, Trip Scheduling, Fares, Bookings & CMS
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-trinity-navy-900 p-1.5 rounded-2xl border border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'routes', label: 'Routes', icon: Map },
            { id: 'trips', label: 'Trips', icon: CalendarClock },
            { id: 'buses', label: 'Fleet', icon: Truck },
            { id: 'bookings', label: 'Bookings', icon: Receipt },
            { id: 'settings', label: 'CMS / Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <span>✓ {statusNotice}</span>
          <button onClick={() => setStatusNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. OVERVIEW TAB */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-panel-dark rounded-2xl p-5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Revenue (Paid)</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-heading">
                {formatCurrency(stats.totalRevenue || 0, 'RWF')}
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold">
                Across all active routes
              </span>
            </div>

            <div className="glass-panel-dark rounded-2xl p-5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Confirmed Bookings</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-heading">
                {stats.confirmedBookings || 0}
              </p>
              <span className="text-[11px] text-slate-400">
                {stats.totalBookings || 0} total reservations
              </span>
            </div>

            <div className="glass-panel-dark rounded-2xl p-5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Passengers</span>
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-heading">
                {stats.totalPassengers || 0}
              </p>
              <span className="text-[11px] text-slate-400">
                Digital tickets issued
              </span>
            </div>

            <div className="glass-panel-dark rounded-2xl p-5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Bus Fleet</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Bus className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-heading">
                {stats.activeBuses || 0} Coaches
              </p>
              <span className="text-[11px] text-slate-400">
                {stats.activeRoutes || 0} active cross-border routes
              </span>
            </div>

          </div>

          {/* Recent Bookings Feed */}
          <div className="glass-panel-dark rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Recent Passenger Reservations
                </h3>
                <p className="text-xs text-slate-400">Live booking activity across East African routes</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className="text-xs text-emerald-400 font-bold hover:underline"
              >
                View All Ledger
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Ref & Date</th>
                    <th className="pb-3">Passenger & Contact</th>
                    <th className="pb-3">Route</th>
                    <th className="pb-3">Seats</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-mono">
                        <span className="font-bold text-white block">{b.bookingRef}</span>
                        <span className="text-[10px] text-slate-500">{new Date(b.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-white block">{b.contactName}</span>
                        <span className="text-[10px] text-slate-400">{b.contactEmail}</span>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-slate-200">
                          {b.trip?.route?.origin?.name} ➔ {b.trip?.route?.destination?.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {b.trip?.departureDate} ({b.trip?.departureTime})
                        </span>
                      </td>
                      <td className="py-3 font-bold text-emerald-400">
                        {b.passengers?.map((p: any) => p.seatNumber).join(', ')}
                      </td>
                      <td className="py-3 font-bold text-white">
                        {formatCurrency(b.totalAmount, b.currency)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : b.status === 'CANCELLED'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setSelectedBookingForModal(b)}
                          className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px]"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ROUTES MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'routes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-heading">
              Cross-Border Routes ({routes.length})
            </h3>
            <button
              onClick={() => setShowRouteModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Route</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((r) => (
              <div key={r.id} className="glass-panel-dark rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="font-bold text-white font-heading text-base">
                    {r.origin.name} ➔ {r.destination.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {r.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong>Distance:</strong> {r.distanceKm} km • ~{Math.round(r.durationMinutes / 60)} hrs</p>
                  <p><strong>Base Fare:</strong> {formatCurrency(r.basePriceRwf, 'RWF')} ({formatCurrency(r.basePriceUgx, 'UGX')} / ${r.basePriceUsd})</p>
                  {r.stops && <p className="text-[11px] text-slate-400">Via: {r.stops}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TRIPS SCHEDULER TAB */}
      {/* ========================================================================= */}
      {activeTab === 'trips' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-heading">
              Scheduled Bus Trips ({trips.length})
            </h3>
            <button
              onClick={() => setShowTripModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Trip</span>
            </button>
          </div>

          <div className="glass-panel-dark rounded-3xl p-6 border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase">
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Route</th>
                  <th className="pb-3">Assigned Coach</th>
                  <th className="pb-3">Fare (RWF)</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trips.slice(0, 30).map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 font-semibold text-white">
                      {t.departureDate} ({t.departureTime} – {t.arrivalTime})
                    </td>
                    <td className="py-3 text-slate-200">
                      {t.route?.origin?.name} ➔ {t.route?.destination?.name}
                    </td>
                    <td className="py-3 text-slate-300">
                      {t.bus?.busModel} ({t.bus?.plateNumber})
                    </td>
                    <td className="py-3 font-bold text-emerald-400">
                      {formatCurrency(t.priceRwf, 'RWF')}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BUS FLEET TAB */}
      {/* ========================================================================= */}
      {activeTab === 'buses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-heading">
              Trinity Express Bus Fleet ({buses.length})
            </h3>
            <button
              onClick={() => setShowBusModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Coach</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.map((bus) => (
              <div key={bus.id} className="glass-panel-dark rounded-3xl p-6 border border-white/10 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="font-mono font-black text-emerald-400 text-lg">
                    {bus.plateNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase">
                    {bus.busType?.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1.5">
                  <p><strong>Model:</strong> {bus.busModel}</p>
                  <p><strong>Capacity:</strong> {bus.seatCount} Seats ({bus.seatLayout} Layout)</p>
                  <p className="text-[11px] text-slate-400"><strong>Amenities:</strong> {bus.amenities}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BOOKINGS & LEDGER TAB */}
      {/* ========================================================================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-white font-heading">
              Bookings & Payment Transactions
            </h3>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search reference, customer, or phone..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={fetchBookingsData}
                className="px-3 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs"
              >
                Search
              </button>
            </div>
          </div>

          <div className="glass-panel-dark rounded-3xl p-6 border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase">
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Route & Date</th>
                  <th className="pb-3">Seats</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 font-mono font-bold text-emerald-400">{b.bookingRef}</td>
                    <td className="py-3 text-white">{b.contactName} ({b.contactPhone})</td>
                    <td className="py-3 text-slate-300">
                      {b.trip?.route?.origin?.name} ➔ {b.trip?.route?.destination?.name} ({b.trip?.departureDate})
                    </td>
                    <td className="py-3 font-bold text-white">{b.passengers?.map((p: any) => p.seatNumber).join(', ')}</td>
                    <td className="py-3 font-bold text-white">{formatCurrency(b.totalAmount, b.currency)}</td>
                    <td className="py-3">
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                        className="bg-trinity-navy-900 text-xs font-bold text-white border border-white/10 rounded px-2 py-1"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedBookingForModal(b)}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px]"
                      >
                        Manifest
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CMS & SITE SETTINGS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="glass-panel-dark rounded-3xl p-8 border border-white/10 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white font-heading">Website CMS & General Settings</h3>
            <p className="text-xs text-slate-400">Update homepage headlines, terminal hotlines, announcements, and partner details.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
            {siteSettings.map((s, idx) => (
              <div key={s.key}>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {s.description || s.key}
                </label>
                <input
                  type="text"
                  value={s.value}
                  onChange={(e) => {
                    const updated = [...siteSettings];
                    updated[idx].value = e.target.value;
                    setSiteSettings(updated);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>
            ))}

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg transition"
            >
              Save Website Settings
            </button>
          </form>
        </div>
      )}

      {/* Create Route Modal */}
      {showRouteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/20 space-y-4">
            <h3 className="text-xl font-bold text-white font-heading">Add New Route</h3>
            <form onSubmit={handleCreateRoute} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Origin City</label>
                <select
                  value={routeForm.originId}
                  onChange={(e) => setRouteForm({ ...routeForm, originId: e.target.value })}
                  className="w-full bg-trinity-navy-900 border border-white/10 rounded-xl p-2.5 text-white"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.country})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Destination City</label>
                <select
                  value={routeForm.destinationId}
                  onChange={(e) => setRouteForm({ ...routeForm, destinationId: e.target.value })}
                  className="w-full bg-trinity-navy-900 border border-white/10 rounded-xl p-2.5 text-white"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.country})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={routeForm.distanceKm}
                    onChange={(e) => setRouteForm({ ...routeForm, distanceKm: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={routeForm.durationMinutes}
                    onChange={(e) => setRouteForm({ ...routeForm, durationMinutes: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fare (RWF)</label>
                  <input
                    type="number"
                    value={routeForm.basePriceRwf}
                    onChange={(e) => setRouteForm({ ...routeForm, basePriceRwf: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fare (USD)</label>
                  <input
                    type="number"
                    value={routeForm.basePriceUsd}
                    onChange={(e) => setRouteForm({ ...routeForm, basePriceUsd: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Intermediate Border/Transit Stops</label>
                <input
                  type="text"
                  value={routeForm.stops}
                  onChange={(e) => setRouteForm({ ...routeForm, stops: e.target.value })}
                  placeholder="Gatuna Border, Mbarara"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRouteModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold"
                >
                  Create Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Passenger Manifest Modal */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/20 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-heading">
                Manifest: {selectedBookingForModal.bookingRef}
              </h3>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <p><strong>Customer:</strong> {selectedBookingForModal.contactName} ({selectedBookingForModal.contactEmail} • {selectedBookingForModal.contactPhone})</p>
              <p><strong>Route:</strong> {selectedBookingForModal.trip?.route?.origin?.name} ➔ {selectedBookingForModal.trip?.route?.destination?.name}</p>
              <p><strong>Date & Time:</strong> {selectedBookingForModal.trip?.departureDate} at {selectedBookingForModal.trip?.departureTime}</p>
              <p><strong>Total Paid:</strong> {formatCurrency(selectedBookingForModal.totalAmount, selectedBookingForModal.currency)} ({selectedBookingForModal.paymentStatus})</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="font-bold text-white text-xs">Passengers:</h4>
              {selectedBookingForModal.passengers?.map((p: any) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-white/5 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">{p.fullName}</span>
                    <span className="text-[10px] text-slate-400">{p.idPassportNumber} ({p.nationality})</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    Seat #{p.seatNumber}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
