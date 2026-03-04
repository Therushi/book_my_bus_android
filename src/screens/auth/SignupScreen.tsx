import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Colors, Fonts, Spacing, Radii} from '@/theme/theme';
import FormInput from '@/components/FormInput';
import AppButton from '@/components/AppButton';
import {useAuth} from '@/context/AuthContext';
import {UserRole} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/models/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const ROLES: {key: UserRole; label: string; icon: string; desc: string}[] = [
  {key: 'passenger', label: 'Passenger', icon: 'account', desc: 'Book bus tickets'},
  {key: 'operator', label: 'Bus Operator', icon: 'steering', desc: 'Manage your fleet'},
  {key: 'admin', label: 'Administrator', icon: 'shield-crown', desc: 'Full system control'},
];

const SignupScreen: React.FC<Props> = ({navigation}) => {
  const {signup} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('passenger');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password, role, phone);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Signup Failed', result.error || 'Unknown error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join BookMyBus today</Text>

        {/* Role Selector */}
        <Text style={styles.sectionLabel}>I am a...</Text>
        <View style={styles.roleRow}>
          {ROLES.map(r => (
            <TouchableOpacity
              key={r.key}
              style={[styles.roleCard, role === r.key && styles.roleCardActive]}
              onPress={() => setRole(r.key)}
              activeOpacity={0.7}>
              <Icon
                name={r.icon}
                size={24}
                color={role === r.key ? Colors.primary : Colors.textMuted}
              />
              <Text
                style={[
                  styles.roleLabel,
                  role === r.key && styles.roleLabelActive,
                ]}>
                {r.label}
              </Text>
              <Text style={styles.roleDesc}>{r.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form */}
        <FormInput
          label="Full Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          icon={<Icon name="account-outline" size={20} color={Colors.textMuted} />}
        />
        <FormInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          icon={<Icon name="email-outline" size={20} color={Colors.textMuted} />}
        />
        <FormInput
          label="Phone (optional)"
          placeholder="+91-XXXXX XXXXX"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          icon={<Icon name="phone-outline" size={20} color={Colors.textMuted} />}
        />
        <FormInput
          label="Password"
          placeholder="Min 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon={<Icon name="lock-outline" size={20} color={Colors.textMuted} />}
        />
        <FormInput
          label="Confirm Password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          icon={<Icon name="lock-check-outline" size={20} color={Colors.textMuted} />}
        />

        <AppButton
          title="Create Account"
          onPress={handleSignup}
          loading={loading}
          style={styles.signupBtn}
        />

        <View style={styles.loginRow}>
          <Text style={styles.loginLabel}>Already have an account? </Text>
          <Text
            style={styles.loginLink}
            onPress={() => navigation.goBack()}>
            Sign In
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: Colors.background},
  container: {flex: 1},
  content: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxxl,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.xxxl,
    fontWeight: Fonts.weights.extraBold,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.base,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    marginBottom: Spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radii.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  roleCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  roleLabel: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semiBold,
    marginTop: Spacing.xs,
  },
  roleLabelActive: {
    color: Colors.primary,
  },
  roleDesc: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
    textAlign: 'center',
    marginTop: 2,
  },
  signupBtn: {
    marginTop: Spacing.md,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  loginLabel: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
  },
  loginLink: {
    color: Colors.primary,
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semiBold,
  },
});

export default SignupScreen;
