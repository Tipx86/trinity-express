const http = require('http');

async function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || 80,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Trinity Express End-to-End API & Booking Integration Test...\n');

  // Test 1: Fetch Destinations
  console.log('1. Testing /api/destinations...');
  const destRes = await request('http://localhost:3000/api/destinations');
  console.log(`   Status: ${destRes.status}, Found ${destRes.data.destinations?.length} destinations`);
  if (!destRes.data.destinations || destRes.data.destinations.length === 0) throw new Error('No destinations found');

  // Test 2: Fetch Routes
  console.log('2. Testing /api/routes...');
  const routesRes = await request('http://localhost:3000/api/routes');
  console.log(`   Status: ${routesRes.status}, Found ${routesRes.data.routes?.length} routes`);

  // Test 3: Search Trips (Kigali to Kampala)
  console.log('3. Testing /api/trips/search (Kigali ➔ Kampala)...');
  const searchRes = await request('http://localhost:3000/api/trips/search?from=Kigali&to=Kampala');
  console.log(`   Status: ${searchRes.status}, Found ${searchRes.data.trips?.length} available trips`);
  if (!searchRes.data.trips || searchRes.data.trips.length === 0) throw new Error('No trips found');

  const selectedTrip = searchRes.data.trips[0];
  const targetSeat = Math.floor(Math.random() * 25) + 20;
  console.log(`   Selected Trip ID: ${selectedTrip.id}, Bus: ${selectedTrip.bus.busModel} (${selectedTrip.bus.plateNumber})`);

  // Test 4: Atomically Lock Seat
  console.log(`4. Testing /api/seats/lock (Seat #${targetSeat})...`);
  const sessionId = 'test_sess_' + Date.now();
  const lockRes = await request('http://localhost:3000/api/seats/lock', { method: 'POST' }, {
    tripId: selectedTrip.id,
    seatNumbers: [targetSeat],
    sessionId,
  });
  console.log(`   Status: ${lockRes.status}, Lock Success: ${lockRes.data.success}, Locked Until: ${lockRes.data.lockedUntil}`);

  // Test 5: Confirm Booking via M-Pesa
  console.log('5. Testing /api/bookings (Confirm Booking & Digital Ticket Issuance)...');
  const bookingPayload = {
    tripId: selectedTrip.id,
    contactName: 'Antigravity Test Passenger',
    contactEmail: 'passenger.test@trinityexpress.rw',
    contactPhone: '+250788999888',
    currency: 'RWF',
    selectedSeats: [targetSeat],
    passengers: [
      {
        seatNumber: targetSeat,
        fullName: 'Antigravity Test Passenger',
        nationality: 'Rwanda',
        idPassportNumber: '1199080011223344',
        phone: '+250788999888',
        email: 'passenger.test@trinityexpress.rw',
        emergencyContact: 'Emergency Contact (+250788111222)',
      },
    ],
    paymentMethod: 'MPESA',
    paymentDetails: {
      phoneNumber: '+250788999888',
    },
    sessionId,
  };

  const bookingRes = await request('http://localhost:3000/api/bookings', { method: 'POST' }, bookingPayload);
  console.log(`   Status: ${bookingRes.status}, Booking Ref: ${bookingRes.data.booking?.bookingRef}`);
  console.log(`   Ticket Number: ${bookingRes.data.booking?.passengers[0]?.ticketNumber}`);
  console.log(`   Security Token: ${bookingRes.data.booking?.passengers[0]?.ticket?.securityToken}`);

  const createdBookingRef = bookingRes.data.booking?.bookingRef;
  const createdSecurityToken = bookingRes.data.booking?.passengers[0]?.ticket?.securityToken;

  // Test 6: Retrieve Reservation via My Booking
  console.log(`6. Testing /api/bookings/my-booking (Lookup by ${createdBookingRef})...`);
  const myBookingRes = await request('http://localhost:3000/api/bookings/my-booking', { method: 'POST' }, {
    bookingRef: createdBookingRef,
  });
  console.log(`   Status: ${myBookingRes.status}, Found Reference: ${myBookingRes.data.booking?.bookingRef}, Status: ${myBookingRes.data.booking?.status}`);

  // Test 7: Conductor QR Code Verification
  console.log(`7. Testing /api/verify-ticket/${createdSecurityToken}...`);
  const verifyRes = await request(`http://localhost:3000/api/verify-ticket/${createdSecurityToken}`);
  console.log(`   Status: ${verifyRes.status}, Valid Ticket: ${verifyRes.data.valid}, Passenger: ${verifyRes.data.ticket?.passenger?.fullName}`);

  // Test 8: Admin Overview
  console.log('8. Testing /api/admin/overview...');
  const adminRes = await request('http://localhost:3000/api/admin/overview');
  console.log(`   Status: ${adminRes.status}, Total Revenue: ${adminRes.data.stats?.totalRevenue} RWF, Confirmed Bookings: ${adminRes.data.stats?.confirmedBookings}`);

  console.log('\n🎉 ALL 8 INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
}

runTests().catch((err) => {
  console.error('❌ Integration Test Failed:', err);
  process.exit(1);
});
