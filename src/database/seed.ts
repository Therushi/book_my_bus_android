import {executeSql, queryOne} from './DatabaseService';
import {hashPassword} from '@/utils/hash';
import {generateId} from '@/utils/helpers';

/**
 * Seeds the database with demo data if it hasn't been seeded yet.
 * Safe to call multiple times — checks if admin user already exists.
 */
export const seedDatabase = async (): Promise<void> => {
  // Check if already seeded
  const existing = await queryOne<{id: string}>(
    "SELECT id FROM users WHERE email = ?",
    ['admin@bookmybus.com'],
  );
  if (existing) {
    return; // Already seeded
  }

  // ─── Users ───────────────────────────────────────────
  const adminId = generateId();
  const operatorId = generateId();
  const passengerId = generateId();

  await executeSql(
    'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?,?,?,?,?,?)',
    [adminId, 'Admin User', 'admin@bookmybus.com', hashPassword('admin123'), 'admin', '+91-9000000001'],
  );
  await executeSql(
    'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?,?,?,?,?,?)',
    [operatorId, 'Raj Transport', 'operator@bookmybus.com', hashPassword('operator123'), 'operator', '+91-9000000002'],
  );
  await executeSql(
    'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?,?,?,?,?,?)',
    [passengerId, 'Rushi Patel', 'passenger@bookmybus.com', hashPassword('passenger123'), 'passenger', '+91-9000000003'],
  );

  // ─── Buses ───────────────────────────────────────────
  const bus1Id = generateId();
  const bus2Id = generateId();
  const bus3Id = generateId();

  await executeSql(
    'INSERT INTO buses (id, operator_id, name, number_plate, total_seats, bus_type, amenities, status) VALUES (?,?,?,?,?,?,?,?)',
    [bus1Id, operatorId, 'Royal Cruiser', 'GJ-01-AB-1234', 40, 'AC', '["WiFi","Charging","Blanket"]', 'active'],
  );
  await executeSql(
    'INSERT INTO buses (id, operator_id, name, number_plate, total_seats, bus_type, amenities, status) VALUES (?,?,?,?,?,?,?,?)',
    [bus2Id, operatorId, 'Night Rider', 'GJ-05-CD-5678', 36, 'Sleeper', '["Charging","Water Bottle"]', 'active'],
  );
  await executeSql(
    'INSERT INTO buses (id, operator_id, name, number_plate, total_seats, bus_type, amenities, status) VALUES (?,?,?,?,?,?,?,?)',
    [bus3Id, operatorId, 'City Express', 'MH-12-EF-9012', 44, 'Non-AC', '["Water Bottle"]', 'active'],
  );

  // ─── Routes ──────────────────────────────────────────
  const route1Id = generateId();
  const route2Id = generateId();
  const route3Id = generateId();

  await executeSql(
    'INSERT INTO routes (id, source, destination, stops, distance_km) VALUES (?,?,?,?,?)',
    [route1Id, 'Mumbai', 'Pune', '["Lonavala","Khandala"]', 150],
  );
  await executeSql(
    'INSERT INTO routes (id, source, destination, stops, distance_km) VALUES (?,?,?,?,?)',
    [route2Id, 'Ahmedabad', 'Surat', '["Vadodara","Bharuch"]', 265],
  );
  await executeSql(
    'INSERT INTO routes (id, source, destination, stops, distance_km) VALUES (?,?,?,?,?)',
    [route3Id, 'Delhi', 'Jaipur', '["Gurgaon","Neemrana"]', 280],
  );

  // ─── Trips ───────────────────────────────────────────
  const trip1Id = generateId();
  const trip2Id = generateId();
  const trip3Id = generateId();

  await executeSql(
    'INSERT INTO trips (id, bus_id, route_id, departure_time, arrival_time, fare, status, available_seats) VALUES (?,?,?,?,?,?,?,?)',
    [trip1Id, bus1Id, route1Id, '2026-03-05 08:00:00', '2026-03-05 11:30:00', 450, 'scheduled', 40],
  );
  await executeSql(
    'INSERT INTO trips (id, bus_id, route_id, departure_time, arrival_time, fare, status, available_seats) VALUES (?,?,?,?,?,?,?,?)',
    [trip2Id, bus2Id, route2Id, '2026-03-05 21:00:00', '2026-03-06 05:00:00', 850, 'scheduled', 36],
  );
  await executeSql(
    'INSERT INTO trips (id, bus_id, route_id, departure_time, arrival_time, fare, status, available_seats) VALUES (?,?,?,?,?,?,?,?)',
    [trip3Id, bus3Id, route3Id, '2026-03-06 06:00:00', '2026-03-06 11:00:00', 350, 'on_time', 44],
  );

  // ─── Seats for each trip ─────────────────────────────
  const seatTypes = ['window', 'aisle', 'aisle', 'window'];
  const generateSeats = async (tripId: string, count: number) => {
    for (let i = 1; i <= count; i++) {
      const seatNum = `${Math.ceil(i / 4)}${String.fromCharCode(64 + ((i - 1) % 4 + 1))}`;
      const seatType = seatTypes[(i - 1) % 4];
      await executeSql(
        'INSERT INTO seats (id, trip_id, seat_number, seat_type, is_booked) VALUES (?,?,?,?,?)',
        [generateId(), tripId, seatNum, seatType, 0],
      );
    }
  };

  await generateSeats(trip1Id, 40);
  await generateSeats(trip2Id, 36);
  await generateSeats(trip3Id, 44);
};
