// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';
// import { Platform } from 'react-native';

// import {
//   getCompanies,
//   getPeopleWithBalances,
//   getTransactionsByPerson,
// } from '@/database/service';

// /* -----------------------------
//    Helpers
// ----------------------------- */

// const formatAmount = (n: number | null | undefined) =>
//   n ? n.toLocaleString('en-IN') : '';

// const formatDateTime = (ts: number) =>
//   new Date(ts * 1000).toLocaleString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

//   function formatCsvDate(ts: number) {
//   const d = new Date(ts * 1000);
//   return d.toLocaleDateString('en-IN') + ' ' +
//          d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
// }

// function num(n: number | null | undefined) {
//   return n ? n.toString() : '';
// }

// // const writeAndShare = async (filename: string, csv: string) => {
// //   const path = FileSystem.documentDirectory + filename;

// //   await FileSystem.writeAsStringAsync(path, csv, {
// //     encoding: FileSystem.EncodingType.UTF8,
// //   });

// //   if (await Sharing.isAvailableAsync()) {
// //     await Sharing.shareAsync(path);
// //   } else {
// //     alert('Sharing not available on this device');
// //   }
// // };
// const writeAndShare = async (filename: string, csv: string) => {
//   const path = FileSystem.documentDirectory + filename;

//   await FileSystem.writeAsStringAsync(path, csv);

//   if (await Sharing.isAvailableAsync()) {
//     await Sharing.shareAsync(path);
//   } else {
//     alert('Sharing not available on this device');
//   }
// };


// /* -----------------------------
//    PERSON CSV
// ----------------------------- */

// export async function exportPersonCsv(personId: number, personName: string) {
//   const txns = await getTransactionsByPerson(personId);

//   let csv = 'Date,IN (Credit),OUT (Debit),Balance,Note\n';

//   txns.forEach(t => {
//     const isIn = t.type === 'credit';   // YOU RECEIVED
//     const isOut = t.type === 'debit';   // YOU GAVE

//     csv += [
//       formatDateTime(t.date),
//       isIn ? formatAmount(t.amount) : '',
//       isOut ? formatAmount(t.amount) : '',
//       formatAmount(t.balance),
//       `"${t.note ?? ''}"`,
//     ].join(',') + '\n';
//   });

//   await writeAndShare(
//     `${personName.replace(/\s+/g, '_')}_ledger.csv`,
//     csv
//   );
// }

// /* -----------------------------
//    COMPANY CSV
// ----------------------------- */

// export async function exportCompanyCsv(companyId: number | null) {
//   const companies = await getCompanies();

//   const targetCompanies =
//     companyId === null
//       ? companies
//       : companies.filter(c => c.id === companyId);

//   let csv =
//     'Company,Person,Date,IN (Credit),OUT (Debit),Balance,Note\n';

//   for (const company of targetCompanies) {
//     const people = await getPeopleWithBalances(company.id);

//     for (const person of people) {
//       const txns = await getTransactionsByPerson(person.id);

//       txns.forEach(t => {
//         const isIn = t.type === 'credit';
//         const isOut = t.type === 'debit';

//         csv += [
//           `"${company.name}"`,
//           `"${person.name}"`,
//           formatDateTime(t.date),
//           isIn ? formatAmount(t.amount) : '',
//           isOut ? formatAmount(t.amount) : '',
//           formatAmount(t.balance),
//           `"${t.note ?? ''}"`,
//         ].join(',') + '\n';
//       });
//     }
//   }

//   await writeAndShare(
//     `Company_Data_${Date.now()}.csv`,
//     csv
//   );
// }

//-------------1-------------

//---------------2-------------
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';

// import {
//   getCompanies,
//   getPeopleWithBalances,
//   getTransactionsByPerson,
// } from '@/database/service';

// /* ======================
//    HELPERS
// ====================== */

// function formatCsvDate(ts: number) {
//   const d = new Date(ts * 1000);
//   return (
//     d.toLocaleDateString('en-IN') +
//     ' ' +
//     d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
//   );
// }

// function num(n?: number | null) {
//   return n != null ? n.toString() : '';
// }

// /* ======================
//    FILE WRITE + SHARE
// ====================== */

// async function writeAndShare(content: string) {
//   const path = FileSystem.cacheDirectory + 'khata_export.csv';

//   await FileSystem.writeAsStringAsync(path, content, {
//     encoding: FileSystem.EncodingType.UTF8,
//   });

//   await Sharing.shareAsync(path);
// }

// /* ======================
//    MAIN EXPORT
// ====================== */

// export async function exportCompanyCsv(selectedCompanyId: number | null) {
//   const rows: string[] = [];

//   // CSV HEADER
//   rows.push(
//     [
//       'Company',
//       'Company Note',
//       'Person',
//       'Date',
//       'IN (Credit)',
//       'OUT (Debit)',
//       'Balance',
//       'Transaction Note',
//     ].join(',')
//   );

//   const companies = await getCompanies();
//   const companiesToExport =
//     selectedCompanyId == null
//       ? companies
//       : companies.filter(c => c.id === selectedCompanyId);

//   for (const company of companiesToExport) {
//     const people = await getPeopleWithBalances(company.id);

//     for (const person of people) {
//       const txns = await getTransactionsByPerson(person.id);

//       let runningBalance = 0;

//       for (const t of txns) {
//         if (t.type === 'credit') runningBalance += t.amount;
//         if (t.type === 'debit') runningBalance -= t.amount;

//         rows.push(
//           [
//             `"${company.name}"`,
//             `"${company.note ?? ''}"`,
//             `"${person.name}"`,
//             `"${formatCsvDate(t.date)}"`,
//             t.type === 'credit' ? num(t.amount) : '',
//             t.type === 'debit' ? num(t.amount) : '',
//             num(runningBalance),
//             `"${t.note ?? ''}"`,
//           ].join(',')
//         );
//       }
//     }
//   }

