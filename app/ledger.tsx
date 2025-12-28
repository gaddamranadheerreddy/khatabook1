// import { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
//   Alert,
// } from 'react-native';
// import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
// import { TrendingUp, TrendingDown, FileText } from 'lucide-react-native';

// import {
//   getPersonWithBalance,
//   getTransactionsByPerson,
//   deleteTransaction,
// } from '@/database/service';
// import { PersonWithBalance, Transaction } from '@/database/types';

// export default function LedgerScreen() {
//   const router = useRouter();
//   const { personId } = useLocalSearchParams<{ personId: string }>();

//   const id = Number(personId); // ✅ normalize once

//   const [person, setPerson] = useState<PersonWithBalance | null>(null);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [refreshing, setRefreshing] = useState(false);

//   /* ======================
//      LOAD DATA
//   ======================= */
//   const loadData = useCallback(async () => {
//     if (!id) return;

//     try {
//       const personData = await getPersonWithBalance(id);
//       const txns = await getTransactionsByPerson(id);

//       setPerson(personData);
//       setTransactions(txns);
//     } catch (error) {
//       console.error('Failed to load ledger data:', error);
//     }
//   }, [id]);

//   useFocusEffect(
//     useCallback(() => {
//       loadData();
//     }, [loadData])
//   );

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadData();
//     setRefreshing(false);
//   }, [loadData]);

//   /* ======================
//      DELETE TXN
//   ======================= */
//   const handleDeleteTransaction = (transactionId: number) => {
//     Alert.alert(
//       'Delete Transaction',
//       'Are you sure you want to delete this transaction?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await deleteTransaction(transactionId);
//               await loadData();
//             } catch {
//               Alert.alert('Error', 'Failed to delete transaction');
//             }
//           },
//         },
//       ]
//     );
//   };

//   /* ======================
//      HELPERS
//   ======================= */
//   const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

//   const formatDate = (timestamp: number) =>
//     new Date(timestamp * 1000).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });

//   /* ======================
//      RENDER TXN
//   ======================= */
//   const renderTransaction = ({ item }: { item: Transaction }) => {
//     const isCredit = item.type === 'credit';
//     const color = isCredit ? '#10B981' : '#EF4444';

//     return (
//       <TouchableOpacity
//         style={styles.transactionCard}
//         onLongPress={() => handleDeleteTransaction(item.id)}
//       >
//         <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
//           {isCredit ? (
//             <TrendingUp size={20} color={color} />
//           ) : (
//             <TrendingDown size={20} color={color} />
//           )}
//         </View>

//         <View style={styles.transactionInfo}>
//           <Text style={styles.transactionType}>
//             {isCredit ? 'Credit (You gave)' : 'Debit (You received)'}
//           </Text>
//           {item.note && <Text style={styles.transactionNote}>{item.note}</Text>}
//           <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
//         </View>

//         <Text style={[styles.transactionAmount, { color }]}>
//           {isCredit ? '+' : '-'} {formatCurrency(item.amount)}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   /* ======================
//      EMPTY STATE
//   ======================= */
//   const renderEmpty = () => (
//     <View style={styles.emptyContainer}>
//       <FileText size={64} color="#D1D5DB" />
//       <Text style={styles.emptyTitle}>No transactions yet</Text>
//       <Text style={styles.emptyText}>
//         Add your first transaction using the buttons below
//       </Text>
//     </View>
//   );

//   if (!person) return null;

//   const isPositive = person.balance >= 0;

//   /* ======================
//      UI
//   ======================= */
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.personName}>{person.name}</Text>
//         {person.phone && <Text style={styles.personPhone}>{person.phone}</Text>}

//         <View style={styles.balanceSection}>
//           <Text style={styles.balanceLabel}>Current Balance</Text>
//           <Text
//             style={[
//               styles.balanceAmount,
//               { color: isPositive ? '#10B981' : '#EF4444' },
//             ]}
//           >
//             {formatCurrency(person.balance)}
//           </Text>
//           <Text style={styles.balanceSubtext}>
//             {isPositive ? 'You will get' : 'You will give'}
//           </Text>
//         </View>
//       </View>

