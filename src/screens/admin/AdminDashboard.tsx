import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {Colors, Fonts, Spacing, Radii} from '@/theme/theme';
import DashboardCard from '@/components/DashboardCard';
import {useAuth} from '@/context/AuthContext';
import {BookingRepository} from '@/database/repositories/BookingRepository';
import {BusRepository} from '@/database/repositories/BusRepository';
import {UserRepository} from '@/database/repositories/UserRepository';
import {TripRepository} from '@/database/repositories/TripRepository';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {formatCurrency} from '@/utils/helpers';

const AdminDashboard: React.FC = () => {
  const {user} = useAuth();
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
    const [totalBookings, revenue, activeBuses, operators, passengers, activeTrips] =
      await Promise.all([
        BookingRepository.totalCount(),
        BookingRepository.totalRevenue(),
        BusRepository.countActive(),
        UserRepository.countByRole('operator'),
        UserRepository.countByRole('passenger'),
        TripRepository.countByStatus('scheduled'),
      ]);
    setStats({totalBookings, revenue, activeBuses, operators, passengers, activeTrips});
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
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <Text style={styles.greeting}>Hello, {user?.name}</Text>
        <Text style={styles.subtitle}>Admin Dashboard</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}>
        
        {/* Primary Featured Metric */}
        <View style={styles.featuredGrid}>
          <DashboardCard
            title="Total Revenue"
            value={formatCurrency(stats.revenue)}
            icon={<Icon name="chart-line-variant" size={28} color={Colors.accent} />}
            color={Colors.accent}
            style={{marginBottom: Spacing.lg}}
            layout="horizontal"
          />
        </View>

        <Text style={styles.sectionTitle}>Operations Overview</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <DashboardCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={<Icon name="ticket-confirmation" size={24} color={Colors.primary} />}
              color={Colors.primary}
              layout="vertical"
            />
          </View>
          <View style={styles.gridItem}>
            <DashboardCard
              title="Active Trips"
              value={stats.activeTrips}
              icon={<Icon name="road-variant" size={24} color={Colors.success} />}
              color={Colors.success}
              layout="vertical"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Network & Users</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <DashboardCard
              title="Active Buses"
              value={stats.activeBuses}
              icon={<Icon name="bus" size={24} color={Colors.info} />}
              color={Colors.info}
              layout="horizontal"
            />
          </View>
          <View style={styles.gridItem}>
            <DashboardCard
              title="Operators"
              value={stats.operators}
              icon={<Icon name="account-tie" size={24} color={Colors.warning} />}
              color={Colors.warning}
              layout="horizontal"
            />
          </View>
        </View>

        <View style={styles.featuredGrid}>
           <DashboardCard
              title="Total Passengers"
              value={stats.passengers}
              icon={<Icon name="account-group" size={24} color={Colors.secondary} />}
              color={Colors.secondary}
              layout="horizontal"
            />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  headerBackground: {
    backgroundColor: Colors.surface,
    paddingTop: 60,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    borderBottomLeftRadius: Radii.xxl,
    borderBottomRightRadius: Radii.xxl,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 10,
  },
  content: {
    padding: Spacing.xl, 
    paddingTop: Spacing.xl, 
    paddingBottom: Spacing.huge
  },
  greeting: {
    color: Colors.primaryDark,
    fontSize: Fonts.sizes.xxxl,
    fontWeight: Fonts.weights.extraBold,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
    marginTop: 4,
    fontWeight: Fonts.weights.medium,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
    letterSpacing: -0.5,
  },
  featuredGrid: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  gridItem: {
    width: '48%',
    marginBottom: Spacing.md,
  },
});

export default AdminDashboard;
