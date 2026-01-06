// import { getDatabase } from './init';
// import {
//   Person,
//   Transaction,
//   PersonWithBalance,
//   TransactionInput,
//   PersonInput,
// } from './types';

// export async function addPerson(input: PersonInput): Promise<number> {
//   const db = getDatabase();
//   const result = await db.runAsync(
//     'INSERT INTO people (name, phone) VALUES (?, ?)',
//     [input.name, input.phone || null]
//   );
//   return result.lastInsertRowId;
// }

// export async function getAllPeople(): Promise<Person[]> {
//   const db = getDatabase();
//   const rows = await db.getAllAsync<Person>('SELECT * FROM people ORDER BY name ASC');
//   return rows;
// }

// export async function getPeopleWithBalances(): Promise<PersonWithBalance[]> {
//   const db = getDatabase();
//   const rows = await db.getAllAsync<PersonWithBalance>(`
//     SELECT
//       p.id,
//       p.name,
//       p.phone,
//       p.created_at,
//       COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) as total_credit,
//       COALESCE(SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END), 0) as total_debit,
//       COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE -t.amount END), 0) as balance
//     FROM people p
//     LEFT JOIN transactions t ON p.id = t.person_id
//     GROUP BY p.id
//     ORDER BY p.name ASC
//   `);
//   return rows;
// }

// export async function getPersonById(id: number): Promise<Person | null> {
//   const db = getDatabase();
//   const row = await db.getFirstAsync<Person>(
//     'SELECT * FROM people WHERE id = ?',
//     [id]
//   );
//   return row || null;
// }

// export async function getPersonWithBalance(id: number): Promise<PersonWithBalance | null> {
//   const db = getDatabase();
//   const row = await db.getFirstAsync<PersonWithBalance>(
//     `
//     SELECT
//       p.id,
//       p.name,
//       p.phone,
//       p.created_at,
//       COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) as total_credit,
//       COALESCE(SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END), 0) as total_debit,
//       COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE -t.amount END), 0) as balance
//     FROM people p
//     LEFT JOIN transactions t ON p.id = t.person_id
//     WHERE p.id = ?
//     GROUP BY p.id
//   `,
//     [id]
//   );
//   return row || null;
// }

// export async function deletePerson(id: number): Promise<void> {
//   const db = getDatabase();
//   await db.runAsync('DELETE FROM people WHERE id = ?', [id]);
// }

// export async function addTransaction(input: TransactionInput): Promise<number> {
//   const db = getDatabase();
//   const result = await db.runAsync(
//     'INSERT INTO transactions (person_id, amount, type, note, date) VALUES (?, ?, ?, ?, ?)',
//     [input.person_id, input.amount, input.type, input.note || null, input.date]
//   );
//   return result.lastInsertRowId;
// }

// export async function getTransactionsByPerson(personId: number): Promise<Transaction[]> {
//   const db = getDatabase();
//   const rows = await db.getAllAsync<Transaction>(
//     'SELECT * FROM transactions WHERE person_id = ? ORDER BY date DESC, created_at DESC',
//     [personId]
//   );
//   return rows;
// }

// export async function deleteTransaction(id: number): Promise<void> {
//   const db = getDatabase();
//   await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
// }

// export async function getOverallSummary(): Promise<{
//   total_credit: number;
//   total_debit: number;
//   balance: number;
// }> {
//   const db = getDatabase();
//   const row = await db.getFirstAsync<{
//     total_credit: number;
//     total_debit: number;
//     balance: number;
//   }>(`
//     SELECT
//       COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) as total_credit,
//       COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) as total_debit,
//       COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END), 0) as balance
//     FROM transactions
//   `);
//   return row || { total_credit: 0, total_debit: 0, balance: 0 };
// }

//--------------1----------------

//-----------------2---------------
// import { getDatabase } from './init';
// import {
//   Person,
//   Transaction,
//   PersonWithBalance,
//   TransactionInput,
//   PersonInput,
// } from './types';

// export interface Company {
//   id: number;
//   name: string;
//   note?: string | null;
//   created_at: number;
// }


// /* =======================
//    COMPANIES
// ======================= */

