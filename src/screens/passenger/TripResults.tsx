import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Colors, Fonts, Spacing, Radii, Shadows } from '@/theme/theme';
import TripCard from '@/components/TripCard';
import { TripRepository } from '@/database/repositories/TripRepository';
import { Trip } from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/models/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TripResults'>;

const FILTER_OPTIONS = ['All', 'Cheapest', 'Fastest', 'Morning', 'Night'];

const TripResults: React.FC<Props> = ({ route, navigation }) => {
  const { source, destination } = route.params;
  const [trips, setTrips] = useState<Trip[]>([]);
  const [_loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        const results = await TripRepository.searchTrips(source, destination);
        setTrips(results);
        setLoading(false);
      })();
    }, [source, destination]),
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.primaryDark}
        barStyle="light-content"
      />

      {/* Red Banner Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.route} numberOfLines={1}>
            {source} → {destination}
          </Text>
          <View style={styles.countBadge}>
            <Text style={styles.count}>
              {trips.length} bus{trips.length !== 1 ? 'es' : ''} found
            </Text>
          </View>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FlatList
          data={FILTER_OPTIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          keyExtractor={item => item}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === index && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(index)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === index && styles.filterChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Trip List */}
      <FlatList
        data={trips}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            onPress={() =>
              navigation.navigate('SeatSelection', { tripId: item.id })
            }
            showStatus={false}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Icon name="bus-alert" size={42} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No buses found</Text>
            <Text style={styles.emptyDesc}>
              Try a different route or check back later
            </Text>
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
    paddingBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  route: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
  },
  countBadge: {
    marginTop: 4,
  },
  count: {
    color: Colors.white,
    opacity: 0.85,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.regular,
  },
  filterContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    ...Shadows.small,
  },
  filterScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary + '12',
    borderColor: Colors.primary,
  },
  filterChipText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: Fonts.weights.semiBold,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
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
});

export default TripResults;
