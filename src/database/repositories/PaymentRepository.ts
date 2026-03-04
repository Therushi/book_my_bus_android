import {queryAll, queryOne, executeSql} from '../DatabaseService';
import {Payment} from '@/models/types';
import {generateId, now} from '@/utils/helpers';

export const PaymentRepository = {
  findById: (id: string) =>
    queryOne<Payment>('SELECT * FROM payments WHERE id = ?', [id]),

  findByBooking: (bookingId: string) =>
    queryOne<Payment>('SELECT * FROM payments WHERE booking_id = ?', [bookingId]),

  create: async (data: {
    booking_id: string;
    amount: number;
    method?: string;
  }): Promise<Payment> => {
    const id = generateId();
    await executeSql(
      'INSERT INTO payments (id, booking_id, amount, method, status) VALUES (?,?,?,?,?)',
      [id, data.booking_id, data.amount, data.method || 'mock_upi', 'pending'],
    );
    return (await PaymentRepository.findById(id))!;
  },

  markSuccess: async (id: string): Promise<void> => {
    await executeSql(
      "UPDATE payments SET status = 'success', paid_at = ? WHERE id = ?",
      [now(), id],
    );
  },

  markFailed: (id: string) =>
    executeSql("UPDATE payments SET status = 'failed' WHERE id = ?", [id]),

  getAll: () =>
    queryAll<Payment>('SELECT * FROM payments ORDER BY paid_at DESC'),
};
