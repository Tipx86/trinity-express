export type UserRole = 'USER' | 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  nationality?: string | null;
  idNumber?: string | null;
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  code: string;
  country: string;
  countryCode: string;
  terminalName: string;
  address?: string | null;
  image: string;
  description: string;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface Route {
  id: string;
  originId: string;
  destinationId: string;
  distanceKm: number;
  durationMinutes: number;
  basePriceRwf: number;
  basePriceUgx: number;
  basePriceKes: number;
  basePriceUsd: number;
  basePriceSsp?: number;
  stops?: string | null;
  isActive: boolean;
  origin: Destination;
  destination: Destination;
}

export type BusType = 'VIP_EXECUTIVE' | 'LUXURY_COACH' | 'STANDARD_EXPRESS';

export interface Bus {
  id: string;
  plateNumber: string;
  busModel: string;
  busType: BusType;
  seatCount: number;
  seatLayout: string; // '2x2' | '2x1'
  amenities: string;
  isActive: boolean;
}

export type TripStatus = 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';

export interface Trip {
  id: string;
  routeId: string;
  busId: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  priceRwf: number;
  priceUgx: number;
  priceKes: number;
  priceUsd: number;
  priceSsp?: number;
  status: TripStatus;
  route: Route;
  bus: Bus;
  availableSeats?: number;
  occupiedSeats?: number[];
  lockedSeats?: number[];
}

export type SeatStatus = 'available' | 'selected' | 'reserved' | 'occupied';

export interface Seat {
  number: number;
  row: number;
  col: number; // 1, 2, 3, 4
  status: SeatStatus;
  price: number;
  isWindow: boolean;
  isVip?: boolean;
}

export interface PassengerInput {
  seatNumber: number;
  fullName: string;
  nationality: string;
  idPassportNumber: string;
  phone?: string;
  email?: string;
  emergencyContact?: string;
}

export type PaymentMethod = 'MPESA' | 'AIRTEL_MONEY' | 'CARD' | 'BANK';

export interface BookingCreationPayload {
  tripId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  currency: 'RWF' | 'UGX' | 'KES' | 'USD' | 'SSP';
  selectedSeats: number[];
  passengers: PassengerInput[];
  paymentMethod: PaymentMethod;
  paymentDetails: {
    phoneNumber?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
    cardHolder?: string;
  };
  sessionId: string;
}

export interface BookingResponse {
  id: string;
  bookingRef: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  currency: string;
  trip: Trip;
  passengers: {
    id: string;
    seatNumber: number;
    fullName: string;
    nationality: string;
    idPassportNumber: string;
    ticketNumber: string;
    ticket?: {
      id: string;
      ticketNumber: string;
      qrData: string;
      securityToken: string;
      status: string;
    };
  }[];
  payment?: {
    transactionRef: string;
    amount: number;
    currency: string;
    provider: string;
    status: string;
  };
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  category: string;
  logoUrl?: string | null;
  description?: string | null;
  websiteUrl?: string | null;
  order: number;
  isActive: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}
