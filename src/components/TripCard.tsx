import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
import {Trip} from '@/models/types';
import {formatTime, formatDate, formatCurrency, tripStatusLabel, tripStatusColor} from '@/utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  trip: Trip;
  onPress?: () => void;
  showStatus?: boolean;
}

const TripCard: React.FC<Props> = ({trip, onPress, showStatus = true}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}>
      <View style={styles.header}>
        <View style={styles.busInfo}>
          <Icon name="bus" size={18} color={Colors.primary} />
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
              {backgroundColor: (tripStatusColor[trip.status] || Colors.info) + '20'},
            ]}>
            <Text
              style={[
                styles.statusText,
                {color: tripStatusColor[trip.status] || Colors.info},
              ]}>
              {tripStatusLabel[trip.status] || trip.status}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.route}>
        <View style={styles.routePoint}>
          <View style={[styles.dot, {backgroundColor: Colors.accent}]} />
          <View>
            <Text style={styles.city}>{trip.source || '—'}</Text>
            <Text style={styles.time}>{formatTime(trip.departure_time)}</Text>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.routePoint}>
          <View style={[styles.dot, {backgroundColor: Colors.secondary}]} />
          <View>
            <Text style={styles.city}>{trip.destination || '—'}</Text>
            <Text style={styles.time}>{formatTime(trip.arrival_time)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>
          <Icon name="calendar" size={13} color={Colors.textMuted} />{' '}
          {formatDate(trip.departure_time)}
        </Text>
        <Text style={styles.fare}>{formatCurrency(trip.fare)}</Text>
      </View>
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
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  busName: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semiBold,
  },
  typeBadge: {
    backgroundColor: Colors.primaryDark + '30',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  typeText: {
    color: Colors.primaryLight,
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.medium,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.semiBold,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  city: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.medium,
  },
  time: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  date: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
  },
  fare: {
    color: Colors.accent,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
  },
});

export default TripCard;
