import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Colors, Fonts, Spacing, Radii, Shadows } from '@/theme/theme';
import FormInput from '@/components/FormInput';
import AppButton from '@/components/AppButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const DATE_OPTIONS = ['Today', 'Tomorrow'];

const SearchBuses: React.FC = () => {
  const navigation = useNavigation<any>();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedDate, setSelectedDate] = useState(0);

  const handleSearch = () => {
    if (!source.trim() || !destination.trim()) return;
    navigation.navigate('TripResults', {
      source: source.trim(),
      destination: destination.trim(),
    });
  };

  return (
    <View style={styles.flex}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Red Banner Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Where to?</Text>
          <Text style={styles.headerSubtitle}>Book your bus tickets</Text>
        </View>

        {/* Elevated Search Card (overlapping header) */}
        <View style={styles.content}>
          <View style={styles.card}>
            {/* Stacked Search Fields */}
            <View style={styles.searchFieldsContainer}>
              <View style={styles.inputWrapper}>
                <FormInput
                  label=""
                  placeholder="Leaving from"
                  value={source}
                  onChangeText={setSource}
                  icon={
                    <View style={styles.fromDot}>
                      <View style={styles.fromDotInner} />
                    </View>
                  }
                  style={styles.flightInput}
                />
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <TouchableOpacity
                  style={styles.swapBtn}
                  onPress={() => {
                    const temp = source;
                    setSource(destination);
                    setDestination(temp);
                  }}
                >
                  <Icon name="swap-vertical" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <FormInput
                  label=""
                  placeholder="Going to"
                  value={destination}
                  onChangeText={setDestination}
                  icon={
                    <Icon name="map-marker" size={20} color={Colors.primary} />
                  }
                  style={styles.flightInput}
                />
              </View>
            </View>

            {/* Date Chips */}
            <View style={styles.dateRow}>
              <Icon
                name="calendar-outline"
                size={18}
                color={Colors.textSecondary}
              />
              {DATE_OPTIONS.map((label, index) => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.dateChip,
                    selectedDate === index && styles.dateChipActive,
                  ]}
                  onPress={() => setSelectedDate(index)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      selectedDate === index && styles.dateChipTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Search Button */}
            <AppButton
              title="Search Buses"
              onPress={handleSearch}
              disabled={!source.trim() || !destination.trim()}
              style={styles.searchBtn}
              icon={<Icon name="magnify" size={20} color={Colors.white} />}
            />
          </View>

          {/* Suggested Routes */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsTitle}>Suggested routes</Text>

            {[
              { s: 'Mumbai', d: 'Pune', type: 'popular' },
              { s: 'Ahmedabad', d: 'Surat', type: 'recent' },
              { s: 'Delhi', d: 'Jaipur', type: 'popular' },
            ].map(({ s, d, type }, index) => (
              <TouchableOpacity
                key={`${s}-${d}`}
                style={[
                  styles.suggestionRow,
                  index !== 2 && styles.suggestionBorder,
                ]}
                onPress={() => {
                  setSource(s);
                  setDestination(d);
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.suggestionIconBg,
                    {
                      backgroundColor:
                        type === 'popular'
                          ? Colors.success + '12'
                          : Colors.secondary + '12',
                    },
                  ]}
                >
                  <Icon
                    name={type === 'popular' ? 'fire' : 'history'}
                    size={18}
                    color={
                      type === 'popular' ? Colors.success : Colors.secondary
                    }
                  />
                </View>
                <View style={styles.suggestionTextContainer}>
                  <Text style={styles.suggestionMainText}>
                    {s} → {d}
                  </Text>
                  <Text style={styles.suggestionSubText}>
                    {type === 'popular' ? 'Popular route' : 'Recently searched'}
                  </Text>
                </View>
                <Icon name="chevron-right" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : Spacing.xxl + 16,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 80,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: Radii.xxl,
    borderBottomRightRadius: Radii.xxl,
  },
  title: {
    color: Colors.white,
    fontSize: Fonts.sizes.xxxl,
    fontWeight: Fonts.weights.bold,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: Colors.white,
    opacity: 0.8,
    fontSize: Fonts.sizes.md,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
    marginTop: -48,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xxl,
    padding: Spacing.lg,
    ...Shadows.large,
  },
  searchFieldsContainer: {
    position: 'relative',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radii.xl,
    padding: Spacing.xs,
  },
  inputWrapper: {},
  flightInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginBottom: 0,
    height: 50,
  },
  fromDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fromDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  dividerContainer: {
    position: 'relative',
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: 10,
    overflow: 'visible',
  },
  dividerLine: {},
  swapBtn: {
    backgroundColor: Colors.surface,
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
    right: Spacing.sm,
    top: -18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    zIndex: 11,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.base,
    paddingHorizontal: Spacing.xs,
  },
  dateChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateChipActive: {
    backgroundColor: Colors.primary + '12',
    borderColor: Colors.primary,
  },
  dateChipText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
  },
  dateChipTextActive: {
    color: Colors.primary,
    fontWeight: Fonts.weights.semiBold,
  },
  searchBtn: {
    marginTop: Spacing.lg,
    height: 52,
    backgroundColor: Colors.primary,
  },
  suggestionsSection: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xs,
  },
  suggestionsTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.md,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  suggestionBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  suggestionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMainText: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.medium,
  },
  suggestionSubText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
    marginTop: 2,
  },
});

export default SearchBuses;
