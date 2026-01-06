// import { dbPromise } from './idb';

// /* ========= COMPANIES ========= */

// export async function getCompanies() {
//   const db = await dbPromise;
//   return db.getAll('companies');
// }

// export async function addCompany(company: any) {
//   const db = await dbPromise;
//   await db.put('companies', company);
// }

// export async function updateCompany(id: number, name: string, note: string) {
//   const db = await dbPromise;
//   const company = await db.get('companies', id);
//   if (!company) return;
//   await db.put('companies', { ...company, name, note });
// }

// export async function deleteCompany(id: number) {
//   const db = await dbPromise;
//   await db.delete('companies', id);
// }

// /* ========= PEOPLE ========= */

// export async function getPeopleWithBalances(companyId: number | null) {
//   const db = await dbPromise;
//   const people = await db.getAll('people');
//   const txns = await db.getAll('transactions');

//   return people
//     .filter(p => companyId === null || p.company_id === companyId)
//     .map(p => {
//       let credit = 0;
//       let debit = 0;

//       txns
//         .filter(t => t.person_id === p.id)
//         .forEach(t => {
//           if (t.type === 'credit') credit += t.amount;
//           else debit += t.amount;
//         });

//       return {
//         ...p,
//         total_credit: credit,
//         total_debit: debit,
//         balance: credit - debit,
//       };
//     });
// }

// /* ========= TRANSACTIONS ========= */

// export async function addTransaction(txn: any) {
//   const db = await dbPromise;
//   await db.put('transactions', txn);
// }

// export async function getTransactionsByPerson(personId: number) {
//   const db = await dbPromise;
//   const index = db.transaction('transactions').store.index('person_id');
//   return index.getAll(personId);
// }


//-----------1-----------

//-------------2------------
// import { getDB } from './idb';
// import {
//   Person,
//   Transaction,
//   PersonWithBalance,
//   PersonInput,
//   TransactionInput,
// } from '../types';

// /* =====================
//    COMPANIES
// ===================== */

// export async function getCompanies(): Promise<Company[]> {
//   const db = await getDB();
//   return db.getAll('companies');
// }

// export async function updateCompany(
//   id: number,
//   name: string,
//   note: string
// ) {
//   const db = await getDB();
//   const company = await db.get('companies', id);
//   if (!company) return;

//   await db.put('companies', { ...company, name, note });
// }

// /* =====================
//    PEOPLE
// ===================== */

// export async function getPeopleWithBalances(
//   companyId: number | null
// ): Promise<PersonWithBalance[]> {
//   const db = await getDB();
//   const people = await db.getAll('people');

//   const filtered = companyId === null
//     ? people
//     : people.filter(p => p.company_id === companyId);

//   const txns = await db.getAll('transactions');

//   return filtered.map(p => {
//     let balance = 0;
//     let total_credit = 0;
//     let total_debit = 0;

//     txns
//       .filter(t => t.person_id === p.id)
//       .forEach(t => {
//         if (t.type === 'credit') {
//           balance += t.amount;
//           total_credit += t.amount;
//         } else {
//           balance -= t.amount;
//           total_debit += t.amount;
//         }
//       });

//     return {
//       ...p,
//       balance,
//       total_credit,
//       total_debit,
//     };
//   });
// }

// /* =====================
//    TRANSACTIONS
// ===================== */

// export async function getTransactionsByPerson(
//   personId: number
// ): Promise<Transaction[]> {
//   const db = await getDB();
//   const all = await db.getAllFromIndex(
//     'transactions',
//     'person_id',
//     personId
//   );

//   return all.sort((a, b) => b.date - a.date);
// }

// export async function addTransaction(
//   data: Omit<Transaction, 'id' | 'created_at'>
// ) {
//   const db = await getDB();
//   await db.add('transactions', {
//     ...data,
//     created_at: Date.now(),
//   });
// }

//--------------2-------------

//-----------3--------------
// import { getDB } from './idb';
// import type {
//   Person,
//   Transaction,
//   PersonWithBalance,
//   TransactionInput,
//   PersonInput,
// } from '../types';

// /* =========================
//    HELPERS
// ========================= */

// const now = () => Math.floor(Date.now() / 1000);
// const genId = () => Date.now();

// /* =========================
//    COMPANIES
// ========================= */

// export async function getCompanies() {
//   const db = await getDB();
//   return db.getAll('companies');
// }

// export async function addCompany(name: string, note = '') {
//   const db = await getDB();
//   const id = genId();

//   await db.put('companies', {
//     id,
//     name,
//     note,
//     created_at: now(),
//   });

//   return id;
// }

// export async function updateCompany(
//   id: number,
//   name: string,
//   note: string
// ) {
//   const db = await getDB();
//   const company = await db.get('companies', id);
//   if (!company) return;

