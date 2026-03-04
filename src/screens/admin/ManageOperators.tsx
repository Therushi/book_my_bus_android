import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
import {UserRepository} from '@/database/repositories/UserRepository';
import {User} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';

const ManageOperators: React.FC = () => {
  const [operators, setOperators] = useState<User[]>([]);

  const load = useCallback(async () => {
    setOperators(await UserRepository.findByRole('operator'));
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleDelete = (op: User) => {
    Alert.alert('Remove Operator', `Remove "${op.name}"?`, [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Remove', style: 'destructive', onPress: async () => { await UserRepository.delete(op.id); load(); }},
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Operators</Text>
      <FlatList
        data={operators}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
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
        ListEmptyComponent={<Text style={styles.empty}>No operators registered yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  title: {
    color: Colors.primaryDark,
    fontSize: Fonts.sizes.xxxl,
    fontWeight: Fonts.weights.extraBold,
    letterSpacing: -0.5,
    padding: Spacing.xl,
    paddingBottom: 0,
  },
  list: {padding: Spacing.xl, paddingBottom: Spacing.huge},
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
  info: {flex: 1},
  name: {color: Colors.textPrimary, fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold},
  email: {color: Colors.textSecondary, fontSize: Fonts.sizes.md, marginTop: 2, fontWeight: Fonts.weights.medium},
  phone: {color: Colors.textMuted, fontSize: Fonts.sizes.sm, marginTop: 4},
  empty: {color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xxl, fontSize: Fonts.sizes.md, fontStyle: 'italic'},
});

export default ManageOperators;
