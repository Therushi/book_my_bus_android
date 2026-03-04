import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Fonts, Spacing, Radii} from '@/theme/theme';
import {Seat} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  seats: Seat[];
  selectedIds: string[];
  onToggle: (seat: Seat) => void;
}

const SeatLayout: React.FC<Props> = ({seats, selectedIds, onToggle}) => {
  const rows: Seat[][] = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  const getSeatStyle = (seat: Seat) => {
    if (seat.is_booked) return styles.seatBooked;
    if (selectedIds.includes(seat.id)) return styles.seatSelected;
    return styles.seatAvailable;
  };

  const getIconColor = (seat: Seat) => {
    if (seat.is_booked) return Colors.textMuted;
    if (selectedIds.includes(seat.id)) return Colors.white;
    return Colors.primary;
  };

  const getTextColor = (seat: Seat) => {
    if (seat.is_booked) return Colors.textMuted;
    if (selectedIds.includes(seat.id)) return Colors.white;
    return Colors.textSecondary;
  };

  return (
    <View style={styles.container}>
      {/* Driver section */}
      <View style={styles.frontBlock}>
        <View style={styles.driverArea}>
          <View style={styles.driverSeat}>
            <Icon name="steering" size={22} color={Colors.primary} />
          </View>
          <Text style={styles.driverLabel}>Driver</Text>
        </View>
        <View style={styles.frontDivider} />
      </View>

      {/* Aisle label */}
      <View style={styles.aisleHeader}>
        <View style={styles.aisleHeaderSpacer} />
        <View style={styles.aisleHeaderLabel}>
          <Text style={styles.aisleHeaderText}>AISLE</Text>
        </View>
        <View style={styles.aisleHeaderSpacer} />
      </View>

      {/* Seat grid */}
      <View style={styles.seatsContainer}>
        {rows.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {/* Left pair */}
            <View style={styles.seatPair}>
              {row.slice(0, 2).map(seat => (
                <TouchableOpacity
                  key={seat.id}
                  style={[styles.seat, getSeatStyle(seat)]}
                  onPress={() => onToggle(seat)}
                  disabled={seat.is_booked === 1}
                  activeOpacity={0.7}>
                  <Icon name="seat-passenger" size={22} color={getIconColor(seat)} />
                  <Text style={[styles.seatLabel, {color: getTextColor(seat)}]}>{seat.seat_number}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Aisle */}
            <View style={styles.aisle}>
              <Text style={styles.rowNum}>{ri + 1}</Text>
            </View>

            {/* Right pair */}
            <View style={styles.seatPair}>
              {row.slice(2, 4).map(seat => (
                <TouchableOpacity
                  key={seat.id}
                  style={[styles.seat, getSeatStyle(seat)]}
                  onPress={() => onToggle(seat)}
                  disabled={seat.is_booked === 1}
                  activeOpacity={0.7}>
                  <Icon name="seat-passenger" size={22} color={getIconColor(seat)} />
                  <Text style={[styles.seatLabel, {color: getTextColor(seat)}]}>{seat.seat_number}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: Colors.surface, borderColor: Colors.primary, borderWidth: 2}]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: Colors.primary}]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: Colors.surfaceLight}]} />
          <Text style={styles.legendText}>Booked</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  frontBlock: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: Spacing.xl,
    marginBottom: Spacing.md,
  },
  driverArea: {
    alignItems: 'center',
    gap: 2,
  },
  driverSeat: {
    width: 42,
    height: 42,
    borderRadius: Radii.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '10',
  },
  driverLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.primary,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 0.5,
  },
  frontDivider: {
    height: 3,
    backgroundColor: Colors.primary,
    width: '100%',
    marginTop: Spacing.md,
    borderRadius: 2,
    opacity: 0.3,
  },
  aisleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  aisleHeaderSpacer: {flex: 1},
  aisleHeaderLabel: {
    width: 48,
    alignItems: 'center',
  },
  aisleHeaderText: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 1,
  },
  seatsContainer: {
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  seatPair: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  aisle: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowNum: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Fonts.weights.medium,
  },
  seat: {
    width: 52,
    height: 58,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    gap: 2,
  },
  seatAvailable: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
  },
  seatSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  seatBooked: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
  },
  seatLabel: {
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.bold,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 18,
    height: 18,
    borderRadius: 5,
  },
  legendText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
  },
});


export default SeatLayout;

