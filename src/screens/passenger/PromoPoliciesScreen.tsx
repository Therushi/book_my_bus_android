import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Fonts, Spacing, Shadows, Radii } from '@/theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PromoPoliciesScreen'>;

const getDummyPolicies = (type: string) => {
  switch (type) {
    case 'Free Cancellation':
      return [
        {
          id: 1,
          title: 'Cancel upto 2 hrs before departure',
          desc: 'Get 100% refund to your original payment method.',
        },
        {
          id: 2,
          title: 'No hidden charges',
          desc: 'The base fare is fully refundable.',
        },
        {
          id: 3,
          title: 'Instant Processing',
          desc: 'Refunds are initiated instantly upon cancellation.',
        },
      ];
    case 'Bus Timetable':
      return [
        {
          id: 1,
          title: 'Live Updates',
          desc: 'Timetables are updated in real-time based on traffic.',
        },
        {
          id: 2,
          title: 'Coverage',
          desc: 'Applies to all major routes between metro cities.',
        },
      ];
    case 'FlexiTicket':
      return [
        {
          id: 1,
          title: 'Date Change',
          desc: 'Change your travel date up to 6 hours before departure without extra fees.',
        },
        {
          id: 2,
          title: 'Fare Difference',
          desc: 'Only pay the fare difference if the new ticket is more expensive.',
        },
      ];
    case 'Travel Insurance':
      return [
        {
          id: 1,
          title: 'Medical Emergencies',
          desc: 'Coverage up to ₹1,00,000 for unexpected medical situations.',
        },
        {
          id: 2,
          title: 'Baggage Loss',
          desc: 'Compensation for lost or damaged luggage during transit.',
        },
        {
          id: 3,
          title: 'Trip Delay',
          desc: 'Reimbursement for expenses incurred due to delays exceeding 6 hours.',
        },
      ];
    default:
      return [
        {
          id: 1,
          title: 'General Info',
          desc: 'This is a standard dummy policy for this feature.',
        },
        {
          id: 2,
          title: 'Terms and Conditions',
          desc: 'Usage is subject to general terms and conditions.',
        },
      ];
  }
};

const PromoPoliciesScreen: React.FC<Props> = ({ route }) => {
  const { title, type } = route.params;
  const policies = getDummyPolicies(type);

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title} Policies</Text>
          <Text style={styles.headerSubtitle}>
            Please review the following details and policies related to {title}.
          </Text>
        </View>
        <View style={styles.policiesContainer}>
          {policies.map((policy, index) => (
            <View key={policy.id} style={styles.policyCard}>
              <View style={styles.policyHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{index + 1}</Text>
                </View>
                <Text style={styles.policyTitle}>{policy.title}</Text>
              </View>
              <Text style={styles.policyDesc}>{policy.desc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: {
    padding: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Fonts.sizes.md,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  policiesContainer: {
    gap: Spacing.md,
  },
  policyCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    ...Shadows.small,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.primary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.bold,
  },
  policyTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.textPrimary,
    flex: 1,
  },
  policyDesc: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    paddingLeft: 32,
  },
});

export default PromoPoliciesScreen;
