// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { TrendingUp, TrendingDown, Calendar } from 'lucide-react-native';
// import { addTransaction, getPersonById } from '@/database/service';
// import { Person } from '@/database/types';

// export default function AddTransactionScreen() {
//   const router = useRouter();
//   const { personId, type: initialType } = useLocalSearchParams<{
//     personId: string;
//     type?: 'credit' | 'debit';
//   }>();

//   const [person, setPerson] = useState<Person | null>(null);
//   const [amount, setAmount] = useState('');
//   const [type, setType] = useState<'credit' | 'debit'>(initialType || 'credit');
//   const [note, setNote] = useState('');
//   const [date, setDate] = useState(new Date());
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     async function loadPerson() {
//       if (!personId) return;
//       const personData = await getPersonById(Number(personId));
//       setPerson(personData);
//     }
//     loadPerson();
//   }, [personId]);

//   const handleSave = async () => {
//     if (!amount || parseFloat(amount) <= 0) {
//       Alert.alert('Error', 'Please enter a valid amount');
//       return;
//     }

//     setSaving(true);
//     try {
//       await addTransaction({
//         person_id: Number(personId),
//         amount: parseFloat(amount),
//         type,
//         note: note.trim() || undefined,
//         date: Math.floor(date.getTime() / 1000),
//       });
//       router.back();
//     } catch (error) {
//       console.error('Failed to add transaction:', error);
//       Alert.alert('Error', 'Failed to add transaction. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });
//   };

//   const handleDateChange = (days: number) => {
//     const newDate = new Date(date);
//     newDate.setDate(newDate.getDate() + days);
//     setDate(newDate);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={styles.form}>
//           {person && (
//             <View style={styles.personInfo}>
//               <Text style={styles.personLabel}>Transaction for</Text>
//               <Text style={styles.personName}>{person.name}</Text>
//             </View>
//           )}

//           <View style={styles.typeSelector}>
//             <TouchableOpacity
//               style={[
//                 styles.typeButton,
//                 type === 'credit' && styles.typeButtonCredit,
//               ]}
//               onPress={() => setType('credit')}
//             >
//               <TrendingUp
//                 size={24}
//                 color={type === 'credit' ? '#FFFFFF' : '#10B981'}
//               />
//               <Text
//                 style={[
//                   styles.typeButtonText,
//                   type === 'credit' && styles.typeButtonTextActive,
//                 ]}
//               >
//                 Credit క్రెడిట్
//               </Text>
//               <Text
//                 style={[
//                   styles.typeButtonSubtext,
//                   type === 'credit' && styles.typeButtonSubtextActive,
//                 ]}
//               >
//                 You gave (మీరు ఇస్తారు)
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.typeButton,
//                 type === 'debit' && styles.typeButtonDebit,
//               ]}
//               onPress={() => setType('debit')}
//             >
//               <TrendingDown
//                 size={24}
//                 color={type === 'debit' ? '#FFFFFF' : '#EF4444'}
//               />
//               <Text
//                 style={[
//                   styles.typeButtonText,
//                   type === 'debit' && styles.typeButtonTextActive,
//                 ]}
//               >
//                 Debit
//               </Text>
//               <Text
//                 style={[
//                   styles.typeButtonSubtext,
//                   type === 'debit' && styles.typeButtonSubtextActive,
//                 ]}
//               >
//                 You received (మీకు లభిస్తుంది)
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>
//               Amount <Text style={styles.required}>*</Text>
//             </Text>
//             <View style={styles.amountInputContainer}>
//               <Text style={styles.currencySymbol}>₹</Text>
//               <TextInput
//                 style={styles.amountInput}
//                 placeholder="0.00"
//                 value={amount}
//                 onChangeText={setAmount}
//                 keyboardType="decimal-pad"
//                 autoFocus
//               />
//             </View>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Note (Optional)</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Add a note"
//               value={note}
//               onChangeText={setNote}
//               multiline
//               numberOfLines={3}
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Date</Text>
//             <View style={styles.dateContainer}>
//               <TouchableOpacity
//                 style={styles.dateButton}
//                 onPress={() => handleDateChange(-1)}
//               >
//                 <Text style={styles.dateButtonText}>Yesterday</Text>
//               </TouchableOpacity>
//               <View style={styles.dateDisplay}>
//                 <Calendar size={20} color="#6B7280" />
//                 <Text style={styles.dateText}>{formatDate(date)}</Text>
//               </View>
//               <TouchableOpacity
//                 style={styles.dateButton}
//                 onPress={() => handleDateChange(1)}
//                 disabled={date >= new Date()}
//               >
//                 <Text
//                   style={[
//                     styles.dateButtonText,
//                     date >= new Date() && styles.dateButtonTextDisabled,
//                   ]}
//                 >
//                   Tomorrow
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[styles.saveButton, saving && styles.saveButtonDisabled]}
//             onPress={handleSave}
//             disabled={saving}
//           >
//             <Text style={styles.saveButtonText}>
//               {saving ? 'Saving...' : 'Save Transaction'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   form: {
//     padding: 16,
//   },
//   personInfo: {
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   personLabel: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   personName: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   typeSelector: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 20,
//   },
//   typeButton: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//   },
//   typeButtonCredit: {
//     backgroundColor: '#10B981',
//     borderColor: '#10B981',
//   },
//   typeButtonDebit: {
//     backgroundColor: '#EF4444',
//     borderColor: '#EF4444',
//   },
//   typeButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//     marginTop: 8,
//   },
//   typeButtonTextActive: {
//     color: '#FFFFFF',
//   },
//   typeButtonSubtext: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   typeButtonSubtextActive: {
//     color: '#FFFFFF',
//     opacity: 0.9,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   required: {
//     color: '#EF4444',
//   },
//   amountInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     paddingLeft: 16,
//   },
//   currencySymbol: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#111827',
//     marginRight: 8,
//   },
//   amountInput: {
//     flex: 1,
//     padding: 12,
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   input: {
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#111827',
//     textAlignVertical: 'top',
//   },
//   dateContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   dateButton: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     alignItems: 'center',
//   },
//   dateButtonText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#111827',
//   },
//   dateButtonTextDisabled: {
//     color: '#D1D5DB',
//   },
//   dateDisplay: {
//     flex: 2,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     gap: 8,
//   },
//   dateText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   saveButton: {
//     backgroundColor: '#007AFF',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   saveButtonDisabled: {
//     opacity: 0.6,
//   },
//   saveButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });


//------------1------------

//------------------2----------------
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { addTransaction, getPersonById } from '@/database/service';
import { Person } from '@/database/types';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { personId, type: initialType } = useLocalSearchParams<{
    personId: string;
    type?: 'credit' | 'debit';
  }>();

  const [person, setPerson] = useState<Person | null>(null);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'credit' | 'debit'>(initialType || 'credit');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [saving, setSaving] = useState(false);
  const insets = useSafeAreaInsets();

  /* ======================
     LOAD PERSON
  ======================= */
  useEffect(() => {
    async function loadPerson() {
      if (!personId) return;
      const data = await getPersonById(Number(personId));
      setPerson(data);
    }
    loadPerson();
  }, [personId]);

  /* ======================
     SAVE
  ======================= */
  const handleSave = async () => {
    const value = parseFloat(amount);

    if (!value || value <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid amount');
      return;
    }

    setSaving(true);
    try {
      await addTransaction({
        person_id: Number(personId),
        amount: value,
        type, // credit = IN, debit = OUT
        note: note.trim() || undefined,
        date: Math.floor(date.getTime() / 1000),
      });

      router.back();
    } catch (e) {
      console.error('Add transaction failed', e);
      Alert.alert('Error', 'Failed to save transaction');
    } finally {
      setSaving(false);
    }
  };

  /* ======================
     DATE HELPERS
  ======================= */
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const shiftDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* PERSON */}
        {person && (
          <View style={styles.personBox}>
            <Text style={styles.personLabel}>Transaction with</Text>
            <Text style={styles.personName}>{person.name}</Text>
          </View>
        )}

        {/* TYPE SELECTOR */}
        <View style={styles.typeRow}>
          {/* IN */}
          <TouchableOpacity
            style={[
              styles.typeCard,
              type === 'credit' && styles.typeInActive,
            ]}
            onPress={() => setType('credit')}
          >
            <TrendingUp
              size={24}
              color={type === 'credit' ? '#FFFFFF' : '#10B981'}
            />
            <Text
              style={[
                styles.typeTitle,
                type === 'credit' && styles.typeTextActive,
              ]}
            >
              IN
            </Text>
            <Text
              style={[
                styles.typeSub,
                type === 'credit' && styles.typeTextActive,
              ]}
            >
              You received (మీకు లభిస్తుంది)
            </Text>
          </TouchableOpacity>

          {/* OUT */}
          <TouchableOpacity
            style={[
              styles.typeCard,
              type === 'debit' && styles.typeOutActive,
            ]}
            onPress={() => setType('debit')}
          >
            <TrendingDown
              size={24}
              color={type === 'debit' ? '#FFFFFF' : '#EF4444'}
            />
            <Text
              style={[
                styles.typeTitle,
                type === 'debit' && styles.typeTextActive,
              ]}
            >
              OUT
            </Text>
            <Text
              style={[
                styles.typeSub,
                type === 'debit' && styles.typeTextActive,
              ]}
            >
              You gave (మీరు ఇస్తారు)
            </Text>
          </TouchableOpacity>
        </View>

        {/* AMOUNT */}
        <View style={styles.group}>
          <Text style={styles.label}>Amount *</Text>
          <View style={styles.amountBox}>
            <Text style={styles.currency}>₹</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="decimal-pad"
              placeholder="0"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>
        </View>

        {/* NOTE */}
        <View style={styles.group}>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="Add note"
            multiline
          />
        </View>

        {/* DATE */}
        {/* <View style={styles.group}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => shiftDate(-1)}
            >
              <Text>Yesterday</Text>
            </TouchableOpacity>

            <View style={styles.dateCenter}>
              <Calendar size={18} color="#6B7280" />
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </View>

            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => shiftDate(1)}
              disabled={date >= new Date()}
            >
              <Text
                style={date >= new Date() && { color: '#D1D5DB' }}
              >
                Tomorrow
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* DATE */}
            <View style={styles.group}>
            <Text style={styles.label}>Date</Text>

            <View style={styles.dateRow}>
                <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => shiftDate(-1)}
                activeOpacity={0.8}
                >
                <Text style={styles.dateBtnText} allowFontScaling={false}>
                    Yesterday
                </Text>
                </TouchableOpacity>

                <View style={styles.dateCenter}>
                <Calendar size={16} color="#6B7280" />
                <Text
                    style={styles.dateText}
                    allowFontScaling={false}
                    numberOfLines={1}
                >
                    {formatDate(date)}
                </Text>
                </View>

                <TouchableOpacity
                style={[
                    styles.dateBtn,
                    date >= new Date() && styles.dateBtnDisabled,
                ]}
                onPress={() => shiftDate(1)}
                disabled={date >= new Date()}
                activeOpacity={0.8}
                >
                <Text
                    style={[
                    styles.dateBtnText,
                    date >= new Date() && styles.dateBtnTextDisabled,
                    ]}
                    allowFontScaling={false}
                >
                    Tomorrow
                </Text>
                </TouchableOpacity>
            </View>
            </View>


        {/* SAVE */}
        <TouchableOpacity
          style={[styles.saveBtn,
            { bottom: insets.bottom + 16 },
             saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ======================
   STYLES
====================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scroll: { padding: 16 },

  personBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  personLabel: { color: '#6B7280', fontSize: 13 },
  personName: { fontSize: 20, fontWeight: '700' },

  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  typeInActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  typeOutActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },

  typeTitle: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  typeSub: { fontSize: 12, color: '#6B7280' },
  typeTextActive: { color: '#FFF' },

  group: { marginBottom: 20 },
  label: { fontWeight: '600', marginBottom: 6 },

  amountBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingLeft: 14,
    alignItems: 'center',
  },
  currency: { fontSize: 24, fontWeight: '600' },
  amountInput: {
    flex: 1,
    fontSize: 24,
    padding: 12,
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
  },

//   dateRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
//   dateBtn: {
//     flex: 1,
//     backgroundColor: '#FFF',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     alignItems: 'center',
//   },
//   dateCenter: {
//     flex: 2,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 6,
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//   },
//   dateText: { fontWeight: '600' },

  saveBtn: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { color: '#FFF', fontWeight: '700', fontSize: 16 },


  dateRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

dateBtn: {
  flex: 1,
  height: 42,              // 🔑 fixed height
  backgroundColor: '#FFF',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#D1D5DB',
  alignItems: 'center',
  justifyContent: 'center',
},

dateBtnDisabled: {
  backgroundColor: '#F9FAFB',
},

dateBtnText: {
  fontSize: 13,            // 🔑 explicit font size
  fontWeight: '500',
  color: '#111827',
},

dateBtnTextDisabled: {
  color: '#D1D5DB',
},

dateCenter: {
  flex: 1.4,               // 🔑 reduce from 2 → prevents squeezing
  height: 42,              // 🔑 same height
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  backgroundColor: '#FFF',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#D1D5DB',
},

dateText: {
  fontSize: 13,
  fontWeight: '600',
  color: '#111827',
},

});

//---------------------2---------------