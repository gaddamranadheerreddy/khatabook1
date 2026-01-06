// // import * as SQLite from 'expo-sqlite';

// // let db: SQLite.SQLiteDatabase | null = null;

// // export async function initDatabase() {
// //   if (db) return db;

// //   db = await SQLite.openDatabaseAsync('khata.db');

// //   await db.execAsync(`
// //     PRAGMA journal_mode = WAL;

// //     CREATE TABLE IF NOT EXISTS people (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       name TEXT NOT NULL,
// //       phone TEXT,
// //       created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
// //     );

// //     CREATE TABLE IF NOT EXISTS transactions (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       person_id INTEGER NOT NULL,
// //       amount REAL NOT NULL,
// //       type TEXT NOT NULL CHECK(type IN ('credit', 'debit')),
// //       note TEXT,
// //       date INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
// //       created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
// //       FOREIGN KEY (person_id) REFERENCES people (id) ON DELETE CASCADE
// //     );

// //     CREATE INDEX IF NOT EXISTS idx_transactions_person_id ON transactions(person_id);
// //     CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
// //   `);

// //   return db;
// // }

// // export function getDatabase() {
// //   if (!db) {
// //     throw new Error('Database not initialized. Call initDatabase() first.');
// //   }
// //   return db;
// // }

// //---------1--------------

// //--------------2---------------
// // import * as SQLite from 'expo-sqlite';

// // let db: SQLite.SQLiteDatabase | null = null;

// // export async function initDatabase() {
// //   if (db) return db;

// //   db = await SQLite.openDatabaseAsync('khata.db');

// //   await db.execAsync(`
// //     PRAGMA journal_mode = WAL;

// //     -- 1. Companies table
// //     CREATE TABLE IF NOT EXISTS companies (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       name TEXT NOT NULL,
// //       note TEXT,
// //       created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
// //     );

// //     -- 2. People table (company_id added)
// //     CREATE TABLE IF NOT EXISTS people (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       company_id INTEGER,
// //       name TEXT NOT NULL,
// //       phone TEXT,
// //       created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
// //       FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
// //     );

// //     -- 3. Transactions table (unchanged)
// //     CREATE TABLE IF NOT EXISTS transactions (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       person_id INTEGER NOT NULL,
// //       amount REAL NOT NULL,
// //       type TEXT NOT NULL CHECK(type IN ('credit', 'debit')),
// //       note TEXT,
// //       date INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
// //       created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
// //       FOREIGN KEY (person_id) REFERENCES people (id) ON DELETE CASCADE
// //     );

// //     CREATE INDEX IF NOT EXISTS idx_people_company_id ON people(company_id);
// //     CREATE INDEX IF NOT EXISTS idx_transactions_person_id ON transactions(person_id);
// //     CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
// //   `);

// //   // 4. Ensure default company exists
// //   const result = await db.getFirstAsync<{ id: number }>(
// //     'SELECT id FROM companies ORDER BY id ASC LIMIT 1'
// //   );

// //   let defaultCompanyId = result?.id;

// //   if (!defaultCompanyId) {
// //     const insert = await db.runAsync(
// //       'INSERT INTO companies (name, note) VALUES (?, ?)',
// //       ['Default Company', 'Auto-created']
// //     );
// //     defaultCompanyId = insert.lastInsertRowId;
// //   }

// //   // 5. Migrate old people rows (company_id NULL → default company)
// //   await db.runAsync(
// //     'UPDATE people SET company_id = ? WHERE company_id IS NULL',
// //     [defaultCompanyId]
// //   );

// //   return db;
// // }

// // export function getDatabase() {
// //   if (!db) {
// //     throw new Error('Database not initialized. Call initDatabase() first.');
// //   }
// //   return db;
// // }

// //--------------2---------------

// //--------------3-------------------
// import * as SQLite from 'expo-sqlite';

// let db: SQLite.SQLiteDatabase | null = null;

// export async function initDatabase() {
//   if (db) return db;

//   db = await SQLite.openDatabaseAsync('khata.db');

//   await db.execAsync(`
//     PRAGMA journal_mode = WAL;

//     /* =========================
//        COMPANIES
//     ========================== */
//     CREATE TABLE IF NOT EXISTS companies (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       note TEXT,
//       created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
//     );

//     /* =========================
//        PEOPLE (with company_id)
//     ========================== */
//     CREATE TABLE IF NOT EXISTS people (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       company_id INTEGER NOT NULL,
//       name TEXT NOT NULL,
//       phone TEXT,
//       created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
//       FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//     );

//     /* =========================
//        TRANSACTIONS
//     ========================== */
//     CREATE TABLE IF NOT EXISTS transactions (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       person_id INTEGER NOT NULL,
//       amount REAL NOT NULL,
//       type TEXT NOT NULL CHECK(type IN ('credit','debit')),
//       note TEXT,
//       date INTEGER NOT NULL DEFAULT (strftime('%s','now')),
//       created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
//       FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
//     );

//     CREATE INDEX IF NOT EXISTS idx_people_company_id ON people(company_id);
//     CREATE INDEX IF NOT EXISTS idx_transactions_person_id ON transactions(person_id);
//     CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
//   `);

//   /* =========================
//      CREATE DEFAULT COMPANY
//   ========================== */
//   const result = await db.getFirstAsync<{ count: number }>(`
//     SELECT COUNT(*) as count FROM companies
//   `);

//   if (result?.count === 0) {
//     await db.runAsync(
//       `INSERT INTO companies (name, note) VALUES (?, ?)`,
//       ['My Business', 'Default company']
//     );
//   }

//   return db;
// }

// export function getDatabase() {
//   if (!db) {
//     throw new Error('Database not initialized. Call initDatabase() first.');
//   }
//   return db;
// }

// //------------------3----------------