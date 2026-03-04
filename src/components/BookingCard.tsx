import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
import {Booking} from '@/models/types';
import {formatDateTime, formatCurrency, tripStatusLabel, tripStatusColor} from '@/utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  booking: Booking;
  onPress?: () => void;
  onCancel?: () => void;
}

const BookingCard: React.FC<Props> = ({booking, onPress, onCancel}) => {
  const statusColors: Record<string, string> = {
    confirmed: Colors.success,
    cancelled: Colors.error,
    completed: Colors.info,
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      disabled={!onPress}>
      <View style={styles.header}>
        <View style={styles.idRow}>
          <Icon name="ticket-confirmation" size={16} color={Colors.primary} />
          <Text style={styles.bookingId}>#{booking.id.slice(0, 8).toUpperCase()}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: (statusColors[booking.status] || Colors.info) + '20'},
          ]}>
          <Text
            style={[
              styles.statusText,
              {color: statusColors[booking.status] || Colors.info},
            ]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.routeRow}>
        <Text style={styles.route}>
          {booking.source || '—'} → {booking.destination || '—'}
        </Text>
        <Text style={styles.busName}>{booking.bus_name}</Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Icon name="calendar-clock" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>
            {booking.departure_time ? formatDateTime(booking.departure_time) : '—'}
          </Text>
        </View>
        <Text style={styles.fare}>{formatCurrency(booking.total_fare)}</Text>
      </View>

      {booking.trip_status && (
        <View style={styles.tripStatusRow}>
          <Text style={styles.tripLabel}>Trip: </Text>
          <Text style={[styles.tripStatus, {color: tripStatusColor[booking.trip_status] || Colors.info}]}>
            {tripStatusLabel[booking.trip_status] || booking.trip_status}
          </Text>
        </View>
      )}

      {onCancel && booking.status === 'confirmed' && (
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
          <Icon name="close-circle-outline" size={16} color={Colors.error} />
          <Text style={styles.cancelText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radii.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  bookingId: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.sm,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.bold,
  },
  routeRow: {
    marginBottom: Spacing.md,
  },
  route: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: 2,
  },
  busName: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
  },
  fare: {
    color: Colors.accent,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
  },
  tripStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  tripLabel: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
  },
  tripStatus: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semiBold,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelText: {
    color: Colors.error,
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.medium,
  },
});

export default BookingCard;
