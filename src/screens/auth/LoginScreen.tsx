import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
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
          
          {/* Red Banner Header (Inside ScrollView to prevent clipping and allow scrolling) */}
          <View style={styles.headerBackground}>
            <View style={styles.logoRow}>
              <Icon name="bus-multiple" size={32} color={Colors.white} />
              <Text style={styles.headerLogoText}>BookMyBus</Text>
            </View>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>Sign in to manage your tickets</Text>
          </View>

          {/* Overlapping Card Container */}
          <View style={styles.content}>
            <View style={styles.card}>
              <View style={styles.formIconContainer}>
                <Icon name="account-circle-outline" size={40} color={Colors.secondary} />
              </View>
              
              <View style={styles.form}>
                <FormInput
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Icon name="email-outline" size={20} />}
                />
                <FormInput
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  icon={<Icon name="lock-outline" size={20} />}
                />

                <AppButton
                  title="Sign In"
                  onPress={handleLogin}
                  loading={loading}
                  style={styles.loginBtn}
                />
              </View>

              {/* Sign Up Link */}
              <View style={styles.signupRow}>
                <Text style={styles.signupLabel}>New to BookMyBus? </Text>
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate('Signup')}>
                  Register Here
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
    paddingTop: Platform.OS === 'ios' ? 60 : Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 90, // Increased bottom padding to give text more room above the overlap
    borderBottomLeftRadius: Radii.xl,
    borderBottomRightRadius: Radii.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerLogoText: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    marginLeft: Spacing.sm,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.xxxl,
    fontWeight: Fonts.weights.extraBold,
  },
  headerSubtitle: {
    color: Colors.white,
    opacity: 0.9,
    fontSize: Fonts.sizes.base,
    marginTop: Spacing.xs,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    paddingTop: Spacing.xl + 20, // Add space for icon
    marginTop: -40, // Less aggressive overlap so text is visible
    ...Shadows.card,
  },
  formIconContainer: {
    position: 'absolute',
    top: -36, // Half of height (72)
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface, // Match card background
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
    elevation: 8,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  loginBtn: {
    marginTop: Spacing.md,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  signupLabel: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
  },
  signupLink: {
    color: Colors.secondary,
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semiBold,
  },
});

export default LoginScreen;
