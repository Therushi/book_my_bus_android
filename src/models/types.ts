// ─── Enums ───────────────────────────────────────────────

export type UserRole = 'admin' | 'operator' | 'passenger';

export type BusType = 'AC' | 'Non-AC' | 'Sleeper' | 'Semi-Sleeper';

export type BusStatus = 'active' | 'inactive';

export type TripStatus =
  | 'scheduled'
  | 'on_time'
  | 'delayed'
  | 'departed'
  | 'cancelled';

export type SeatType = 'window' | 'aisle' | 'middle';

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export type PaymentStatus = 'success' | 'failed' | 'pending';

export type PaymentMethod = 'mock_upi' | 'mock_card' | 'mock_wallet';

// ─── Models ──────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  phone?: string;
  created_at: string;
}

export interface Bus {
  id: string;
  operator_id: string;
  name: string;
  number_plate: string;
  total_seats: number;
  bus_type: BusType;
  amenities?: string; // JSON array string
  status: BusStatus;
  created_at: string;
}

export interface Route {
  id: string;
  source: string;
  destination: string;
  stops?: string; // JSON array string
  distance_km?: number;
  created_at: string;
}

export interface Trip {
  id: string;
  bus_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  fare: number;
  status: TripStatus;
  available_seats: number;
  created_at: string;
  // Joined fields (optional, populated by queries)
  bus_name?: string;
  bus_type?: BusType;
  number_plate?: string;
  source?: string;
  destination?: string;
  operator_name?: string;
}

export interface Seat {
  id: string;
  trip_id: string;
  seat_number: string;
  seat_type: SeatType;
  is_booked: number; // 0 or 1 (SQLite boolean)
  locked_until?: string;
}

export interface Booking {
  id: string;
  passenger_id: string;
  trip_id: string;
  seat_ids: string; // JSON array of seat IDs
  total_fare: number;
  status: BookingStatus;
  booking_date: string;
  passenger_name?: string;
  passenger_phone?: string;
  // Joined fields
  source?: string;
  destination?: string;
  departure_time?: string;
  arrival_time?: string;
  bus_name?: string;
  trip_status?: TripStatus;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paid_at?: string;
}

// ─── Navigation param types ──────────────────────────────

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  AdminTabs: undefined;
  OperatorTabs: undefined;
  PassengerTabs: undefined;
  ManageBuses: undefined;
  ManageRoutes: undefined;
  ManageOperators: undefined;
  ManageTrips: undefined;
  TripDetails: { tripId: string };
  SearchBuses: undefined;
  TripResults: { source: string; destination: string; date?: string };
  SeatSelection: { tripId: string };
  BookingConfirmation: { bookingId: string };
  PaymentScreen: { bookingId: string };
  TicketScreen: { bookingId: string };
  AdminBookings: undefined;
  OperatorBookings: undefined;
  ReportsScreen: undefined;
  ProfileScreen: undefined;
  BookingHistory: undefined;
  PromoPoliciesScreen: { title: string; type: string };
};
