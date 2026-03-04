import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors, Fonts, Spacing, Radii, Shadows } from '@/theme/theme';
import { UserRepository } from '@/database/repositories/UserRepository';
import { User } from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const ManageOperators: React.FC = () => {
  const [operators, setOperators] = useState<User[]>([]);

  const load = useCallback(async () => {
    setOperators(await UserRepository.findByRole('operator'));
  }, []);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleDelete = (op: User) => {
    Alert.alert('Remove Operator', `Remove "${op.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await UserRepository.delete(op.id);
          load();
        },
      },
    ]);
  };

  return (
    <View style={styles.flex}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.headerBackground}>
        <Text style={styles.title}>Bus Operators</Text>
      </View>
      <FlatList
        data={operators}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        style={styles.overlapContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Icon name="account-tie" size={24} color={Colors.primary} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              {item.phone && <Text style={styles.phone}>{item.phone}</Text>}
            </View>
            <TouchableOpacity onPress={() => handleDelete(item)}>
              <Icon name="delete-outline" size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Icon name="account-tie" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No operators yet</Text>
            <Text style={styles.emptyDesc}>
              Operators can register from the app.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  headerBackground: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 56 : Spacing.xxl + 16,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 80,
    borderBottomLeftRadius: Radii.xxl,
    borderBottomRightRadius: Radii.xxl,
  },
  title: {
    color: Colors.white,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.bold,
    letterSpacing: -0.3,
  },
  overlapContent: { marginTop: -44 },
  list: { padding: Spacing.xl, paddingBottom: Spacing.huge },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  info: { flex: 1 },
  name: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
  },
  email: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
    marginTop: 2,
    fontWeight: Fonts.weights.medium,
  },
  phone: { color: Colors.textMuted, fontSize: Fonts.sizes.sm, marginTop: 4 },
  emptyState: { alignItems: 'center', marginTop: Spacing.xxl },
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

export default ManageOperators;
