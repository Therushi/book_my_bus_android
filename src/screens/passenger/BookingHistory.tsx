import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, Alert, RefreshControl} from 'react-native';
import {Colors, Fonts, Spacing} from '@/theme/theme';
import BookingCard from '@/components/BookingCard';
import {BookingRepository} from '@/database/repositories/BookingRepository';
import {SeatRepository} from '@/database/repositories/SeatRepository';
import {TripRepository} from '@/database/repositories/TripRepository';
import {useAuth} from '@/context/AuthContext';
import {Booking} from '@/models/types';
import {useFocusEffect} from '@react-navigation/native';

const BookingHistory: React.FC<{navigation: any}> = ({navigation}) => {
  const {user} = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setBookings(await BookingRepository.findByPassenger(user.id));
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleCancel = (bk: Booking) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel?', [
      {text: 'No', style: 'cancel'},
      {text: 'Yes, Cancel', style: 'destructive', onPress: async () => {
        await BookingRepository.cancel(bk.id);
        const seatIds = JSON.parse(bk.seat_ids) as string[];
        await SeatRepository.releaseSeats(seatIds);
        const trip = await TripRepository.findById(bk.trip_id);
        if (trip) {
          await TripRepository.updateAvailableSeats(bk.trip_id, trip.available_seats + seatIds.length);
        }
        load();
      }},
    ]);
  };

  const handleRebook = (bk: Booking) => {
    if (bk.source && bk.destination) {
      navigation.navigate('TripResults', {source: bk.source, destination: bk.destination});
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking History</Text>
      <FlatList
        data={bookings}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        renderItem={({item}) => (
          <BookingCard
            booking={item}
            onPress={() => navigation.navigate('TicketScreen', {bookingId: item.id})}
            onCancel={item.status === 'confirmed' ? () => handleCancel(item) : undefined}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No bookings yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  title: {color: Colors.textPrimary, fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold, padding: Spacing.xl, paddingBottom: 0},
  list: {padding: Spacing.xl},
  empty: {color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xxl, fontSize: Fonts.sizes.md},
});

export default BookingHistory;
