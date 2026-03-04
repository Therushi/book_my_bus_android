import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors, Fonts, Spacing, Radii, Shadows } from '@/theme/theme';
import AppButton from '@/components/AppButton';
import FormInput from '@/components/FormInput';
import { TripRepository } from '@/database/repositories/TripRepository';
import { BusRepository } from '@/database/repositories/BusRepository';
import { RouteRepository } from '@/database/repositories/RouteRepository';
import { SeatRepository } from '@/database/repositories/SeatRepository';
import { Trip, Bus, Route } from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

const STATUS_COLORS: Record<string, string> = {
  scheduled: Colors.info,
  on_time: Colors.success,
  delayed: Colors.warning,
  departed: Colors.textSecondary,
  cancelled: Colors.error,
};

const AdminManageTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    bus_id: '',
    route_id: '',
    departure: '',
    arrival: '',
    fare: '',
    seats: '40',
  });

  const load = useCallback(async () => {
    const [t, b, r] = await Promise.all([
      TripRepository.getAll(),
      BusRepository.getActive(),
      RouteRepository.getAll(),
    ]);
    setTrips(t);
    setBuses(b);
    setRoutes(r);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const openAdd = () => {
    setForm({
      bus_id: buses[0]?.id || '',
      route_id: routes[0]?.id || '',
      departure: '2026-03-10 08:00:00',
      arrival: '2026-03-10 12:00:00',
      fare: '500',
      seats: String(buses[0]?.total_seats || 40),
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.bus_id || !form.route_id || !form.fare) {
      Alert.alert('Error', 'Please select a bus, a route, and enter the fare');
      return;
    }
    if (!form.departure || !form.arrival) {
      Alert.alert('Error', 'Please enter departure and arrival times');
      return;
    }
    try {
      const trip = await TripRepository.create({
        bus_id: form.bus_id,
        route_id: form.route_id,
        departure_time: form.departure,
        arrival_time: form.arrival,
        fare: parseFloat(form.fare),
        status: 'scheduled',
        available_seats: parseInt(form.seats, 10) || 40,
      });
      await SeatRepository.createSeatsForTrip(
        trip.id,
        parseInt(form.seats, 10) || 40,
      );
      setModalVisible(false);
      load();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleDelete = (trip: Trip) => {
    const label = `${trip.source ?? ''} → ${trip.destination ?? ''} (${
      trip.bus_name ?? 'Unknown bus'
    })`;
    Alert.alert('Delete Trip', `Delete "${label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await TripRepository.delete(trip.id);
          load();
        },
      },
    ]);
  };

  const selectedBus = buses.find(b => b.id === form.bus_id);

  return (
    <View style={styles.flex}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.headerBackground}>
        <Text style={styles.title}>Manage Trips</Text>
        <AppButton
          title="Add Trip"
          onPress={openAdd}
          icon={<Icon name="plus" size={18} color={Colors.primary} />}
          style={styles.addBtn}
          textStyle={{ color: Colors.primary }}
        />
      </View>

      <FlatList
        data={trips}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        style={styles.overlapContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Icon name="bus" size={20} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.busName}>{item.bus_name ?? 'Unknown'}</Text>
                <Text style={styles.routeText}>
                  {item.source} → {item.destination}
                </Text>
                <Text style={styles.timeText}>
                  {item.departure_time} → {item.arrival_time}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.fare}>₹{item.fare}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          (STATUS_COLORS[item.status] || Colors.textMuted) +
                          '18',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: STATUS_COLORS[item.status] || Colors.textMuted,
                        },
                      ]}
                    >
                      {item.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.seats}>{item.available_seats} seats</Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={styles.actionBtn}
              >
                <Icon name="delete" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Icon name="road-variant" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptyDesc}>
              Tap "Add Trip" above to create one.
            </Text>
          </View>
        }
      />

      {/* Add Trip Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ScrollView>
              <Text style={styles.modalTitle}>Create Trip</Text>

              {/* Bus Selector */}
              <Text style={styles.label}>Select Bus</Text>
              {buses.length === 0 ? (
                <Text style={styles.noneText}>
                  No active buses. Create one from the Buses tab.
                </Text>
              ) : (
                <View style={styles.chipRow}>
                  {buses.map(b => (
                    <TouchableOpacity
                      key={b.id}
                      style={[
                        styles.chip,
                        form.bus_id === b.id && styles.chipActive,
                      ]}
                      onPress={() =>
                        setForm(f => ({
                          ...f,
                          bus_id: b.id,
                          seats: String(b.total_seats),
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          form.bus_id === b.id && styles.chipTextActive,
                        ]}
                      >
                        {b.name}
                      </Text>
                      <Text
                        style={[
                          styles.chipMeta,
                          form.bus_id === b.id && styles.chipMetaActive,
                        ]}
                      >
                        {b.bus_type} • {b.total_seats} seats
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Route Selector */}
              <Text style={styles.label}>Select Route</Text>
              {routes.length === 0 ? (
                <Text style={styles.noneText}>
                  No routes available. Create one from the Routes tab.
                </Text>
              ) : (
                <View style={styles.chipRow}>
                  {routes.map(r => (
                    <TouchableOpacity
                      key={r.id}
                      style={[
                        styles.chip,
                        form.route_id === r.id && styles.chipActive,
                      ]}
                      onPress={() => setForm(f => ({ ...f, route_id: r.id }))}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          form.route_id === r.id && styles.chipTextActive,
                        ]}
                      >
                        {r.source} → {r.destination}
                      </Text>
                      {r.distance_km ? (
                        <Text
                          style={[
                            styles.chipMeta,
                            form.route_id === r.id && styles.chipMetaActive,
                          ]}
                        >
                          {r.distance_km} km
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Trip Details */}
              <FormInput
                label="Departure (YYYY-MM-DD HH:mm:ss)"
                value={form.departure}
                onChangeText={v => setForm(f => ({ ...f, departure: v }))}
                placeholder="2026-03-10 08:00:00"
              />
              <FormInput
                label="Arrival (YYYY-MM-DD HH:mm:ss)"
                value={form.arrival}
                onChangeText={v => setForm(f => ({ ...f, arrival: v }))}
                placeholder="2026-03-10 12:00:00"
              />
              <FormInput
                label="Fare (₹)"
                value={form.fare}
                onChangeText={v => setForm(f => ({ ...f, fare: v }))}
                keyboardType="numeric"
                placeholder="500"
              />
              {selectedBus && (
                <Text style={styles.seatInfo}>
                  Seats will be auto-generated: {selectedBus.total_seats} seats
                  ({selectedBus.bus_type})
                </Text>
              )}

              <View style={styles.modalActions}>
                <AppButton
                  title="Cancel"
                  variant="outline"
                  onPress={() => setModalVisible(false)}
                  style={{ flex: 1 }}
                />
                <AppButton
                  title="Create"
                  onPress={handleSave}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  headerBackground: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 56 : Spacing.xxl + 16,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 80,
    borderBottomLeftRadius: Radii.xxl,
    borderBottomRightRadius: Radii.xxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: Colors.white,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.bold,
    letterSpacing: -0.3,
  },
  addBtn: {
    paddingHorizontal: Spacing.base,
    height: 42,
    borderRadius: Radii.full,
    backgroundColor: Colors.white,
  },
  overlapContent: {
    marginTop: -44,
  },
  list: { padding: Spacing.xl, paddingBottom: Spacing.huge },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  busName: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
  },
  routeText: {
    color: Colors.primary,
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semiBold,
    marginTop: 2,
  },
  timeText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginTop: 4,
    fontWeight: Fonts.weights.medium,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  fare: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.bold,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 0.5,
  },
  seats: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
    paddingTop: Spacing.md,
  },
  actionBtn: {
    padding: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radii.full,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  emptyIconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.semiBold,
    marginTop: Spacing.base,
  },
  emptyDesc: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.md,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    padding: Spacing.xl,
    maxHeight: '90%',
  },
  modalTitle: {
    color: Colors.primaryDark,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.extraBold,
    marginBottom: Spacing.xl,
    letterSpacing: -0.5,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  noneText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    fontStyle: 'italic',
    marginBottom: Spacing.xl,
    marginLeft: Spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceLight,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: Fonts.weights.bold,
  },
  chipMeta: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
    marginTop: 2,
  },
  chipMetaActive: {
    color: Colors.primary + 'AA',
  },
  seatInfo: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});

export default AdminManageTrips;
