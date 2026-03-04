import {queryAll, queryOne, executeSql} from '../DatabaseService';
import {User} from '@/models/types';
import {hashPassword} from '@/utils/hash';
import {generateId} from '@/utils/helpers';

export const UserRepository = {
  findByEmail: (email: string) =>
    queryOne<User>('SELECT * FROM users WHERE email = ?', [email]),

  findById: (id: string) =>
    queryOne<User>('SELECT * FROM users WHERE id = ?', [id]),

  findByRole: (role: string) =>
    queryAll<User>('SELECT * FROM users WHERE role = ?', [role]),

  getAll: () => queryAll<User>('SELECT * FROM users ORDER BY created_at DESC'),

  create: async (
    name: string,
    email: string,
    password: string,
    role: string,
    phone?: string,
  ): Promise<User> => {
    const id = generateId();
    const password_hash = hashPassword(password);
    await executeSql(
      'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?,?,?,?,?,?)',
      [id, name, email, password_hash, role, phone || null],
    );
    return (await UserRepository.findById(id))!;
  },

  update: async (
    id: string,
    data: Partial<Pick<User, 'name' | 'phone' | 'email'>>,
  ): Promise<void> => {
    const fields: string[] = [];
    const values: any[] = [];
    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.phone !== undefined) {
      fields.push('phone = ?');
      values.push(data.phone);
    }
    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (fields.length === 0) return;
    values.push(id);
    await executeSql(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete: (id: string) => executeSql('DELETE FROM users WHERE id = ?', [id]),

  countByRole: async (role: string): Promise<number> => {
    const result = await queryOne<{cnt: number}>(
      'SELECT COUNT(*) as cnt FROM users WHERE role = ?',
      [role],
    );
    return result?.cnt || 0;
  },
};
