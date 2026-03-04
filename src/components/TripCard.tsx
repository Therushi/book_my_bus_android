import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Fonts, Spacing, Radii, Shadows } from '@/theme/theme';
import { Trip } from '@/models/types';
import {
  formatTime,
  formatDate,
  formatCurrency,
  tripStatusLabel,
  tripStatusColor,
} from '@/utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  trip: Trip;
  onPress?: () => void;
  showStatus?: boolean;
}

const TripCard: React.FC<Props> = ({ trip, onPress, showStatus = true }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={!onPress}
    >
      {/* Header: Bus name + type + status */}
      <View style={styles.header}>
        <View style={styles.busInfo}>
          <View style={styles.busIconBg}>
            <Icon name="bus" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.busName}>{trip.bus_name || 'Bus'}</Text>
          {trip.bus_type && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{trip.bus_type}</Text>
            </View>
          )}
        </View>
        {showStatus && (
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  (tripStatusColor[trip.status] || Colors.info) + '15',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: tripStatusColor[trip.status] || Colors.info },
              ]}
            >
              {tripStatusLabel[trip.status] || trip.status}
            </Text>
          </View>
        )}
      </View>

      {/* Route Timeline */}
      <View style={styles.route}>
        <View style={styles.routeEndpoint}>
          <Text style={styles.timeText}>{formatTime(trip.departure_time)}</Text>
          <Text style={styles.city}>{trip.source || '—'}</Text>
        </View>

        <View style={styles.timeline}>
          <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
          <View style={styles.line} />
          <View style={[styles.dot, { backgroundColor: Colors.success }]} />
        </View>

        <View style={[styles.routeEndpoint, styles.routeEndpointRight]}>
          <Text style={styles.timeText}>{formatTime(trip.arrival_time)}</Text>
          <Text style={styles.city}>{trip.destination || '—'}</Text>
        </View>
      </View>

      {/* Footer: Date + Seats + Fare */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.footerChip}>
            <Icon name="calendar-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.date}>{formatDate(trip.departure_time)}</Text>
          </View>
          {trip.available_seats !== undefined && (
            <View style={[styles.footerChip, styles.seatsChip]}>
              <Icon name="seat-outline" size={13} color={Colors.success} />
              <Text style={styles.seatsText}>{trip.available_seats} seats</Text>
            </View>
          )}
        </View>
        <Text style={styles.fare}>{formatCurrency(trip.fare)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radii.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  busIconBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busName: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semiBold,
  },
  typeBadge: {
    backgroundColor: Colors.secondary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  typeText: {
    color: Colors.secondary,
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.medium,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.semiBold,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  routeEndpoint: {
    alignItems: 'flex-start',
  },
  routeEndpointRight: {
    alignItems: 'flex-end',
  },
  timeText: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
  },
  city: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginTop: 2,
  },
  timeline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  footerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seatsChip: {
    backgroundColor: Colors.success + '10',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  date: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
  },
  seatsText: {
    color: Colors.success,
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.medium,
  },
  fare: {
    color: Colors.primary,
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
  },
});

export default TripCard;
