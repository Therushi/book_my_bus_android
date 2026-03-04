import {queryAll, queryOne, executeSql} from '../DatabaseService';
import {Bus} from '@/models/types';
import {generateId} from '@/utils/helpers';

export const BusRepository = {
  getAll: () => queryAll<Bus>('SELECT * FROM buses ORDER BY created_at DESC'),

  findById: (id: string) =>
    queryOne<Bus>('SELECT * FROM buses WHERE id = ?', [id]),

  findByOperator: (operatorId: string) =>
    queryAll<Bus>('SELECT * FROM buses WHERE operator_id = ?', [operatorId]),

  getActive: () =>
    queryAll<Bus>("SELECT * FROM buses WHERE status = 'active' ORDER BY name"),

  create: async (data: Omit<Bus, 'id' | 'created_at'>): Promise<Bus> => {
    const id = generateId();
    await executeSql(
      'INSERT INTO buses (id, operator_id, name, number_plate, total_seats, bus_type, amenities, status) VALUES (?,?,?,?,?,?,?,?)',
      [
        id,
        data.operator_id,
        data.name,
        data.number_plate,
        data.total_seats,
        data.bus_type,
        data.amenities || null,
        data.status || 'active',
      ],
    );
    return (await BusRepository.findById(id))!;
  },

  update: async (id: string, data: Partial<Bus>): Promise<void> => {
    const fields: string[] = [];
    const values: any[] = [];
    const updatable = ['name', 'number_plate', 'total_seats', 'bus_type', 'amenities', 'status', 'operator_id'] as const;
    for (const key of updatable) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
    if (fields.length === 0) return;
    values.push(id);
    await executeSql(`UPDATE buses SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete: (id: string) => executeSql('DELETE FROM buses WHERE id = ?', [id]),

  countActive: async (): Promise<number> => {
    const r = await queryOne<{cnt: number}>(
      "SELECT COUNT(*) as cnt FROM buses WHERE status = 'active'",
    );
    return r?.cnt || 0;
  },
};
