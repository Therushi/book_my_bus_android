import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
import AppButton from '@/components/AppButton';
import BookingCard from '@/components/BookingCard';
import {TripRepository} from '@/database/repositories/TripRepository';
import {BookingRepository} from '@/database/repositories/BookingRepository';
import {SeatRepository} from '@/database/repositories/SeatRepository';
import {Trip, Booking, TripStatus} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {formatDateTime, formatCurrency, tripStatusLabel, tripStatusColor} from '@/utils/helpers';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/models/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TripDetails'>;

const STATUSES: TripStatus[] = ['scheduled', 'on_time', 'delayed', 'departed', 'cancelled'];

const TripDetails: React.FC<Props> = ({route}) => {
  const {tripId} = route.params;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookedSeats, setBookedSeats] = useState(0);

  const load = useCallback(async () => {
    const [t, bks, seats] = await Promise.all([
      TripRepository.findById(tripId),
      BookingRepository.findByTrip(tripId),
      SeatRepository.countBooked(tripId),
    ]);
    setTrip(t);
    setBookings(bks);
    setBookedSeats(seats);
  }, [tripId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const updateStatus = async (status: TripStatus) => {
    await TripRepository.updateStatus(tripId, status);
    load();
  };

  if (!trip) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Trip Info */}
      <View style={styles.card}>
        <Text style={styles.busName}>{trip.bus_name}</Text>
        <Text style={styles.route}>{trip.source} → {trip.destination}</Text>
        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.infoText}>{formatDateTime(trip.departure_time)} — {formatDateTime(trip.arrival_time)}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatCurrency(trip.fare)}</Text>
            <Text style={styles.statLabel}>Fare</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{bookedSeats}/{trip.available_seats + bookedSeats}</Text>
            <Text style={styles.statLabel}>Seats Booked</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, {color: tripStatusColor[trip.status]}]}>
              {tripStatusLabel[trip.status]}
            </Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>
      </View>

      {/* Status Changer */}
      <Text style={styles.sectionTitle}>Change Status</Text>
      <View style={styles.statusRow}>
        {STATUSES.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.statusChip, trip.status === s && {backgroundColor: tripStatusColor[s] + '30', borderColor: tripStatusColor[s]}]}
            onPress={() => updateStatus(s)}>
            <Text style={[styles.statusChipText, trip.status === s && {color: tripStatusColor[s]}]}>
              {tripStatusLabel[s]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings */}
      <Text style={styles.sectionTitle}>Bookings ({bookings.length})</Text>
      {bookings.length === 0 ? <Text style={styles.empty}>No bookings for this trip</Text> :
        bookings.map(bk => <BookingCard key={bk.id} booking={bk} />)
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {padding: Spacing.xl, paddingBottom: Spacing.huge},
  loading: {color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.huge},
  card: {backgroundColor: Colors.card, borderRadius: Radii.lg, padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl, ...Shadows.card},
  busName: {color: Colors.textPrimary, fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold},
  route: {color: Colors.primary, fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.medium, marginTop: Spacing.xs},
  infoRow: {flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.md},
  infoText: {color: Colors.textSecondary, fontSize: Fonts.sizes.sm},
  statsRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xl, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.xl},
  stat: {alignItems: 'center'},
  statValue: {color: Colors.textPrimary, fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold},
  statLabel: {color: Colors.textMuted, fontSize: Fonts.sizes.xs, marginTop: 2},
  sectionTitle: {color: Colors.textPrimary, fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, marginBottom: Spacing.md},
  statusRow: {flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl},
  statusChip: {paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surfaceLight},
  statusChipText: {color: Colors.textSecondary, fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.medium},
  empty: {color: Colors.textMuted, fontSize: Fonts.sizes.md, textAlign: 'center', marginVertical: Spacing.xl},
});

export default TripDetails;
