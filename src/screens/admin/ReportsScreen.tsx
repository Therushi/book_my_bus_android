import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors, Fonts, Spacing, Radii, Shadows } from '@/theme/theme';
import { BookingRepository } from '@/database/repositories/BookingRepository';
import { BusRepository } from '@/database/repositories/BusRepository';
import { TripRepository } from '@/database/repositories/TripRepository';
import DashboardCard from '@/components/DashboardCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { formatCurrency } from '@/utils/helpers';

const ReportsScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    bookings: 0,
    revenue: 0,
    buses: 0,
    trips: 0,
  });
  const [dateStats, setDateStats] = useState<{ date: string; count: number }[]>(
    [],
  );
  const [routeRevenue, setRouteRevenue] = useState<
    { route: string; revenue: number }[]
  >([]);

  const load = useCallback(async () => {
    const [bookings, revenue, buses, trips, dates, routes] = await Promise.all([
      BookingRepository.totalCount(),
      BookingRepository.totalRevenue(),
      BusRepository.countActive(),
      TripRepository.countByStatus('scheduled'),
      BookingRepository.countByDate(),
      BookingRepository.revenueByRoute(),
    ]);
    setStats({ bookings, revenue, buses, trips });
    setDateStats(dates);
    setRouteRevenue(routes);
  }, []);

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

  return (
    <View style={styles.flex}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.headerBackground}>
        <Text style={styles.title}>Reports & Analytics</Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <DashboardCard
              title="Total Bookings"
              value={stats.bookings}
              icon={
                <Icon
                  name="ticket-confirmation"
                  size={24}
                  color={Colors.primary}
                />
              }
              color={Colors.primary}
            />
          </View>
          <View style={styles.gridItem}>
            <DashboardCard
              title="Revenue"
              value={formatCurrency(stats.revenue)}
              icon={
                <Icon name="currency-inr" size={24} color={Colors.accent} />
              }
              color={Colors.accent}
            />
          </View>
          <View style={styles.gridItem}>
            <DashboardCard
              title="Active Buses"
              value={stats.buses}
              icon={<Icon name="bus" size={24} color={Colors.info} />}
              color={Colors.info}
            />
          </View>
          <View style={styles.gridItem}>
            <DashboardCard
              title="Scheduled Trips"
              value={stats.trips}
              icon={
                <Icon name="road-variant" size={24} color={Colors.warning} />
              }
              color={Colors.warning}
            />
          </View>
        </View>

        {/* Date-wise bookings */}
        <Text style={styles.sectionTitle}>Bookings by Date</Text>
        {dateStats.length === 0 ? (
          <Text style={styles.empty}>No data yet</Text>
        ) : (
          <View style={styles.table}>
            {dateStats.map((d, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableLabel}>{d.date}</Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: `${Math.min(
                          (d.count / Math.max(...dateStats.map(x => x.count))) *
                            100,
                          100,
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.tableValue}>{d.count}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Revenue by route */}
        <Text style={styles.sectionTitle}>Revenue by Route</Text>
        {routeRevenue.length === 0 ? (
          <Text style={styles.empty}>No data yet</Text>
        ) : (
          <View style={styles.table}>
            {routeRevenue.map((r, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableLabel, { flex: 2 }]}>{r.route}</Text>
                <Text style={[styles.tableValue, { color: Colors.accent }]}>
                  {formatCurrency(r.revenue)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
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
  content: { padding: Spacing.xl, paddingBottom: Spacing.huge, marginTop: -44 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  gridItem: {
    width: '48%',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.extraBold,
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
    letterSpacing: -0.5,
  },
  table: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  tableLabel: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    flex: 1,
  },
  tableValue: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.extraBold,
    minWidth: 40,
    textAlign: 'right',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
  },
  bar: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  empty: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.md,
    textAlign: 'center',
    marginVertical: Spacing.xl,
    fontStyle: 'italic',
  },
});

export default ReportsScreen;
