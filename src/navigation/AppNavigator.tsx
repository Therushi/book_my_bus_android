import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {useAuth} from '@/context/AuthContext';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Colors} from '@/theme/theme';
import {RootStackParamList} from '@/models/types';

// Auth screens
import LoginScreen from '@/screens/auth/LoginScreen';
import SignupScreen from '@/screens/auth/SignupScreen';

// Tab navigators
import AdminNavigator from './AdminNavigator';
import OperatorNavigator from './OperatorNavigator';
import PassengerNavigator from './PassengerNavigator';

// Stack screens (shared)
import ManageBuses from '@/screens/admin/ManageBuses';
import ManageRoutes from '@/screens/admin/ManageRoutes';
import ManageOperators from '@/screens/admin/ManageOperators';
import ReportsScreen from '@/screens/admin/ReportsScreen';
import TripDetails from '@/screens/operator/TripDetails';
import SearchBuses from '@/screens/passenger/SearchBuses';
import TripResults from '@/screens/passenger/TripResults';
import SeatSelection from '@/screens/passenger/SeatSelection';
import PaymentScreen from '@/screens/passenger/PaymentScreen';
import TicketScreen from '@/screens/passenger/TicketScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const {user, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: Colors.surface},
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: {fontWeight: '600'},
          contentStyle: {backgroundColor: Colors.background},
        }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown: false}} />
          </>
        ) : user.role === 'admin' ? (
          <>
            <Stack.Screen name="AdminTabs" component={AdminNavigator} options={{headerShown: false}} />
            <Stack.Screen name="ManageBuses" component={ManageBuses} options={{title: 'Manage Buses'}} />
            <Stack.Screen name="ManageRoutes" component={ManageRoutes} options={{title: 'Manage Routes'}} />
            <Stack.Screen name="ManageOperators" component={ManageOperators} options={{title: 'Operators'}} />
            <Stack.Screen name="ReportsScreen" component={ReportsScreen} options={{title: 'Reports'}} />
            <Stack.Screen name="TripDetails" component={TripDetails} options={{title: 'Trip Details'}} />
            <Stack.Screen name="TicketScreen" component={TicketScreen} options={{title: 'Ticket'}} />
          </>
        ) : user.role === 'operator' ? (
          <>
            <Stack.Screen name="OperatorTabs" component={OperatorNavigator} options={{headerShown: false}} />
            <Stack.Screen name="TripDetails" component={TripDetails} options={{title: 'Trip Details'}} />
            <Stack.Screen name="TicketScreen" component={TicketScreen} options={{title: 'Ticket'}} />
          </>
        ) : (
          <>
            <Stack.Screen name="PassengerTabs" component={PassengerNavigator} options={{headerShown: false}} />
            <Stack.Screen name="SearchBuses" component={SearchBuses} options={{title: 'Search'}} />
            <Stack.Screen name="TripResults" component={TripResults} options={{title: 'Available Buses'}} />
            <Stack.Screen name="SeatSelection" component={SeatSelection} options={{title: 'Select Seats'}} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{title: 'Payment', headerBackVisible: false}} />
            <Stack.Screen name="TicketScreen" component={TicketScreen} options={{title: 'Your Ticket', headerBackVisible: false}} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});

export default AppNavigator;
