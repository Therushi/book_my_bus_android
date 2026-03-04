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
  StatusBar,
} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
import FormInput from '@/components/FormInput';
import AppButton from '@/components/AppButton';
import {useAuth} from '@/context/AuthContext';
import {UserRole} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/models/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const ROLES: {key: UserRole; label: string; icon: string; desc: string}[] = [
  {key: 'passenger', label: 'Passenger', icon: 'account', desc: 'Book tickets'},
  {key: 'operator', label: 'Operator', icon: 'steering', desc: 'Manage fleet'},
  {key: 'admin', label: 'Admin', icon: 'shield-crown', desc: 'System control'},
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
    <View style={styles.flex}>
      <StatusBar backgroundColor={Colors.secondary} barStyle="light-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}>
          
          {/* Red Banner Header (Inside ScrollView) */}
          <View style={styles.headerBackground}>
            <View style={styles.logoRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Icon name="arrow-left" size={24} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.headerLogoText}>BookMyBus</Text>
            </View>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Join us today for an amazing journey</Text>
          </View>

          {/* Overlapping Card Container */}
          <View style={styles.content}>
            <View style={styles.card}>
              
              {/* Role Selector */}
              <Text style={styles.sectionLabel}>I am a...</Text>
              <View style={styles.roleSegmentContainer}>
                {ROLES.map((r, index) => {
                  const isSelected = role === r.key;
                  const isFirst = index === 0;
                  const isLast = index === ROLES.length - 1;

                  return (
                    <TouchableOpacity
                      key={r.key}
                      style={[
                        styles.roleSegment,
                        isFirst && styles.roleSegmentFirst,
                        isLast && styles.roleSegmentLast,
                        isSelected && styles.roleSegmentActive,
                      ]}
                      onPress={() => setRole(r.key)}
                      activeOpacity={0.7}>
                      <Icon
                        name={r.icon}
                        size={18}
                        color={isSelected ? Colors.white : Colors.textSecondary}
                        style={{marginBottom: 2}}
                      />
                      <Text
                        style={[
                          styles.roleSegmentText,
                          isSelected && styles.roleSegmentTextActive,
                        ]}>
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                <FormInput
                  label="Full Name"
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  icon={<Icon name="account-outline" size={20} />}
                />
                <FormInput
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Icon name="email-outline" size={20} />}
                />
                <FormInput
                  label="Phone (optional)"
                  placeholder="+91-XXXXX XXXXX"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  icon={<Icon name="phone-outline" size={20} />}
                />
                <FormInput
                  label="Password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon={<Icon name="lock-outline" size={20} />}
                />
                <FormInput
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  icon={<Icon name="lock-check-outline" size={20} />}
                />

                <AppButton
                  title="Create Account"
                  onPress={handleSignup}
                  loading={loading}
                  style={styles.signupBtn}
                />
              </View>

              <View style={styles.loginRow}>
                <Text style={styles.loginLabel}>Already have an account? </Text>
                <Text
                  style={styles.loginLink}
                  onPress={() => navigation.goBack()}>
                  Sign In
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: Colors.background},
  container: {flex: 1},
  headerBackground: {
    backgroundColor: Colors.secondary,
    paddingTop: Platform.OS === 'ios' ? 50 : Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 90, // Extra padding for the overlap
    borderBottomLeftRadius: Radii.xl,
    borderBottomRightRadius: Radii.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backBtn: {
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  headerLogoText: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.extraBold,
  },
  headerSubtitle: {
    color: Colors.white,
    opacity: 0.9,
    fontSize: Fonts.sizes.sm,
    marginTop: Spacing.xs,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    marginTop: -40, // Keeps it comfortably below the text
    ...Shadows.card,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    marginBottom: Spacing.sm,
  },
  roleSegmentContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  roleSegment: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  roleSegmentFirst: {
    borderTopLeftRadius: Radii.md,
    borderBottomLeftRadius: Radii.md,
  },
  roleSegmentLast: {
    borderRightWidth: 0,
    borderTopRightRadius: Radii.md,
    borderBottomRightRadius: Radii.md,
  },
  roleSegmentActive: {
    backgroundColor: Colors.primary,
  },
  roleSegmentText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: Fonts.weights.semiBold,
    marginTop: 2,
  },
  roleSegmentTextActive: {
    color: Colors.white,
  },
  formContainer: {
  },
  signupBtn: {
    marginTop: Spacing.md,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
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
