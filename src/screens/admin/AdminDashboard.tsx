import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Colors, Fonts, Spacing, Radii } from '@/theme/theme';
import DashboardCard from '@/components/DashboardCard';
import { useAuth } from '@/context/AuthContext';
import { BookingRepository } from '@/database/repositories/BookingRepository';
import { BusRepository } from '@/database/repositories/BusRepository';
import { UserRepository } from '@/database/repositories/UserRepository';
import { TripRepository } from '@/database/repositories/TripRepository';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { formatCurrency } from '@/utils/helpers';

const AdminDashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    revenue: 0,
    activeBuses: 0,
    operators: 0,
    passengers: 0,
    activeTrips: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    const [
      totalBookings,
      revenue,
      activeBuses,
      operators,
      passengers,
      activeTrips,
    ] = await Promise.all([
      BookingRepository.totalCount(),
      BookingRepository.totalRevenue(),
      BusRepository.countActive(),
      UserRepository.countByRole('operator'),
      UserRepository.countByRole('passenger'),
      TripRepository.countByStatus('scheduled'),
    ]);
    setStats({
      totalBookings,
      revenue,
      activeBuses,
      operators,
      passengers,
      activeTrips,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  return (
    <View style={styles.flex}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.white}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Red Banner Header */}
        <View style={styles.headerBackground}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello, {user?.name} 👋</Text>
              <Text style={styles.subtitle}>Admin Panel</Text>
            </View>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <Icon name="account-circle" size={36} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Overlapping Content Container */}
        <View style={styles.overlapContent}>
          {/* Primary Featured Metric */}
          <View style={styles.featuredGrid}>
            <DashboardCard
              title="Total Revenue"
              value={formatCurrency(stats.revenue)}
              icon={
                <Icon name="currency-inr" size={28} color={Colors.accent} />
              }
              color={Colors.accent}
              layout="horizontal"
            />
          </View>

          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <DashboardCard
                title="Bookings"
                value={stats.totalBookings}
                icon={
                  <Icon
                    name="ticket-confirmation"
                    size={24}
                    color={Colors.primary}
                  />
                }
                color={Colors.primary}
                layout="vertical"
              />
            </View>
            <View style={styles.statItem}>
              <DashboardCard
                title="Active Trips"
                value={stats.activeTrips}
                icon={
                  <Icon name="road-variant" size={24} color={Colors.success} />
                }
                color={Colors.success}
                layout="vertical"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Network</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <DashboardCard
                title="Active Buses"
                value={stats.activeBuses}
                icon={<Icon name="bus" size={24} color={Colors.info} />}
                color={Colors.info}
                layout="vertical"
              />
            </View>
            <View style={styles.statItem}>
              <DashboardCard
                title="Operators"
                value={stats.operators}
                icon={
                  <Icon name="account-tie" size={24} color={Colors.warning} />
                }
                color={Colors.warning}
                layout="vertical"
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <DashboardCard
                title="Total Passengers"
                value={stats.passengers}
                icon={
                  <Icon
                    name="account-group"
                    size={28}
                    color={Colors.secondary}
                  />
                }
                color={Colors.secondary}
                layout="horizontal"
              />
            </View>
          </View>
        </View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileBtn: {
    marginTop: 4,
  },
  greeting: {
    color: Colors.white,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.bold,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: Colors.white,
    opacity: 0.85,
    fontSize: Fonts.sizes.md,
    marginTop: 4,
    fontWeight: Fonts.weights.medium,
  },
  overlapContent: {
    paddingHorizontal: Spacing.xl,
    marginTop: -44,
    paddingBottom: Spacing.huge + Spacing.xxl,
  },

  featuredGrid: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statItem: { flex: 1 },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.md,
    letterSpacing: -0.3,
  },
});

export default AdminDashboard;
