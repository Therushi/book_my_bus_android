import SQLite, {
  SQLiteDatabase,
  ResultSet,
} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DATABASE_NAME = 'BookMyBus.db';

let db: SQLiteDatabase | null = null;

// ─── Open / Initialize ───────────────────────────────────

export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (db) {
    return db;
  }
  db = await SQLite.openDatabase({name: DATABASE_NAME, location: 'default'});
  await createTables(db);
  return db;
};

const createTables = async (database: SQLiteDatabase): Promise<void> => {
  await database.executeSql('PRAGMA foreign_keys = ON;');

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role          TEXT CHECK(role IN ('admin','operator','passenger')) NOT NULL,
      phone         TEXT,
      created_at    TEXT DEFAULT (datetime('now'))
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS buses (
      id            TEXT PRIMARY KEY,
      operator_id   TEXT REFERENCES users(id),
      name          TEXT NOT NULL,
      number_plate  TEXT UNIQUE NOT NULL,
      total_seats   INTEGER NOT NULL DEFAULT 40,
      bus_type      TEXT CHECK(bus_type IN ('AC','Non-AC','Sleeper','Semi-Sleeper')) DEFAULT 'AC',
      amenities     TEXT,
      status        TEXT CHECK(status IN ('active','inactive')) DEFAULT 'active',
      created_at    TEXT DEFAULT (datetime('now'))
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS routes (
      id            TEXT PRIMARY KEY,
      source        TEXT NOT NULL,
      destination   TEXT NOT NULL,
      stops         TEXT,
      distance_km   REAL,
      created_at    TEXT DEFAULT (datetime('now'))
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS trips (
      id              TEXT PRIMARY KEY,
      bus_id          TEXT REFERENCES buses(id),
      route_id        TEXT REFERENCES routes(id),
      departure_time  TEXT NOT NULL,
      arrival_time    TEXT NOT NULL,
      fare            REAL NOT NULL,
      status          TEXT CHECK(status IN ('scheduled','on_time','delayed','departed','cancelled')) DEFAULT 'scheduled',
      available_seats INTEGER NOT NULL,
      created_at      TEXT DEFAULT (datetime('now'))
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS seats (
      id          TEXT PRIMARY KEY,
      trip_id     TEXT REFERENCES trips(id),
      seat_number TEXT NOT NULL,
      seat_type   TEXT CHECK(seat_type IN ('window','aisle','middle')) DEFAULT 'aisle',
      is_booked   INTEGER DEFAULT 0,
      locked_until TEXT,
      UNIQUE(trip_id, seat_number)
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS bookings (
      id              TEXT PRIMARY KEY,
      passenger_id    TEXT REFERENCES users(id),
      trip_id         TEXT REFERENCES trips(id),
      seat_ids        TEXT NOT NULL,
      total_fare      REAL NOT NULL,
      status          TEXT CHECK(status IN ('confirmed','cancelled','completed')) DEFAULT 'confirmed',
      booking_date    TEXT DEFAULT (datetime('now')),
      passenger_name  TEXT,
      passenger_phone TEXT
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS payments (
      id          TEXT PRIMARY KEY,
      booking_id  TEXT REFERENCES bookings(id),
      amount      REAL NOT NULL,
      method      TEXT DEFAULT 'mock_upi',
      status      TEXT CHECK(status IN ('success','failed','pending')) DEFAULT 'pending',
      paid_at     TEXT
    );
  `);
};

// ─── Generic query helpers ───────────────────────────────

export const executeSql = async (
  sql: string,
  params: any[] = [],
): Promise<ResultSet> => {
  const database = await getDatabase();
  const [result] = await database.executeSql(sql, params);
  return result;
};

export const queryAll = async <T>(
  sql: string,
  params: any[] = [],
): Promise<T[]> => {
  const result = await executeSql(sql, params);
  const rows: T[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    rows.push(result.rows.item(i) as T);
  }
  return rows;
};

export const queryOne = async <T>(
  sql: string,
  params: any[] = [],
): Promise<T | null> => {
  const result = await executeSql(sql, params);
  if (result.rows.length > 0) {
    return result.rows.item(0) as T;
  }
  return null;
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
  }
};
