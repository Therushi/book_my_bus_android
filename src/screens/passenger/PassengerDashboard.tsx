import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity} from 'react-native';
import {Colors, Fonts, Spacing, Radii} from '@/theme/theme';
import DashboardCard from '@/components/DashboardCard';
import BookingCard from '@/components/BookingCard';
import {useAuth} from '@/context/AuthContext';
import {BookingRepository} from '@/database/repositories/BookingRepository';
import {Booking} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {formatCurrency} from '@/utils/helpers';

const PassengerDashboard: React.FC<{navigation: any}> = ({navigation}) => {
  const {user} = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const bks = await BookingRepository.findByPassenger(user.id);
    setBookings(bks);
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const upcoming = bookings.filter(b => b.status === 'confirmed');
  const totalSpent = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.total_fare, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}>
      <Text style={styles.greeting}>Hello, {user?.name}</Text>
      <Text style={styles.subtitle}>Where would you like to go?</Text>

      {/* Quick Search */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('SearchBuses')}
        activeOpacity={0.8}>
        <Icon name="magnify" size={22} color={Colors.textMuted} />
        <Text style={styles.searchText}>Search buses...</Text>
      </TouchableOpacity>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <DashboardCard
            title="Upcoming"
            value={upcoming.length}
            icon={<Icon name="calendar-check" size={24} color={Colors.primary} />}
            color={Colors.primary}
            layout="vertical"
          />
        </View>
        <View style={styles.statItem}>
          <DashboardCard
            title="Total Spent"
            value={formatCurrency(totalSpent)}
            icon={<Icon name="wallet" size={24} color={Colors.accent} />}
            color={Colors.accent}
            layout="vertical"
          />
        </View>
      </View>

      {/* Upcoming Trips */}
      {upcoming.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Upcoming Trips</Text>
          {upcoming.slice(0, 3).map(bk => (
            <BookingCard
              key={bk.id}
              booking={bk}
              onPress={() => navigation.navigate('TicketScreen', {bookingId: bk.id})}
            />
          ))}
        </>
      )}

      {bookings.length === 0 && (
        <View style={styles.emptyState}>
          <Icon name="bus-marker" size={64} color={Colors.surfaceLight} />
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyDesc}>
            Search for buses and book your first trip!
          </Text>
        </View>
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
    marginBottom: Spacing.lg,
    fontWeight: Fonts.weights.medium,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.base,
    flex: 1,
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
  emptyState: {
    alignItems: 'center',
    marginTop: Spacing.huge,
  },
  emptyTitle: {
    color: Colors.textSecondary,
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

export default PassengerDashboard;
