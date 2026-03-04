import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';

interface Props {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  style?: ViewStyle;
  layout?: 'horizontal' | 'vertical';
}

const DashboardCard: React.FC<Props> = ({
  title,
  value,
  icon,
  color = Colors.primary,
  style,
  layout = 'horizontal',
}) => {
  const isVertical = layout === 'vertical';

  return (
    <View style={[styles.card, isVertical && styles.cardVertical, style]}>
      <View style={[styles.inner, isVertical ? styles.innerVertical : styles.innerHorizontal]}>
        {icon && (
          <View
            style={[
              styles.iconBg,
              isVertical && styles.iconBgVertical,
              {backgroundColor: color + '15'},
            ]}>
            {icon}
          </View>
        )}
        <View style={[styles.content, isVertical && styles.contentVertical]}>
          <Text style={[styles.value, isVertical && styles.valueVertical, {color}]}>{value}</Text>
          <Text style={[styles.title, isVertical && styles.titleVertical]}>{title}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 110,
    justifyContent: 'center',
  },
  cardVertical: {
    padding: Spacing.xl,
    minHeight: 140,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  inner: {
    flex: 1,
    width: '100%',
  },
  innerHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerVertical: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconBg: {
    width: 52,
    height: 52,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconBgVertical: {
    marginRight: 0,
    marginBottom: Spacing.md,
    width: 44,
    height: 44,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  contentVertical: {
    flex: 0,
    width: '100%',
    alignItems: 'flex-start',
  },
  value: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.extraBold,
  },
  valueVertical: {
    fontSize: Fonts.sizes.xl,
  },
  title: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  titleVertical: {
    marginTop: 2,
    fontSize: Fonts.sizes.xs,
  },
});

export default DashboardCard;
