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

import {
  getPersonById,
  updatePerson,
  deletePerson,
} from '@/database/service';

export default function ManagePerson() {
  const router = useRouter();
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const id = Number(personId);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Load person once
  useState(() => {
    (async () => {
      const p = await getPersonById(id);
      if (!p) return;
      setName(p.name);
      setPhone(p.phone ?? '');
    })();
  });

  const handleSave = async () => {
    if (!name.trim()) return;

    await updatePerson(id, {
      name: name.trim(),
      phone: phone.trim() || null,
    });

    router.back();
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Person',
      'All transactions of this person will be deleted. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePerson(id);
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.label}>Phone (optional)</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
        <Text style={styles.btnText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Person</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F3F4F6' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
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
