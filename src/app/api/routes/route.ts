import { NextResponse } from 'next/server';

const ALL_21_ROUTES = [
  {
    id: 'route_Kigali_Kampala',
    origin: { name: 'Kigali', code: 'KGL', country: 'Rwanda', terminalName: 'Nyabugogo Bus Park Terminal 1' },
    destination: { name: 'Kampala', code: 'KLA', country: 'Uganda', terminalName: 'Namayiba Bus Terminal (Kisenyi)' },
    basePriceRwf: 38000, basePriceUgx: 100000, basePriceKes: 4000, basePriceUsd: 30, basePriceSsp: 0, durationMinutes: 570
  },
  {
    id: 'route_Kigali_Mbarara',
    origin: { name: 'Kigali', code: 'KGL', country: 'Rwanda', terminalName: 'Nyabugogo Bus Park Terminal 1' },
    destination: { name: 'Mbarara', code: 'MBR', country: 'Uganda', terminalName: 'Mbarara Central Bus Park' },
    basePriceRwf: 25000, basePriceUgx: 70000, basePriceKes: 2800, basePriceUsd: 20, basePriceSsp: 0, durationMinutes: 330
  },
  {
    id: 'route_Kigali_Nairobi',
    origin: { name: 'Kigali', code: 'KGL', country: 'Rwanda', terminalName: 'Nyabugogo Bus Park Terminal 1' },
    destination: { name: 'Nairobi', code: 'NBO', country: 'Kenya', terminalName: 'River Road / Accra Rd Terminal' },
    basePriceRwf: 75000, basePriceUgx: 220000, basePriceKes: 7500, basePriceUsd: 60, basePriceSsp: 0, durationMinutes: 960
  },
  {
    id: 'route_Kigali_Busia',
    origin: { name: 'Kigali', code: 'KGL', country: 'Rwanda', terminalName: 'Nyabugogo Bus Park Terminal 1' },
    destination: { name: 'Busia', code: 'BSA', country: 'Uganda', terminalName: 'Busia Border Terminal' },
    basePriceRwf: 55000, basePriceUgx: 160000, basePriceKes: 5500, basePriceUsd: 45, basePriceSsp: 0, durationMinutes: 720
  },
  {
    id: 'route_Kampala_Kigali',
    origin: { name: 'Kampala', code: 'KLA', country: 'Uganda', terminalName: 'Namayiba Bus Terminal (Kisenyi)' },
    destination: { name: 'Kigali', code: 'KGL', country: 'Rwanda', terminalName: 'Nyabugogo Bus Park Terminal 1' },
    basePriceRwf: 38000, basePriceUgx: 100000, basePriceKes: 4000, basePriceUsd: 30, basePriceSsp: 0, durationMinutes: 570
  },
  {
    id: 'route_Kampala_Goma',
    origin: { name: 'Kampala', code: 'KLA', country: 'Uganda', terminalName: 'Namayiba Bus Terminal (Kisenyi)' },
    destination: { name: 'Goma', code: 'GOM', country: 'DR Congo', terminalName: 'La Corniche Border Station' },
    basePriceRwf: 38000, basePriceUgx: 100000, basePriceKes: 4000, basePriceUsd: 30, basePriceSsp: 0, durationMinutes: 600
  },
  {
    id: 'route_Kampala_Nairobi',
    origin: { name: 'Kampala', code: 'KLA', country: 'Uganda', terminalName: 'Namayiba Bus Terminal (Kisenyi)' },
    destination: { name: 'Nairobi', code: 'NBO', country: 'Kenya', terminalName: 'River Road / Accra Rd Terminal' },
    basePriceRwf: 40000, basePriceUgx: 120000, basePriceKes: 4000, basePriceUsd: 32, basePriceSsp: 0, durationMinutes: 840
  },
  {
    id: 'route_Kampala_Juba',
    origin: { name: 'Kampala', code: 'KLA', country: 'Uganda', terminalName: 'Namayiba Bus Terminal (Kisenyi)' },
    destination: { name: 'Juba', code: 'JUB', country: 'South Sudan', terminalName: 'Customs Bus Terminal' },
    basePriceRwf: 50000, basePriceUgx: 150000, basePriceKes: 5000, basePriceUsd: 45, basePriceSsp: 600000, durationMinutes: 600
  },
  {
    id: 'route_Nairobi_Kigali',
    origin: { name: 'Nairobi', code: 'NBO', country: 'Kenya', terminalName: 'River Road / Accra Rd Terminal' },
    destination: { name: 'Kigali', code: 'KGL', country: 'Rwanda', terminalName: 'Nyabugogo Bus Park Terminal 1' },
    basePriceRwf: 75000, basePriceUgx: 220000, basePriceKes: 7500, basePriceUsd: 60, basePriceSsp: 0, durationMinutes: 960
  },
  {
    id: 'route_Nairobi_Kampala',
    origin: { name: 'Nairobi', code: 'NBO', country: 'Kenya', terminalName: 'River Road / Accra Rd Terminal' },
    destination: { name: 'Kampala', code: 'KLA', country: 'Uganda', terminalName: 'Namayiba Bus Terminal (Kisenyi)' },
    basePriceRwf: 40000, basePriceUgx: 120000, basePriceKes: 4000, basePriceUsd: 32, basePriceSsp: 0, durationMinutes: 840
  },
  {
    id: 'route_Nairobi_Mombasa',
    origin: { name: 'Nairobi', code: 'NBO', country: 'Kenya', terminalName: 'River Road / Accra Rd Terminal' },
    destination: { name: 'Mombasa', code: 'MBA', country: 'Kenya', terminalName: 'Mbaraki Bus Terminal' },
    basePriceRwf: 21000, basePriceUgx: 65000, basePriceKes: 2100, basePriceUsd: 18, basePriceSsp: 0, durationMinutes: 480
  },
  {
    id: 'route_Nairobi_Kisumu',
    origin: { name: 'Nairobi', code: 'NBO', country: 'Kenya', terminalName: 'River Road / Accra Rd Terminal' },
    destination: { name: 'Kisumu', code: 'KIS', country: 'Kenya', terminalName: 'Kisumu Main Bus Park' },
    basePriceRwf: 16000, basePriceUgx: 50000, basePriceKes: 1600, basePriceUsd: 13, basePriceSsp: 0, durationMinutes: 360
  },
  {
    id: 'route_Mombasa_Kisumu',
    origin: { name: 'Mombasa', code: 'MBA', country: 'Kenya', terminalName: 'Mbaraki Bus Terminal' },
    destination: { name: 'Kisumu', code: 'KIS', country: 'Kenya', terminalName: 'Kisumu Main Bus Park' },
    basePriceRwf: 26000, basePriceUgx: 80000, basePriceKes: 2600, basePriceUsd: 22, basePriceSsp: 0, durationMinutes: 720
  },
  {
    id: 'route_Mombasa_Nairobi',
    origin: { name: 'Mombasa', code: 'MBA', country: 'Kenya', terminalName: 'Mbaraki Bus Terminal' },
    destination: { name: 'Nairobi', code: 'NBO', country: 'Kenya', terminalName: 'River Road / Accra Rd Terminal' },
    basePriceRwf: 21000, basePriceUgx: 65000, basePriceKes: 2100, basePriceUsd: 18, basePriceSsp: 0, durationMinutes: 480
  },
  {
    id: 'route_Kisumu_Nairobi',
    origin: { name: 'Kisumu', code: 'KIS', country: 'Kenya', terminalName: 'Kisumu Main Bus Park' },
    destination: { name: 'Nairobi', code: 'NBO', country: 'Kenya', terminalName: 'River Road / Accra Rd Terminal' },
    basePriceRwf: 16000, basePriceUgx: 50000, basePriceKes: 1600, basePriceUsd: 13, basePriceSsp: 0, durationMinutes: 360
  },
  {
    id: 'route_Busia_Kampala',
    origin: { name: 'Busia', code: 'BSA', country: 'Uganda', terminalName: 'Busia Border Terminal' },
    destination: { name: 'Kampala', code: 'KLA', country: 'Uganda', terminalName: 'Namayiba Bus Terminal (Kisenyi)' },
    basePriceRwf: 20000, basePriceUgx: 60000, basePriceKes: 2000, basePriceUsd: 16, basePriceSsp: 0, durationMinutes: 240
  },
  {
    id: 'route_Kampala_Busia',
    origin: { name: 'Kampala', code: 'KLA', country: 'Uganda', terminalName: 'Namayiba Bus Terminal (Kisenyi)' },
    destination: { name: 'Busia', code: 'BSA', country: 'Uganda', terminalName: 'Busia Border Terminal' },
    basePriceRwf: 20000, basePriceUgx: 60000, basePriceKes: 2000, basePriceUsd: 16, basePriceSsp: 0, durationMinutes: 240
  },
  {
    id: 'route_Busia_Kigali',
    origin: { name: 'Busia', code: 'BSA', country: 'Uganda', terminalName: 'Busia Border Terminal' },
    destination: { name: 'Kigali', code: 'KGL', country: 'Rwanda', terminalName: 'Nyabugogo Bus Park Terminal 1' },
    basePriceRwf: 55000, basePriceUgx: 160000, basePriceKes: 5500, basePriceUsd: 45, basePriceSsp: 0, durationMinutes: 720
  },
  {
    id: 'route_Juba_Kampala',
    origin: { name: 'Juba', code: 'JUB', country: 'South Sudan', terminalName: 'Customs Bus Terminal' },
    destination: { name: 'Kampala', code: 'KLA', country: 'Uganda', terminalName: 'Namayiba Bus Terminal (Kisenyi)' },
    basePriceRwf: 50000, basePriceUgx: 150000, basePriceKes: 5000, basePriceUsd: 45, basePriceSsp: 600000, durationMinutes: 600
  },
  {
    id: 'route_Juba_Bor',
    origin: { name: 'Juba', code: 'JUB', country: 'South Sudan', terminalName: 'Customs Bus Terminal' },
    destination: { name: 'Bor', code: 'BOR', country: 'South Sudan', terminalName: 'Bor Central Station' },
    basePriceRwf: 5000, basePriceUgx: 15000, basePriceKes: 500, basePriceUsd: 5, basePriceSsp: 50000, durationMinutes: 240
  },
  {
    id: 'route_Bor_Juba',
    origin: { name: 'Bor', code: 'BOR', country: 'South Sudan', terminalName: 'Bor Central Station' },
    destination: { name: 'Juba', code: 'JUB', country: 'South Sudan', terminalName: 'Customs Bus Terminal' },
    basePriceRwf: 5000, basePriceUgx: 15000, basePriceKes: 500, basePriceUsd: 5, basePriceSsp: 50000, durationMinutes: 240
  },
];

export async function GET() {
  return NextResponse.json({ success: true, routes: ALL_21_ROUTES });
}
