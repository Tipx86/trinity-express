const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function calculateArrivalTime(depTime, durationMinutes) {
  const [h, m] = depTime.split(':').map(Number);
  const totalMins = h * 60 + m + durationMinutes;
  const arrH = Math.floor((totalMins / 60) % 24);
  const arrM = totalMins % 60;
  return `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`;
}

async function main() {
  console.log('Seeding Trinity Express database with updated routes, prices and 3 daily departures...');

  // 1. Clear existing data
  await prisma.ticket.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.passenger.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seatLock.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.route.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  // 2. Admin User and Demo Customer
  const adminPasswordHash = await bcrypt.hash('Admin@Trinity2026!', 10);
  const userPasswordHash = await bcrypt.hash('Customer@2026!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@trinityexpress.rw',
      name: 'Trinity Operations Administrator',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+250 788 123 456',
      nationality: 'Rwanda',
      idNumber: '1199080012345678',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: 'kevin.mugisha@gmail.com',
      name: 'Kevin Mugisha',
      passwordHash: userPasswordHash,
      role: 'USER',
      phone: '+250 783 987 654',
      nationality: 'Rwanda',
      idNumber: '1199580023456789',
    },
  });

  console.log('Users created:', admin.email, demoUser.email);

  // 3. Destinations
  const destinationsData = [
    {
      name: 'Kigali',
      code: 'KGL',
      country: 'Rwanda',
      countryCode: 'RW',
      terminalName: 'Nyabugogo Bus Park Terminal 1',
      address: 'KN 1 Rd, Nyabugogo, Kigali, Rwanda',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
      description: 'The vibrant, clean capital of Rwanda. Modern terminal with VIP waiting lounge, cafe, and seamless check-in.',
      isPopular: true,
      sortOrder: 1,
    },
    {
      name: 'Kampala',
      code: 'KLA',
      country: 'Uganda',
      countryCode: 'UG',
      terminalName: 'Namayiba Bus Terminal (Kisenyi)',
      address: 'Rashid Khamis Rd, Old Kampala, Uganda',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      description: 'Uganda’s bustling commercial hub. Direct daily express connections via Gatuna/Katuna border.',
      isPopular: true,
      sortOrder: 2,
    },
    {
      name: 'Nairobi',
      code: 'NBO',
      country: 'Kenya',
      countryCode: 'KE',
      terminalName: 'River Road / Accra Rd Terminal',
      address: 'River Road / Accra Rd, Nairobi, Kenya',
      image: 'https://images.unsplash.com/photo-1609137144822-7773f3246eb3?auto=format&fit=crop&w=1200&q=80',
      description: 'East Africa’s premier economic powerhouse. Comfortable overnight and express luxury coach services.',
      isPopular: true,
      sortOrder: 3,
    },
    {
      name: 'Mbarara',
      code: 'MBR',
      country: 'Uganda',
      countryCode: 'UG',
      terminalName: 'Mbarara Central Bus Park',
      address: 'High Street, Mbarara, Western Uganda',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
      description: 'Prime stopover hub along the Kigali–Kampala highway with fast passenger embarkation.',
      isPopular: true,
      sortOrder: 4,
    },
    {
      name: 'Busia',
      code: 'BSA',
      country: 'Kenya / Uganda',
      countryCode: 'KE',
      terminalName: 'Busia Border Bus Terminal',
      address: 'Customs Way, Busia Border Post',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      description: 'Key cross-border commercial gateway connecting Kenya and Uganda trade corridors.',
      isPopular: true,
      sortOrder: 5,
    },
    {
      name: 'Goma',
      code: 'GMA',
      country: 'DR Congo',
      countryCode: 'CD',
      terminalName: 'Goma Grande Barrière Bus Terminal',
      address: 'Avenue du 4 Janvier, Goma, DR Congo',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
      description: 'Vibrant Eastern DRC commercial lake port connected to Rwanda and Uganda routes.',
      isPopular: true,
      sortOrder: 6,
    },
    {
      name: 'Mombasa',
      code: 'MBA',
      country: 'Kenya',
      countryCode: 'KE',
      terminalName: 'Mombasa Mwembe Tayari Terminal',
      address: 'Jomo Kenyatta Ave, Mwembe Tayari, Mombasa, Kenya',
      image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=1200&q=80',
      description: 'Historic coastal trade port and tourism capital connected by direct express VIP coaches.',
      isPopular: true,
      sortOrder: 7,
    },
    {
      name: 'Kisumu',
      code: 'KSM',
      country: 'Kenya',
      countryCode: 'KE',
      terminalName: 'Kisumu Central Bus Station',
      address: 'Oginga Odinga Rd, Kisumu, Kenya',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      description: 'Lake Victoria’s premier logistics hub connecting Western Kenya, Uganda, and Rwanda.',
      isPopular: true,
      sortOrder: 8,
    },
    {
      name: 'Juba',
      code: 'JUB',
      country: 'South Sudan',
      countryCode: 'SS',
      terminalName: 'Custom Market Bus Station',
      address: 'Customs Roundabout, Juba, South Sudan',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      description: 'Key northern corridor cross-border route connecting Kampala and Juba with dedicated escort services.',
      isPopular: true,
      sortOrder: 9,
    },
    {
      name: 'Bor',
      code: 'BOR',
      country: 'South Sudan',
      countryCode: 'SS',
      terminalName: 'Bor Central Bus Station',
      address: 'Main Commercial Area, Bor, Jonglei State, South Sudan',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      description: 'Strategic White Nile transit hub connecting Jonglei State with South Sudan capital Juba.',
      isPopular: false,
      sortOrder: 10,
    },
    {
      name: 'Musanze',
      code: 'MSZ',
      country: 'Rwanda',
      countryCode: 'RW',
      terminalName: 'Musanze Modern Bus Park',
      address: 'RN4 Highway, Musanze, Northern Province',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
      description: 'Gateway to Volcanoes National Park and connecting link to Cyanika border into Uganda.',
      isPopular: false,
      sortOrder: 11,
    },
  ];

  const createdDestinations = {};
  for (const d of destinationsData) {
    const dest = await prisma.destination.create({ data: d });
    createdDestinations[d.name] = dest;
  }

  console.log('Destinations created:', Object.keys(createdDestinations).length);

  // 4. Routes (All 21 routes specified by user)
  const routesData = [
    // 1. Kigali To Kampala RWF 38,000
    {
      originName: 'Kigali',
      destName: 'Kampala',
      distanceKm: 510,
      durationMinutes: 570, // 9h 30m
      basePriceRwf: 38000,
      basePriceUgx: 100000,
      basePriceKes: 4000,
      basePriceUsd: 28,
      basePriceSsp: 300000,
      stops: 'Gatuna/Katuna Border, Kabale, Mbarara, Masaka',
    },
    // 2. Kigali to Mbarara RWF 25,000
    {
      originName: 'Kigali',
      destName: 'Mbarara',
      distanceKm: 240,
      durationMinutes: 270, // 4h 30m
      basePriceRwf: 25000,
      basePriceUgx: 65000,
      basePriceKes: 2500,
      basePriceUsd: 18,
      basePriceSsp: 200000,
      stops: 'Gatuna/Katuna Border, Kabale, Ntungamo',
    },
    // 3. Kigali To Nairobi RWF 75,000
    {
      originName: 'Kigali',
      destName: 'Nairobi',
      distanceKm: 1150,
      durationMinutes: 1320, // 22h
      basePriceRwf: 75000,
      basePriceUgx: 200000,
      basePriceKes: 7500,
      basePriceUsd: 55,
      basePriceSsp: 600000,
      stops: 'Katuna Border, Mbarara, Kampala, Busia Border, Nakuru',
    },
    // 4. Kigali to Busia RWF 55,000
    {
      originName: 'Kigali',
      destName: 'Busia',
      distanceKm: 710,
      durationMinutes: 810, // 13h 30m
      basePriceRwf: 55000,
      basePriceUgx: 150000,
      basePriceKes: 5500,
      basePriceUsd: 40,
      basePriceSsp: 440000,
      stops: 'Katuna Border, Mbarara, Kampala, Jinja, Iganga',
    },
    // 5. Kampala to Kigali UGX 100,000
    {
      originName: 'Kampala',
      destName: 'Kigali',
      distanceKm: 510,
      durationMinutes: 570,
      basePriceRwf: 38000,
      basePriceUgx: 100000,
      basePriceKes: 4000,
      basePriceUsd: 28,
      basePriceSsp: 300000,
      stops: 'Masaka, Mbarara, Kabale, Katuna/Gatuna Border',
    },
    // 6. Kampala to Goma UGX 100,000
    {
      originName: 'Kampala',
      destName: 'Goma',
      distanceKm: 540,
      durationMinutes: 630, // 10h 30m
      basePriceRwf: 38000,
      basePriceUgx: 100000,
      basePriceKes: 4000,
      basePriceUsd: 28,
      basePriceSsp: 300000,
      stops: 'Mbarara, Kabale, Kisoro, Bunagana/Goma Border',
    },
    // 7. Kampala To Nairobi UGX 120,000
    {
      originName: 'Kampala',
      destName: 'Nairobi',
      distanceKm: 650,
      durationMinutes: 720, // 12h
      basePriceRwf: 45000,
      basePriceUgx: 120000,
      basePriceKes: 4000,
      basePriceUsd: 32,
      basePriceSsp: 360000,
      stops: 'Jinja, Iganga, Busia/Malaba Border, Eldoret, Nakuru',
    },
    // 8. Kampala to Juba UGX 150,000
    {
      originName: 'Kampala',
      destName: 'Juba',
      distanceKm: 650,
      durationMinutes: 780, // 13h
      basePriceRwf: 55000,
      basePriceUgx: 150000,
      basePriceKes: 5500,
      basePriceUsd: 40,
      basePriceSsp: 600000,
      stops: 'Luwero, Gulu, Elegu/Nimule Border',
    },
    // 9. Nairobi To Kigali KES 7,500
    {
      originName: 'Nairobi',
      destName: 'Kigali',
      distanceKm: 1150,
      durationMinutes: 1320,
      basePriceRwf: 75000,
      basePriceUgx: 200000,
      basePriceKes: 7500,
      basePriceUsd: 55,
      basePriceSsp: 600000,
      stops: 'Nakuru, Malaba/Busia Border, Jinja, Kampala, Mbarara, Gatuna',
    },
    // 10. Nairobi to Kampala KES 4,000
    {
      originName: 'Nairobi',
      destName: 'Kampala',
      distanceKm: 650,
      durationMinutes: 720,
      basePriceRwf: 40000,
      basePriceUgx: 120000,
      basePriceKes: 4000,
      basePriceUsd: 30,
      basePriceSsp: 320000,
      stops: 'Nakuru, Eldoret, Malaba/Busia Border, Iganga, Jinja',
    },
    // 11. Nairobi to Mombasa KES 2,100
    {
      originName: 'Nairobi',
      destName: 'Mombasa',
      distanceKm: 490,
      durationMinutes: 480, // 8h
      basePriceRwf: 21000,
      basePriceUgx: 60000,
      basePriceKes: 2100,
      basePriceUsd: 16,
      basePriceSsp: 170000,
      stops: 'Machakos Junction, Mtito Andei, Voi, Mariakani',
    },
    // 12. Nairobi to Kisumu KES 1,600
    {
      originName: 'Nairobi',
      destName: 'Kisumu',
      distanceKm: 350,
      durationMinutes: 390, // 6h 30m
      basePriceRwf: 16000,
      basePriceUgx: 45000,
      basePriceKes: 1600,
      basePriceUsd: 12,
      basePriceSsp: 130000,
      stops: 'Naivasha, Nakuru, Kericho, Awasi',
    },
    // 13. Mombasa to Kisumu KES 2,600
    {
      originName: 'Mombasa',
      destName: 'Kisumu',
      distanceKm: 840,
      durationMinutes: 840, // 14h
      basePriceRwf: 26000,
      basePriceUgx: 75000,
      basePriceKes: 2600,
      basePriceUsd: 20,
      basePriceSsp: 210000,
      stops: 'Voi, Mtito Andei, Nairobi Bypass, Nakuru, Kericho',
    },
    // 14. Mombasa to Nairobi KES 2,100
    {
      originName: 'Mombasa',
      destName: 'Nairobi',
      distanceKm: 490,
      durationMinutes: 480,
      basePriceRwf: 21000,
      basePriceUgx: 60000,
      basePriceKes: 2100,
      basePriceUsd: 16,
      basePriceSsp: 170000,
      stops: 'Mariakani, Voi, Mtito Andei, Machakos Junction',
    },
    // 15. Kisumu to Nairobi KES 1,600
    {
      originName: 'Kisumu',
      destName: 'Nairobi',
      distanceKm: 350,
      durationMinutes: 390,
      basePriceRwf: 16000,
      basePriceUgx: 45000,
      basePriceKes: 1600,
      basePriceUsd: 12,
      basePriceSsp: 130000,
      stops: 'Awasi, Kericho, Nakuru, Naivasha',
    },
    // 16. Busia to Kampala KES 2,000 / UGX 60,000
    {
      originName: 'Busia',
      destName: 'Kampala',
      distanceKm: 200,
      durationMinutes: 210, // 3h 30m
      basePriceRwf: 20000,
      basePriceUgx: 60000,
      basePriceKes: 2000,
      basePriceUsd: 15,
      basePriceSsp: 160000,
      stops: 'Bugiri, Iganga, Jinja, Mukono',
    },
    // 17. Kampala to Busia UGX 60,000 / KES 2,000
    {
      originName: 'Kampala',
      destName: 'Busia',
      distanceKm: 200,
      durationMinutes: 210,
      basePriceRwf: 20000,
      basePriceUgx: 60000,
      basePriceKes: 2000,
      basePriceUsd: 15,
      basePriceSsp: 160000,
      stops: 'Mukono, Jinja, Iganga, Bugiri',
    },
    // 18. Busia to Kigali KES 5,500 / RWF 55,000
    {
      originName: 'Busia',
      destName: 'Kigali',
      distanceKm: 710,
      durationMinutes: 810,
      basePriceRwf: 55000,
      basePriceUgx: 150000,
      basePriceKes: 5500,
      basePriceUsd: 40,
      basePriceSsp: 440000,
      stops: 'Iganga, Jinja, Kampala, Mbarara, Gatuna Border',
    },
    // 19. Juba to Kampala SSP 600,000
    {
      originName: 'Juba',
      destName: 'Kampala',
      distanceKm: 650,
      durationMinutes: 780,
      basePriceRwf: 55000,
      basePriceUgx: 150000,
      basePriceKes: 5500,
      basePriceUsd: 40,
      basePriceSsp: 600000,
      stops: 'Nimule/Elegu Border, Gulu, Luwero',
    },
    // 20. Juba to Bor SSP 50,000
    {
      originName: 'Juba',
      destName: 'Bor',
      distanceKm: 200,
      durationMinutes: 240, // 4h
      basePriceRwf: 5000,
      basePriceUgx: 15000,
      basePriceKes: 500,
      basePriceUsd: 4,
      basePriceSsp: 50000,
      stops: 'Mangalla, Pariak, Bor Town',
    },
    // 21. Bor to Juba SSP 50,000
    {
      originName: 'Bor',
      destName: 'Juba',
      distanceKm: 200,
      durationMinutes: 240,
      basePriceRwf: 5000,
      basePriceUgx: 15000,
      basePriceKes: 500,
      basePriceUsd: 4,
      basePriceSsp: 50000,
      stops: 'Pariak, Mangalla, Juba City',
    },
  ];

  const createdRoutes = [];
  for (const r of routesData) {
    const origin = createdDestinations[r.originName];
    const destination = createdDestinations[r.destName];
    if (!origin || !destination) {
      console.warn(`Skipping route ${r.originName} -> ${r.destName}: Destination missing.`);
      continue;
    }

    const route = await prisma.route.create({
      data: {
        originId: origin.id,
        destinationId: destination.id,
        distanceKm: r.distanceKm,
        durationMinutes: r.durationMinutes,
        basePriceRwf: r.basePriceRwf,
        basePriceUgx: r.basePriceUgx,
        basePriceKes: r.basePriceKes,
        basePriceUsd: r.basePriceUsd,
        basePriceSsp: r.basePriceSsp,
        stops: r.stops,
        isActive: true,
      },
      include: { origin: true, destination: true },
    });
    createdRoutes.push(route);
  }

  console.log('Routes created:', createdRoutes.length);

  // 5. Buses
  const busesData = [
    {
      plateNumber: 'RAD 782K',
      busModel: 'Scania Touring HD VIP (5AM Express)',
      busType: 'VIP_EXECUTIVE',
      seatCount: 44,
      seatLayout: '2x2',
      amenities: 'WIFI,USB,AC,WATER,TOILET,SNACKS,RECLINE_SEATS',
    },
    {
      plateNumber: 'RAC 459M',
      busModel: 'Marcopolo Paradiso G8 (2PM Express)',
      busType: 'LUXURY_COACH',
      seatCount: 48,
      seatLayout: '2x2',
      amenities: 'WIFI,USB,AC,WATER,RECLINE_SEATS',
    },
    {
      plateNumber: 'UBK 112L',
      busModel: 'Yutong ZK6122H VIP (8PM Night Express)',
      busType: 'VIP_EXECUTIVE',
      seatCount: 38,
      seatLayout: '2x1',
      amenities: 'WIFI,USB,AC,WATER,TOILET,TV,SNACKS',
    },
    {
      plateNumber: 'KDM 890P',
      busModel: 'Scania Irizar i6 Grand Class',
      busType: 'LUXURY_COACH',
      seatCount: 52,
      seatLayout: '2x2',
      amenities: 'WIFI,USB,AC,WATER',
    },
  ];

  const createdBuses = [];
  for (const b of busesData) {
    const bus = await prisma.bus.create({ data: b });
    createdBuses.push(bus);
  }

  console.log('Buses created:', createdBuses.length);

  // 6. Generate Trips for next 14 days
  // User Requirement: Each route daily has 3 buses leaving at 5:00 AM (05:00), 2:00 PM (14:00), and 8:00 PM (20:00).
  const departureTimes = ['05:00', '14:00', '20:00'];
  const today = new Date();
  const tripsData = [];

  for (let offset = 0; offset <= 14; offset++) {
    const tripDate = new Date(today);
    tripDate.setDate(today.getDate() + offset);
    const dateStr = tripDate.toISOString().split('T')[0];

    for (const route of createdRoutes) {
      for (let busIdx = 0; busIdx < departureTimes.length; busIdx++) {
        const depTime = departureTimes[busIdx];
        const arrTime = calculateArrivalTime(depTime, route.durationMinutes);
        const assignedBus = createdBuses[busIdx % createdBuses.length];

        tripsData.push({
          routeId: route.id,
          busId: assignedBus.id,
          departureDate: dateStr,
          departureTime: depTime,
          arrivalTime: arrTime,
          priceRwf: route.basePriceRwf,
          priceUgx: route.basePriceUgx,
          priceKes: route.basePriceKes,
          priceUsd: route.basePriceUsd,
          priceSsp: route.basePriceSsp,
          status: 'SCHEDULED',
        });
      }
    }
  }

  let createdTripsCount = 0;
  let sampleTripForSeedBooking = null;

  for (const t of tripsData) {
    const trip = await prisma.trip.create({ data: t });
    createdTripsCount++;
    if (!sampleTripForSeedBooking && t.departureDate === today.toISOString().split('T')[0] && t.departureTime === '05:00') {
      sampleTripForSeedBooking = trip;
    }
  }
  if (!sampleTripForSeedBooking) {
    sampleTripForSeedBooking = await prisma.trip.findFirst();
  }

  console.log(`Trips created: ${createdTripsCount} (3 daily buses per route across ${createdRoutes.length} routes)`);

  // 7. Seed a sample confirmed booking with tickets and payment
  if (sampleTripForSeedBooking) {
    const bookingRef = 'TE-894271';
    const sampleBooking = await prisma.booking.create({
      data: {
        bookingRef,
        userId: demoUser.id,
        tripId: sampleTripForSeedBooking.id,
        contactName: 'Kevin Mugisha',
        contactEmail: 'kevin.mugisha@gmail.com',
        contactPhone: '+250 783 987 654',
        totalAmount: sampleTripForSeedBooking.priceRwf * 2,
        currency: 'RWF',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        notes: 'East Africa Cross Border Travel',
      },
    });

    const p1 = await prisma.passenger.create({
      data: {
        bookingId: sampleBooking.id,
        seatNumber: 12,
        fullName: 'Kevin Mugisha',
        nationality: 'Rwanda',
        idPassportNumber: '1199580023456789',
        phone: '+250 783 987 654',
        email: 'kevin.mugisha@gmail.com',
        emergencyContact: 'Aline Mugisha (+250 788 555 123)',
        ticketNumber: `TKT-${bookingRef}-01`,
      },
    });

    const p2 = await prisma.passenger.create({
      data: {
        bookingId: sampleBooking.id,
        seatNumber: 13,
        fullName: 'Aline Mugisha',
        nationality: 'Rwanda',
        idPassportNumber: '1199880034567890',
        phone: '+250 788 555 123',
        email: 'aline.mugisha@gmail.com',
        emergencyContact: 'Kevin Mugisha (+250 783 987 654)',
        ticketNumber: `TKT-${bookingRef}-02`,
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: sampleBooking.id,
        transactionRef: 'MP-TX-89214710',
        amount: sampleBooking.totalAmount,
        currency: 'RWF',
        provider: 'MPESA',
        status: 'COMPLETED',
        phoneNumber: '+250783987654',
        rawResponse: JSON.stringify({ status: 'SUCCESS', method: 'M-Pesa STK Push Sandbox' }),
      },
    });

    await prisma.ticket.create({
      data: {
        ticketNumber: p1.ticketNumber,
        bookingId: sampleBooking.id,
        passengerId: p1.id,
        qrData: JSON.stringify({
          ticket: p1.ticketNumber,
          ref: bookingRef,
          passenger: p1.fullName,
          seat: p1.seatNumber,
          tripId: sampleTripForSeedBooking.id,
        }),
        securityToken: 'sec_tk_894271_p1_98a72b',
        status: 'VALID',
      },
    });

    await prisma.ticket.create({
      data: {
        ticketNumber: p2.ticketNumber,
        bookingId: sampleBooking.id,
        passengerId: p2.id,
        qrData: JSON.stringify({
          ticket: p2.ticketNumber,
          ref: bookingRef,
          passenger: p2.fullName,
          seat: p2.seatNumber,
          tripId: sampleTripForSeedBooking.id,
        }),
        securityToken: 'sec_tk_894271_p2_11b34c',
        status: 'VALID',
      },
    });

    console.log(`Sample booking created with reference: ${bookingRef}`);
  }

  // 8. Partners
  const partnersData = [
    {
      name: 'SONARWA General',
      category: 'INSURANCE',
      logoUrl: '/images/partners/sonarwa.png',
      description: 'Comprehensive passenger transit liability and travel accident coverage across Rwanda & East Africa.',
      websiteUrl: 'https://sonarwa.co.rw',
      order: 1,
    },
    {
      name: 'Zion Insurance Brokers',
      category: 'INSURANCE',
      logoUrl: '/images/partners/zion.png',
      description: 'Premier regional insurance brokerage safeguarding cross-border fleet operations and passenger security.',
      websiteUrl: 'https://zionbrokers.com',
      order: 2,
    },
    {
      name: 'RURA — Rwanda Utilities Regulatory Authority',
      category: 'REGULATOR',
      logoUrl: '/images/partners/rura.png',
      description: 'Regulating public road transport safety, cross-border standards, and consumer protection.',
      websiteUrl: 'https://rura.rw',
      order: 3,
    },
    {
      name: 'MTN Mobile Money Rwanda',
      category: 'PAYMENT',
      logoUrl: '/images/partners/momo.png',
      description: 'Instant MoMo cashless ticket payments for Rwandan passengers.',
      websiteUrl: 'https://mtn.co.rw',
      order: 4,
    },
    {
      name: 'Safaricom M-Pesa',
      category: 'PAYMENT',
      logoUrl: '/images/partners/mpesa.png',
      description: 'Seamless STK push and Paybill mobile payments across Kenya, Uganda, and Rwanda.',
      websiteUrl: 'https://safaricom.co.ke',
      order: 5,
    },
    {
      name: 'Airtel Money East Africa',
      category: 'PAYMENT',
      logoUrl: '/images/partners/airtel.png',
      description: 'Zero-fee mobile wallet transactions across cross-border transit corridors.',
      websiteUrl: 'https://airtel.africa',
      order: 6,
    },
  ];

  for (const p of partnersData) {
    await prisma.partner.create({ data: p });
  }

  console.log('Partners created:', partnersData.length);

  // 9. FAQs
  const faqsData = [
    {
      question: 'What travel documents do I need for cross-border trips?',
      answer: 'For cross-border journeys (e.g. Rwanda, Uganda, Kenya, DR Congo, or South Sudan), passengers must carry a valid Passport, East African National ID card (for EAC citizens between Rwanda, Uganda, Kenya), or Temporary Travel Permit issued by immigration, plus a valid Yellow Fever vaccination certificate.',
      category: 'BORDER_CROSSING',
      order: 1,
    },
    {
      question: 'How early should I arrive at the bus terminal before departure?',
      answer: 'We recommend arriving at least 45 minutes prior to scheduled departure. This allows sufficient time for baggage tagging, seat check-in, and pre-departure immigration briefing.',
      category: 'BOOKING',
      order: 2,
    },
    {
      question: 'What is the daily schedule for Trinity Express buses?',
      answer: 'Trinity Express operates 3 daily departures on all routes: Morning Bus (05:00 AM), Afternoon Bus (02:00 PM), and Night Express Bus (08:00 PM).',
      category: 'BOOKING',
      order: 3,
    },
    {
      question: 'What is the free luggage allowance per passenger?',
      answer: 'Each passenger is entitled to 1 standard suitcase or duffel bag (up to 20kg) to be stowed in the undercarriage luggage bay, plus 1 small personal cabin bag (up to 5kg) for the overhead bin.',
      category: 'LUGGAGE',
      order: 4,
    },
    {
      question: 'Can I select my preferred seat in advance?',
      answer: 'Yes! Trinity Express provides an interactive real-time visual seat map during online booking where you can choose your exact window, aisle, or VIP seat before checkout.',
      category: 'BOOKING',
      order: 5,
    },
    {
      question: 'Which payment methods are supported?',
      answer: 'We accept M-Pesa, Airtel Money, MTN MoMo, Visa, Mastercard, and direct WhatsApp agent booking confirmations. All transactions are protected by bank-grade encryption.',
      category: 'PAYMENT',
      order: 6,
    },
  ];

  for (const f of faqsData) {
    await prisma.faq.create({ data: f });
  }

  console.log('FAQs created:', faqsData.length);

  // 10. Site Settings & CMS
  const settingsData = [
    {
      key: 'SITE_NAME',
      value: 'Trinity Express',
      description: 'Main brand name',
      category: 'GENERAL',
    },
    {
      key: 'SITE_TAGLINE',
      value: 'Bus Tickets Across East Africa',
      description: 'Primary website tagline',
      category: 'GENERAL',
    },
    {
      key: 'HERO_HEADLINE',
      value: 'Search Trinity Express routes from Kigali to Kampala, Kigali to Nairobi, Kampala to Juba, and other trusted cross-border bus journeys.',
      description: 'Hero supporting headline',
      category: 'HOMEPAGE',
    },
    {
      key: 'CONTACT_PHONE_RW',
      value: '+250 788 123 456',
      description: 'Customer Support Rwanda',
      category: 'CONTACT',
    },
    {
      key: 'CONTACT_PHONE_UG',
      value: '+256 700 890 123',
      description: 'Customer Support Uganda',
      category: 'CONTACT',
    },
    {
      key: 'CONTACT_PHONE_KE',
      value: '+254 7146613385',
      description: 'Customer Support Kenya',
      category: 'CONTACT',
    },
    {
      key: 'CONTACT_EMAIL',
      value: 'support@trinityexpress.rw',
      description: 'Support email address',
      category: 'CONTACT',
    },
    {
      key: 'ANNOUNCEMENT_BANNER',
      value: '🌟 Daily VIP Express Service on all routes with 3 daily departures: 5:00 AM, 2:00 PM, and 8:00 PM!',
      description: 'Top header announcement banner text',
      category: 'HOMEPAGE',
    },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.create({ data: s });
  }

  console.log('Site settings created:', settingsData.length);
  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
