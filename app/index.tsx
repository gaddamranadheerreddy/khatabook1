// import { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
// } from 'react-native';
// import { useRouter, useFocusEffect } from 'expo-router';
// import { Plus, ChevronRight, User } from 'lucide-react-native';
// import { getPeopleWithBalances } from '@/database/service';
// import { PersonWithBalance } from '@/database/types';

// export default function HomeScreen() {
//   const router = useRouter();
//   const [people, setPeople] = useState<PersonWithBalance[]>([]);
//   const [refreshing, setRefreshing] = useState(false);

//   const loadPeople = useCallback(async () => {
//     try {
//       const data = await getPeopleWithBalances();
//       setPeople(data);
//     } catch (error) {
//       console.error('Failed to load people:', error);
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       loadPeople();
//     }, [loadPeople])
//   );

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadPeople();
//     setRefreshing(false);
//   }, [loadPeople]);

//   const formatCurrency = (amount: number) => {
//     return `₹${Math.abs(amount).toFixed(2)}`;
//   };

//   const renderPerson = ({ item }: { item: PersonWithBalance }) => {
//     const isPositive = item.balance >= 0;
//     const balanceColor = isPositive ? '#10B981' : '#EF4444';

//     return (
//       <TouchableOpacity
//         style={styles.personCard}
//         onPress={() => router.push({ pathname: '/ledger', params: { personId: item.id } })}
//       >
//         <View style={styles.personIcon}>
//           <User size={24} color="#6B7280" />
//         </View>
//         <View style={styles.personInfo}>
//           <Text style={styles.personName}>{item.name}</Text>
//           {item.phone && <Text style={styles.personPhone}>{item.phone}</Text>}
//         </View>
//         <View style={styles.balanceContainer}>
//           <Text style={[styles.balance, { color: balanceColor }]}>
//             {formatCurrency(item.balance)}
//           </Text>
//           <Text style={styles.balanceLabel}>
//             {isPositive ? 'You will get' : 'You will give'}
//           </Text>
//         </View>
//         <ChevronRight size={20} color="#9CA3AF" />
//       </TouchableOpacity>
//     );
//   };

//   const renderEmpty = () => (
//     <View style={styles.emptyContainer}>
//       <User size={64} color="#D1D5DB" />
//       <Text style={styles.emptyTitle}>No people added yet</Text>
//       <Text style={styles.emptyText}>
//         Add your first person to start tracking transactions
//       </Text>
//     </View>
//   );

//   const totalBalance = people.reduce((sum, person) => sum + person.balance, 0);
//   const isPositive = totalBalance >= 0;

//   return (
//     <View style={styles.container}>
//       {people.length > 0 && (
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryLabel}>Overall Balance</Text>
//           <Text
//             style={[
//               styles.summaryAmount,
//               { color: isPositive ? '#10B981' : '#EF4444' },
//             ]}
//           >
//             {formatCurrency(totalBalance)}
//           </Text>
//           <Text style={styles.summarySubtext}>
//             {isPositive ? 'Total you will get' : 'Total you will give'}
//           </Text>
//         </View>
//       )}

//       <FlatList
//         data={people}
//         renderItem={renderPerson}
//         keyExtractor={(item) => item.id.toString()}
//         ListEmptyComponent={renderEmpty}
//         contentContainerStyle={
//           people.length === 0 && styles.emptyListContainer
//         }
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />

//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => router.push('/add-person')}
//       >
//         <Plus size={28} color="#FFFFFF" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//   },
//   summaryCard: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     margin: 16,
//     marginBottom: 8,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 8,
//   },
//   summaryAmount: {
//     fontSize: 32,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   summarySubtext: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   personCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     marginHorizontal: 16,
//     marginVertical: 6,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   personIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   personInfo: {
//     flex: 1,
//   },
//   personName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   personPhone: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   balanceContainer: {
//     alignItems: 'flex-end',
//     marginRight: 8,
//   },
//   balance: {
//     fontSize: 16,
//     fontWeight: '700',
//     marginBottom: 2,
//   },
//   balanceLabel: {
//     fontSize: 11,
//     color: '#9CA3AF',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   emptyListContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     paddingHorizontal: 32,
//   },
//   fab: {
//     position: 'absolute',
//     right: 20,
//     bottom: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
// });

//------------1--------------

//---------------2---------------
// import { useState, useCallback, useLayoutEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
// } from 'react-native';
// import { useRouter, useFocusEffect, router } from 'expo-router';
// import { Plus, ChevronRight, User } from 'lucide-react-native';
// import { Picker } from '@react-native-picker/picker';
// import { useNavigation } from 'expo-router';

// import { getPeopleWithBalances } from '@/database/service';
// import { PersonWithBalance } from '@/database/types';
// import { useCompany } from '@/context/CompanyContext';

// export default function HomeScreen() {
// //   const router = useRouter();

// const navigation = useNavigation();


//   const { companies, selectedCompanyId, setSelectedCompanyId, loading } =
//     useCompany();

//   const [people, setPeople] = useState<PersonWithBalance[]>([]);
//   const [refreshing, setRefreshing] = useState(false);

//   const loadPeople = useCallback(async () => {
//     try {
//       const data = await getPeopleWithBalances(selectedCompanyId);
//       setPeople(data);
//     } catch (error) {
//       console.error('Failed to load people:', error);
//     }
//   }, [selectedCompanyId]);

//   useFocusEffect(
//     useCallback(() => {
//       loadPeople();
//     }, [loadPeople])
//   );

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadPeople();
//     setRefreshing(false);
//   }, [loadPeople]);

