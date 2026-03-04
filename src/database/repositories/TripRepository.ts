import {queryAll, queryOne, executeSql} from '../DatabaseService';
import {Trip} from '@/models/types';
import {generateId} from '@/utils/helpers';

export const TripRepository = {
  getAll: () =>
    queryAll<Trip>(`
      SELECT t.*, b.name as bus_name, b.bus_type, b.number_plate,
             r.source, r.destination, u.name as operator_name
      FROM trips t
      JOIN buses b ON t.bus_id = b.id
      JOIN routes r ON t.route_id = r.id
      LEFT JOIN users u ON b.operator_id = u.id
      ORDER BY t.departure_time DESC
    `),

  findById: (id: string) =>
    queryOne<Trip>(
      `SELECT t.*, b.name as bus_name, b.bus_type, b.number_plate,
              r.source, r.destination, u.name as operator_name
       FROM trips t
       JOIN buses b ON t.bus_id = b.id
       JOIN routes r ON t.route_id = r.id
       LEFT JOIN users u ON b.operator_id = u.id
       WHERE t.id = ?`,
      [id],
    ),

  searchTrips: (source: string, destination: string) =>
    queryAll<Trip>(
      `SELECT t.*, b.name as bus_name, b.bus_type, b.number_plate,
              r.source, r.destination
       FROM trips t
       JOIN buses b ON t.bus_id = b.id
       JOIN routes r ON t.route_id = r.id
       WHERE LOWER(r.source) LIKE ? AND LOWER(r.destination) LIKE ?
         AND t.status != 'cancelled' AND t.available_seats > 0
       ORDER BY t.departure_time ASC`,
      [`%${source.toLowerCase()}%`, `%${destination.toLowerCase()}%`],
    ),

  findByOperator: (operatorId: string) =>
    queryAll<Trip>(
      `SELECT t.*, b.name as bus_name, b.bus_type, b.number_plate,
              r.source, r.destination
       FROM trips t
       JOIN buses b ON t.bus_id = b.id
       JOIN routes r ON t.route_id = r.id
       WHERE b.operator_id = ?
       ORDER BY t.departure_time DESC`,
      [operatorId],
    ),

  create: async (data: Omit<Trip, 'id' | 'created_at' | 'bus_name' | 'bus_type' | 'number_plate' | 'source' | 'destination' | 'operator_name'>): Promise<Trip> => {
    const id = generateId();
    await executeSql(
      'INSERT INTO trips (id, bus_id, route_id, departure_time, arrival_time, fare, status, available_seats) VALUES (?,?,?,?,?,?,?,?)',
      [id, data.bus_id, data.route_id, data.departure_time, data.arrival_time, data.fare, data.status || 'scheduled', data.available_seats],
    );
    return (await TripRepository.findById(id))!;
  },

  updateStatus: (id: string, status: string) =>
    executeSql('UPDATE trips SET status = ? WHERE id = ?', [status, id]),

  updateAvailableSeats: (id: string, count: number) =>
    executeSql('UPDATE trips SET available_seats = ? WHERE id = ?', [count, id]),

  delete: (id: string) => executeSql('DELETE FROM trips WHERE id = ?', [id]),

  countByStatus: async (status: string): Promise<number> => {
    const r = await queryOne<{cnt: number}>(
      'SELECT COUNT(*) as cnt FROM trips WHERE status = ?',
      [status],
    );
    return r?.cnt || 0;
  },

  getUpcoming: () =>
    queryAll<Trip>(
      `SELECT t.*, b.name as bus_name, b.bus_type, b.number_plate,
              r.source, r.destination
       FROM trips t
       JOIN buses b ON t.bus_id = b.id
       JOIN routes r ON t.route_id = r.id
       WHERE t.status IN ('scheduled','on_time','delayed')
       ORDER BY t.departure_time ASC
       LIMIT 20`,
    ),
};
