import {queryAll, queryOne, executeSql} from '../DatabaseService';
import {Booking} from '@/models/types';
import {generateId} from '@/utils/helpers';

export const BookingRepository = {
  findById: (id: string) =>
    queryOne<Booking>(
      `SELECT bk.*, r.source, r.destination, t.departure_time, t.arrival_time,
              b.name as bus_name, t.status as trip_status
       FROM bookings bk
       JOIN trips t ON bk.trip_id = t.id
       JOIN buses b ON t.bus_id = b.id
       JOIN routes r ON t.route_id = r.id
       WHERE bk.id = ?`,
      [id],
    ),

  findByPassenger: (passengerId: string) =>
    queryAll<Booking>(
      `SELECT bk.*, r.source, r.destination, t.departure_time, t.arrival_time,
              b.name as bus_name, t.status as trip_status
       FROM bookings bk
       JOIN trips t ON bk.trip_id = t.id
       JOIN buses b ON t.bus_id = b.id
       JOIN routes r ON t.route_id = r.id
       WHERE bk.passenger_id = ?
       ORDER BY bk.booking_date DESC`,
      [passengerId],
    ),

  findByTrip: (tripId: string) =>
    queryAll<Booking>(
      `SELECT bk.*, u.name as passenger_name, u.phone as passenger_phone
       FROM bookings bk
       JOIN users u ON bk.passenger_id = u.id
       WHERE bk.trip_id = ?
       ORDER BY bk.booking_date DESC`,
      [tripId],
    ),

  getAll: () =>
    queryAll<Booking>(
      `SELECT bk.*, r.source, r.destination, t.departure_time, t.arrival_time,
              b.name as bus_name, t.status as trip_status
       FROM bookings bk
       JOIN trips t ON bk.trip_id = t.id
       JOIN buses b ON t.bus_id = b.id
       JOIN routes r ON t.route_id = r.id
       ORDER BY bk.booking_date DESC`,
    ),

  create: async (data: {
    passenger_id: string;
    trip_id: string;
    seat_ids: string[];
    total_fare: number;
    passenger_name?: string;
    passenger_phone?: string;
  }): Promise<Booking> => {
    const id = generateId();
    await executeSql(
      'INSERT INTO bookings (id, passenger_id, trip_id, seat_ids, total_fare, status, passenger_name, passenger_phone) VALUES (?,?,?,?,?,?,?,?)',
      [
        id,
        data.passenger_id,
        data.trip_id,
        JSON.stringify(data.seat_ids),
        data.total_fare,
        'confirmed',
        data.passenger_name || null,
        data.passenger_phone || null,
      ],
    );
    return (await BookingRepository.findById(id))!;
  },

  cancel: async (id: string): Promise<void> => {
    await executeSql(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
      [id],
    );
  },

  totalCount: async (): Promise<number> => {
    const r = await queryOne<{cnt: number}>('SELECT COUNT(*) as cnt FROM bookings');
    return r?.cnt || 0;
  },

  totalRevenue: async (): Promise<number> => {
    const r = await queryOne<{total: number}>(
      "SELECT COALESCE(SUM(total_fare), 0) as total FROM bookings WHERE status = 'confirmed'",
    );
    return r?.total || 0;
  },

  countByDate: () =>
    queryAll<{date: string; count: number}>(
      `SELECT DATE(booking_date) as date, COUNT(*) as count
       FROM bookings
       GROUP BY DATE(booking_date)
       ORDER BY date DESC
       LIMIT 30`,
    ),

  revenueByRoute: () =>
    queryAll<{route: string; revenue: number}>(
      `SELECT (r.source || ' → ' || r.destination) as route,
              COALESCE(SUM(bk.total_fare), 0) as revenue
       FROM bookings bk
       JOIN trips t ON bk.trip_id = t.id
       JOIN routes r ON t.route_id = r.id
       WHERE bk.status = 'confirmed'
       GROUP BY r.id
       ORDER BY revenue DESC`,
    ),
};
