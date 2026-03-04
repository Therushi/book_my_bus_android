import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Colors, Fonts, Spacing} from '@/theme/theme';
import BookingCard from '@/components/BookingCard';
import {BookingRepository} from '@/database/repositories/BookingRepository';
import {useAuth} from '@/context/AuthContext';
import {TripRepository} from '@/database/repositories/TripRepository';
import {Booking} from '@/models/types';
import {useFocusEffect} from '@react-navigation/native';

const OperatorBookings: React.FC = () => {
  const {user} = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    const trips = await TripRepository.findByOperator(user.id);
    const tripIds = new Set(trips.map(t => t.id));
    const all = await BookingRepository.getAll();
    setBookings(all.filter(b => tripIds.has(b.trip_id)));
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => <BookingCard booking={item} />}
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

export default OperatorBookings;
