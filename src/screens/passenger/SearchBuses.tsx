import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Fonts, Spacing, Radii } from '@/theme/theme';
import FormInput from '@/components/FormInput';
import AppButton from '@/components/AppButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const SearchBuses: React.FC = () => {
  const navigation = useNavigation<any>();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const handleSearch = () => {
    if (!source.trim() || !destination.trim()) return;
    navigation.navigate('TripResults', {
      source: source.trim(),
      destination: destination.trim(),
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Icon name="bus-marker" size={48} color={Colors.primary} />
        <Text style={styles.title}>Search Buses</Text>
        <Text style={styles.subtitle}>Find the best bus for your journey</Text>
      </View>

      <View style={styles.card}>
        <FormInput
          label="From"
          placeholder="Enter source city"
          value={source}
          onChangeText={setSource}
          icon={<Icon name="map-marker" size={20} color={Colors.accent} />}
        />
        <View style={styles.swapRow}>
          <View style={styles.divider} />
          <View style={styles.swapIcon}>
            <Icon name="swap-vertical" size={20} color={Colors.primary} />
          </View>
          <View style={styles.divider} />
        </View>
        <FormInput
          label="To"
          placeholder="Enter destination city"
          value={destination}
          onChangeText={setDestination}
          icon={
            <Icon name="map-marker-check" size={20} color={Colors.secondary} />
          }
        />
        <AppButton
          title="Search Buses"
          onPress={handleSearch}
          disabled={!source.trim() || !destination.trim()}
          style={styles.searchBtn}
          icon={<Icon name="magnify" size={20} color={Colors.white} />}
        />
      </View>

      <View style={styles.popularRoutes}>
        <Text style={styles.popularTitle}>Popular Routes</Text>
        {[
          ['Mumbai', 'Pune'],
          ['Ahmedabad', 'Surat'],
          ['Delhi', 'Jaipur'],
        ].map(([s, d]) => (
          <AppButton
            key={`${s}-${d}`}
            title={`${s} → ${d}`}
            variant="secondary"
            onPress={() => {
              setSource(s);
              setDestination(d);
            }}
            style={styles.routeChip}
            textStyle={styles.routeChipText}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingTop: Spacing.xxl },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.bold,
    marginTop: Spacing.md,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  divider: { flex: 1, height: 1, backgroundColor: Colors.border },
  swapIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.md,
  },
  searchBtn: { marginTop: Spacing.md },
  popularRoutes: { marginTop: Spacing.xxl },
  popularTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.md,
  },
  routeChip: { marginBottom: Spacing.sm, height: 44 },
  routeChipText: { fontSize: Fonts.sizes.md },
});

export default SearchBuses;