// //   useLayoutEffect(() => {
// //     router.setOptions({
// //       headerTitle: () => (
// //         <Picker
// //           selectedValue={selectedCompanyId ?? 'ALL'}
// //           onValueChange={(value) =>
// //             setSelectedCompanyId(value === 'ALL' ? null : Number(value))
// //           }
// //           style={{ width: 220 }}
// //         >
// //           <Picker.Item label="All Companies" value="ALL" />
// //           {companies.map((company) => (
// //             <Picker.Item
// //               key={company.id}
// //               label={company.name}
// //               value={company.id}
// //             />
// //           ))}
// //         </Picker>
// //       ),
// //     });
// //   }, [router, companies, selectedCompanyId]);
// useLayoutEffect(() => {
//   navigation.setOptions({
//     headerTitle: () => (
//       <Picker
//         selectedValue={selectedCompanyId ?? 'ALL'}
//         onValueChange={(value) =>
//           setSelectedCompanyId(value === 'ALL' ? null : Number(value))
//         }
//         style={{ width: 220 }}
//       >
//         <Picker.Item label="All Companies" value="ALL" />
//         {companies.map((company) => (
//           <Picker.Item
//             key={company.id}
//             label={company.name}
//             value={company.id}
//           />
//         ))}
//       </Picker>
//     ),
//   });
// }, [navigation, companies, selectedCompanyId]);

//   const formatCurrency = (amount: number) => {
//     return `₹${Math.abs(amount).toFixed(2)}`;
//   };

//   const renderPerson = ({ item }: { item: PersonWithBalance }) => {
//     const isPositive = item.balance >= 0;
//     const balanceColor = isPositive ? '#10B981' : '#EF4444';

//     return (
//       <TouchableOpacity
//         style={styles.personCard}
//         onPress={() =>
//           router.push({ pathname: '/ledger', params: { personId: item.id } })
//         }
//       >
//         <View style={styles.personIcon}>
//           <User size={24} color="#6B7280" />
//         </View>

//         <View style={styles.personInfo}>
//           <Text style={styles.personName}>{item.name}</Text>
//           {item.phone && <Text style={styles.personPhone}>{item.phone}</Text>}
//         </View>

//         <View style={styles.balanceContainer}>
//           <Text style={[styles.balance, { color: balanceColor }]}>
//             {formatCurrency(item.balance)}
//           </Text>
//           <Text style={styles.balanceLabel}>
//             {isPositive ? 'You will get' : 'You will give'}
//           </Text>
//         </View>

//         <ChevronRight size={20} color="#9CA3AF" />
//       </TouchableOpacity>
//     );
//   };

//   const renderEmpty = () => (
//     <View style={styles.emptyContainer}>
//       <User size={64} color="#D1D5DB" />
//       <Text style={styles.emptyTitle}>No people added yet</Text>
//       <Text style={styles.emptyText}>
//         Add your first person to start tracking transactions
//       </Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ textAlign: 'center', marginTop: 40 }}>
//           Loading companies…
//         </Text>
//       </View>
//     );
//   }

//   const totalBalance = people.reduce((sum, person) => sum + person.balance, 0);
//   const isPositive = totalBalance >= 0;

//   return (
//     <View style={styles.container}>
//       {people.length > 0 && (
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryLabel}>Overall Balance</Text>
//           <Text
//             style={[
//               styles.summaryAmount,
//               { color: isPositive ? '#10B981' : '#EF4444' },
//             ]}
//           >
//             {formatCurrency(totalBalance)}
//           </Text>
//           <Text style={styles.summarySubtext}>
//             {isPositive ? 'Total you will get' : 'Total you will give'}
//           </Text>
//         </View>
//       )}

//       <FlatList
//         data={people}
//         renderItem={renderPerson}
//         keyExtractor={(item) => item.id.toString()}
//         ListEmptyComponent={renderEmpty}
//         contentContainerStyle={
//           people.length === 0 && styles.emptyListContainer
//         }
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />

//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => router.push('/add-person')}
//       >
//         <Plus size={28} color="#FFFFFF" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// /* =======================
//    STYLES (UNCHANGED)
// ======================= */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//   },
//   summaryCard: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     margin: 16,
//     marginBottom: 8,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 8,
//   },
//   summaryAmount: {
//     fontSize: 32,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   summarySubtext: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   personCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     marginHorizontal: 16,
//     marginVertical: 6,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   personIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   personInfo: {
//     flex: 1,
//   },
//   personName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   personPhone: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   balanceContainer: {
//     alignItems: 'flex-end',
//     marginRight: 8,
//   },
//   balance: {
//     fontSize: 16,
//     fontWeight: '700',
//     marginBottom: 2,
//   },
//   balanceLabel: {
//     fontSize: 11,
//     color: '#9CA3AF',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   emptyListContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     paddingHorizontal: 32,
//   },
//   fab: {
//     position: 'absolute',
//     right: 20,
//     bottom: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
// });

//--------------------2------------

//-----------3-------------------
// import { useState, useCallback, useLayoutEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
//   Pressable,
// } from 'react-native';

// import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
// import { Plus, ChevronRight, User } from 'lucide-react-native';
// // import { Picker } from '@react-native-picker/picker';
// import { Building2 } from 'lucide-react-native';

// import { getPeopleWithBalances } from '@/database/service';
// import { PersonWithBalance } from '@/database/types';
// import { useCompany } from '@/context/CompanyContext';

// export default function HomeScreen() {
//   const router = useRouter();
//   const navigation = useNavigation();

//   const { companies, selectedCompanyId, setSelectedCompanyId } = useCompany();

//   const [people, setPeople] = useState<PersonWithBalance[]>([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [companySheetOpen, setCompanySheetOpen] = useState(false);


//   /* ======================
//      LOAD PEOPLE
//   ======================= */
//   const loadPeople = useCallback(async () => {
//     try {
//       const data = await getPeopleWithBalances(selectedCompanyId);
//       setPeople(data);
//     } catch (error) {
//       console.error('Failed to load people:', error);
//     }
//   }, [selectedCompanyId]);