//       <FlatList
//         data={transactions}
//         renderItem={renderTransaction}
//         keyExtractor={(item) => item.id.toString()}
//         ListEmptyComponent={renderEmpty}
//         contentContainerStyle={
//           transactions.length === 0 && styles.emptyListContainer
//         }
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />

    //   <View style={styles.buttonContainer}>
    //     <TouchableOpacity
    //       style={[styles.actionButton, styles.creditButton]}
    //       onPress={() =>
    //         router.push({
    //           pathname: '/add-transaction',
    //           params: { personId: id.toString(), type: 'credit' },
    //         })
    //       }
    //     >
    //       <TrendingUp size={20} color="#FFFFFF" />
    //       <Text style={styles.buttonText}>Add Credit</Text>
    //     </TouchableOpacity>

    //     <TouchableOpacity
    //       style={[styles.actionButton, styles.debitButton]}
    //       onPress={() =>
    //         router.push({
    //           pathname: '/add-transaction',
    //           params: { personId: id.toString(), type: 'debit' },
    //         })
    //       }
    //     >
    //       <TrendingDown size={20} color="#FFFFFF" />
    //       <Text style={styles.buttonText}>Add Debit</Text>
    //     </TouchableOpacity>
    //   </View>
//     </View>
//   );
// }

// /* ======================
//    STYLES (unchanged)
// ====================== */

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F3F4F6' },
//   header: { backgroundColor: '#FFF', padding: 20 },
//   personName: { fontSize: 24, fontWeight: '700' },
//   personPhone: { fontSize: 16, color: '#6B7280', marginBottom: 16 },
//   balanceSection: { alignItems: 'center', paddingVertical: 16 },
//   balanceLabel: { fontSize: 14, color: '#6B7280' },
//   balanceAmount: { fontSize: 36, fontWeight: '700' },
//   balanceSubtext: { fontSize: 13, color: '#9CA3AF' },
//   transactionCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     padding: 16,
//     margin: 12,
//     borderRadius: 8,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   transactionInfo: { flex: 1 },
//   transactionType: { fontWeight: '600' },
//   transactionNote: { color: '#6B7280' },
//   transactionDate: { fontSize: 12, color: '#9CA3AF' },
//   transactionAmount: { fontSize: 18, fontWeight: '700' },
//   emptyContainer: { alignItems: 'center', padding: 60 },
//   emptyListContainer: { flexGrow: 1, justifyContent: 'center' },
//   emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
//   emptyText: { color: '#6B7280', textAlign: 'center' },
//   buttonContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     backgroundColor: '#FFF',
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     padding: 16,
//     borderRadius: 8,
//     marginHorizontal: 6,
//   },
//   creditButton: { backgroundColor: '#10B981' },
//   debitButton: { backgroundColor: '#EF4444' },
//   buttonText: { color: '#FFF', fontWeight: '600' },
// });


//--------1---------------

//-------------2------------------
import { useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect, useNavigation } from 'expo-router';
// import { FileText } from 'lucide-react-native';
import { TrendingUp, TrendingDown, FileText, Download } from 'lucide-react-native';

import {
  getPersonWithBalance,
  getTransactionsByPerson,
  deleteTransaction,
} from '@/database/service';
import { PersonWithBalance, Transaction } from '@/database/types';
import { exportPersonCsv } from '@/utils/exportcsv';


export default function LedgerScreen() {
  const router = useRouter();
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const id = Number(personId);

  const [person, setPerson] = useState<PersonWithBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
    
  /* ======================
     LOAD DATA
  ======================= */
  const loadData = useCallback(async () => {
    if (!id) return;

    try {
      const personData = await getPersonWithBalance(id);
      const txns = await getTransactionsByPerson(id);

      setPerson(personData);
      setTransactions(txns);
    } catch (e) {
      console.error('Failed to load ledger', e);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

//   ==================
  useLayoutEffect(() => {
  if (!person) return;

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => exportPersonCsv(person.id)}
      >
        <Download size={22} color="#007AFF" />
      </TouchableOpacity>
    ),
  });
}, [person]);


  /* ======================
     DELETE TXN
  ======================= */
  const handleDeleteTransaction = (txnId: number) => {
    Alert.alert('Delete entry?', 'This action cannot be undone', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(txnId);
          await loadData();
        },
      },
    ]);
  };

  /* ======================
     HELPERS
  ======================= */
