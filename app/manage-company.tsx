import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { renameCompany, deleteCompany, updateCompany } from '@/database/service';
import { useCompany } from '@/context/CompanyContext';

export default function ManageCompany() {
  const router = useRouter();
  const { companyId } = useLocalSearchParams<{ companyId: string }>();
  const id = Number(companyId);

  const { companies, reloadCompanies, setSelectedCompanyId } = useCompany();
  const company = companies.find(c => c.id === id);

  const [name, setName] = useState(company?.name ?? '');
  const [note, setNote] = useState(company?.note ?? '');

  if (!company) return null;

  const handleRename = async () => {
    if (!name.trim()) return;

    await updateCompany(id, name.trim(), note.trim() || '');
    await reloadCompanies();
    setSelectedCompanyId(id);
    router.back();
  };

  const handleDelete = async () => {
    if (companies.length === 1) {
      Alert.alert('Not allowed', 'You must have at least one company.');
      return;
    }

    Alert.alert(
      'Delete Company',
      'This will delete all related people & transactions. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCompany(id);
            await reloadCompanies();
            setSelectedCompanyId(null);
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Company Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a note (optional)"
        value={note}
        onChangeText={setNote}
        multiline={true}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleRename}>
        <Text style={styles.btnText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Company</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F3F4F6' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#FFF', fontWeight: '600' },
  deleteBtn: { marginTop: 24, alignItems: 'center' },
  deleteText: { color: '#EF4444', fontWeight: '600' },
});