//   await db.put('companies', {
//     ...company,
//     name,
//     note,
//   });
// }

// export async function deleteCompany(companyId: number) {
//   const db = await getDB();

//   const people = await db.getAllFromIndex(
//     'people',
//     'by-company',
//     companyId
//   );

//   for (const p of people) {
//     await deletePerson(p.id);
//   }

//   await db.delete('companies', companyId);
// }

// /* =========================
//    PEOPLE
// ========================= */

// export async function addPerson(
//   companyId: number,
//   input: PersonInput
// ) {
//   const db = await getDB();
//   const id = genId();

//   const person: Person = {
//     id,
//     name: input.name,
//     phone: input.phone ?? null,
//     company_id: companyId,
//     created_at: now(),
//   };

//   await db.put('people', person);
//   return id;
// }

// export async function getPersonById(personId: number) {
//   const db = await getDB();
//   return db.get('people', personId);
// }

// export async function deletePerson(personId: number) {
//   const db = await getDB();

//   const txns = await db.getAllFromIndex(
//     'transactions',
//     'by-person',
//     personId
//   );

//   for (const t of txns) {
//     await db.delete('transactions', t.id);
//   }

//   await db.delete('people', personId);
// }

// /* =========================
//    TRANSACTIONS
// ========================= */

// export async function addTransaction(input: TransactionInput) {
//   const db = await getDB();
//   const id = genId();

//   const txn: Transaction = {
//     id,
//     person_id: input.person_id,
//     amount: input.amount,
//     type: input.type,
//     note: input.note ?? null,
//     date: input.date,
//     created_at: now(),
//   };

//   await db.put('transactions', txn);
//   return id;
// }

// export async function deleteTransaction(transactionId: number) {
//   const db = await getDB();
//   await db.delete('transactions', transactionId);
// }

// export async function getTransactionsByPerson(personId: number) {
//   const db = await getDB();

//   const txns = await db.getAllFromIndex(
//     'transactions',
//     'by-person',
//     personId
//   );

//   return txns.sort((a, b) => b.date - a.date);
// }

// /* =========================
//    BALANCE LOGIC
// ========================= */

// export async function getPeopleWithBalances(
//   companyId: number | null
// ): Promise<PersonWithBalance[]> {
//   const db = await getDB();

//   const people =
//     companyId === null
//       ? await db.getAll('people')
//       : await db.getAllFromIndex(
//           'people',
//           'by-company',
//           companyId
//         );

//   const result: PersonWithBalance[] = [];

//   for (const p of people) {
//     const txns = await db.getAllFromIndex(
//       'transactions',
//       'by-person',
//       p.id
//     );

//     let credit = 0;
//     let debit = 0;

//     for (const t of txns) {
//       if (t.type === 'credit') credit += t.amount;
//       else debit += t.amount;
//     }

//     result.push({
//       ...p,
//       balance: credit - debit,
//       total_credit: credit,
//       total_debit: debit,
//     });
//   }

//   return result;
// }

// export async function getPersonWithBalance(personId: number) {
//   const db = await getDB();
//   const person = await db.get('people', personId);
//   if (!person) return null;

//   const txns = await db.getAllFromIndex(
//     'transactions',
//     'by-person',
//     personId
//   );

//   let credit = 0;
//   let debit = 0;

//   for (const t of txns) {
//     if (t.type === 'credit') credit += t.amount;
//     else debit += t.amount;
//   }

//   return {
//     ...person,
//     balance: credit - debit,
//     total_credit: credit,
//     total_debit: debit,
//   };
// }

//--------------3--------------

//---------4--------------
// database/web/service.ts
import { getDB } from './idb';
import { initDatabase } from './init';
import {
  Person,
  Transaction,
  PersonWithBalance,
  TransactionInput,
  PersonInput,
} from '../types';

export interface Company {
  id: number;
  name: string;
  note?: string | null;
  created_at: number;
}

/* ======================
   COMPANIES
====================== */

export async function getCompanies(): Promise<Company[]> {
  const db = await getDB();
  return await db.getAll('companies');
}

export async function addCompany(
  name: string,
  note?: string
): Promise<number> {
  const db = await getDB();
  const id = Date.now();
  await db.add('companies', {
    id,
    name,
    note: note ?? null,
    created_at: Date.now(),
  });
  return id;
}

export async function updateCompany(
  id: number,
  name: string,
  note?: string
) {
  const db = await getDB();
  const company = await db.get('companies', id);
  if (!company) return;

  await db.put('companies', {
    ...company,
    name,
    note: note ?? null,
  });
}

// export async function deleteCompany(companyId: number) {
//   const db = await getDB();