//   useFocusEffect(
//     useCallback(() => {
//       loadPeople();
//     }, [loadPeople])
//   );

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadPeople();
//     setRefreshing(false);
//   }, [loadPeople]);

//   /* ======================
//      HEADER DROPDOWN
//   ======================= */
//   // useLayoutEffect(() => {
//   //   navigation.setOptions({
//   //     headerTitle: () => (
//   //       <Picker
//   //         selectedValue={selectedCompanyId ?? 'ALL'}
//   //         onValueChange={(value) =>
//   //           setSelectedCompanyId(value === 'ALL' ? null : Number(value))
//   //         }
//   //         style={{ width: 220 }}
//   //       >
//   //         <Picker.Item label="All Companies" value="ALL" />
//   //         {companies.map((company) => (
//   //           <Picker.Item
//   //             key={company.id}
//   //             label={company.name}
//   //             value={company.id}
//   //           />
//   //         ))}
//   //       </Picker>
//   //     ),
//   //   });
//   // }, [navigation, companies, selectedCompanyId]);

// //   useLayoutEffect(() => {
// //   navigation.setOptions({
// //     headerTitle: () => (
// //       <Picker
// //         selectedValue={selectedCompanyId ?? 'ALL'}
// //         onValueChange={(value) =>
// //           setSelectedCompanyId(value === 'ALL' ? null : Number(value))
// //         }
// //         style={{ width: 220 }}
// //       >
// //         <Picker.Item label="All Companies" value="ALL" />
// //         {companies.map((company) => (
// //           <Picker.Item
// //             key={company.id}
// //             label={company.name}
// //             value={company.id}
// //           />
// //         ))}
// //       </Picker>
// //     ),
// //     headerRight: () => (
// //       <Pressable onPress={() => router.push('/add-company')}>
// //         <Building2 size={22} color="#007AFF" />
// //       </Pressable>
// //     ),
// //   });
// // }, [navigation, companies, selectedCompanyId]);


// // useLayoutEffect(() => {
// //   navigation.setOptions({
// //     headerTitle: () => (
// //       <Pressable onPress={() => router.push('/company-switcher')}>
// //         <Text style={{ fontSize: 16, fontWeight: '600' }}>
// //           {selectedCompanyId === null
// //             ? 'All Companies'
// //             : companies.find(c => c.id === selectedCompanyId)?.name || 'Company'}
// //         </Text>
// //       </Pressable>
// //     ),
// //     headerRight: () => (
// //       <Pressable onPress={() => router.push('/add-company')}>
// //         <Building2 size={22} color="#007AFF" />
// //       </Pressable>
// //     ),
// //   });
// // }, [navigation, companies, selectedCompanyId]);


// useLayoutEffect(() => {
//   navigation.setOptions({
//     headerTitle: () => (
//       <TouchableOpacity
//         onPress={() => setCompanySheetOpen(true)}
//         style={{ flexDirection: 'row', alignItems: 'center' }}
//       >
//         <Text style={{ fontSize: 16, fontWeight: '600' }}>
//           {selectedCompanyId
//             ? companies.find(c => c.id === selectedCompanyId)?.name
//             : 'All Companies'}
//         </Text>
//         <Text style={{ marginLeft: 16 }}>▼</Text>
//       </TouchableOpacity>
//     ),
//     headerRight: () => (
//       <TouchableOpacity onPress={() => router.push('/add-company')}>
//         <Building2 size={22} color="#007AFF" />
//       </TouchableOpacity>
//     ),
//   });
// }, [navigation, companies, selectedCompanyId]);

//   /* ======================
//      HELPERS
//   ======================= */
//   const formatCurrency = (amount: number) => {
//     return `₹${Math.abs(amount).toFixed(2)}`;
//   };

//   const renderPerson = ({ item }: { item: PersonWithBalance }) => {
//     const isPositive = item.balance >= 0;
//     const balanceColor = isPositive ? '#10B981' : '#EF4444';

//     return (
//       <TouchableOpacity
//         style={styles.personCard}
//         onPress={() =>
//           router.push({ pathname: '/ledger', params: { personId: item.id } })
//         }
//       >
//         <View style={styles.personIcon}>
//           <User size={24} color="#6B7280" />
//         </View>

//         <View style={styles.personInfo}>
//           <Text style={styles.personName}>{item.name}</Text>
//           {item.phone && <Text style={styles.personPhone}>{item.phone}</Text>}
//         </View>

//         <View style={styles.balanceContainer}>
//           <Text style={[styles.balance, { color: balanceColor }]}>
//             {formatCurrency(item.balance)}
//           </Text>
//           <Text style={styles.balanceLabel}>
//             {isPositive ? 'You will get' : 'You will give'}
//           </Text>
//         </View>

//         <ChevronRight size={20} color="#9CA3AF" />
//       </TouchableOpacity>
//     );
//   };

//   const renderEmpty = () => (
//     <View style={styles.emptyContainer}>
//       <User size={64} color="#D1D5DB" />
//       <Text style={styles.emptyTitle}>No people added yet</Text>
//       <Text style={styles.emptyText}>
//         Add your first person to start tracking transactions
//       </Text>
//     </View>
//   );

//   const totalBalance = people.reduce((sum, person) => sum + person.balance, 0);
//   const isPositive = totalBalance >= 0;

//   /* ======================
//      RENDER
//   ======================= */
//   return (
//     <View style={styles.container}>
//       {people.length > 0 && (
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryLabel}>Overall Balance</Text>
//           <Text
//             style={[
//               styles.summaryAmount,
//               { color: isPositive ? '#10B981' : '#EF4444' },
//             ]}
//           >
//             {formatCurrency(totalBalance)}
//           </Text>
//           <Text style={styles.summarySubtext}>
//             {isPositive ? 'Total you will get' : 'Total you will give'}
//           </Text>
//         </View>
//       )}

