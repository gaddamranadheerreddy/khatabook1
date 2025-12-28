// import { useState } from 'react';
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
// import { useRouter } from 'expo-router';
// import { addPerson } from '@/database/service';

// export default function AddPersonScreen() {
//   const router = useRouter();
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [saving, setSaving] = useState(false);

//   const handleSave = async () => {
//     if (!name.trim()) {
//       Alert.alert('Error', 'Please enter a name');
//       return;
//     }

//     setSaving(true);
//     try {
//       await addPerson({
//         name: name.trim(),
//         phone: phone.trim() || undefined,
//       });
//       router.back();
//     } catch (error) {
//       console.error('Failed to add person:', error);
//       Alert.alert('Error', 'Failed to add person. Please try again.');
//     } finally {
//       setSaving(false);
//     }
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
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>
//               Name <Text style={styles.required}>*</Text>
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter person's name"
//               value={name}
//               onChangeText={setName}
//               autoFocus
//               autoCapitalize="words"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Phone Number (Optional)</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter phone number"
//               value={phone}
//               onChangeText={setPhone}
//               keyboardType="phone-pad"
//             />
//           </View>

//           <TouchableOpacity
//             style={[styles.button, saving && styles.buttonDisabled]}
//             onPress={handleSave}
//             disabled={saving}
//           >
//             <Text style={styles.buttonText}>
//               {saving ? 'Saving...' : 'Add Person'}
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
//   input: {
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#111827',
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

//--------1--------------

//-------------2---------------
import { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { addPerson } from '@/database/service';
import { useCompany } from '@/context/CompanyContext';

export default function AddPersonScreen() {
  const router = useRouter();
  const { selectedCompanyId } = useCompany();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    // ❗ Block adding person when "All Companies" is selected
    if (selectedCompanyId === null) {
      Alert.alert(
        'Select Company',
        'Please select a company before adding a person.'
      );
      return;
    }

    setSaving(true);
    try {
      await addPerson({
        name: name.trim(),
        phone: phone.trim() || undefined,
        company_id: selectedCompanyId, // ✅ REQUIRED
      });

      router.back();
    } catch (error) {
      console.error('Failed to add person:', error);
      Alert.alert('Error', 'Failed to add person. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter person's name"
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? 'Saving...' : 'Add Person'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

//------------2--------------------