import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
import AppButton from '@/components/AppButton';
import {PaymentRepository} from '@/database/repositories/PaymentRepository';
import {BookingRepository} from '@/database/repositories/BookingRepository';
import {Booking} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatCurrency} from '@/utils/helpers';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/models/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentScreen'>;

const PaymentScreen: React.FC<Props> = ({route, navigation}) => {
  const {bookingId} = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);
  const scaleAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    (async () => {
      const bk = await BookingRepository.findById(bookingId);
      setBooking(bk);
      // Simulate payment processing
      setTimeout(async () => {
        const payment = await PaymentRepository.findByBooking(bookingId);
        if (payment) {
          await PaymentRepository.markSuccess(payment.id);
        }
        setProcessing(false);
        setSuccess(true);
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      }, 2500);
    })();
  }, [bookingId, scaleAnim]);

  return (
    <View style={styles.container}>
      {processing ? (
        <View style={styles.center}>
          <View style={styles.processingCircle}>
            <Icon name="credit-card-wireless" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.processingText}>Processing Payment...</Text>
          <Text style={styles.amount}>{booking ? formatCurrency(booking.total_fare) : ''}</Text>
          <Text style={styles.hint}>Please wait while we confirm your payment</Text>
        </View>
      ) : (
        <View style={styles.center}>
          <Animated.View style={[styles.successCircle, {transform: [{scale: scaleAnim}]}]}>
            <Icon name="check" size={56} color={Colors.white} />
          </Animated.View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.amount}>{booking ? formatCurrency(booking.total_fare) : ''}</Text>
          <Text style={styles.bookingIdText}>Booking #{bookingId.slice(0, 8).toUpperCase()}</Text>
          <AppButton
            title="View Ticket"
            onPress={() => navigation.replace('TicketScreen', {bookingId})}
            style={styles.ticketBtn}
            icon={<Icon name="ticket-confirmation" size={20} color={Colors.white} />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl},
  processingCircle: {width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl},
  processingText: {color: Colors.textPrimary, fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold},
  amount: {color: Colors.accent, fontSize: Fonts.sizes.xxxl, fontWeight: Fonts.weights.extraBold, marginTop: Spacing.md},
  hint: {color: Colors.textMuted, fontSize: Fonts.sizes.md, marginTop: Spacing.md, textAlign: 'center'},
  successCircle: {width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl, ...Shadows.card},
  successTitle: {color: Colors.success, fontSize: Fonts.sizes.xxl, fontWeight: Fonts.weights.bold},
  bookingIdText: {color: Colors.textSecondary, fontSize: Fonts.sizes.md, marginTop: Spacing.md},
  ticketBtn: {marginTop: Spacing.xxxl, minWidth: 200},
});

export default PaymentScreen;
