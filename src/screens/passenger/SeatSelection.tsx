import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
import AppButton from '@/components/AppButton';
import SeatLayout from '@/components/SeatLayout';
import {TripRepository} from '@/database/repositories/TripRepository';
import {SeatRepository} from '@/database/repositories/SeatRepository';
import {BookingRepository} from '@/database/repositories/BookingRepository';
import {PaymentRepository} from '@/database/repositories/PaymentRepository';
import {useAuth} from '@/context/AuthContext';
import {Trip, Seat} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {formatTime, formatDate, formatCurrency} from '@/utils/helpers';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/models/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SeatSelection'>;

const SeatSelection: React.FC<Props> = ({route, navigation}) => {
  const {tripId} = route.params;
  const {user} = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [t, s] = await Promise.all([
          TripRepository.findById(tripId),
          SeatRepository.findByTrip(tripId),
        ]);
        setTrip(t);
        setSeats(s);
      })();
    }, [tripId]),
  );

  const handleToggle = (seat: Seat) => {
    setSelectedIds(prev =>
      prev.includes(seat.id)
        ? prev.filter(id => id !== seat.id)
        : [...prev, seat.id],
    );
  };

  const handleBook = async () => {
    if (!trip || !user || selectedIds.length === 0) return;
    setLoading(true);
    try {
      // Lock seats
      await SeatRepository.lockSeats(selectedIds);
      // Book seats
      await SeatRepository.bookSeats(selectedIds);
      // Update trip available seats
      const totalFare = trip.fare * selectedIds.length;
      await TripRepository.updateAvailableSeats(tripId, trip.available_seats - selectedIds.length);
      // Create booking
      const booking = await BookingRepository.create({
        passenger_id: user.id,
        trip_id: tripId,
        seat_ids: selectedIds,
        total_fare: totalFare,
        passenger_name: user.name,
        passenger_phone: user.phone,
      });
      // Create mock payment
      const payment = await PaymentRepository.create({
        booking_id: booking.id,
        amount: totalFare,
      });
      navigation.navigate('PaymentScreen', {bookingId: booking.id});
    } catch (e: any) {
      Alert.alert('Booking Failed', e.message);
      await SeatRepository.unlockSeats(selectedIds);
    }
    setLoading(false);
  };

  if (!trip) return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>;

  const totalFare = trip.fare * selectedIds.length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <Text style={styles.busName}>{trip.bus_name}</Text>
          <Text style={styles.route}>{trip.source} → {trip.destination}</Text>
          <Text style={styles.timing}>
            {formatDate(trip.departure_time)} • {formatTime(trip.departure_time)} — {formatTime(trip.arrival_time)}
          </Text>
        </View>

        {/* Seat Layout */}
        <View style={styles.seatContainer}>
          <SeatLayout seats={seats} selectedIds={selectedIds} onToggle={handleToggle} />
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summary}>
          <Text style={styles.selectedCount}>{selectedIds.length} seat{selectedIds.length !== 1 ? 's' : ''}</Text>
          <Text style={styles.totalFare}>{formatCurrency(totalFare)}</Text>
        </View>
        <AppButton
          title="Book Now"
          onPress={handleBook}
          disabled={selectedIds.length === 0}
          loading={loading}
          style={styles.bookBtn}
          icon={<Icon name="check-circle" size={20} color={Colors.white} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {paddingBottom: 120},
  loadingText: {color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.huge},
  tripInfo: {padding: Spacing.xl, borderBottomWidth: 1, borderBottomColor: Colors.border},
  busName: {color: Colors.textPrimary, fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold},
  route: {color: Colors.primary, fontSize: Fonts.sizes.base, fontWeight: Fonts.weights.medium, marginTop: 4},
  timing: {color: Colors.textSecondary, fontSize: Fonts.sizes.sm, marginTop: 4},
  seatContainer: {backgroundColor: Colors.card, margin: Spacing.xl, borderRadius: Radii.xl, padding: Spacing.base, borderWidth: 1, borderColor: Colors.border, ...Shadows.card},
  bottomBar: {position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, padding: Spacing.xl, flexDirection: 'row', alignItems: 'center'},
  summary: {flex: 1},
  selectedCount: {color: Colors.textSecondary, fontSize: Fonts.sizes.sm},
  totalFare: {color: Colors.accent, fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold},
  bookBtn: {minWidth: 140},
});

export default SeatSelection;