//   await writeAndShare(rows.join('\n'));
// }

//----------------2--------------

//-------3---------------
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';

// import {
//   getCompanies,
//   getPeopleWithBalances,
//   getPersonById,
//   getTransactionsByPerson,
// } from '@/database/service';

// /* ============================
//    HELPERS
// ============================ */

// const formatAmount = (n: number | null | undefined) =>
//   n === null || n === undefined ? '' : n.toLocaleString('en-IN');

// const formatDateTime = (ts: number) =>
//   new Date(ts * 1000).toLocaleString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

// async function writeAndShare(csv: string, filename: string) {
//   const path = FileSystem.cacheDirectory + filename;
//   await FileSystem.writeAsStringAsync(path, csv);
//   await Sharing.shareAsync(path, {
//     mimeType: 'text/csv',
//     dialogTitle: 'Export CSV',
//   });
// }

// /* ============================
//    EXPORT COMPANY CSV
// ============================ */

// export async function exportCompanyCsv(companyId: number | null) {
//   const companies = await getCompanies();
//   const company =
//     companyId === null
//       ? { id: null, name: 'All Companies', note: '' }
//       : companies.find(c => c.id === companyId);

//   if (!company) return;

//   const people = await getPeopleWithBalances(companyId);

//   const rows: string[] = [];

//   // HEADER
//   rows.push(
//     [
//       'Company',
//       'Company Note',
//       'Person',
//       'Date',
//       'IN (Credit)',
//       'OUT (Debit)',
//       'Balance',
//       'Transaction Note',
//     ].join(',')
//   );

//   for (const person of people) {
//     const txns = await getTransactionsByPerson(person.id);

//     if (!txns.length) continue;

//     // 🔹 1. ASC for balance calculation
//     const asc = [...txns].sort((a, b) => a.date - b.date);

//     let running = 0;
//     const balanceMap = new Map<number, number>();

//     for (const t of asc) {
//       if (t.type === 'credit') running += t.amount; // IN
//       else running -= t.amount; // OUT
//       balanceMap.set(t.id, running);
//     }

//     // 🔹 2. DESC for export (latest first)
//     const desc = [...txns].sort((a, b) => b.date - a.date);

//     for (const t of desc) {
//       rows.push(
//         [
//           `"${company.name}"`,
//           `"${company.note ?? ''}"`,
//           `"${person.name}"`,
//           `"${formatDateTime(t.date)}"`,
//           t.type === 'credit' ? formatAmount(t.amount) : '',
//           t.type === 'debit' ? formatAmount(t.amount) : '',
//           formatAmount(balanceMap.get(t.id)),
//           `"${t.note ?? ''}"`,
//         ].join(',')
//       );
//     }
//   }

//   await writeAndShare(
//     rows.join('\n'),
//     `${company.name.replace(/\s+/g, '_')}_ledger.csv`
//   );
// }

// /* ============================
//    EXPORT PERSON CSV
// ============================ */

// export async function exportPersonCsv(personId: number) {
//   const person = await getPersonById(personId);
//   if (!person) throw new Error('Person not found');

//   const txns = await getTransactionsByPerson(personId);
//   if (!txns.length) return;

//   const personName = person.name;

//   const rows: string[] = [];

//   // ======================
//   // CSV HEADER
//   // ======================
//   rows.push(
//     [
//       'Person',
//       'Date',
//       'IN (Credit)',
//       'OUT (Debit)',
//       'Balance',
//       'Transaction Note',
//     ].join(',')
//   );

//   // ======================
//   // BALANCE CALCULATION (ASC)
//   // ======================
//   const asc = [...txns].sort((a, b) => a.date - b.date);
//   let running = 0;
//   const balanceMap = new Map<number, number>();

//   for (const t of asc) {
//     if (t.type === 'credit') running += t.amount; // IN
//     else running -= t.amount; // OUT

//     balanceMap.set(t.id, running);
//   }

//   // ======================
//   // EXPORT (DESC – latest first)
//   // ======================
//   const desc = [...txns].sort((a, b) => b.date - a.date);

//   for (const t of desc) {
//     rows.push(
//       [
//         `"${personName}"`,
//         `"${formatDateTime(t.date)}"`,
//         t.type === 'credit' ? formatAmount(t.amount) : '',
//         t.type === 'debit' ? formatAmount(t.amount) : '',
//         formatAmount(balanceMap.get(t.id) ?? 0),
//         `"${t.note ?? ''}"`,
//       ].join(',')
//     );
//   }

//   await writeAndShare(
//     rows.join('\n'),
//     `${personName.replace(/\s+/g, '_')}_ledger.csv`
//   );
// }


//--------------3-------------

//-----------4-------------
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';

// import {
//   getCompanies,
//   getPeopleWithBalances,
//   getPersonById,
//   getTransactionsByPerson,
// } from '@/database/service';

// /* ============================
//    CONSTANTS & HELPERS
// ============================ */

// // UTF-8 BOM → REQUIRED for Samsung / Excel
// const BOM = '\uFEFF';

// // Safe CSV escape
// const csvEscape = (value: any): string => {
//   if (value === null || value === undefined) return '';
//   const str = String(value);

//   if (str.includes(',') || str.includes('\n') || str.includes('"')) {
//     return `"${str.replace(/"/g, '""')}"`;
//   }
//   return str;
// };

// const formatAmount = (n?: number | null) =>
//   n === null || n === undefined ? '' : n.toLocaleString('en-IN');

// const formatDateTime = (ts: number) =>
//   new Date(ts * 1000).toLocaleString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

