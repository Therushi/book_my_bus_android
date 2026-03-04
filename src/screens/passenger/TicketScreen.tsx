import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Colors, Fonts, Spacing, Radii, Shadows } from '@/theme/theme';
import AppButton from '@/components/AppButton';
import { BookingRepository } from '@/database/repositories/BookingRepository';
import { Booking } from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDateTime, formatCurrency } from '@/utils/helpers';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/models/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketScreen'>;

const TicketScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    BookingRepository.findById(bookingId).then(setBooking);
  }, [bookingId]);

  if (!booking)
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );

  const seatIds: string[] = JSON.parse(booking.seat_ids);
  const isConfirmed = booking.status === 'confirmed';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Ticket Card */}
      <View style={styles.ticket}>
        {/* Header with gradient feel */}
        <View style={styles.ticketHeader}>
          <View style={styles.headerRow}>
            <Icon name="bus" size={24} color={Colors.white} />
            <Text style={styles.brandName}>BookMyBus</Text>
          </View>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: isConfirmed
                  ? Colors.success + '30'
                  : Colors.error + '30',
              },
            ]}
          >
            <Icon
              name={isConfirmed ? 'check-circle' : 'close-circle'}
              size={14}
              color={isConfirmed ? Colors.success : Colors.error}
            />
            <Text
              style={[
                styles.statusPillText,
                { color: isConfirmed ? Colors.success : Colors.error },
              ]}
            >
              {booking.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.routeSection}>
          <View style={styles.routePoint}>
            <Text style={styles.routeCity}>{booking.source || '—'}</Text>
            <Text style={styles.routeLabel}>FROM</Text>
          </View>
          <View style={styles.routeArrow}>
            <View style={styles.routeLine} />
            <Icon name="bus" size={20} color={Colors.primary} />
            <View style={styles.routeLine} />
          </View>
          <View style={styles.routePoint}>
            <Text style={styles.routeCity}>{booking.destination || '—'}</Text>
            <Text style={styles.routeLabel}>TO</Text>
          </View>
        </View>

        {/* Divider with circles */}
        <View style={styles.dividerRow}>
          <View style={styles.cutoutLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.cutoutRight} />
        </View>

        {/* Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>DATE & TIME</Text>
            <Text style={styles.detailValue}>
              {booking.departure_time
                ? formatDateTime(booking.departure_time)
                : '—'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>BUS</Text>
            <Text style={styles.detailValue}>{booking.bus_name || '—'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>SEAT(S)</Text>
            <Text style={styles.detailValue}>
              {seatIds.length} seat{seatIds.length > 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>PASSENGER</Text>
            <Text style={styles.detailValue}>
              {booking.passenger_name || '—'}
            </Text>
          </View>
        </View>

        {/* Fare */}
        <View style={styles.fareSection}>
          <Text style={styles.fareLabel}>TOTAL FARE</Text>
          <Text style={styles.fareValue}>
            {formatCurrency(booking.total_fare)}
          </Text>
        </View>

        {/* Booking ID */}
        <View style={styles.idSection}>
          <Text style={styles.idLabel}>BOOKING ID</Text>
          <Text style={styles.idValue}>
            {booking.id.slice(0, 12).toUpperCase()}
          </Text>
        </View>
      </View>

      <AppButton
        title="Back to Home"
        variant="outline"
        onPress={() => navigation.popToTop()}
        style={styles.homeBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? Spacing.huge : Spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.huge,
  },
  ticket: {
    backgroundColor: Colors.card,
    borderRadius: Radii.xl,
    width: '100%',
    overflow: 'hidden',
    ...Shadows.card,
  },
  ticketHeader: {
    backgroundColor: Colors.primary,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brandName: {
    color: Colors.white,
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  statusPillText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 0.5,
  },
  routeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.xl,
  },
  routePoint: { alignItems: 'center', flex: 1 },
  routeCity: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.bold,
  },
  routeLabel: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
    marginTop: 4,
    letterSpacing: 1,
  },
  routeArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  routeLine: {
    width: 20,
    height: 1.5,
    backgroundColor: Colors.border,
  },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 0 },
  cutoutLeft: {
    width: 16,
    height: 32,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: Colors.background,
    marginLeft: -1,
  },
  dashedLine: {
    flex: 1,
    borderTopWidth: 2,
    borderTopColor: Colors.borderLight,
    borderStyle: 'dashed',
  },
  cutoutRight: {
    width: 16,
    height: 32,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: Colors.background,
    marginRight: -1,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.xl,
    paddingTop: Spacing.md,
  },
  detailItem: { width: '50%', marginBottom: Spacing.lg },
  detailLabel: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.medium,
    letterSpacing: 1,
  },
  detailValue: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semiBold,
    marginTop: 4,
  },
  fareSection: {
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  fareLabel: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
    letterSpacing: 1,
  },
  fareValue: {
    color: Colors.primary,
    fontSize: Fonts.sizes.xxxl,
    fontWeight: Fonts.weights.extraBold,
    marginTop: 4,
  },
  idSection: { padding: Spacing.xl, alignItems: 'center' },
  idLabel: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
    letterSpacing: 1,
  },
  idValue: {
    color: Colors.primary,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    marginTop: 4,
    letterSpacing: 2,
  },
  homeBtn: { marginTop: Spacing.xxl, width: '100%' },
});

export default TicketScreen;
