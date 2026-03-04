import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, Alert, Modal, ScrollView, TouchableOpacity} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
import AppButton from '@/components/AppButton';
import FormInput from '@/components/FormInput';
import TripCard from '@/components/TripCard';
import {TripRepository} from '@/database/repositories/TripRepository';
import {BusRepository} from '@/database/repositories/BusRepository';
import {RouteRepository} from '@/database/repositories/RouteRepository';
import {SeatRepository} from '@/database/repositories/SeatRepository';
import {useAuth} from '@/context/AuthContext';
import {Trip, Bus, Route} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';

const ManageTrips: React.FC<{navigation: any}> = ({navigation}) => {
  const {user} = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({bus_id: '', route_id: '', departure: '', arrival: '', fare: '', seats: '40'});

  const load = useCallback(async () => {
    if (!user) return;
    const [t, b, r] = await Promise.all([
      TripRepository.findByOperator(user.id),
      BusRepository.findByOperator(user.id),
      RouteRepository.getAll(),
    ]);
    setTrips(t); setBuses(b); setRoutes(r);
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const openAdd = () => {
    setForm({bus_id: buses[0]?.id || '', route_id: routes[0]?.id || '', departure: '2026-03-10 08:00:00', arrival: '2026-03-10 12:00:00', fare: '500', seats: '40'});
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.bus_id || !form.route_id || !form.fare) { Alert.alert('Error', 'Fill all fields'); return; }
    try {
      const trip = await TripRepository.create({
        bus_id: form.bus_id, route_id: form.route_id,
        departure_time: form.departure, arrival_time: form.arrival,
        fare: parseFloat(form.fare), status: 'scheduled',
        available_seats: parseInt(form.seats, 10) || 40,
      });
      await SeatRepository.createSeatsForTrip(trip.id, parseInt(form.seats, 10) || 40);
      setModalVisible(false);
      load();
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <AppButton title="Add Trip" onPress={openAdd} icon={<Icon name="plus" size={18} color={Colors.white} />} style={styles.addBtn} />
      </View>
      <FlatList
        data={trips}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <TripCard trip={item} onPress={() => navigation.navigate('TripDetails', {tripId: item.id})} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No trips yet. Add one!</Text>}
      />
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ScrollView>
              <Text style={styles.modalTitle}>Create Trip</Text>
              <Text style={styles.label}>Select Bus</Text>
              <View style={styles.chipRow}>
                {buses.map(b => (
                  <TouchableOpacity key={b.id} style={[styles.chip, form.bus_id === b.id && styles.chipActive]} onPress={() => setForm(f => ({...f, bus_id: b.id, seats: String(b.total_seats)}))}>
                    <Text style={[styles.chipText, form.bus_id === b.id && styles.chipTextActive]}>{b.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Select Route</Text>
              <View style={styles.chipRow}>
                {routes.map(r => (
                  <TouchableOpacity key={r.id} style={[styles.chip, form.route_id === r.id && styles.chipActive]} onPress={() => setForm(f => ({...f, route_id: r.id}))}>
                    <Text style={[styles.chipText, form.route_id === r.id && styles.chipTextActive]}>{r.source} → {r.destination}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <FormInput label="Departure (YYYY-MM-DD HH:mm:ss)" value={form.departure} onChangeText={v => setForm(f => ({...f, departure: v}))} />
              <FormInput label="Arrival (YYYY-MM-DD HH:mm:ss)" value={form.arrival} onChangeText={v => setForm(f => ({...f, arrival: v}))} />
              <FormInput label="Fare (₹)" value={form.fare} onChangeText={v => setForm(f => ({...f, fare: v}))} keyboardType="numeric" />
              <View style={styles.modalActions}>
                <AppButton title="Cancel" variant="outline" onPress={() => setModalVisible(false)} style={{flex: 1}} />
                <AppButton title="Create" onPress={handleSave} style={{flex: 1}} />
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
  title: {color: Colors.textPrimary, fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold},
  addBtn: {paddingHorizontal: Spacing.base, height: 42},
  list: {padding: Spacing.xl},
  empty: {color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xxl, fontSize: Fonts.sizes.md},
  modalOverlay: {flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end'},
  modal: {backgroundColor: Colors.surface, borderTopLeftRadius: Radii.xl, borderTopRightRadius: Radii.xl, padding: Spacing.xl, maxHeight: '90%'},
  modalTitle: {color: Colors.textPrimary, fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold, marginBottom: Spacing.xl},
  label: {color: Colors.textSecondary, fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.medium, marginBottom: Spacing.sm, marginLeft: Spacing.xs},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl},
  chip: {paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surfaceLight},
  chipActive: {borderColor: Colors.primary, backgroundColor: Colors.primary + '20'},
  chipText: {color: Colors.textSecondary, fontSize: Fonts.sizes.sm},
  chipTextActive: {color: Colors.primary, fontWeight: Fonts.weights.semiBold},
  modalActions: {flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md},
});

export default ManageTrips;
