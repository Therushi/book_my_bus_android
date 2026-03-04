import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList, RefreshControl} from 'react-native';
import {Colors, Fonts, Spacing} from '@/theme/theme';
import DashboardCard from '@/components/DashboardCard';
import TripCard from '@/components/TripCard';
import {useAuth} from '@/context/AuthContext';
import {TripRepository} from '@/database/repositories/TripRepository';
import {SeatRepository} from '@/database/repositories/SeatRepository';
import {BookingRepository} from '@/database/repositories/BookingRepository';
import {Trip} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';

const OperatorDashboard: React.FC<{navigation: any}> = ({navigation}) => {
  const {user} = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState({activeTrips: 0, totalBookings: 0});
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const allTrips = await TripRepository.findByOperator(user.id);
    setTrips(allTrips);
    const active = allTrips.filter(
      t => t.status === 'scheduled' || t.status === 'on_time' || t.status === 'delayed',
    ).length;
    const bookings = await BookingRepository.getAll();
    const opBookings = bookings.filter(b =>
      allTrips.some(t => t.id === b.trip_id),
    );
    setStats({activeTrips: active, totalBookings: opBookings.length});
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}>
      <Text style={styles.greeting}>Hello, {user?.name}</Text>
      <Text style={styles.subtitle}>Operator Dashboard</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <DashboardCard
            title="Active Trips"
            value={stats.activeTrips}
            icon={<Icon name="bus-clock" size={24} color={Colors.primary} />}
            color={Colors.primary}
            layout="vertical"
          />
        </View>
        <View style={styles.statItem}>
          <DashboardCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<Icon name="ticket-confirmation" size={24} color={Colors.accent} />}
            color={Colors.accent}
            layout="vertical"
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Trips</Text>
      {trips.length === 0 ? (
        <Text style={styles.emptyText}>No trips yet. Create one from the Trips tab.</Text>
      ) : (
        trips.slice(0, 5).map(trip => (
          <TripCard
            key={trip.id}
            trip={trip}
            onPress={() => navigation.navigate('TripDetails', {tripId: trip.id})}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {padding: Spacing.xl, paddingTop: Spacing.xxl, paddingBottom: Spacing.huge},
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
    marginBottom: Spacing.xl,
    fontWeight: Fonts.weights.medium,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statItem: {flex: 1},
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.md,
    letterSpacing: -0.3,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.md,
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontStyle: 'italic',
  },
});

export default OperatorDashboard;