// // export async function getCompanies() {
// //   const db = getDatabase();
// //   return db.getAllAsync(`
// //     SELECT * FROM companies
// //     ORDER BY name ASC
// //   `);
// // }

// // export async function addCompany(name: string, note?: string) {
// //   const db = getDatabase();
// //   const res = await db.runAsync(
// //     'INSERT INTO companies (name, note) VALUES (?, ?)',
// //     [name, note || null]
// //   );
// //   return res.lastInsertRowId;
// // }

// export async function addCompany(
//   name: string,
//   note?: string
// ): Promise<number> {
//   const db = getDatabase();
//   const result = await db.runAsync(
//     'INSERT INTO companies (name, note) VALUES (?, ?)',
//     [name, note || null]
//   );
//   return result.lastInsertRowId;
// }

// export async function getCompanies(): Promise<Company[]> {
//   const db = getDatabase();
//   return await db.getAllAsync<Company>(
//     'SELECT * FROM companies ORDER BY created_at ASC'
//   );
// }

// export async function updateCompany(
//   id: number,
//   name: string,
//   note?: string
// ) {
//   const db = getDatabase();
//   await db.runAsync(
//     'UPDATE companies SET name = ?, note = ? WHERE id = ?',
//     [name, note || null, id]
//   );
// }

// export async function deleteCompany(id: number) {
//   const db = getDatabase();

//   // Prevent deleting last company
//   const count = await db.getFirstAsync<{ count: number }>(
//     'SELECT COUNT(*) as count FROM companies'
//   );

//   if (count && count.count <= 1) {
//     throw new Error('Cannot delete last company');
//   }

//   await db.runAsync('DELETE FROM companies WHERE id = ?', [id]);
// }

// export async function renameCompany(
//   companyId: number,
//   name: string
// ) {
//   const db = getDatabase();
//   await db.runAsync(
//     'UPDATE companies SET name = ? WHERE id = ?',
//     [name, companyId]
//   );
// }

// export async function getCompanyById(id: number) {
//   const db = getDatabase();
//   const res = await db.getFirstAsync<Company>(
//     'SELECT id, name, note FROM companies WHERE id = ?',
//     [id]
//   );
//   return res ?? null;
// }


// // export async function deleteCompany(companyId: number) {
// //   const db = getDatabase();
// //   await db.runAsync(
// //     'DELETE FROM companies WHERE id = ?',
// //     [companyId]
// //   );
// // }


// /* =======================
//    PEOPLE
// ======================= */

// export async function addPerson(input: PersonInput & { company_id: number }) {
//   const db = getDatabase();
//   const result = await db.runAsync(
//     'INSERT INTO people (company_id, name, phone) VALUES (?, ?, ?)',
//     [input.company_id, input.name, input.phone || null]
//   );
//   return result.lastInsertRowId;
// }

// export async function getPeopleWithBalances(companyId: number | null) {
//   const db = getDatabase();

//   const whereClause = companyId ? 'WHERE p.company_id = ?' : '';

//   return db.getAllAsync<PersonWithBalance>(
//     `
//     SELECT
//       p.id,
//       p.company_id,
//       p.name,
//       p.phone,
//       p.created_at,
//       COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) AS total_credit,
//       COALESCE(SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END), 0) AS total_debit,
//       COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE -t.amount END), 0) AS balance
//     FROM people p
//     LEFT JOIN transactions t ON p.id = t.person_id
//     ${whereClause}
//     GROUP BY p.id
//     ORDER BY p.name ASC
//     `,
//     companyId ? [companyId] : []
//   );
// }

// export async function getPersonById(id: number) {
//   const db = getDatabase();
//   return db.getFirstAsync<Person>(
//     'SELECT * FROM people WHERE id = ?',
//     [id]
//   );
// }

// // export async function deletePerson(id: number) {
// //   const db = getDatabase();
// //   await db.runAsync('DELETE FROM people WHERE id = ?', [id]);
// // }

// export async function getPersonWithBalance(
//   personId: number
// ): Promise<PersonWithBalance | null> {
//   const db = getDatabase();