// async function writeAndShareCsv(filename: string, csv: string) {
//   const uri = FileSystem.cacheDirectory + filename;

//   await FileSystem.writeAsStringAsync(uri, csv, {
//     encoding: FileSystem.EncodingType.UTF8,
//   });

//   await Sharing.shareAsync(uri, {
//     mimeType: 'text/csv',
//     dialogTitle: 'Export Ledger CSV',
//   });
// }

// /* ============================
//    EXPORT COMPANY CSV
// ============================ */

// export async function exportCompanyCsv(companyId: number | null) {
//   const companies = await getCompanies();

//   const company =
//     companyId === null
//       ? { id: null, name: 'All Companies', note: '' }
//       : companies.find(c => c.id === companyId);

//   if (!company) return;

//   const people = await getPeopleWithBalances(companyId);

//   const headers = [
//     'Company',
//     'Company Note',
//     'Person',
//     'Date',
//     'IN (Credit)',
//     'OUT (Debit)',
//     'Balance',
//     'Transaction Note',
//   ];

//   const rows: string[] = [];

//   for (const person of people) {
//     const txns = await getTransactionsByPerson(person.id);
//     if (!txns.length) continue;

//     // 1️⃣ ASC → calculate running balance
//     const asc = [...txns].sort((a, b) => a.date - b.date);
//     let running = 0;
//     const balanceMap = new Map<number, number>();

//     for (const t of asc) {
//       if (t.type === 'credit') running += t.amount;
//       else running -= t.amount;

//       balanceMap.set(t.id, running);
//     }

//     // 2️⃣ DESC → export latest first
//     const desc = [...txns].sort((a, b) => b.date - a.date);

//     for (const t of desc) {
//       rows.push(
//         [
//           csvEscape(company.name),
//           csvEscape(company.note ?? ''),
//           csvEscape(person.name),
//           csvEscape(formatDateTime(t.date)),
//           t.type === 'credit' ? formatAmount(t.amount) : '',
//           t.type === 'debit' ? formatAmount(t.amount) : '',
//           formatAmount(balanceMap.get(t.id)),
//           csvEscape(t.note ?? ''),
//         ].join(',')
//       );
//     }
//   }

//   const csv =
//     BOM +
//     headers.join(',') +
//     '\n' +
//     rows.join('\n');

//   await writeAndShareCsv(
//     `${company.name.replace(/\s+/g, '_')}_ledger.csv`,
//     csv
//   );
// }

// /* ============================
//    EXPORT PERSON CSV
// ============================ */

// export async function exportPersonCsv(personId: number) {
//   const person = await getPersonById(personId);
//   if (!person) throw new Error('Person not found');

//   const txns = await getTransactionsByPerson(personId);
//   if (!txns.length) return;

//   const headers = [
//     'Person',
//     'Date',
//     'IN (Credit)',
//     'OUT (Debit)',
//     'Balance',
//     'Transaction Note',
//   ];

//   // 1️⃣ ASC → running balance
//   const asc = [...txns].sort((a, b) => a.date - b.date);
//   let running = 0;
//   const balanceMap = new Map<number, number>();

//   for (const t of asc) {
//     if (t.type === 'credit') running += t.amount;
//     else running -= t.amount;

//     balanceMap.set(t.id, running);
//   }

//   // 2️⃣ DESC → export
//   const desc = [...txns].sort((a, b) => b.date - a.date);
//   const rows: string[] = [];

//   for (const t of desc) {
//     rows.push(
//       [
//         csvEscape(person.name),
//         csvEscape(formatDateTime(t.date)),
//         t.type === 'credit' ? formatAmount(t.amount) : '',
//         t.type === 'debit' ? formatAmount(t.amount) : '',
//         formatAmount(balanceMap.get(t.id)),
//         csvEscape(t.note ?? ''),
//       ].join(',')
//     );
//   }

//   const csv =
//     BOM +
//     headers.join(',') +
//     '\n' +
//     rows.join('\n');

//   await writeAndShareCsv(
//     `${person.name.replace(/\s+/g, '_')}_ledger.csv`,
//     csv
//   );
// }

//----------------4--------------

//-----------5------------
// import { Platform } from 'react-native';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';

// import {
//   getCompanies,
//   getPeopleWithBalances,
//   getPersonById,
//   getTransactionsByPerson,
// } from '@/database/service';

// /* ============================
//    HELPERS
// ============================ */

// const formatAmount = (n?: number | null) =>
//   n === null || n === undefined ? '' : n.toLocaleString('en-IN');

// const formatDateTime = (ts: number) =>
//   new Date(ts * 1000).toLocaleString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

// /* ============================
//    SAVE TO DEVICE (ANDROID)
// ============================ */

// // async function saveCsvToDevice(filename: string, csv: string) {
// //   if (Platform.OS !== 'android') {
// //     throw new Error('Download is supported only on Android');
// //   }

// //   const permission =
// //     await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

// //   if (!permission.granted) {
// //     throw new Error('Permission denied');
// //   }

// //   const fileUri =
// //     await FileSystem.StorageAccessFramework.createFileAsync(
// //       permission.directoryUri,
// //       filename,
// //       'text/csv'
// //     );

// //   await FileSystem.writeAsStringAsync(fileUri, csv, {
// //     encoding: FileSystem.EncodingType.UTF8,
// //   });
// // }

// async function saveCsvToDevice(filename: string, csv: string) {
//   if (Platform.OS !== 'android') return;

//   const permission =
//     await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

//   // 🚫 User cancelled – do nothing
//   if (!permission.granted) {
//     console.log('User cancelled folder selection');
//     return;
//   }

//   const fileUri =
//     await FileSystem.StorageAccessFramework.createFileAsync(
//       permission.directoryUri,
//       filename,
//       'text/csv'
//     );