//       <FlatList
//         data={people}
//         renderItem={renderPerson}
//         keyExtractor={(item) => item.id.toString()}
//         ListEmptyComponent={renderEmpty}
//         contentContainerStyle={
//           people.length === 0 && styles.emptyListContainer
//         }
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />

//       {companySheetOpen && (
//           <View style={styles.overlay}>
//             <View style={styles.sheet}>
//               <TouchableOpacity
//                 style={styles.sheetItem}
//                 onPress={() => {
//                   setSelectedCompanyId(null);
//                   setCompanySheetOpen(false);
//                 }}
//               >
//                 <Text>All Companies</Text>
//               </TouchableOpacity>

//               {companies.map(c => (
//                 <TouchableOpacity
//                   key={c.id}
//                   style={styles.sheetItem}
//                   onPress={() => {
//                     setSelectedCompanyId(c.id);
//                     setCompanySheetOpen(false);
//                   }}
//                 >
//                   <Text>{c.name}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         )}


//       {/* FAB */}
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => router.push('/add-person')}
//       >
//         <Plus size={28} color="#FFFFFF" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// /* ======================
//    STYLES
// ======================= */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//   },
//   summaryCard: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     margin: 16,
//     marginBottom: 8,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 3,
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 8,
//   },
//   summaryAmount: {
//     fontSize: 32,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   summarySubtext: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   personCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     marginHorizontal: 16,
//     marginVertical: 6,
//     borderRadius: 12,
//     elevation: 2,
//   },
//   personIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   personInfo: {
//     flex: 1,
//   },
//   personName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   personPhone: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   balanceContainer: {
//     alignItems: 'flex-end',
//     marginRight: 8,
//   },
//   balance: {
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   balanceLabel: {
//     fontSize: 11,
//     color: '#9CA3AF',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   emptyListContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     paddingHorizontal: 32,
//   },
//   fab: {
//     position: 'absolute',
//     right: 20,
//     bottom: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 8,
//   },

//   overlay: {
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: 'rgba(0,0,0,0.3)',
//   justifyContent: 'flex-end',
// },
// sheet: {
//   backgroundColor: '#FFF',
//   padding: 16,
//   borderTopLeftRadius: 12,
//   borderTopRightRadius: 12,
// },
// sheetItem: {
//   paddingVertical: 14,
// },
// });


//--------------3-----------------

//----------4--------------------
// import { useState, useCallback, useLayoutEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
//   Pressable,
// } from 'react-native';
// import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
// import { Plus, ChevronRight, User, Building2 } from 'lucide-react-native';

// import { getPeopleWithBalances } from '@/database/service';
// import { PersonWithBalance } from '@/database/types';
// import { useCompany } from '@/context/CompanyContext';

// export default function HomeScreen() {
//   const router = useRouter();
//   const navigation = useNavigation();

//   const {
//     companies,
//     selectedCompanyId,
//     setSelectedCompanyId,
//   } = useCompany();

//   const [people, setPeople] = useState<PersonWithBalance[]>([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [companySheetOpen, setCompanySheetOpen] = useState(false);

//   /* ======================
//      LOAD PEOPLE
//   ======================= */
//   const loadPeople = useCallback(async () => {
//     try {
//       const data = await getPeopleWithBalances(selectedCompanyId);
//       setPeople(data);
//     } catch (e) {
//       console.error('Failed to load people', e);
//     }
//   }, [selectedCompanyId]);

//   useFocusEffect(
//     useCallback(() => {
//       loadPeople();
//     }, [loadPeople])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadPeople();
//     setRefreshing(false);
//   };

//   /* ======================
//      HEADER
//   ======================= */
//   useLayoutEffect(() => {
//     const companyName =
//       selectedCompanyId === null
//         ? 'All Companies'
//         : companies.find(c => c.id === selectedCompanyId)?.name || 'Company';

//     navigation.setOptions({
//       headerTitle: () => (
//         <TouchableOpacity
//           onPress={() => setCompanySheetOpen(true)}
//           style={styles.headerTitle}
//         >
//           <Text style={styles.headerTitleText}>{companyName}</Text>
//           <Text style={styles.headerArrow}>▼</Text>
//         </TouchableOpacity>
//       ),
//       headerRight: () => (
//         <Pressable onPress={() => router.push('/add-company')}>
//           <Building2 size={22} color="#007AFF" />
//         </Pressable>
//       ),
//     });
//   }, [navigation, companies, selectedCompanyId]);

//   /* ======================
//      HELPERS
//   ======================= */
//   const formatCurrency = (amount: number) =>
//     `₹${Math.abs(amount).toFixed(2)}`;

//   const renderPerson = ({ item }: { item: PersonWithBalance }) => {
//     const isPositive = item.balance >= 0;
//     const color = isPositive ? '#10B981' : '#EF4444';

//     return (
//       <TouchableOpacity
//         style={styles.personCard}
//         onPress={() =>
//           router.push({
//             pathname: '/ledger',
//             params: { personId: item.id.toString() },
//           })
//         }
//       >
//         <View style={styles.personIcon}>
//           <User size={24} color="#6B7280" />
//         </View>

//         <View style={styles.personInfo}>
//           <Text style={styles.personName}>{item.name}</Text>
//           {item.phone && <Text style={styles.personPhone}>{item.phone}</Text>}
//         </View>

//         <View style={styles.balanceContainer}>
//           <Text style={[styles.balance, { color }]}>
//             {formatCurrency(item.balance)}
//           </Text>
//           <Text style={styles.balanceLabel}>
//             {isPositive ? 'You will get (మీకు లభిస్తుంది)' : 'You will give (మీరు ఇస్తారు)'}
//           </Text>
//         </View>

//         <ChevronRight size={20} color="#9CA3AF" />
//       </TouchableOpacity>
//     );
//   };

//   const renderEmpty = () => (
//     <View style={styles.emptyContainer}>
//       <User size={64} color="#D1D5DB" />
//       <Text style={styles.emptyTitle}>No people added yet</Text>
//       <Text style={styles.emptyText}>
//         Add your first person to start tracking transactions
//       </Text>
//     </View>
//   );

//   const totalBalance = people.reduce((s, p) => s + p.balance, 0);
//   const totalPositive = totalBalance >= 0;

//   /* ======================
//      RENDER
//   ======================= */
//   return (
//     <View style={styles.container}>
//       {people.length > 0 && (
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryLabel}>Overall Balance (సామగ్ర సమతుల్యం)=(మొత్తం)</Text>
//           <Text
//             style={[
//               styles.summaryAmount,
//               { color: totalPositive ? '#10B981' : '#EF4444' },
//             ]}
//           >
//             {formatCurrency(totalBalance)}
//           </Text>
//           <Text style={styles.summarySubtext}>
//             {totalPositive ? 'Total you will get (మీకు లభిస్తుంది)' : 'Total you will give (మీరు ఇస్తారు)'}
//             {/* {isPositive ? 'మీకు లభిస్తుంది' : 'మీరు ఇస్తారు'} */}

