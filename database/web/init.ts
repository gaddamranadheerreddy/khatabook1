// import { getDB } from './idb';

// export async function initWebDB() {
//   const db = await getDB();
//   const count = await db.count('companies');

//   if (count === 0) {
//     await db.add('companies', {
//       name: 'My Business',
//       note: '',
//       created_at: Date.now(),
//     });
//   }
// }

////////---------1------------

//------------2--------------
import { getDB } from './idb';

export async function initDatabase() {
  console.log('🌐 Initializing IndexedDB');

  const db = await getDB();
  const count = await db.count('companies');

  if (count === 0) {
    await db.add('companies', {
        id:Date.now(),
      name: 'My Business',
      note: '',
      created_at: Date.now(),
    });
  }
}

//------------2------------------