//   const count = await db.count('companies');
//   if (count <= 1) {
//     throw new Error('Cannot delete last company');
//   }

//   const people = await db.getAllFromIndex('people', 'by-company', companyId);
//   for (const p of people) {
//     const txns = await db.getAllFromIndex('transactions', 'by-person', p.id);
//     for (const t of txns) {
//       await db.delete('transactions', t.id);
//     }
//     await db.delete('people', p.id);
//   }

//   await db.delete('companies', companyId);
// }


export async function deleteCompany(companyId: number) {
  await initDatabase(); // ✅ GUARANTEE DB READY
  const db = await getDB();

  const count = await db.count('companies');
  if (count <= 1) {
    throw new Error('Cannot delete last company');
  }

  const cid = Number(companyId); // ✅ ensure number

  const people = await db.getAllFromIndex('people', 'by-company', cid);

  for (const p of people) {
    const txns = await db.getAllFromIndex(
      'transactions',
      'by-person',
      Number(p.id)
    );

    for (const t of txns) {
      await db.delete('transactions', t.id);
    }

    await db.delete('people', p.id);
  }

  await db.delete('companies', cid);
}


export async function getCompanyById(id: number) {
  const db = await getDB();
  return (await db.get('companies', id)) ?? null;
}

/* ======================
   PEOPLE
====================== */

export async function addPerson(
  input: PersonInput & { company_id: number }
) {
  const db = await getDB();
  const id = Date.now();

  await db.add('people', {
    id,
    name: input.name,
    phone: input.phone ?? null,
    company_id: input.company_id,
    created_at: Date.now(),
  });

  return id;
}

export async function getPeopleWithBalances(
  companyId: number | null
): Promise<PersonWithBalance[]> {
  const db = await getDB();

  const people =
    companyId === null
      ? await db.getAll('people')
      : await db.getAllFromIndex('people', 'by-company', companyId);

  const result: PersonWithBalance[] = [];

  for (const p of people) {
    const txns = await db.getAllFromIndex(
      'transactions',
      'by-person',
      p.id
    );

    let total_credit = 0;
    let total_debit = 0;

    for (const t of txns) {
      if (t.type === 'credit') total_credit += t.amount;
      else total_debit += t.amount;
    }

    result.push({
      ...p,
      total_credit,
      total_debit,
      balance: total_credit - total_debit,
    });
  }

  return result;
}

export async function getPersonWithBalance(personId: number) {
  const db = await getDB();
  const person = await db.get('people', personId);
  if (!person) return null;

  const txns = await db.getAllFromIndex(
    'transactions',
    'by-person',
    personId
  );

  let credit = 0;
  let debit = 0;

  for (const t of txns) {
    if (t.type === 'credit') credit += t.amount;
    else debit += t.amount;
  }

  return {
    ...person,
    balance: credit - debit,
    total_credit: credit,
    total_debit: debit,
  };
}

export async function getPersonById(id: number) {
  const db = await getDB();
  return (await db.get('people', id)) ?? null;
}

export async function updatePerson(
  id: number,
  data: { name: string; phone?: string | null }
) {
  const db = await getDB();
  const person = await db.get('people', id);
  if (!person) return;

  await db.put('people', {
    ...person,
    name: data.name,
    phone: data.phone ?? null,
  });
}

// export async function deletePerson(personId: number) {
//   const db = await getDB();
//   const txns = await db.getAllFromIndex('transactions', 'by-person', personId);
//   for (const t of txns) {
//     await db.delete('transactions', t.id);
//   }
//   await db.delete('people', personId);
// }

export async function deletePerson(personId: number) {
  await initDatabase(); // ✅ REQUIRED
  const db = await getDB();

  const pid = Number(personId);

  const txns = await db.getAllFromIndex(
    'transactions',
    'by-person',
    pid
  );

  for (const t of txns) {
    await db.delete('transactions', t.id);
  }

  await db.delete('people', pid);
}


/* ======================
   TRANSACTIONS
====================== */

export async function addTransaction(input: TransactionInput) {
  const db = await getDB();
  const id = Date.now();

  await db.add('transactions', {
    id,
    person_id: input.person_id,
    amount: input.amount,
    type: input.type,
    note: input.note ?? null,
    date: input.date,
    created_at: Date.now(),
  });

  return id;
}

export async function getTransactionsByPerson(
  personId: number
): Promise<Transaction[]> {
  const db = await getDB();
  const txns = await db.getAllFromIndex(
    'transactions',
    'by-person',
    personId
  );
  return txns.sort((a, b) => b.date - a.date);
}

export async function deleteTransaction(id: number) {
  const db = await getDB();
  await db.delete('transactions', id);
}

//----------------4-------------