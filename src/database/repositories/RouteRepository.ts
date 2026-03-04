import {queryAll, queryOne, executeSql} from '../DatabaseService';
import {Route} from '@/models/types';
import {generateId} from '@/utils/helpers';

export const RouteRepository = {
  getAll: () => queryAll<Route>('SELECT * FROM routes ORDER BY source'),

  findById: (id: string) =>
    queryOne<Route>('SELECT * FROM routes WHERE id = ?', [id]),

  search: (source: string, destination: string) =>
    queryAll<Route>(
      'SELECT * FROM routes WHERE LOWER(source) LIKE ? AND LOWER(destination) LIKE ?',
      [`%${source.toLowerCase()}%`, `%${destination.toLowerCase()}%`],
    ),

  create: async (data: Omit<Route, 'id' | 'created_at'>): Promise<Route> => {
    const id = generateId();
    await executeSql(
      'INSERT INTO routes (id, source, destination, stops, distance_km) VALUES (?,?,?,?,?)',
      [id, data.source, data.destination, data.stops || null, data.distance_km || null],
    );
    return (await RouteRepository.findById(id))!;
  },

  update: async (id: string, data: Partial<Route>): Promise<void> => {
    const fields: string[] = [];
    const values: any[] = [];
    const updatable = ['source', 'destination', 'stops', 'distance_km'] as const;
    for (const key of updatable) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
    if (fields.length === 0) return;
    values.push(id);
    await executeSql(`UPDATE routes SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete: (id: string) => executeSql('DELETE FROM routes WHERE id = ?', [id]),
};
