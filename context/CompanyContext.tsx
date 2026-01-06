// import React, { createContext, useContext, useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getCompanies } from '@/database/service';

// type Company = {
//   id: number;
//   name: string;
//   note?: string | null;
// };

// type CompanyContextType = {
//   companies: Company[];
//   selectedCompanyId: number | null; // null = ALL
//   setSelectedCompanyId: (id: number | null) => void;
//   reloadCompanies: () => Promise<void>;
//   loading: boolean;
// };

// const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// const STORAGE_KEY = 'SELECTED_COMPANY_ID';

// export function CompanyProvider({ children }: { children: React.ReactNode }) {
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [selectedCompanyId, setSelectedCompanyIdState] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function init() {
//       try {
//         const stored = await AsyncStorage.getItem(STORAGE_KEY);
//         if (stored !== null) {
//           setSelectedCompanyIdState(stored === 'ALL' ? null : Number(stored));
//         }

//         const dbCompanies = await getCompanies();
//         setCompanies(dbCompanies as Company[]);
//       } catch (e) {
//         console.error('Company init failed', e);
//       } finally {
//         setLoading(false);
//       }
//     }

//     init();
//   }, []);

//   const setSelectedCompanyId = async (id: number | null) => {
//     setSelectedCompanyIdState(id);
//     await AsyncStorage.setItem(STORAGE_KEY, id === null ? 'ALL' : String(id));
//   };

//   const reloadCompanies = async () => {
//   const list = await getCompanies();
//   setCompanies(list);
// };


//   return (
//     <CompanyContext.Provider
//       value={{
//         companies,
//         selectedCompanyId,
//         setSelectedCompanyId,
//         reloadCompanies,
//         loading,
//       }}
//     >
//       {children}
//     </CompanyContext.Provider>
//   );
// }

// export function useCompany() {
//   const ctx = useContext(CompanyContext);
//   if (!ctx) {
//     throw new Error('useCompany must be used inside CompanyProvider');
//   }
//   return ctx;
// }


//-------------1----------------


//-------2-------------------------
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getCompanies } from '@/database/service';

// type Company = {
//   id: number;
//   name: string;
//   note?: string | null;
// };

// type CompanyContextType = {
//   companies: Company[];
//   selectedCompanyId: number | null;
//   setSelectedCompanyId: (id: number | null) => Promise<void>;
//   reloadCompanies: () => Promise<void>;
//   loading: boolean;
// };

// const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// const STORAGE_KEY = 'SELECTED_COMPANY_ID';

// export function CompanyProvider({ children }: { children: React.ReactNode }) {
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [selectedCompanyId, setSelectedCompanyIdState] =
//     useState<number | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     init();
//   }, []);

//   const init = async () => {
//     try {
//       const stored = await AsyncStorage.getItem(STORAGE_KEY);
//       const dbCompanies = await getCompanies();
      
//       setCompanies(dbCompanies as Company[]);

//       if (stored === 'ALL' || stored === null) {
//         setSelectedCompanyIdState(null);
//       } else {
//         const id = Number(stored);
//         setSelectedCompanyIdState(
//           dbCompanies.some(c => c.id === id) ? id : null
//         );
//       }
//     } catch (e) {
//       console.error('Company init failed', e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setSelectedCompanyId = async (id: number | null) => {
//     setSelectedCompanyIdState(id);
//     await AsyncStorage.setItem(
//       STORAGE_KEY,
//       id === null ? 'ALL' : String(id)
//     );
//   };

//   const reloadCompanies = async () => {
//     const list = await getCompanies();
//     setCompanies(list);

//     if (
//       selectedCompanyId !== null &&
//       !list.some(c => c.id === selectedCompanyId)
//     ) {
//       await setSelectedCompanyId(null);
//     }
//   };

//   return (
//     <CompanyContext.Provider
//       value={{
//         companies,
//         selectedCompanyId,
//         setSelectedCompanyId,
//         reloadCompanies,
//         loading,
//       }}
//     >
//       {children}
//     </CompanyContext.Provider>
//   );
// }

// export function useCompany() {
//   const ctx = useContext(CompanyContext);
//   if (!ctx) {
//     throw new Error('useCompany must be used inside CompanyProvider');
//   }
//   return ctx;
// }

//------------2------------------------

//------------3------------------
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDatabase, getCompanies } from '@/database/service';

type Company = {
  id: number;
  name: string;
  note?: string | null;
};

type CompanyContextType = {
  companies: Company[];
  selectedCompanyId: number | null;
  setSelectedCompanyId: (id: number | null) => Promise<void>;
  reloadCompanies: () => Promise<void>;
  loading: boolean;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const STORAGE_KEY = 'SELECTED_COMPANY_ID';

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyIdState] =
    useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      /* =========================
         INIT DATABASE (IMPORTANT)
      ========================== */
      await initDatabase(); // 🔑 FIX FOR WEB
      setInitialized(true);

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const dbCompanies = await getCompanies();

      setCompanies(dbCompanies as Company[]);

      if (stored === 'ALL' || stored === null) {
        setSelectedCompanyIdState(null);
      } else {
        const id = Number(stored);
        setSelectedCompanyIdState(
          dbCompanies.some(c => c.id === id) ? id : null
        );
      }
    } catch (e) {
      console.error('Company init failed', e);
    } finally {
      setLoading(false);
    }
  };

  const setSelectedCompanyId = async (id: number | null) => {
    setSelectedCompanyIdState(id);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      id === null ? 'ALL' : String(id)
    );
  };

  const reloadCompanies = async () => {
    if (!initialized) return;

    const list = await getCompanies();
    setCompanies(list);

    if (
      selectedCompanyId !== null &&
      !list.some(c => c.id === selectedCompanyId)
    ) {
      await setSelectedCompanyId(null);
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        selectedCompanyId,
        setSelectedCompanyId,
        reloadCompanies,
        loading,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) {
    throw new Error('useCompany must be used inside CompanyProvider');
  }
  return ctx;
}

//------------3-----------------------