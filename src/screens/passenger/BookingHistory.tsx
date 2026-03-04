import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Colors, Fonts, Spacing, Radii, Shadows } from '@/theme/theme';
import BookingCard from '@/components/BookingCard';
import AppButton from '@/components/AppButton';
import { BookingRepository } from '@/database/repositories/BookingRepository';
import { SeatRepository } from '@/database/repositories/SeatRepository';
import { TripRepository } from '@/database/repositories/TripRepository';
import { useAuth } from '@/context/AuthContext';
import { Booking } from '@/models/types';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SEGMENTS = ['All', 'Upcoming', 'Cancelled'];

const BookingHistory: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(0);

  const load = useCallback(async () => {
    if (!user) return;
    setBookings(await BookingRepository.findByPassenger(user.id));
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleCancel = (bk: Booking) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          await BookingRepository.cancel(bk.id);
          const seatIds = JSON.parse(bk.seat_ids) as string[];
          await SeatRepository.releaseSeats(seatIds);
          const trip = await TripRepository.findById(bk.trip_id);
          if (trip) {
            await TripRepository.updateAvailableSeats(
              bk.trip_id,
              trip.available_seats + seatIds.length,
            );
          }
          load();
        },
      },
    ]);
  };

  // const handleRebook = (bk: Booking) => {
  //   if (bk.source && bk.destination) {
  //     navigation.navigate('TripResults', {
  //       source: bk.source,
  //       destination: bk.destination,
  //     });
  //   }
  // };

  const filteredBookings = bookings.filter(b => {
    if (selectedSegment === 0) return true;
    if (selectedSegment === 1) return b.status === 'confirmed';
    if (selectedSegment === 2) return b.status === 'cancelled';
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.primaryDark}
        barStyle="light-content"
      />

      {/* Red Banner Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>{bookings.length} total bookings</Text>
      </View>

      {/* Segment Control */}
      <View style={styles.segmentContainer}>
        {SEGMENTS.map((label, index) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.segmentChip,
              selectedSegment === index && styles.segmentChipActive,
            ]}
            onPress={() => setSelectedSegment(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                selectedSegment === index && styles.segmentTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() =>
              navigation.navigate('TicketScreen', { bookingId: item.id })
            }
            onCancel={
              item.status === 'confirmed' ? () => handleCancel(item) : undefined
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Icon name="ticket-outline" size={42} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptyDesc}>Your bookings will appear here</Text>
            <AppButton
              title="Search Buses"
              onPress={() => navigation.navigate('SearchBuses')}
              style={styles.emptyCta}
              icon={<Icon name="magnify" size={18} color={Colors.white} />}
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 52 : Spacing.xxl + 8,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  title: {
    color: Colors.white,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.bold,
  },
  subtitle: {
    color: Colors.white,
    opacity: 0.8,
    fontSize: Fonts.sizes.sm,
    marginTop: 4,
  },
  segmentContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    ...Shadows.small,
  },
  segmentChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentChipActive: {
    backgroundColor: Colors.primary + '12',
    borderColor: Colors.primary,
  },
  segmentText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
  },
  segmentTextActive: {
    color: Colors.primary,
    fontWeight: Fonts.weights.semiBold,
  },
  list: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  emptyState: { alignItems: 'center', marginTop: Spacing.huge },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  emptyCta: { marginTop: Spacing.xl },
});

export default BookingHistory;