//   await FileSystem.writeAsStringAsync(fileUri, csv, {
//     encoding: FileSystem.EncodingType.UTF8,
//   });
// }


// /* ============================
//    SHARE CSV
// ============================ */

// async function shareCsv(filename: string, csv: string) {
//   const uri = FileSystem.cacheDirectory + filename;

//   await FileSystem.writeAsStringAsync(uri, csv, {
//     encoding: FileSystem.EncodingType.UTF8,
//   });

//   await Sharing.shareAsync(uri, {
//     mimeType: 'text/csv',
//     dialogTitle: 'Export Ledger CSV',
//   });
// }

// /* ============================
//    EXPORT COMPANY CSV
// ============================ */

// export async function exportCompanyCsv(
//   companyId: number | null,
//   mode: 'download' | 'share' = 'download'
// ) {
//   const companies = await getCompanies();

//   const company =
//     companyId === null
//       ? { id: null, name: 'All Companies', note: '' }
//       : companies.find(c => c.id === companyId);

//   if (!company) return;

//   const people = await getPeopleWithBalances(companyId);
//   const rows: string[] = [];

//   // CSV HEADER
//   rows.push(
//     [
//       'Company',
//       'Company Note',
//       'Person',
//       'Date',
//       'IN (Credit)',
//       'OUT (Debit)',
//       'Balance',
//       'Transaction Note',
//     ].join(',')
//   );

//   for (const person of people) {
//     const txns = await getTransactionsByPerson(person.id);
//     if (!txns.length) continue;

//     // Balance calculation (ASC)
//     const asc = [...txns].sort((a, b) => a.date - b.date);
//     let running = 0;
//     const balanceMap = new Map<number, number>();

//     for (const t of asc) {
//       running += t.type === 'credit' ? t.amount : -t.amount;
//       balanceMap.set(t.id, running);
//     }

//     // Export (DESC – latest first)
//     const desc = [...txns].sort((a, b) => b.date - a.date);

//     for (const t of desc) {
//       rows.push(
//         [
//           `"${company.name}"`,
//           `"${company.note ?? ''}"`,
//           `"${person.name}"`,
//           `"${formatDateTime(t.date)}"`,
//           t.type === 'credit' ? formatAmount(t.amount) : '',
//           t.type === 'debit' ? formatAmount(t.amount) : '',
//           formatAmount(balanceMap.get(t.id)),
//           `"${t.note ?? ''}"`,
//         ].join(',')
//       );
//     }
//   }

//   // UTF-8 BOM fixes Samsung / Excel issues
//   const csv = '\uFEFF' + rows.join('\n');
//   const filename = `${company.name.replace(/\s+/g, '_')}_ledger.csv`;

//   if (mode === 'download') {
//     await saveCsvToDevice(filename, csv);
//   } else {
//     await shareCsv(filename, csv);
//   }
// }

// /* ============================
//    EXPORT PERSON CSV
// ============================ */

// export async function exportPersonCsv(
//   personId: number,
//   mode: 'download' | 'share' = 'download'
// ) {
//   const person = await getPersonById(personId);
//   if (!person) return;

//   const txns = await getTransactionsByPerson(personId);
//   if (!txns.length) return;

//   const rows: string[] = [];

//   // CSV HEADER
//   rows.push(
//     [
//       'Person',
//       'Date',
//       'IN (Credit)',
//       'OUT (Debit)',
//       'Balance',
//       'Transaction Note',
//     ].join(',')
//   );

//   // Balance calculation (ASC)
//   const asc = [...txns].sort((a, b) => a.date - b.date);
//   let running = 0;
//   const balanceMap = new Map<number, number>();

//   for (const t of asc) {
//     running += t.type === 'credit' ? t.amount : -t.amount;
//     balanceMap.set(t.id, running);
//   }

//   // Export (DESC – latest first)
//   const desc = [...txns].sort((a, b) => b.date - a.date);

//   for (const t of desc) {
//     rows.push(
//       [
//         `"${person.name}"`,
//         `"${formatDateTime(t.date)}"`,
//         t.type === 'credit' ? formatAmount(t.amount) : '',
//         t.type === 'debit' ? formatAmount(t.amount) : '',
//         formatAmount(balanceMap.get(t.id)),
//         `"${t.note ?? ''}"`,
//       ].join(',')
//     );
//   }

//   const csv = '\uFEFF' + rows.join('\n');
//   const filename = `${person.name.replace(/\s+/g, '_')}_ledger.csv`;

//   if (mode === 'download') {
//     await saveCsvToDevice(filename, csv);
//   } else {
//     await shareCsv(filename, csv);
//   }
// }

//--------------5------------

//----------6--------------
// import { Platform, Alert } from 'react-native';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';

// import {
//   getCompanies,
//   getPeopleWithBalances,
//   getPersonById,
//   getTransactionsByPerson,
// } from '@/database/service';

// /* ============================
//    HELPERS
// ============================ */

// const formatAmount = (n?: number | null) =>
//   n === null || n === undefined ? '' : n.toLocaleString('en-IN');

// const formatDateTime = (ts: number) =>
//   new Date(ts * 1000).toLocaleString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

// /* ============================
//    SHARE CSV
// ============================ */

// async function shareCsv(filename: string, csv: string) {
//   const uri = FileSystem.cacheDirectory + filename;

//   await FileSystem.writeAsStringAsync(uri, csv, {
//     encoding: FileSystem.EncodingType.UTF8,
//   });

//   await Sharing.shareAsync(uri, {
//     mimeType: 'text/csv',
//     dialogTitle: 'Share Ledger CSV',
//   });
// }

