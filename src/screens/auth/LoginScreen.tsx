import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Colors, Fonts, Spacing, Radii} from '@/theme/theme';
import FormInput from '@/components/FormInput';
import AppButton from '@/components/AppButton';
import {useAuth} from '@/context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/models/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Unknown error');
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="bus-multiple" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>BookMyBus</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            icon={<Icon name="lock-outline" size={20} color={Colors.textMuted} />}
          />

          <AppButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />
        </View>

        {/* Demo Credentials */}
        {/* <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Demo Credentials</Text>
          <Text style={styles.demoText}>Admin: admin@bookmybus.com / admin123</Text>
          <Text style={styles.demoText}>Operator: operator@bookmybus.com / operator123</Text>
          <Text style={styles.demoText}>Passenger: passenger@bookmybus.com / passenger123</Text>
        </View> */}

        {/* Sign Up Link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupLabel}>Don't have an account? </Text>
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate('Signup')}>
            Sign Up
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
    paddingTop: Spacing.huge,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.hero,
    fontWeight: Fonts.weights.extraBold,
    letterSpacing: -1,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.base,
    marginTop: Spacing.xs,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  loginBtn: {
    marginTop: Spacing.md,
  },
  demoBox: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radii.md,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  demoTitle: {
    color: Colors.primary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.sm,
  },
  demoText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginBottom: 3,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  signupLabel: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
  },
  signupLink: {
    color: Colors.primary,
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semiBold,
  },
});

export default LoginScreen;
