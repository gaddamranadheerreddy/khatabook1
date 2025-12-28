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
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import {
  getCompanies,
  getPeopleWithBalances,
  getPersonById,
  getTransactionsByPerson,
} from '@/database/service';

/* ============================
   HELPERS
============================ */

const formatAmount = (n: number | null | undefined) =>
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

async function writeAndShare(csv: string, filename: string) {
  const path = FileSystem.cacheDirectory + filename;
  await FileSystem.writeAsStringAsync(path, csv);
  await Sharing.shareAsync(path, {
    mimeType: 'text/csv',
    dialogTitle: 'Export CSV',
  });
}

/* ============================
   EXPORT COMPANY CSV
============================ */

export async function exportCompanyCsv(companyId: number | null) {
  const companies = await getCompanies();
  const company =
    companyId === null
      ? { id: null, name: 'All Companies', note: '' }
      : companies.find(c => c.id === companyId);

  if (!company) return;

  const people = await getPeopleWithBalances(companyId);

  const rows: string[] = [];

  // HEADER
  rows.push(
    [
      'Company',
      'Company Note',
      'Person',
      'Date',
      'IN (Credit)',
      'OUT (Debit)',
      'Balance',
      'Transaction Note',
    ].join(',')
  );

  for (const person of people) {
    const txns = await getTransactionsByPerson(person.id);

    if (!txns.length) continue;

    // 🔹 1. ASC for balance calculation
    const asc = [...txns].sort((a, b) => a.date - b.date);

    let running = 0;
    const balanceMap = new Map<number, number>();

    for (const t of asc) {
      if (t.type === 'credit') running += t.amount; // IN
      else running -= t.amount; // OUT
      balanceMap.set(t.id, running);
    }

    // 🔹 2. DESC for export (latest first)
    const desc = [...txns].sort((a, b) => b.date - a.date);

    for (const t of desc) {
      rows.push(
        [
          `"${company.name}"`,
          `"${company.note ?? ''}"`,
          `"${person.name}"`,
          `"${formatDateTime(t.date)}"`,
          t.type === 'credit' ? formatAmount(t.amount) : '',
          t.type === 'debit' ? formatAmount(t.amount) : '',
          formatAmount(balanceMap.get(t.id)),
          `"${t.note ?? ''}"`,
        ].join(',')
      );
    }
  }

  await writeAndShare(
    rows.join('\n'),
    `${company.name.replace(/\s+/g, '_')}_ledger.csv`
  );
}

/* ============================
   EXPORT PERSON CSV
============================ */

export async function exportPersonCsv(personId: number) {
  const person = await getPersonById(personId);
  if (!person) throw new Error('Person not found');

  const txns = await getTransactionsByPerson(personId);
  if (!txns.length) return;

  const personName = person.name;

  const rows: string[] = [];

  // ======================
  // CSV HEADER
  // ======================
  rows.push(
    [
      'Person',
      'Date',
      'IN (Credit)',
      'OUT (Debit)',
      'Balance',
      'Transaction Note',
    ].join(',')
  );

  // ======================
  // BALANCE CALCULATION (ASC)
  // ======================
  const asc = [...txns].sort((a, b) => a.date - b.date);
  let running = 0;
  const balanceMap = new Map<number, number>();

  for (const t of asc) {
    if (t.type === 'credit') running += t.amount; // IN
    else running -= t.amount; // OUT

    balanceMap.set(t.id, running);
  }

  // ======================
  // EXPORT (DESC – latest first)
  // ======================
  const desc = [...txns].sort((a, b) => b.date - a.date);

  for (const t of desc) {
    rows.push(
      [
        `"${personName}"`,
        `"${formatDateTime(t.date)}"`,
        t.type === 'credit' ? formatAmount(t.amount) : '',
        t.type === 'debit' ? formatAmount(t.amount) : '',
        formatAmount(balanceMap.get(t.id) ?? 0),
        `"${t.note ?? ''}"`,
      ].join(',')
    );
  }

  await writeAndShare(
    rows.join('\n'),
    `${personName.replace(/\s+/g, '_')}_ledger.csv`
  );
}


//--------------3-------------