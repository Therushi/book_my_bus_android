import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Colors, Fonts, Spacing} from '@/theme/theme';
import BookingCard from '@/components/BookingCard';
import {BookingRepository} from '@/database/repositories/BookingRepository';
import {Booking} from '@/models/types';
import {useFocusEffect} from '@react-navigation/native';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = useCallback(async () => {
    setBookings(await BookingRepository.getAll());
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Bookings</Text>
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

export default AdminBookings;