//           </Text>
//         </View>
//       )}

//       <FlatList
//         data={people}
//         renderItem={renderPerson}
//         keyExtractor={item => item.id.toString()}
//         ListEmptyComponent={renderEmpty}
//         contentContainerStyle={
//           people.length === 0 && styles.emptyListContainer
//         }
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />

//       {/* COMPANY SWITCHER SHEET */}
//       {companySheetOpen && (
//         <Pressable
//           style={styles.overlay}
//           onPress={() => setCompanySheetOpen(false)}
//         >
//           <View style={styles.sheet}>
//             <TouchableOpacity
//               style={styles.sheetItem}
//               onPress={() => {
//                 setSelectedCompanyId(null);
//                 setCompanySheetOpen(false);
//               }}
//             >
//               <Text>All Companies</Text>
//             </TouchableOpacity>

//             {companies.map(c => (
//               <TouchableOpacity
//                 key={c.id}
//                 style={styles.sheetItem}
//                 onPress={() => {
//                   setSelectedCompanyId(c.id);
//                   setCompanySheetOpen(false);
//                 }}
//                 onLongPress={() => {
//                   setCompanySheetOpen(false);
//                   router.push({
//                     pathname: '/manage-company',
//                     params: { companyId: c.id.toString() },
//                   });
//                 }}
//               >
//                 <Text>{c.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </Pressable>
//       )}

//       {/* FAB */}
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => router.push('/add-person')}
//       >
//         <Plus size={28} color="#FFFFFF" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// /* ======================
//    STYLES
// ====================== */

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F3F4F6' },

//   headerTitle: { flexDirection: 'row', alignItems: 'center' },
//   headerTitleText: { fontSize: 16, fontWeight: '600' },
//   headerArrow: { marginLeft: 8 },

//   summaryCard: {
//     backgroundColor: '#FFF',
//     padding: 20,
//     margin: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   summaryLabel: { fontSize: 14, color: '#6B7280' },
//   summaryAmount: { fontSize: 32, fontWeight: '700' },
//   summarySubtext: { fontSize: 12, color: '#9CA3AF' },

//   personCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     padding: 16,
//     marginHorizontal: 16,
//     marginVertical: 6,
//     borderRadius: 12,
//   },
//   personIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   personInfo: { flex: 1 },
//   personName: { fontSize: 16, fontWeight: '600' },
//   personPhone: { fontSize: 14, color: '#6B7280' },
//   balanceContainer: { alignItems: 'flex-end', marginRight: 8 },
//   balance: { fontSize: 16, fontWeight: '700' },
//   balanceLabel: { fontSize: 11, color: '#9CA3AF' },

//   emptyContainer: { alignItems: 'center', paddingVertical: 60 },
//   emptyListContainer: { flexGrow: 1, justifyContent: 'center' },
//   emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
//   emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center' },

//   fab: {
//     position: 'absolute',
//     right: 20,
//     bottom: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   overlay: {
//     position: 'absolute',
//     inset: 0,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'flex-end',
//   },
//   sheet: {
//     backgroundColor: '#FFF',
//     padding: 16,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   sheetItem: { paddingVertical: 14 },
// });

//------------4------------------

//--------------5---------------
// import { useState, useCallback, useLayoutEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
//   Pressable,
// } from 'react-native';
// import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
// import { Plus, ChevronRight, User, Building2, Download} from 'lucide-react-native';
// import { exportCompanyCsv } from '@/utils/exportcsv';

// import { getPeopleWithBalances } from '@/database/service';
// import { PersonWithBalance } from '@/database/types';
// import { useCompany } from '@/context/CompanyContext';

// export default function HomeScreen() {
//   const router = useRouter();
//   const navigation = useNavigation();

//   const { companies, selectedCompanyId, setSelectedCompanyId } = useCompany();

//   const [people, setPeople] = useState<PersonWithBalance[]>([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [companySheetOpen, setCompanySheetOpen] = useState(false);

//   const selectedCompany =
//   selectedCompanyId !== null
//     ? companies.find(c => c.id === selectedCompanyId)
//     : null;


//   /* ======================
//      LOAD PEOPLE
//   ======================= */
//   const loadPeople = useCallback(async () => {
//     try {
//       const data = await getPeopleWithBalances(selectedCompanyId);
//       setPeople(data);
//     } catch (e) {
//       console.error('Failed to load people', e);
//     }
//   }, [selectedCompanyId]);

