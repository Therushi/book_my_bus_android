import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Colors, Fonts, Spacing, Radii, Shadows } from '@/theme/theme';
import FormInput from '@/components/FormInput';
import AppButton from '@/components/AppButton';
import { useAuth } from '@/context/AuthContext';
import { UserRepository } from '@/database/repositories/UserRepository';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = async () => {
    if (!user) return;
    await UserRepository.update(user.id, {
      name: name.trim(),
      phone: phone.trim(),
    });
    await refreshUser();
    setEditing(false);
    Alert.alert('Success', 'Profile updated');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  if (!user) return null;

  return (
    <View style={styles.flex}>
      <StatusBar
        backgroundColor={Colors.primaryDark}
        barStyle="light-content"
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Red Banner Header with Avatar */}
        <View style={styles.headerBanner}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="account" size={44} color={Colors.primary} />
            </View>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.userRole}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {editing ? (
              <>
                <FormInput label="Name" value={name} onChangeText={setName} />
                <FormInput
                  label="Phone"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
                <View style={styles.editActions}>
                  <AppButton
                    title="Cancel"
                    variant="outline"
                    onPress={() => setEditing(false)}
                    style={styles.actionBtn}
                  />
                  <AppButton
                    title="Save"
                    onPress={handleSave}
                    style={styles.actionBtn}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconBg}>
                    <Icon
                      name="email-outline"
                      size={18}
                      color={Colors.primary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{user.email}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconBg}>
                    <Icon
                      name="account-outline"
                      size={18}
                      color={Colors.secondary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{user.name}</Text>
                  </View>
                </View>
                <View style={[styles.infoRow, styles.infoRowLast]}>
                  <View style={styles.infoIconBg}>
                    <Icon
                      name="phone-outline"
                      size={18}
                      color={Colors.success}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.value}>{user.phone || 'Not set'}</Text>
                  </View>
                </View>
                <AppButton
                  title="Edit Profile"
                  variant="secondary"
                  onPress={() => {
                    setName(user.name);
                    setPhone(user.phone || '');
                    setEditing(true);
                  }}
                  style={styles.editBtn}
                  icon={
                    <Icon name="pencil" size={16} color={Colors.textPrimary} />
                  }
                />
              </>
            )}
          </View>
        </View>

        <AppButton
          title="Logout"
          variant="danger"
          onPress={handleLogout}
          icon={<Icon name="logout" size={16} color={Colors.error} />}
          style={styles.logoutBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { paddingBottom: Spacing.huge },
  headerBanner: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 56 : Spacing.xxl + 16,
    paddingBottom: Spacing.xxxl + Spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: Radii.xxl,
    borderBottomRightRadius: Radii.xxl,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  userName: {
    color: Colors.white,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.bold,
    marginTop: Spacing.xs,
  },
  roleBadge: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.white + '20',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.full,
  },
  userRole: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
  },
  cardContainer: {
    paddingHorizontal: Spacing.xl,
    marginTop: -Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  label: { color: Colors.textMuted, fontSize: Fonts.sizes.xs },
  value: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.medium,
    marginTop: 2,
  },
  editBtn: { marginTop: Spacing.xl },
  editActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  actionBtn: { flex: 1 },
  logoutBtn: { marginTop: Spacing.xxl, marginHorizontal: Spacing.xl },
});

export default ProfileScreen;
