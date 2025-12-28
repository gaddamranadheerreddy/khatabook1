import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCompany } from '@/context/CompanyContext';

export default function CompanySwitcher() {
  const router = useRouter();
  const { companies, selectedCompanyId, setSelectedCompanyId } = useCompany();

  const select = (id: number | null) => {
    setSelectedCompanyId(id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={() => select(null)}>
        <Text style={styles.text}>All Companies</Text>
      </TouchableOpacity>

      {companies.map((c) => (
        <TouchableOpacity
          key={c.id}
          style={styles.item}
          onPress={() => select(c.id)}
        >
          <Text style={styles.text}>{c.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