//   useFocusEffect(
//     useCallback(() => {
//       loadPeople();
//     }, [loadPeople])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadPeople();
//     setRefreshing(false);
//   };

//   /* ======================
//      HEADER
//   ======================= */
//   useLayoutEffect(() => {
//     const companyName =
//       selectedCompanyId === null
//         ? 'All Companies'
//         : companies.find(c => c.id === selectedCompanyId)?.name || 'Company';

//     navigation.setOptions({
//       headerTitle: () => (
//         <TouchableOpacity
//           onPress={() => setCompanySheetOpen(true)}
//           style={styles.headerTitle}
//         >
//           <Text style={styles.headerTitleText}>{companyName}</Text>
//           <Text style={styles.headerArrow}>▼</Text>
//         </TouchableOpacity>
//       ),
//       // headerRight: () => (
//       //   <Pressable onPress={() => router.push('/add-company')}>
//       //     <Building2 size={22} color="#007AFF" />
//       //   </Pressable>
//       // ),

//       // headerRight: () => (
//       //   <Pressable
//       //     onPress={() => exportCompanyCsv(selectedCompanyId)}
//       //     style={{ marginRight: 12 }}
//       //   >
//       //     <Download size={22} color="#007AFF" />
//       //   </Pressable>
        
//       // ),

//       headerRight: () => (
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
//           {/* Download CSV */}
//           <Pressable onPress={() => exportCompanyCsv(selectedCompanyId)}>
//             <Download size={22} color="#007AFF" />
//           </Pressable>

//           {/* Add Company */}
//           <Pressable onPress={() => router.push('/add-company')}>
//             <Building2 size={22} color="#007AFF" />
//           </Pressable>
//         </View>
//       ),

//     });
//   }, [navigation, companies, selectedCompanyId]);




//   /* ======================
//      HELPERS
//   ======================= */
//   const formatCurrency = (amount: number) =>
//     // `₹${Math.abs(amount).toFixed(2)}`;
//   `₹${Math.abs(amount).toLocaleString('en-IN')}`;


//   const renderPerson = ({ item }: { item: PersonWithBalance }) => {
//     const isPositive = item.balance >= 0;
//     const color = isPositive ? '#10B981' : '#EF4444';

//     return (
//       <TouchableOpacity
//         style={styles.personCard}
//         onPress={() =>
//           router.push({
//             pathname: '/ledger',
//             params: { personId: item.id.toString() },
//           })
//         }
//       >
//         <View style={styles.personIcon}>
//           <User size={24} color="#6B7280" />
//         </View>

//         <View style={styles.personInfo}>
//           <Text style={styles.personName}>{item.name}</Text>
//           {item.phone && <Text style={styles.personPhone}>{item.phone}</Text>}
//         </View>

//         <View style={styles.balanceContainer}>
//           <Text style={[styles.balance, { color }]}>
//             {formatCurrency(item.balance)}
//           </Text>
//           <Text style={styles.balanceLabel}>
//             {isPositive
//               ? 'You received (మీకు లభిస్తుంది)'
//               : 'You gave (మీరు ఇస్తారు)'}
//           </Text>
//         </View>

//         <ChevronRight size={20} color="#9CA3AF" />
//       </TouchableOpacity>
//     );
//   };

//   const renderEmpty = () => (
//     <View style={styles.emptyContainer}>
//       <User size={64} color="#D1D5DB" />
//       <Text style={styles.emptyTitle}>No people added yet</Text>
//       <Text style={styles.emptyText}>
//         Add your first person to start tracking transactions
//       </Text>
//     </View>
//   );

//   const totalBalance = people.reduce((s, p) => s + p.balance, 0);
//   const totalPositive = totalBalance >= 0;

//   /* ======================
//      RENDER
//   ======================= */
//   return (
//     <View style={styles.container}>
//       {people.length > 0 && (
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryLabel}>Overall Balance (సామగ్ర సమతుల్యం)=(మొత్తం)</Text>
//           <Text
//             style={[
//               styles.summaryAmount,
//               { color: totalPositive ? '#10B981' : '#EF4444' },
//             ]}
//           >
//             {formatCurrency(totalBalance)}
//           </Text>
//           <Text style={styles.summarySubtext}>
//             {totalPositive
//               ? 'Total you received (మీకు లభిస్తుంది)'
//               : 'Total you gave (మీరు ఇస్తారు)'}
//           </Text>
//         </View>
//       )}

//       {/* ✅ COMPANY NOTE (ONLY WHEN COMPANY SELECTED) */}
//     {selectedCompany?.note ? (
//       <View style={styles.companyNoteCard}>
//         <Text style={styles.companyNoteLabel}>Company Note</Text>
//         <Text style={styles.companyNoteText}>{selectedCompany.note}</Text>
//       </View>
//     ) : null}

//       <FlatList
//         data={people}
//         renderItem={renderPerson}
//         keyExtractor={item => item.id.toString()}
//         ListEmptyComponent={renderEmpty}
//         contentContainerStyle={
//           people.length === 0 && styles.emptyListContainer
//         }
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />

//       {/* COMPANY SWITCHER */}
//       {companySheetOpen && (
//         <Pressable
//           style={styles.overlay}
//           onPress={() => setCompanySheetOpen(false)}
//         >
//           <View style={styles.sheet}>
//             <TouchableOpacity
//               style={styles.sheetItem}
//               onPress={() => {
//                 setSelectedCompanyId(null);
//                 setCompanySheetOpen(false);
//               }}
//             >
//               <Text>All Companies</Text>
//             </TouchableOpacity>