// /* ============================
//    DOWNLOAD CSV (ANDROID SAF)
// ============================ */

// async function downloadCsv(filename: string, csv: string) {
//   if (Platform.OS !== 'android') {
//     // iOS → fallback to share
//     return shareCsv(filename, csv);
//   }

//   const permission =
//     await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

//   // 🚫 user cancelled
//   if (!permission.granted) return;

//   const fileUri =
//     await FileSystem.StorageAccessFramework.createFileAsync(
//       permission.directoryUri,
//       filename,
//       'text/csv'
//     );

//   await FileSystem.writeAsStringAsync(fileUri, csv, {
//     encoding: FileSystem.EncodingType.UTF8,
//   });
// }

// /* ============================
//    EXPORT COMPANY CSV
// ============================ */

// export async function exportCompanyCsv(companyId: number | null) {
//   const companies = await getCompanies();
//   const company =
//     companyId === null
//       ? { id: null, name: 'All_Companies', note: '' }
//       : companies.find(c => c.id === companyId);

//   if (!company) return;

//   const people = await getPeopleWithBalances(companyId);
//   const rows: string[] = [];

//   // HEADER
//   rows.push(
//     [
//       'Company',
//       'Company Note',
//       'Person',
//       'Date',
//       'IN (Credit)',
//       'OUT (Debit)',
//       'Balance',
//       'Transaction Note',
//     ].join(',')
//   );

//   for (const person of people) {
//     const txns = await getTransactionsByPerson(person.id);
//     if (!txns.length) continue;

//     // balance calc ASC
//     const asc = [...txns].sort((a, b) => a.date - b.date);
//     let running = 0;
//     const balanceMap = new Map<number, number>();

//     for (const t of asc) {
//       running += t.type === 'credit' ? t.amount : -t.amount;
//       balanceMap.set(t.id, running);
//     }

//     // export DESC
//     const desc = [...txns].sort((a, b) => b.date - a.date);

//     for (const t of desc) {
//       rows.push(
//         [
//           `"${company.name}"`,
//           `"${company.note ?? ''}"`,
//           `"${person.name}"`,
//           `"${formatDateTime(t.date)}"`,
//           t.type === 'credit' ? formatAmount(t.amount) : '',
//           t.type === 'debit' ? formatAmount(t.amount) : '',
//           formatAmount(balanceMap.get(t.id)),
//           `"${t.note ?? ''}"`,
//         ].join(',')
//       );
//     }
//   }

//   const csv = rows.join('\n');
//   const filename = `${company.name.replace(/\s+/g, '_')}_ledger.csv`;

//   // 🔹 Ask user what they want
//   Alert.alert(
//     'Export Company Data',
//     'Choose how you want to export the CSV',
//     [
//       {
//         text: 'Download',
//         onPress: () => downloadCsv(filename, csv),
//       },
//       {
//         text: 'Share',
//         onPress: () => shareCsv(filename, csv),
//       },
//       { text: 'Cancel', style: 'cancel' },
//     ]
//   );
// }

// /* ============================
//    EXPORT PERSON CSV (SHARE ONLY)
// ============================ */

// export async function exportPersonCsv(personId: number) {
//   const person = await getPersonById(personId);
//   if (!person) return;

//   const txns = await getTransactionsByPerson(personId);
//   if (!txns.length) return;

//   const rows: string[] = [];

//   rows.push(
//     ['Person', 'Date', 'IN (Credit)', 'OUT (Debit)', 'Balance', 'Transaction Note'].join(',')
//   );

//   const asc = [...txns].sort((a, b) => a.date - b.date);
//   let running = 0;
//   const balanceMap = new Map<number, number>();

//   for (const t of asc) {
//     running += t.type === 'credit' ? t.amount : -t.amount;
//     balanceMap.set(t.id, running);
//   }

//   const desc = [...txns].sort((a, b) => b.date - a.date);

//   for (const t of desc) {
//     rows.push(
//       [
//         `"${person.name}"`,
//         `"${formatDateTime(t.date)}"`,
//         t.type === 'credit' ? formatAmount(t.amount) : '',
//         t.type === 'debit' ? formatAmount(t.amount) : '',
//         formatAmount(balanceMap.get(t.id)),
//         `"${t.note ?? ''}"`,
//       ].join(',')
//     );
//   }

//   await shareCsv(
//     `${person.name.replace(/\s+/g, '_')}_ledger.csv`,
//     rows.join('\n')
//   );
// }

//--------------6------------

//-------7----------------
// import { Platform, Alert } from 'react-native';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';

// import {
//   getCompanies,
//   getPeopleWithBalances,
//   getPersonById,
//   getTransactionsByPerson,
// } from '@/database/service';

// /* ============================
//    HELPERS
// ============================ */

// const formatAmount = (n?: number | null) =>
//   n === null || n === undefined ? '' : n.toLocaleString('en-IN');

// const formatDateTime = (ts: number) =>
//   new Date(ts * 1000).toLocaleString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

// /* ============================
//    SHARE CSV
// ============================ */

// async function shareCsv(filename: string, csv: string) {
//   const uri = FileSystem.cacheDirectory + filename;

//   await FileSystem.writeAsStringAsync(uri, csv, {
//     encoding: FileSystem.EncodingType.UTF8,
//   });

//   await Sharing.shareAsync(uri, {
//     mimeType: 'text/csv',
//     dialogTitle: 'Share Ledger CSV',
//   });
// }

// /* ============================
//    DOWNLOAD CSV (ANDROID SAF)
// ============================ */

// async function downloadCsv(filename: string, csv: string) {
//   if (Platform.OS !== 'android') {
//     // iOS fallback → share
//     return shareCsv(filename, csv);
//   }

//   const permission =
//     await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

//   if (!permission.granted) return;

