import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Colors, Fonts, Spacing} from '@/theme/theme';
import TripCard from '@/components/TripCard';
import {TripRepository} from '@/database/repositories/TripRepository';
import {Trip} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/models/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TripResults'>;

const TripResults: React.FC<Props> = ({route, navigation}) => {
  const {source, destination} = route.params;
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

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
      <View style={styles.header}>
        <Text style={styles.route}>{source} → {destination}</Text>
        <Text style={styles.count}>{trips.length} bus{trips.length !== 1 ? 'es' : ''} found</Text>
      </View>
      <FlatList
        data={trips}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <TripCard trip={item} onPress={() => navigation.navigate('SeatSelection', {tripId: item.id})} showStatus={false} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="bus-alert" size={56} color={Colors.surfaceLight} />
            <Text style={styles.emptyTitle}>No buses found</Text>
            <Text style={styles.emptyDesc}>Try a different route or check back later</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {padding: Spacing.xl, paddingBottom: Spacing.md},
  route: {color: Colors.textPrimary, fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold},
  count: {color: Colors.textSecondary, fontSize: Fonts.sizes.sm, marginTop: Spacing.xs},
  list: {paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl},
  emptyState: {alignItems: 'center', marginTop: Spacing.huge},
  emptyTitle: {color: Colors.textSecondary, fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.semiBold, marginTop: Spacing.base},
  emptyDesc: {color: Colors.textMuted, fontSize: Fonts.sizes.md, marginTop: Spacing.xs},
});

export default TripResults;
