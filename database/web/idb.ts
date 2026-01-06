// import { openDB } from 'idb';

// export const dbPromise = openDB('khata-web-db', 1, {
//   upgrade(db) {
//     if (!db.objectStoreNames.contains('companies')) {
//       db.createObjectStore('companies', { keyPath: 'id' });
//     }

//     if (!db.objectStoreNames.contains('people')) {
//       db.createObjectStore('people', { keyPath: 'id' });
//     }

//     if (!db.objectStoreNames.contains('transactions')) {
//       const store = db.createObjectStore('transactions', { keyPath: 'id' });
//       store.createIndex('person_id', 'person_id');
//     }
//   },
// });


//------------1-------------


//--------------2--------------------
// import { openDB, IDBPDatabase } from 'idb';

// export const dbPromise = openDB('khata-web-db', 1, {
//   upgrade(db: IDBPDatabase) {
//     if (!db.objectStoreNames.contains('companies')) {
//       db.createObjectStore('companies', { keyPath: 'id' });
//     }

//     if (!db.objectStoreNames.contains('people')) {
//       db.createObjectStore('people', { keyPath: 'id' });
//     }

//     if (!db.objectStoreNames.contains('transactions')) {
//       const store = db.createObjectStore('transactions', { keyPath: 'id' });
//       store.createIndex('person_id', 'person_id');
//     }
//   },
// });

//-------2----------------------


//-------------3---------------
// import { openDB, IDBPDatabase } from '../../web/node_modules/idb';

// /**
//  * Web IndexedDB database
//  * Mirrors SQLite structure
//  */
// export const dbPromise = openDB('khata-web-db', 1, {
//   upgrade(db: IDBPDatabase) {
//     /* ======================
//        COMPANIES
//     ======================= */
//     if (!db.objectStoreNames.contains('companies')) {
//       db.createObjectStore('companies', { keyPath: 'id' });
//     }

//     /* ======================
//        PEOPLE
//     ======================= */
//     if (!db.objectStoreNames.contains('people')) {
//       const store = db.createObjectStore('people', { keyPath: 'id' });
//       store.createIndex('company_id', 'company_id');
//     }

//     /* ======================
//        TRANSACTIONS
//     ======================= */
//     if (!db.objectStoreNames.contains('transactions')) {
//       const store = db.createObjectStore('transactions', { keyPath: 'id' });
//       store.createIndex('person_id', 'person_id');
//       store.createIndex('date', 'date');
//     }
//   },
// });

//-------------3--------------------

//---------4-----------------
// import { openDB, IDBPDatabase } from '../../web/node_modules/idb';

// const DB_NAME = 'mykhata-db';
// const DB_VERSION = 1;

// export interface MyKhataDB {
//   companies: any;
//   people: any;
//   transactions: any;
// }

// let dbPromise: Promise<IDBPDatabase<MyKhataDB>> | null = null;

// export function getDB() {
//   if (!dbPromise) {
//     dbPromise = openDB<MyKhataDB>(DB_NAME, DB_VERSION, {
//       upgrade(db) {
//         if (!db.objectStoreNames.contains('companies')) {
//           const store = db.createObjectStore('companies', {
//             keyPath: 'id',
//             autoIncrement: true,
//           });
//           store.createIndex('name', 'name');
//         }

//         if (!db.objectStoreNames.contains('people')) {
//           const store = db.createObjectStore('people', {
//             keyPath: 'id',
//             autoIncrement: true,
//           });
//           store.createIndex('company_id', 'company_id');
//         }

//         if (!db.objectStoreNames.contains('transactions')) {
//           const store = db.createObjectStore('transactions', {
//             keyPath: 'id',
//             autoIncrement: true,
//           });
//           store.createIndex('person_id', 'person_id');
//           store.createIndex('date', 'date');
//         }
//       },
//     });
//   }

//   return dbPromise;
// }

//-------------4-----------------

//-----------5--------------
// import { openDB, IDBPDatabase } from '../../web/node_modules/idb';
// import type {
//   Person,
//   Transaction,
// } from '../types';

// export interface MyKhataDB {
//   companies: {
//     key: number;
//     value: {
//       id: number;
//       name: string;
//       note?: string | null;
//       created_at: number;
//     };
//   };

//   people: {
//     key: number;
//     value: Person;
//     indexes: {
//       'by-company': number;
//     };
//   };

//   transactions: {
//     key: number;
//     value: Transaction;
//     indexes: {
//       'by-person': number;
//       'by-date': number;
//     };
//   };
// }

// let dbPromise: Promise<IDBPDatabase<MyKhataDB>> | null = null;

// export function getDB() {
//   if (!dbPromise) {
//     dbPromise = openDB<MyKhataDB>('my-khata-db', 1, {
//       upgrade(db) {
//         /* ======================
//            COMPANIES
//         ======================= */
//         if (!db.objectStoreNames.contains('companies')) {
//           const store = db.createObjectStore('companies', {
//             keyPath: 'id',
//           });
//           store.createIndex('name', 'name');
//         }

//         /* ======================
//            PEOPLE
//         ======================= */
//         if (!db.objectStoreNames.contains('people')) {
//           const store = db.createObjectStore('people', {
//             keyPath: 'id',
//           });
//           store.createIndex('by-company', 'company_id');
//         }

//         /* ======================
//            TRANSACTIONS
//         ======================= */
//         if (!db.objectStoreNames.contains('transactions')) {
//           const store = db.createObjectStore('transactions', {
//             keyPath: 'id',
//           });
//           store.createIndex('by-person', 'person_id');
//           store.createIndex('by-date', 'date');
//         }
//       },
//     });
//   }

//   return dbPromise;
// }

//------------5-------------

//---------6-----------------
import { openDB, IDBPDatabase } from '../../web/node_modules/idb';
import type {
  Person,
  Transaction,
} from '../types';

export interface MyKhataDB {
  companies: {
    key: number;
    value: {
      id: number;
      name: string;
      note?: string | null;
      created_at: number;
    };
    indexes: {
      'by-name': string;
    };
  };

  people: {
    key: number;
    value: Person;
    indexes: {
      'by-company': number;
    };
  };

  transactions: {
    key: number;
    value: Transaction;
    indexes: {
      'by-person': number;
      'by-date': number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<MyKhataDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<MyKhataDB>('my-khata-db', 1, {
      upgrade(db) {
        /* ======================
           COMPANIES
        ======================= */
        if (!db.objectStoreNames.contains('companies')) {
          const store = db.createObjectStore('companies', {
            keyPath: 'id',
            autoIncrement: true, // ✅ FIX
          });
          store.createIndex('by-name', 'name');
        }

        /* ======================
           PEOPLE
        ======================= */
        if (!db.objectStoreNames.contains('people')) {
          const store = db.createObjectStore('people', {
            keyPath: 'id',
            autoIncrement: true, // ✅ FIX
          });
          store.createIndex('by-company', 'company_id');
        }

        /* ======================
           TRANSACTIONS
        ======================= */
        if (!db.objectStoreNames.contains('transactions')) {
          const store = db.createObjectStore('transactions', {
            keyPath: 'id',
            autoIncrement: true, // ✅ FIX
          });
          store.createIndex('by-person', 'person_id');
          store.createIndex('by-date', 'date');
        }
      },
    });
  }

  return dbPromise;
}

//-------------6-----------------