//             {companies.map(c => (
//               <TouchableOpacity
//                 key={c.id}
//                 style={styles.sheetItem}
//                 onPress={() => {
//                   setSelectedCompanyId(c.id);
//                   setCompanySheetOpen(false);
//                 }}
//                 onLongPress={() => {
//                   setCompanySheetOpen(false);
//                   router.push({
//                     pathname: '/manage-company',
//                     params: { companyId: c.id.toString() },
//                   });
//                 }}
//               >
//                 <Text>{c.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </Pressable>
//       )}

//       {/* FAB */}
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => router.push('/add-person')}
//       >
//         <Plus size={28} color="#FFFFFF" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// /* ======================
//    STYLES
// ====================== */

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F3F4F6' },

//   headerTitle: { flexDirection: 'row', alignItems: 'center' },
//   headerTitleText: { fontSize: 16, fontWeight: '600' },
//   headerArrow: { marginLeft: 6, fontSize: 12 },

//   summaryCard: {
//     backgroundColor: '#FFF',
//     padding: 20,
//     margin: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   summaryLabel: { fontSize: 14, color: '#6B7280' },
//   summaryAmount: { fontSize: 32, fontWeight: '700' },
//   summarySubtext: { fontSize: 12, color: '#9CA3AF' },

//   personCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     padding: 16,
//     marginHorizontal: 16,
//     marginVertical: 6,
//     borderRadius: 12,
//   },
//   personIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   personInfo: { flex: 1 },
//   personName: { fontSize: 16, fontWeight: '600' },
//   personPhone: { fontSize: 14, color: '#6B7280' },
//   balanceContainer: { alignItems: 'flex-end', marginRight: 8 },
//   balance: { fontSize: 16, fontWeight: '700' },
//   balanceLabel: { fontSize: 11, color: '#9CA3AF' },

//   emptyContainer: { alignItems: 'center', paddingVertical: 60 },
//   emptyListContainer: { flexGrow: 1, justifyContent: 'center' },
//   emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
//   emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center' },

//   fab: {
//     position: 'absolute',
//     right: 20,
//     bottom: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   overlay: {
//     position: 'absolute',
//     inset: 0,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'flex-end',
//   },
//   sheet: {
//     backgroundColor: '#FFF',
//     padding: 16,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   sheetItem: { paddingVertical: 14 },

//   companyNoteCard: {
//   backgroundColor: '#FFF',
//   marginHorizontal: 16,
//   marginTop: 12,
//   padding: 14,
//   borderRadius: 10,
//   borderLeftWidth: 4,
//   borderLeftColor: '#007AFF',
// },
// companyNoteLabel: {
//   fontSize: 12,
//   fontWeight: '600',
//   color: '#6B7280',
//   marginBottom: 4,
// },
// companyNoteText: {
//   fontSize: 14,
//   color: '#111827',
// },

// });

//-----------5--------------------