//   const row = await db.getFirstAsync<PersonWithBalance>(
//     `
//     SELECT
//       p.id,
//       p.name,
//       p.phone,
//       p.company_id,
//       p.created_at,
//       COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) AS total_credit,
//       COALESCE(SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END), 0) AS total_debit,
//       COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE -t.amount END), 0) AS balance
//     FROM people p
//     LEFT JOIN transactions t ON p.id = t.person_id
//     WHERE p.id = ?
//     GROUP BY p.id
//     `,
//     [personId]
//   );

//   return row ?? null;
// }


// export async function updatePerson(
//   id: number,
//   data: { name: string; phone?: string | null }
// ) {
//   const db = getDatabase();
//   await db.runAsync(
//     'UPDATE people SET name = ?, phone = ? WHERE id = ?',
//     [data.name, data.phone ?? null, id]
//   );
// }

// export async function deletePerson(id: number) {
//   const db = getDatabase();
//   await db.runAsync('DELETE FROM transactions WHERE person_id = ?', [id]);
//   await db.runAsync('DELETE FROM people WHERE id = ?', [id]);
// }


// /* =======================
//    TRANSACTIONS
// ======================= */

// export async function addTransaction(input: TransactionInput) {
//   const db = getDatabase();
//   const result = await db.runAsync(
//     'INSERT INTO transactions (person_id, amount, type, note, date) VALUES (?, ?, ?, ?, ?)',
//     [input.person_id, input.amount, input.type, input.note || null, input.date]
//   );
//   return result.lastInsertRowId;
// }

// export async function getTransactionsByPerson(personId: number) {
//   const db = getDatabase();
//   return db.getAllAsync<Transaction>(
//     `
//     SELECT * FROM transactions
//     WHERE person_id = ?
//     ORDER BY date DESC, created_at DESC
//     `,
//     [personId]
//   );
// }

// export async function deleteTransaction(id: number) {
//   const db = getDatabase();
//   await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
// }

// /* =======================
//    OVERALL SUMMARY
//    (Company or ALL)
// ======================= */

// export async function getOverallSummary(companyId: number | null) {
//   const db = getDatabase();

//   const whereClause = companyId ? 'WHERE p.company_id = ?' : '';

//   const row = await db.getFirstAsync<{
//     total_credit: number;
//     total_debit: number;
//     balance: number;
//   }>(
//     `
//     SELECT
//       COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) AS total_credit,
//       COALESCE(SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END), 0) AS total_debit,
//       COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE -t.amount END), 0) AS balance
//     FROM transactions t
//     JOIN people p ON p.id = t.person_id
//     ${whereClause}
//     `,
//     companyId ? [companyId] : []
//   );

//   return row || { total_credit: 0, total_debit: 0, balance: 0 };
// }

//-----------------2----------------

//-----------3------------------
// import { Platform } from 'react-native';

// let service: any;

// if (Platform.OS === 'web') {
//   service = require('./web/service');
// } else {
//   service = require('./native/service');
// }

// export const {
//   getCompanies,
//   addCompany,
//   updateCompany,
//   deleteCompany,
//   getPeopleWithBalances,
//   addTransaction,
//   getTransactionsByPerson,
//   getPersonById,
// } = service;

//----------------3---------------

//-----------4----------------
// import { Platform } from 'react-native';

// /**
//  * This file acts as a proxy.
//  * UI imports from here.
//  * Internally routes to native or web implementation.
//  */

// let service: typeof import('./native/service');

// if (Platform.OS === 'web') {
//   service = require('./web/service');
// } else {
//   service = require('./native/service');
// }

// export const {
//   // Companies
//   getCompanies,
//   addCompany,
//   updateCompany,
//   deleteCompany,

//   // People
//   addPerson,
//   getPersonById,
//   deletePerson,
//   getPeopleWithBalances,
//   getPersonWithBalance,

//   // Transactions
//   addTransaction,
//   getTransactionsByPerson,
//   deleteTransaction,
// } = service;

//----------------4-------------


//------------5---------------
// import { Platform } from 'react-native';

// let initDatabase: () => Promise<void>;

// if (Platform.OS === 'web') {
//   // WEB (IndexedDB)
//   initDatabase = require('./web/init').initDatabase;
// } else {
//   // NATIVE (SQLite)
//   initDatabase = require('./native/init').initDatabase;
// }

// export { initDatabase };

//--------------5-------------

