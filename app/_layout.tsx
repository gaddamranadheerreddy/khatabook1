// import { useEffect, useState } from 'react';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import { useFrameworkReady } from '@/hooks/useFrameworkReady';
// import { initDatabase } from '@/database/init';

// export default function RootLayout() {
//   useFrameworkReady();
//   const [dbInitialized, setDbInitialized] = useState(false);

//   useEffect(() => {
//     async function setupDatabase() {
//       try {
//         await initDatabase();
//         setDbInitialized(true);
//       } catch (error) {
//         console.error('Failed to initialize database:', error);
//       }
//     }
//     setupDatabase();
//   }, []);

//   if (!dbInitialized) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   return (
//     <>
//       <Stack screenOptions={{ headerShown: true }}>
//         <Stack.Screen
//           name="index"
//           options={{ title: 'My Khata', headerShown: true }}
//         />
//         <Stack.Screen
//           name="add-person"
//           options={{ title: 'Add Person', presentation: 'modal' }}
//         />
//         <Stack.Screen
//           name="ledger"
//           options={{ title: 'Ledger' }}
//         />
//         <Stack.Screen
//           name="add-transaction"
//           options={{ title: 'Add Transaction', presentation: 'modal' }}
//         />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
// });

//----------1-------------


//------------------2--------------
// import { useEffect, useState } from 'react';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import { useFrameworkReady } from '@/hooks/useFrameworkReady';
// import { initDatabase } from '@/database/init';
// import { CompanyProvider } from '@/context/CompanyContext';

// export default function RootLayout() {
//   useFrameworkReady();
//   const [dbInitialized, setDbInitialized] = useState(false);

//   useEffect(() => {
//     async function setupDatabase() {
//       try {
//         await initDatabase();
//         setDbInitialized(true);
//       } catch (error) {
//         console.error('Failed to initialize database:', error);
//       }
//     }
//     setupDatabase();
//   }, []);

//   if (!dbInitialized) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   return (
//     <CompanyProvider>
//       <Stack screenOptions={{ headerShown: true }}>
//         <Stack.Screen name="index" options={{ title: 'My Khata' }} />
//         <Stack.Screen name="add-person" options={{ title: 'Add Person', presentation: 'modal' }} />
//         <Stack.Screen name="ledger" options={{ title: 'Ledger' }} />
//         <Stack.Screen
//           name="add-transaction"
//           options={{ title: 'Add Transaction', presentation: 'modal' }}
//         />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </CompanyProvider>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
// });

//------------------2-----------------

//---------3--------------------
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { initDatabase } from '@/database/service';
import { CompanyProvider } from '@/context/CompanyContext';

export default function RootLayout() {
  useFrameworkReady();
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function setupDatabase() {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    }
    setupDatabase();
  }, []);

  if (!dbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

//   <Stack.Screen
//   name="add-company"
//   options={{ title: 'Add Company', presentation: 'modal' }}
//     />
<Stack.Screen
  name="company-switcher"
  options={{ title: 'Select Company', presentation: 'modal' }}
/>


  // ✅ CompanyProvider is mounted ONLY AFTER DB is ready
  return (
    <CompanyProvider>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: 'My Khata' }} />
        <Stack.Screen
          name="add-person"
          options={{ title: 'Add Person', presentation: 'modal' }}
        />
        <Stack.Screen name="ledger" options={{ title: 'Ledger' }} />
        <Stack.Screen
          name="add-transaction"
          options={{ title: 'Add Transaction', presentation: 'modal' }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </CompanyProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

//--------------3------------------