//   const fileUri =
//     await FileSystem.StorageAccessFramework.createFileAsync(
//       permission.directoryUri,
//       filename,
//       'text/csv'
//     );

//   await FileSystem.writeAsStringAsync(fileUri, csv, {
//     encoding: FileSystem.EncodingType.UTF8,
//   });
// }

// /* ============================
//    EXPORT COMPANY CSV
// ============================ */

// export async function exportCompanyCsv(companyId: number | null) {
//   const companies = await getCompanies();
//   const company =
//     companyId === null
//       ? { id: null, name: 'All_Companies', note: '' }
//       : companies.find(c => c.id === companyId);

//   if (!company) return;

//   const people = await getPeopleWithBalances(companyId);
//   const rows: string[] = [];

//   rows.push(
//     [
//       'Company',
//       'Company Note',
//       'Person',
//       'Date',
//       'IN (Credit)',
//       'OUT (Debit)',
//       'Balance',
//       'Transaction Note',
//     ].join(',')
//   );

//   for (const person of people) {
//     const txns = await getTransactionsByPerson(person.id);
//     if (!txns.length) continue;

  //   const asc = [...txns].sort((a, b) => a.date - b.date);
  //   let running = 0;
  //   const balanceMap = new Map<number, number>();

  //   for (const t of asc) {
  //     running += t.type === 'credit' ? t.amount : -t.amount;
  //     balanceMap.set(t.id, running);
  //   }

  //   const desc = [...txns].sort((a, b) => b.date - a.date);

  //   for (const t of desc) {
  //     rows.push(
  //       [
  //         `"${company.name}"`,
  //         `"${company.note ?? ''}"`,
  //         `"${person.name}"`,
  //         `"${formatDateTime(t.date)}"`,
  //         t.type === 'credit' ? formatAmount(t.amount) : '',
  //         t.type === 'debit' ? formatAmount(t.amount) : '',
  //         formatAmount(balanceMap.get(t.id)),
  //         `"${t.note ?? ''}"`,
  //       ].join(',')
  //     );
  //   }
  // }

//   const csv = rows.join('\n');
//   const filename = `${company.name.replace(/\s+/g, '_')}_ledger.csv`;

//   Alert.alert(
//     'Export Company Data',
//     'Choose how you want to export the CSV',
//     [
//       { text: 'Download', onPress: () => downloadCsv(filename, csv) },
//       { text: 'Share', onPress: () => shareCsv(filename, csv) },
//       { text: 'Cancel', style: 'cancel' },
//     ]
//   );
// }

// /* ============================
//    EXPORT PERSON CSV
// ============================ */

// export async function exportPersonCsv(personId: number) {
//   const person = await getPersonById(personId);
//   if (!person) return;

//   const txns = await getTransactionsByPerson(personId);
//   if (!txns.length) return;

//   const rows: string[] = [];

//   rows.push(
//     ['Person', 'Date', 'IN (Credit)', 'OUT (Debit)', 'Balance', 'Transaction Note'].join(',')
//   );

//   const asc = [...txns].sort((a, b) => a.date - b.date);
//   let running = 0;
//   const balanceMap = new Map<number, number>();

//   for (const t of asc) {
//     running += t.type === 'credit' ? t.amount : -t.amount;
//     balanceMap.set(t.id, running);
//   }

//   const desc = [...txns].sort((a, b) => b.date - a.date);

//   for (const t of desc) {
//     rows.push(
//       [
//         `"${person.name}"`,
//         `"${formatDateTime(t.date)}"`,
//         t.type === 'credit' ? formatAmount(t.amount) : '',
//         t.type === 'debit' ? formatAmount(t.amount) : '',
//         formatAmount(balanceMap.get(t.id)),
//         `"${t.note ?? ''}"`,
//       ].join(',')
//     );
//   }

//   const csv = rows.join('\n');
//   const filename = `${person.name.replace(/\s+/g, '_')}_ledger.csv`;

//   Alert.alert(
//     'Export Person Data',
//     'Choose how you want to export the CSV',
//     [
//       { text: 'Download', onPress: () => downloadCsv(filename, csv) },
//       { text: 'Share', onPress: () => shareCsv(filename, csv) },
//       { text: 'Cancel', style: 'cancel' },
//     ]
//   );
// }

//---------------7-------------

//-----------8--------------
// import { Platform, Alert } from 'react-native';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';

// import {
//   getCompanies,
//   getPeopleWithBalances,
//   getPersonById,
//   getTransactionsByPerson,
// } from '@/database/service';

// /* ============================
//    CSV HELPERS (IMPORTANT)
// ============================ */

// /**
//  * Safely formats any value for CSV.
//  * - Wraps in quotes if it contains comma / newline / quotes
//  * - Escapes quotes correctly
//  */
// function csvValue(value: string | number | null | undefined): string {
//   if (value === null || value === undefined) return '';

//   const str = String(value);

//   if (str.includes(',') || str.includes('\n') || str.includes('"')) {
//     return `"${str.replace(/"/g, '""')}"`;
//   }

//   return str;
// }

// const formatAmount = (n?: number | null) =>
//   n === null || n === undefined ? '' : n.toLocaleString('en-IN');

// const formatDateTime = (ts: number) =>
//   new Date(ts * 1000).toLocaleString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

// /* ============================
//    SHARE CSV
// ============================ */

// async function shareCsv(filename: string, csv: string) {
//   const uri = FileSystem.cacheDirectory + filename;

//   await FileSystem.writeAsStringAsync(uri, csv, {
//     encoding: FileSystem.EncodingType.UTF8,
//   });

//   await Sharing.shareAsync(uri, {
//     mimeType: 'text/csv',
//     dialogTitle: 'Share Ledger CSV',
//   });
// }

