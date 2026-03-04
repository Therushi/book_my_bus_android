import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Modal, ScrollView} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
import AppButton from '@/components/AppButton';
import FormInput from '@/components/FormInput';
import {BusRepository} from '@/database/repositories/BusRepository';
import {UserRepository} from '@/database/repositories/UserRepository';
import {Bus, User, BusType} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';

const BUS_TYPES: BusType[] = ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'];

const ManageBuses: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [operators, setOperators] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editBus, setEditBus] = useState<Bus | null>(null);
  const [form, setForm] = useState({name: '', number_plate: '', total_seats: '40', bus_type: 'AC' as BusType, operator_id: ''});

  const load = useCallback(async () => {
    const [b, ops] = await Promise.all([BusRepository.getAll(), UserRepository.findByRole('operator')]);
    setBuses(b);
    setOperators(ops);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const openAdd = () => {
    setEditBus(null);
    setForm({name: '', number_plate: '', total_seats: '40', bus_type: 'AC', operator_id: operators[0]?.id || ''});
    setModalVisible(true);
  };

  const openEdit = (bus: Bus) => {
    setEditBus(bus);
    setForm({name: bus.name, number_plate: bus.number_plate, total_seats: String(bus.total_seats), bus_type: bus.bus_type, operator_id: bus.operator_id});
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.number_plate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      if (editBus) {
        await BusRepository.update(editBus.id, {
          name: form.name,
          number_plate: form.number_plate,
          total_seats: parseInt(form.total_seats, 10) || 40,
          bus_type: form.bus_type,
          operator_id: form.operator_id,
        });
      } else {
        await BusRepository.create({
          name: form.name,
          number_plate: form.number_plate,
          total_seats: parseInt(form.total_seats, 10) || 40,
          bus_type: form.bus_type,
          operator_id: form.operator_id,
          amenities: '[]',
          status: 'active',
        });
      }
      setModalVisible(false);
      load();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleDelete = (bus: Bus) => {
    Alert.alert('Delete Bus', `Delete "${bus.name}"?`, [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: async () => { await BusRepository.delete(bus.id); load(); }},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Buses</Text>
        <AppButton title="Add Bus" onPress={openAdd} icon={<Icon name="plus" size={18} color={Colors.white} />} style={styles.addBtn} />
      </View>

      <FlatList
        data={buses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="bus" size={20} color={Colors.primary} />
              <Text style={styles.busName}>{item.name}</Text>
              <View style={[styles.statusDot, {backgroundColor: item.status === 'active' ? Colors.success : Colors.error}]} />
            </View>
            <Text style={styles.plate}>{item.number_plate}</Text>
            <View style={styles.meta}>
              <Text style={styles.metaText}>{item.bus_type} • {item.total_seats} seats</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
                <Icon name="pencil" size={18} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
                <Icon name="delete" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No buses added yet</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ScrollView>
              <Text style={styles.modalTitle}>{editBus ? 'Edit Bus' : 'Add Bus'}</Text>
              <FormInput label="Bus Name" value={form.name} onChangeText={v => setForm(f => ({...f, name: v}))} placeholder="e.g. Royal Cruiser" />
              <FormInput label="Number Plate" value={form.number_plate} onChangeText={v => setForm(f => ({...f, number_plate: v}))} placeholder="e.g. GJ-01-AB-1234" autoCapitalize="characters" />
              <FormInput label="Total Seats" value={form.total_seats} onChangeText={v => setForm(f => ({...f, total_seats: v}))} keyboardType="number-pad" placeholder="40" />
              <Text style={styles.label}>Bus Type</Text>
              <View style={styles.typeRow}>
                {BUS_TYPES.map(t => (
                  <TouchableOpacity key={t} style={[styles.typeChip, form.bus_type === t && styles.typeChipActive]} onPress={() => setForm(f => ({...f, bus_type: t}))}>
                    <Text style={[styles.typeChipText, form.bus_type === t && styles.typeChipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.modalActions}>
                <AppButton title="Cancel" variant="outline" onPress={() => setModalVisible(false)} style={{flex: 1}} />
                <AppButton title="Save" onPress={handleSave} style={{flex: 1}} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.xl, paddingBottom: 0},
  title: {
    color: Colors.primaryDark,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.extraBold,
    letterSpacing: -0.5,
  },
  addBtn: {paddingHorizontal: Spacing.base, height: 42, borderRadius: Radii.lg},
  list: {padding: Spacing.xl, paddingBottom: Spacing.huge},
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardHeader: {flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs},
  busName: {color: Colors.textPrimary, fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, flex: 1},
  statusDot: {width: 10, height: 10, borderRadius: 5},
  plate: {color: Colors.textSecondary, fontSize: Fonts.sizes.md, marginBottom: Spacing.xs, marginLeft: 28},
  meta: {marginLeft: 28},
  metaText: {color: Colors.textMuted, fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.medium},
  actions: {flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md, marginTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.surfaceLight, paddingTop: Spacing.md},
  actionBtn: {padding: Spacing.sm, backgroundColor: Colors.surfaceLight, borderRadius: Radii.full},
  empty: {color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xxl, fontSize: Fonts.sizes.md, fontStyle: 'italic'},
  modalOverlay: {flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end'},
  modal: {backgroundColor: Colors.surface, borderTopLeftRadius: Radii.xl, borderTopRightRadius: Radii.xl, padding: Spacing.xl, maxHeight: '85%'},
  modalTitle: {color: Colors.primaryDark, fontSize: Fonts.sizes.xxl, fontWeight: Fonts.weights.extraBold, marginBottom: Spacing.xl, letterSpacing: -0.5},
  label: {color: Colors.textSecondary, fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, marginBottom: Spacing.sm, marginLeft: Spacing.xs},
  typeRow: {flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl, flexWrap: 'wrap'},
  typeChip: {paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surfaceLight},
  typeChipActive: {borderColor: Colors.primary, backgroundColor: Colors.primary + '15'},
  typeChipText: {color: Colors.textSecondary, fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.medium},
  typeChipTextActive: {color: Colors.primary, fontWeight: Fonts.weights.bold},
  modalActions: {flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, paddingBottom: Spacing.xl},
});

export default ManageBuses;
