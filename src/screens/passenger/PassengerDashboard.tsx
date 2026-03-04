import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors, Fonts, Spacing, Radii, Shadows } from '@/theme/theme';
import DashboardCard from '@/components/DashboardCard';
import BookingCard from '@/components/BookingCard';
import PromoCard from '@/components/PromoCard';
import { useAuth } from '@/context/AuthContext';
import { BookingRepository } from '@/database/repositories/BookingRepository';
import { Booking } from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { formatCurrency } from '@/utils/helpers';

const PROMO_CARDS = [
  {
    title: 'Free Cancellation',
    description: 'Get 100% refund on cancellation',
    iconName: 'shield-check',
    backgroundColor: Colors.promoDarkRed,
  },
  {
    title: 'Bus Timetable',
    description: 'Get local bus timings between cities',
    iconName: 'timetable',
    backgroundColor: Colors.surface,
  },
  {
    title: 'FlexiTicket',
    description: 'Benefits on date change & cancellation',
    iconName: 'ticket-percent',
    backgroundColor: Colors.promoLightPink,
  },
  {
    title: 'Travel Insurance',
    description: 'Insure your trip against cancellations!',
    iconName: 'bag-suitcase',
    backgroundColor: Colors.promoLightBlue,
    iconColor: Colors.secondary,
    iconBgColor: Colors.secondary + '15',
  },
];

const POPULAR_ROUTES = [
  { from: 'Mumbai', to: 'Pune' },
  { from: 'Delhi', to: 'Jaipur' },
  { from: 'Bangalore', to: 'Chennai' },
  { from: 'Ahmedabad', to: 'Surat' },
];

const PassengerDashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const bks = await BookingRepository.findByPassenger(user.id);
    setBookings(bks);
  }, [user]);

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

  const upcoming = bookings.filter(b => b.status === 'confirmed');
  const totalSpent = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.total_fare, 0);

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
              <Text style={styles.subtitle}>Where would you like to go?</Text>
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
          {/* Quick Search */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('SearchBuses')}
            activeOpacity={0.8}
          >
            <Icon name="magnify" size={22} color={Colors.primary} />
            <Text style={styles.searchText}>Search for buses, routes...</Text>
            <View style={styles.searchMic}>
              <Icon
                name="microphone-outline"
                size={18}
                color={Colors.textMuted}
              />
            </View>
          </TouchableOpacity>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <DashboardCard
                title="Upcoming"
                value={upcoming.length}
                icon={
                  <Icon
                    name="calendar-check"
                    size={22}
                    color={Colors.primary}
                  />
                }
                color={Colors.primary}
                layout="vertical"
              />
            </View>
            <View style={styles.statItem}>
              <DashboardCard
                title="Total Spent"
                value={formatCurrency(totalSpent)}
                icon={<Icon name="wallet" size={22} color={Colors.accent} />}
                color={Colors.accent}
                layout="vertical"
              />
            </View>
          </View>

          {/* What's New — Promo Cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's new</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.promoScroll}
            >
              {PROMO_CARDS.map(promo => (
                <PromoCard
                  key={promo.title}
                  {...promo}
                  onPress={() =>
                    navigation.navigate('PromoPoliciesScreen', {
                      title: promo.title,
                      type: promo.title,
                    })
                  }
                />
              ))}
            </ScrollView>
          </View>

          {/* Popular Routes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Routes</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.routeScroll}
            >
              {POPULAR_ROUTES.map(route => (
                <TouchableOpacity
                  key={`${route.from}-${route.to}`}
                  style={styles.routeChip}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('TripResults', {
                      source: route.from,
                      destination: route.to,
                    })
                  }
                >
                  <Icon name="bus" size={16} color={Colors.primary} />
                  <Text style={styles.routeChipText}>
                    {route.from} → {route.to}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Upcoming Trips */}
          {upcoming.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming Trips</Text>
              {upcoming.slice(0, 3).map(bk => (
                <BookingCard
                  key={bk.id}
                  booking={bk}
                  onPress={() =>
                    navigation.navigate('TicketScreen', { bookingId: bk.id })
                  }
                />
              ))}
            </View>
          )}

          {bookings.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Icon name="bus-marker" size={48} color={Colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.emptyDesc}>
                Search for buses and book your first trip!
              </Text>
            </View>
          )}
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
    fontWeight: Fonts.weights.regular,
  },
  overlapContent: {
    paddingHorizontal: Spacing.xl,
    marginTop: -44,
    paddingBottom: Spacing.huge + Spacing.xxl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    ...Shadows.large,
  },
  searchText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.base,
    flex: 1,
  },
  searchMic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statItem: { flex: 1 },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.md,
    letterSpacing: -0.3,
  },
  promoScroll: {
    paddingRight: Spacing.xl,
  },
  routeScroll: {
    gap: Spacing.sm,
  },
  routeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    ...Shadows.small,
  },
  routeChipText: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  emptyIconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
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

export default PassengerDashboard;