//------------6-------------------
import { useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Pressable,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
import {
  Plus,
  ChevronRight,
  User,
  Building2,
  Download,
  Cloud,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { exportCompanyCsv } from '@/utils/exportcsv';
import { backupToGoogleDrive, restoreFromGoogleDrive } from '@/utils/backup';
import { getPeopleWithBalances } from '@/database/service';
import { PersonWithBalance } from '@/database/types';
import { useCompany } from '@/context/CompanyContext';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { companies, selectedCompanyId, setSelectedCompanyId } = useCompany();

  const [people, setPeople] = useState<PersonWithBalance[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [companySheetOpen, setCompanySheetOpen] = useState(false);
  const [driveSheetOpen, setDriveSheetOpen] = useState(false);

  const selectedCompany =
    selectedCompanyId !== null
      ? companies.find(c => c.id === selectedCompanyId)
      : null;

  /* ======================
     LOAD PEOPLE
  ======================= */
  const loadPeople = useCallback(async () => {
    try {
      const data = await getPeopleWithBalances(selectedCompanyId);
      setPeople(data);
    } catch (e) {
      console.error('Failed to load people', e);
    }
  }, [selectedCompanyId]);

  useFocusEffect(
    useCallback(() => {
      loadPeople();
    }, [loadPeople])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPeople();
    setRefreshing(false);
  };

  /* ======================
     HEADER
  ======================= */
  useLayoutEffect(() => {
    const companyName =
      selectedCompanyId === null
        ? 'All Companies'
        : companies.find(c => c.id === selectedCompanyId)?.name || 'Company';

    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity
          onPress={() => setCompanySheetOpen(true)}
          style={styles.headerTitle}
        >
          <Text style={styles.headerTitleText}>{companyName}</Text>
          <Text style={styles.headerArrow}>▼</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.headerActions}>
          <Pressable onPress={() => exportCompanyCsv(selectedCompanyId)}>
            <Download size={22} color="#007AFF" />
          </Pressable>
          <Pressable onPress={() => setDriveSheetOpen(true)}>
            <Cloud size={22} color="#007AFF" />
          </Pressable>
          <Pressable onPress={() => router.push('/add-company')}>
            <Building2 size={22} color="#007AFF" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, companies, selectedCompanyId]);

  /* ======================
     HELPERS
  ======================= */
  const formatCurrency = (amount: number) =>
    `₹${Math.abs(amount).toLocaleString('en-IN')}`;

  const renderPerson = ({ item }: { item: PersonWithBalance }) => {
    const isPositive = item.balance >= 0;
    const color = isPositive ? '#10B981' : '#EF4444';

    return (
      <TouchableOpacity
        style={styles.personCard}
        onPress={() =>
          router.push({
            pathname: '/ledger',
            params: { personId: item.id.toString() },
          })
        }
        onLongPress={() =>
          router.push({
            pathname: '/manage-person',
            params: { personId: item.id.toString() },
          })
        }
      >
        <View style={styles.personIcon}>
          <User size={24} color="#6B7280" />
        </View>

        <View style={styles.personInfo}>
          <Text style={styles.personName}>{item.name}</Text>
          {item.phone && <Text style={styles.personPhone}>{item.phone}</Text>}
        </View>

        <View style={styles.balanceContainer}>
          <Text style={[styles.balance, { color }]}>
            {formatCurrency(item.balance)}
          </Text>
          <Text style={styles.balanceLabel}>
            {isPositive
              ? 'You received (మీకు లభిస్తుంది)'
              : 'You gave (మీరు ఇస్తారు)'}
          </Text>
        </View>

        <ChevronRight size={20} color="#9CA3AF" />
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <User size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No people added yet</Text>
      <Text style={styles.emptyText}>
        Add your first person to start tracking transactions
      </Text>
    </View>
  );

  const totalBalance = people.reduce((s, p) => s + p.balance, 0);
  const totalPositive = totalBalance >= 0;

  /* ======================
     RENDER
  ======================= */
  return (
    <View style={styles.container}>
      {people.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Overall Balance (సామగ్ర సమతుల్యం)
          </Text>
          <Text
            style={[
              styles.summaryAmount,
              { color: totalPositive ? '#10B981' : '#EF4444' },
            ]}
          >
            {formatCurrency(totalBalance)}
          </Text>
          <Text style={styles.summarySubtext}>
            {totalPositive
              ? 'Total you received (మీకు లభిస్తుంది)'
              : 'Total you gave (మీరు ఇస్తారు)'}
          </Text>
        </View>
      )}

      {/* COMPANY NOTE */}
      {selectedCompany?.note ? (
        <View style={styles.companyNoteCard}>
          <Text style={styles.companyNoteLabel}>Company Note</Text>
          <Text style={styles.companyNoteText}>{selectedCompany.note}</Text>
        </View>
      ) : null}

      <FlatList
        data={people}
        renderItem={renderPerson}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          people.length === 0 && styles.emptyListContainer
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* COMPANY SWITCHER */}
      {companySheetOpen && (
        <Pressable
          style={styles.overlay}
          onPress={() => setCompanySheetOpen(false)}
        >
          {/* <View style={styles.sheet}>
            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => {
                setSelectedCompanyId(null);
                setCompanySheetOpen(false);
              }}
            >
              <Text>All Companies</Text>
            </TouchableOpacity>

            {companies.map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.sheetItem}
                onPress={() => {
                  setSelectedCompanyId(c.id);
                  setCompanySheetOpen(false);
                }}
                onLongPress={() => {
                  setCompanySheetOpen(false);
                  router.push({
                    pathname: '/manage-company',
                    params: { companyId: c.id.toString() },
                  });
                }}
              >
                <Text>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </View> */}

          <View style={styles.sheet}>
            {/* ALL COMPANIES */}
            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => {
                setSelectedCompanyId(null);
                setCompanySheetOpen(false);
              }}
            >
              <Text>All Companies</Text>
            </TouchableOpacity>

            {/* SCROLLABLE COMPANY LIST */}
            <ScrollView
              style={styles.companyList}
              showsVerticalScrollIndicator={true}
            >
              {companies.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.sheetItem}
                  onPress={() => {
                    setSelectedCompanyId(c.id);
                    setCompanySheetOpen(false);
                  }}
                  onLongPress={() => {
                    setCompanySheetOpen(false);
                    router.push({
                      pathname: '/manage-company',
                      params: { companyId: c.id.toString() },
                    });
                  }}
                >
                  <Text>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

        </Pressable>
      )}

      {/* DRIVE ACTIONS SHEET */}
      {driveSheetOpen && (
        <Pressable
          style={styles.overlay}
          onPress={() => setDriveSheetOpen(false)}
        >
          <View style={styles.sheet}>
            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => {
                setDriveSheetOpen(false);
                backupToGoogleDrive(selectedCompanyId);
              }}
            >
              <Text>Backup to Drive</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => {
                setDriveSheetOpen(false);
                restoreFromGoogleDrive('replace');
              }}
            >
              <Text>Replace</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => {
                setDriveSheetOpen(false);
                restoreFromGoogleDrive('merge');
              }}
            >
              <Text>Merge</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          { bottom: insets.bottom + 16 },
        ]}
        onPress={() => router.push('/add-person')}
      >
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

/* ======================
   STYLES
====================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  headerTitle: { flexDirection: 'row', alignItems: 'center' },
  headerTitleText: { fontSize: 16, fontWeight: '600' },
  headerArrow: { marginLeft: 6, fontSize: 12 },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginRight: 8,
  },

  summaryCard: {
    backgroundColor: '#FFF',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryAmount: { fontSize: 32, fontWeight: '700' },
  summarySubtext: { fontSize: 12, color: '#9CA3AF' },

  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
  },
  personIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  personInfo: { flex: 1 },
  personName: { fontSize: 16, fontWeight: '600' },
  personPhone: { fontSize: 14, color: '#6B7280' },
  balanceContainer: { alignItems: 'flex-end', marginRight: 8 },
  balance: { fontSize: 16, fontWeight: '700' },
  balanceLabel: { fontSize: 11, color: '#9CA3AF' },

  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyListContainer: { flexGrow: 1, justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center' },

  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
  },
  sheet: {
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 12,
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 6,
    // borderTopLeftRadius: 12,
    // borderTopRightRadius: 12,
  },
  sheetItem: { paddingVertical: 14,
    paddingHorizontal: 12,
   },
    companyList: {
    maxHeight: 220, // 👈 shows ~4–5 companies
  },

  companyNoteCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  companyNoteLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  companyNoteText: {
    fontSize: 14,
    color: '#111827',
  },
});

//-------------6----------------------
