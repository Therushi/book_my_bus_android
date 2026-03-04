import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
import FormInput from '@/components/FormInput';
import AppButton from '@/components/AppButton';
import {useAuth} from '@/context/AuthContext';
import {UserRepository} from '@/database/repositories/UserRepository';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen: React.FC = () => {
  const {user, logout, refreshUser} = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = async () => {
    if (!user) return;
    await UserRepository.update(user.id, {name: name.trim(), phone: phone.trim()});
    await refreshUser();
    setEditing(false);
    Alert.alert('Success', 'Profile updated');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', style: 'destructive', onPress: logout},
    ]);
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Icon name="account" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        {editing ? (
          <>
            <FormInput label="Name" value={name} onChangeText={setName} />
            <FormInput label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <View style={styles.editActions}>
              <AppButton title="Cancel" variant="outline" onPress={() => setEditing(false)} style={{flex: 1}} />
              <AppButton title="Save" onPress={handleSave} style={{flex: 1}} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Icon name="email-outline" size={20} color={Colors.textMuted} />
              <View style={{flex: 1}}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{user.email}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Icon name="account-outline" size={20} color={Colors.textMuted} />
              <View style={{flex: 1}}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{user.name}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Icon name="phone-outline" size={20} color={Colors.textMuted} />
              <View style={{flex: 1}}>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{user.phone || 'Not set'}</Text>
              </View>
            </View>
            <AppButton title="Edit Profile" variant="secondary" onPress={() => { setName(user.name); setPhone(user.phone || ''); setEditing(true); }} style={styles.editBtn} icon={<Icon name="pencil" size={18} color={Colors.textPrimary} />} />
          </>
        )}
      </View>

      <AppButton title="Logout" variant="danger" onPress={handleLogout} icon={<Icon name="logout" size={18} color={Colors.white} />} style={styles.logoutBtn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {padding: Spacing.xl, paddingTop: Spacing.xxl},
  avatarSection: {alignItems: 'center', marginBottom: Spacing.xxl},
  avatar: {width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center'},
  userName: {color: Colors.textPrimary, fontSize: Fonts.sizes.xxl, fontWeight: Fonts.weights.bold, marginTop: Spacing.md},
  userRole: {color: Colors.primary, fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.medium, marginTop: 4},
  card: {backgroundColor: Colors.card, borderRadius: Radii.xl, padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border, ...Shadows.card},
  infoRow: {flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border},
  label: {color: Colors.textMuted, fontSize: Fonts.sizes.xs},
  value: {color: Colors.textPrimary, fontSize: Fonts.sizes.base, fontWeight: Fonts.weights.medium, marginTop: 2},
  editBtn: {marginTop: Spacing.xl},
  editActions: {flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md},
  logoutBtn: {marginTop: Spacing.xxl},
});

export default ProfileScreen;
