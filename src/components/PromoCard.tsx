import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Fonts, Spacing, Radii, Shadows } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  title: string;
  description: string;
  iconName: string;
  backgroundColor: string;
  textColor?: string;
  iconColor?: string;
  iconBgColor?: string;
  onPress?: () => void;
}

const PromoCard: React.FC<Props> = ({
  title,
  description,
  iconName,
  backgroundColor,
  textColor = Colors.textPrimary,
  iconColor,
  iconBgColor,
  onPress,
}) => {
  const isDark = backgroundColor === Colors.promoDarkRed;
  const resolvedTextColor = isDark ? Colors.white : textColor;
  const resolvedSubTextColor = isDark
    ? 'rgba(255,255,255,0.8)'
    : Colors.textSecondary;
  const resolvedIconColor =
    iconColor || (isDark ? Colors.white : Colors.primary);
  const resolvedIconBg =
    iconBgColor || (isDark ? 'rgba(255,255,255,0.15)' : Colors.primarySurface);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.textSection}>
          <Text
            style={[styles.title, { color: resolvedTextColor }]}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text
            style={[styles.description, { color: resolvedSubTextColor }]}
            numberOfLines={2}
          >
            {description}
          </Text>
          <View style={styles.ctaRow}>
            <Text style={[styles.cta, { color: resolvedTextColor }]}>
              Know more
            </Text>
            <Icon name="arrow-right" size={14} color={resolvedTextColor} />
          </View>
        </View>
        <View style={[styles.iconCircle, { backgroundColor: resolvedIconBg }]}>
          <Icon name={iconName} size={28} color={resolvedIconColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    minHeight: 150,
    borderRadius: Radii.xl,
    padding: Spacing.base,
    marginRight: Spacing.md,
    ...Shadows.medium,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textSection: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: Spacing.sm,
  },
  title: {
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.bold,
    lineHeight: 20,
  },
  description: {
    fontSize: Fonts.sizes.xs,
    lineHeight: 16,
    marginTop: Spacing.xs,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  cta: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semiBold,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});

export default PromoCard;