//   const formatCurrency = (amt: number) => `₹${amt.toFixed(0)}`;
const formatCurrency = (amt: number) =>
  `₹${amt.toLocaleString('en-IN')}`;


  const formatDateTime = (ts: number) =>
    new Date(ts * 1000).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  /* ======================
     ROW
  ======================= */
  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isIn = item.type === 'credit'; // money received
    const isOut = item.type === 'debit'; // money given

    return (
      <TouchableOpacity
        style={styles.row}
        onLongPress={() => handleDeleteTransaction(item.id)}
      >
        {/* LEFT */}
        <View style={styles.left}>
          <Text style={styles.date}>{formatDateTime(item.date)}</Text>
          {/* <Text style={styles.balance}>
            Bal. {formatCurrency(item.balance_after ?? 0)}
          </Text> */}
          {item.note && <Text style={styles.note}>{item.note}</Text>}
        </View>

        {/* IN */}
        <View style={styles.col}>
          {isIn && (
            <Text style={[styles.amount, styles.in]}>
              {formatCurrency(item.amount)}
            </Text>
          )}
        </View>

        {/* OUT */}
        <View style={styles.col}>
          {isOut && (
            <Text style={[styles.amount, styles.out]}>
              {formatCurrency(item.amount)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <FileText size={48} color="#D1D5DB" />
      <Text style={styles.emptyText}>No entries yet</Text>
    </View>
  );

  if (!person) return null;

  /* ======================
     UI
  ======================= */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.name}>{person.name}</Text>
        <Text
          style={[
            styles.total,
            { color: person.balance >= 0 ? '#10B981' : '#EF4444' },
          ]}
        >
          {formatCurrency(Math.abs(person.balance))}
        </Text>
        <Text style={styles.sub}>
          {person.balance >= 0
            ? 'You received (మీకు లభిస్తుంది)'
            : 'You gave (మీరు ఇస్తారు)'}
        </Text>
      </View>

      {/* COLUMN HEADER */}
      <View style={styles.columns}>
        <Text style={styles.colTitle}>IN</Text>
        <Text style={styles.colTitle}>OUT</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(i) => i.id.toString()}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* ACTION BUTTONS */}
{/* <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.actionButton, styles.inButton]}
    onPress={() =>
      router.push({
        pathname: '/add-transaction',
        params: { personId: id.toString(), type: 'debit' }, // IN
      })
    }
  >
    <Text style={styles.buttonText}>+ IN</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.actionButton, styles.outButton]}
    onPress={() =>
      router.push({
        pathname: '/add-transaction',
        params: { personId: id.toString(), type: 'credit' }, // OUT
      })
    }
  >
    <Text style={styles.buttonText}>− OUT</Text>
  </TouchableOpacity>
</View> */}
<View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.creditButton]}
          onPress={() =>
            router.push({
              pathname: '/add-transaction',
              params: { personId: id.toString(), type: 'credit' },
            })
          }
        >
          <TrendingUp size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add Credit (మీకు లభిస్తుంది)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.debitButton]}
          onPress={() =>
            router.push({
              pathname: '/add-transaction',
              params: { personId: id.toString(), type: 'debit' },
            })
          }
        >
          <TrendingDown size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add Debit (మీరు ఇస్తారు)</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

/* ======================
   STYLES
====================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  header: {
    backgroundColor: '#FFF',
    padding: 16,
    alignItems: 'center',
  },
  name: { fontSize: 22, fontWeight: '700' },
  total: { fontSize: 32, fontWeight: '700', marginTop: 6 },
  sub: { color: '#6B7280' },

  columns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  colTitle: {
    width: 80,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  row: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 6,
    padding: 12,
  },

  left: { flex: 1 },
  date: { fontSize: 13, color: '#111827' },
  balance: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  note: { fontSize: 13, marginTop: 4 ,color:'#39d0b9ff'},

  col: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  amount: { fontSize: 16, fontWeight: '700' },
  in: { color: '#10B981' },
  out: { color: '#EF4444' },

  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { marginTop: 12, color: '#6B7280' },

  buttonContainer: {
  flexDirection: 'row',
  padding: 12,
  backgroundColor: '#FFF',
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
},

actionButton: {
  flex: 1,
  paddingVertical: 14,
  marginHorizontal: 6,
  borderRadius: 8,
  alignItems: 'center',
},

inButton: {
  backgroundColor: '#10B981',
},

outButton: {
  backgroundColor: '#EF4444',
},

buttonText: {
  color: '#FFF',
  fontSize: 16,
  fontWeight: '700',
},
  debitButton: { backgroundColor: '#EF4444' },
  creditButton: { backgroundColor: '#10B981' },


});

//--------------2-------------------