//------------6-------------
// import { Platform } from 'react-native';

// export async function initDatabase() {
//   if (Platform.OS === 'web') {
//     const web = await import('./web/init');
//     return web.initDatabase();
//   } else {
//     const native = await import('./native/init');
//     return native.initDatabase();
//   }
// }


//-----------6-----------------

//------------7-----------------
// import { Platform } from 'react-native';

// /* ======================
//    INIT
// ====================== */

// export async function initDatabase() {
//   if (Platform.OS === 'web') {
//     const web = await import('./web/init');
//     return web.initDatabase();
//   } else {
//     const native = await import('./native/init');
//     return native.initDatabase();
//   }
// }

// /* ======================
//    COMPANIES
// ====================== */

// export async function getCompanies() {
//   if (Platform.OS === 'web') {
//     const web = await import('./web/service');
//     return web.getCompanies();
//   } else {
//     const native = await import('./native/service');
//     return native.getCompanies();
//   }
// }

// /* ======================
//    PEOPLE
// ====================== */

// export async function getPeopleWithBalances(companyId: number | null) {
//   if (Platform.OS === 'web') {
//     const web = await import('./web/service');
//     return web.getPeopleWithBalances(companyId);
//   } else {
//     const native = await import('./native/service');
//     return native.getPeopleWithBalances(companyId);
//   }
// }

// /* ======================
//    TRANSACTIONS
// ====================== */

// export async function getTransactionsByPerson(personId: number) {
//   if (Platform.OS === 'web') {
//     const web = await import('./web/service');
//     return web.getTransactionsByPerson(personId);
//   } else {
//     const native = await import('./native/service');
//     return native.getTransactionsByPerson(personId);
//   }
// }

//-------------7-----------------

//--------------9------------------
import { Platform } from 'react-native';

/* ======================
   INIT
====================== */

export async function initDatabase() {
  if (Platform.OS === 'web') {
    const web = await import('./web/init');
    return web.initDatabase();
  } else {
    const native = await import('./native/init');
    return native.initDatabase();
  }
}

/* ======================
   COMPANIES
====================== */

export async function getCompanies() {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.getCompanies();
}

export async function addCompany(name: string, note?: string) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.addCompany(name, note);
}

export async function updateCompany(
  id: number,
  name: string,
  note?: string
) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.updateCompany(id, name, note);
}

export async function deleteCompany(id: number) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.deleteCompany(id);
}

export async function getCompanyById(id: number) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.getCompanyById(id);
}

/* ======================
   PEOPLE
====================== */

export async function addPerson(input: any) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.addPerson(input);
}

export async function getPeopleWithBalances(companyId: number | null) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.getPeopleWithBalances(companyId);
}

export async function getPersonWithBalance(id: number) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.getPersonWithBalance(id);
}

export async function getPersonById(id: number) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.getPersonById(id);
}

export async function updatePerson(id: number, data: any) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.updatePerson(id, data);
}

export async function deletePerson(id: number) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.deletePerson(id);
}

/* ======================
   TRANSACTIONS
====================== */

export async function addTransaction(input: any) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.addTransaction(input);
}

export async function getTransactionsByPerson(personId: number) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.getTransactionsByPerson(personId);
}

export async function deleteTransaction(id: number) {
  const svc =
    Platform.OS === 'web'
      ? await import('./web/service')
      : await import('./native/service');
  return svc.deleteTransaction(id);
}

//-------------9-----------------------

//-----------8----------------
// import { Platform } from 'react-native';

// let service: any;

// if (Platform.OS === 'web') {
//   service = require('./web/service');
// } else {
//   service = require('./native/service');
// }

// // 🔹 database init
// export const initDatabase = service.initDatabase;

// // 🔹 companies
// export const getCompanies = service.getCompanies;
// export const addCompany = service.addCompany;
// export const updateCompany = service.updateCompany;
// export const deleteCompany = service.deleteCompany;

// // 🔹 people
// export const getPeopleWithBalances = service.getPeopleWithBalances;
// export const addPerson = service.addPerson;
// export const getPersonById = service.getPersonById;

// // 🔹 transactions
// export const addTransaction = service.addTransaction;
// export const getTransactionsByPerson = service.getTransactionsByPerson;

//----------------8--------------