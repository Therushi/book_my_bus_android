import {queryAll, queryOne, executeSql} from '../DatabaseService';
import {Seat} from '@/models/types';
import {generateId, now} from '@/utils/helpers';
import dayjs from 'dayjs';

export const SeatRepository = {
  findByTrip: (tripId: string) =>
    queryAll<Seat>(
      'SELECT * FROM seats WHERE trip_id = ? ORDER BY seat_number',
      [tripId],
    ),

  findById: (id: string) =>
    queryOne<Seat>('SELECT * FROM seats WHERE id = ?', [id]),

  findAvailable: (tripId: string) =>
    queryAll<Seat>(
      `SELECT * FROM seats WHERE trip_id = ? AND is_booked = 0
       AND (locked_until IS NULL OR locked_until < ?)
       ORDER BY seat_number`,
      [tripId, now()],
    ),

  lockSeats: async (seatIds: string[]): Promise<void> => {
    const lockUntil = dayjs().add(10, 'minute').format('YYYY-MM-DD HH:mm:ss');
    for (const id of seatIds) {
      await executeSql(
        'UPDATE seats SET locked_until = ? WHERE id = ? AND is_booked = 0',
        [lockUntil, id],
      );
    }
  },

  unlockSeats: async (seatIds: string[]): Promise<void> => {
    for (const id of seatIds) {
      await executeSql(
        'UPDATE seats SET locked_until = NULL WHERE id = ?',
        [id],
      );
    }
  },

  bookSeats: async (seatIds: string[]): Promise<void> => {
    for (const id of seatIds) {
      await executeSql(
        'UPDATE seats SET is_booked = 1, locked_until = NULL WHERE id = ?',
        [id],
      );
    }
  },

  releaseSeats: async (seatIds: string[]): Promise<void> => {
    for (const id of seatIds) {
      await executeSql(
        'UPDATE seats SET is_booked = 0, locked_until = NULL WHERE id = ?',
        [id],
      );
    }
  },

  createSeatsForTrip: async (tripId: string, totalSeats: number): Promise<void> => {
    const seatTypes = ['window', 'aisle', 'aisle', 'window'];
    for (let i = 1; i <= totalSeats; i++) {
      const seatNum = `${Math.ceil(i / 4)}${String.fromCharCode(64 + ((i - 1) % 4 + 1))}`;
      const seatType = seatTypes[(i - 1) % 4];
      await executeSql(
        'INSERT INTO seats (id, trip_id, seat_number, seat_type, is_booked) VALUES (?,?,?,?,?)',
        [generateId(), tripId, seatNum, seatType, 0],
      );
    }
  },

  countBooked: async (tripId: string): Promise<number> => {
    const r = await queryOne<{cnt: number}>(
      'SELECT COUNT(*) as cnt FROM seats WHERE trip_id = ? AND is_booked = 1',
      [tripId],
    );
    return r?.cnt || 0;
  },
};