// /* ============================
//    DOWNLOAD CSV (ANDROID SAF)
// ============================ */

// async function downloadCsv(filename: string, csv: string) {
//   if (Platform.OS !== 'android') {
//     return shareCsv(filename, csv);
//   }

//   const permission =
//     await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

//   if (!permission.granted) return;

//   const fileUri =
//     await FileSystem.StorageAccessFramework.createFileAsync(
//       permission.directoryUri,
//       filename,
//       'text/csv'
//     );

//   await FileSystem.writeAsStringAsync(fileUri, csv, {
//     encoding: FileSystem.EncodingType.UTF8,
//   });
// }

// /* ============================
//    EXPORT COMPANY CSV
// ============================ */

// export async function exportCompanyCsv(companyId: number | null) {
//   const companies = await getCompanies();

//   const company =
//     companyId === null
//       ? { id: null, name: 'All Companies', note: '' }
//       : companies.find(c => c.id === companyId);

//   if (!company) return;

//   const people = await getPeopleWithBalances(companyId);
//   const rows: string[] = [];

//   // Header
//   rows.push(
//     [
//       'Company',
//       'Company Note',
//       'Person',
//       'Date',
//       'IN (Credit)',
//       'OUT (Debit)',
//       'Balance',
//       'Transaction Note',
//     ].join(',')
//   );

//   for (const person of people) {
//     const txns = await getTransactionsByPerson(person.id);
//     if (!txns.length) continue;

//     // Calculate running balance (ASC)
//     const asc = [...txns].sort((a, b) => a.date - b.date);
//     let running = 0;
//     const balanceMap = new Map<number, number>();

//     for (const t of asc) {
//       running += t.type === 'credit' ? t.amount : -t.amount;
//       balanceMap.set(t.id, running);
//     }

//     // Export DESC (latest first)
//     const desc = [...txns].sort((a, b) => b.date - a.date);

//     for (const t of desc) {
//       rows.push(
//         [
//           csvValue(company.name),
//           csvValue(company.note ?? ''),
//           csvValue(person.name),
//           csvValue(formatDateTime(t.date)),
//           csvValue(t.type === 'credit' ? formatAmount(t.amount) : ''),
//           csvValue(t.type === 'debit' ? formatAmount(t.amount) : ''),
//           csvValue(formatAmount(balanceMap.get(t.id))),
//           csvValue(t.note ?? ''),
//         ].join(',')
//       );
//     }
//   }

//   const csv = rows.join('\n');
//   const filename = `${company.name.replace(/\s+/g, '_')}_ledger.csv`;

//   Alert.alert(
//     'Export Company Data',
//     'Choose how you want to export the CSV',
//     [
//       { text: 'Download', onPress: () => downloadCsv(filename, csv) },
//       { text: 'Share', onPress: () => shareCsv(filename, csv) },
//       { text: 'Cancel', style: 'cancel' },
//     ]
//   );
// }

// /* ============================
//    EXPORT PERSON CSV
// ============================ */

// export async function exportPersonCsv(personId: number) {
//   const person = await getPersonById(personId);
//   if (!person) return;

//   const txns = await getTransactionsByPerson(personId);
//   if (!txns.length) return;

//   const rows: string[] = [];

//   rows.push(
//     [
//       'Person',
//       'Date',
//       'IN (Credit)',
//       'OUT (Debit)',
//       'Balance',
//       'Transaction Note',
//     ].join(',')
//   );

//   // Calculate running balance
//   const asc = [...txns].sort((a, b) => a.date - b.date);
//   let running = 0;
//   const balanceMap = new Map<number, number>();

//   for (const t of asc) {
//     running += t.type === 'credit' ? t.amount : -t.amount;
//     balanceMap.set(t.id, running);
//   }

//   const desc = [...txns].sort((a, b) => b.date - a.date);

//   for (const t of desc) {
//     rows.push(
//       [
//         csvValue(person.name),
//         csvValue(formatDateTime(t.date)),
//         csvValue(t.type === 'credit' ? formatAmount(t.amount) : ''),
//         csvValue(t.type === 'debit' ? formatAmount(t.amount) : ''),
//         csvValue(formatAmount(balanceMap.get(t.id))),
//         csvValue(t.note ?? ''),
//       ].join(',')
//     );
//   }

//   const csv = rows.join('\n');
//   const filename = `${person.name.replace(/\s+/g, '_')}_ledger.csv`;

//   Alert.alert(
//     'Export Person Data',
//     'Choose how you want to export the CSV',
//     [
//       { text: 'Download', onPress: () => downloadCsv(filename, csv) },
//       { text: 'Share', onPress: () => shareCsv(filename, csv) },
//       { text: 'Cancel', style: 'cancel' },
//     ]
//   );
// }

//-----------8----------------

//------------9---------------
import { Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import {
  getCompanies,
  getPeopleWithBalances,
  getPersonById,
  getTransactionsByPerson,
} from '@/database/service';

/* ============================
   CSV SAFE HELPERS
============================ */

const csv = (v: any) =>
  `"${String(v ?? '').replace(/"/g, '""')}"`;

const formatAmount = (n?: number | null) =>
  n === null || n === undefined ? '' : n.toLocaleString('en-IN');

const formatDateTime = (ts: number) =>
  new Date(ts * 1000).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

/* ============================
   FILE HANDLING
============================ */

async function shareCsv(filename: string, content: string) {
  const uri = FileSystem.cacheDirectory + filename;

  await FileSystem.writeAsStringAsync(uri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  await Sharing.shareAsync(uri, {
    mimeType: 'text/csv',
    dialogTitle: 'Share Ledger CSV',
  });
}

async function downloadCsv(filename: string, content: string) {
  if (Platform.OS !== 'android') {
    return shareCsv(filename, content);
  }

  const perm =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!perm.granted) return;

  const fileUri =
    await FileSystem.StorageAccessFramework.createFileAsync(
      perm.directoryUri,
      filename,
      'text/csv'
    );

  await FileSystem.writeAsStringAsync(fileUri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });
}

