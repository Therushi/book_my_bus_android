import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Fonts, Spacing, Radii } from '@/theme/theme';
import BookingCard from '@/components/BookingCard';
import { BookingRepository } from '@/database/repositories/BookingRepository';
import { Booking } from '@/models/types';
import { useFocusEffect } from '@react-navigation/native';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = useCallback(async () => {
    setBookings(await BookingRepository.getAll());
  }, []);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View style={styles.flex}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.headerBackground}>
        <Text style={styles.title}>All Bookings</Text>
      </View>
      <FlatList
        data={bookings}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        style={styles.overlapContent}
        renderItem={({ item }) => <BookingCard booking={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Icon
                name="ticket-confirmation"
                size={48}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyDesc}>
              Bookings will appear here once made.
            </Text>
          </View>
        }
      />
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
  },
  title: {
    color: Colors.white,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.bold,
    letterSpacing: -0.3,
  },
  overlapContent: { marginTop: -44 },
  list: { padding: Spacing.xl, paddingBottom: Spacing.huge },
  emptyState: { alignItems: 'center', marginTop: Spacing.xxl },
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
});

export default AdminBookings;