/* ============================
   EXPORT COMPANY CSV
============================ */

// export async function exportCompanyCsv(companyId: number | null) {
//   const companies = await getCompanies();

//   const company =
//     companyId === null
//       ? { id: null, name: 'All Companies', note: '' }
//       : companies.find(c => c.id === companyId);

//   if (!company) return;

//   const people = await getPeopleWithBalances(companyId);
//   const rows: string[] = [];

//   rows.push([
//     'Company',
//     'Company Note',
//     'Person',
//     'Date',
//     'IN (Credit)',
//     'OUT (Debit)',
//     'Balance',
//     'Transaction Note',
//   ].map(csv).join(','));

//   for (const person of people) {
//     const txns = await getTransactionsByPerson(person.id);
//     if (!txns.length) continue;

//     const asc = [...txns].sort((a, b) => a.date - b.date);
//     let balance = 0;

//     for (const t of asc) {
//       balance += t.type === 'credit' ? t.amount : -t.amount;

//       rows.push([
//         csv(company.name),
//         csv(company.note ?? ''),
//         csv(person.name),
//         csv(formatDateTime(t.date)),
//         t.type === 'credit' ? csv(formatAmount(t.amount)) : csv(''),
//         t.type === 'debit' ? csv(formatAmount(t.amount)) : csv(''),
//         csv(formatAmount(balance)),
//         csv(t.note ?? ''),
//       ].join(','));
//     }
//   }

//   const csvContent = rows.join('\n');
//   const filename = `${company.name.replace(/\s+/g, '_')}_ledger.csv`;

//   Alert.alert(
//     'Export Company Ledger',
//     'Choose export method',
//     [
//       { text: 'Download', onPress: () => downloadCsv(filename, csvContent) },
//       { text: 'Share', onPress: () => shareCsv(filename, csvContent) },
//       { text: 'Cancel', style: 'cancel' },
//     ]
//   );
// }

export async function exportCompanyCsv(companyId: number | null) {
  const companies = await getCompanies();

  const company =
    companyId === null
      ? { id: null, name: 'All Companies', note: '' }
      : companies.find(c => c.id === companyId);

  if (!company) return;

  const people = await getPeopleWithBalances(companyId);

  // 1️⃣ collect ALL transactions
  const allRows: {
    person: string;
    date: number;
    type: 'credit' | 'debit';
    amount: number;
    note?: string | null;
  }[] = [];

  for (const p of people) {
    const txns = await getTransactionsByPerson(p.id);
    for (const t of txns) {
      allRows.push({
        person: p.name,
        date: t.date,
        type: t.type,
        amount: t.amount,
        note: t.note,
      });
    }
  }

  if (!allRows.length) return;

  // 2️⃣ sort by date ASC
  allRows.sort((a, b) => a.date - b.date);

  const rows: string[] = [];

  rows.push([
    'Company',
    'Company Note',
    'Person',
    'Date',
    'IN (Credit)',
    'OUT (Debit)',
    'Balance',
    'Transaction Note',
  ].map(csv).join(','));

  // 3️⃣ ONE company-wide balance
  let companyBalance = 0;

  for (const r of allRows) {
    companyBalance += r.type === 'credit' ? r.amount : -r.amount;

    rows.push([
      csv(company.name),
      csv(company.note ?? ''),
      csv(r.person),
      csv(formatDateTime(r.date)),
      r.type === 'credit' ? csv(formatAmount(r.amount)) : csv(''),
      r.type === 'debit' ? csv(formatAmount(r.amount)) : csv(''),
      csv(formatAmount(companyBalance)),
      csv(r.note ?? ''),
    ].join(','));
  }

  const csvContent = rows.join('\n');
  const filename = `${company.name.replace(/\s+/g, '_')}_ledger.csv`;

  Alert.alert(
    'Export Company Ledger',
    'Choose export method',
    [
      { text: 'Download', onPress: () => downloadCsv(filename, csvContent) },
      { text: 'Share', onPress: () => shareCsv(filename, csvContent) },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
}


/* ============================
   EXPORT PERSON CSV
============================ */

export async function exportPersonCsv(personId: number) {
  const person = await getPersonById(personId);
  if (!person) return;

  const txns = await getTransactionsByPerson(personId);
  if (!txns.length) return;

  const rows: string[] = [];

  rows.push([
    'Person',
    'Date',
    'IN (Credit)',
    'OUT (Debit)',
    'Balance',
    'Transaction Note',
  ].map(csv).join(','));

  const asc = [...txns].sort((a, b) => a.date - b.date);
  let balance = 0;

  for (const t of asc) {
    balance += t.type === 'credit' ? t.amount : -t.amount;

    rows.push([
      csv(person.name),
      csv(formatDateTime(t.date)),
      t.type === 'credit' ? csv(formatAmount(t.amount)) : csv(''),
      t.type === 'debit' ? csv(formatAmount(t.amount)) : csv(''),
      csv(formatAmount(balance)),
      csv(t.note ?? ''),
    ].join(','));
  }

  const csvContent = rows.join('\n');
  const filename = `${person.name.replace(/\s+/g, '_')}_ledger.csv`;

  Alert.alert(
    'Export Person Ledger',
    'Choose export method',
    [
      { text: 'Download', onPress: () => downloadCsv(filename, csvContent) },
      { text: 'Share', onPress: () => shareCsv(filename, csvContent) },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
}

//---------------9-------------