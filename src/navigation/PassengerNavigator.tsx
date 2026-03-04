import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PassengerDashboard from '@/screens/passenger/PassengerDashboard';
import SearchBuses from '@/screens/passenger/SearchBuses';
import BookingHistory from '@/screens/passenger/BookingHistory';
import ProfileScreen from '@/screens/passenger/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '@/theme/theme';

const Tab = createBottomTabNavigator();

const PassengerNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
      }}>
      <Tab.Screen
        name="Home"
        component={PassengerDashboard}
        options={{tabBarIcon: ({color, size}) => <Icon name="home" size={size} color={color} />}}
      />
      <Tab.Screen
        name="SearchBuses"
        component={SearchBuses}
        options={{tabBarLabel: 'Search', tabBarIcon: ({color, size}) => <Icon name="magnify" size={size} color={color} />}}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingHistory}
        options={{tabBarIcon: ({color, size}) => <Icon name="ticket-confirmation" size={size} color={color} />}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{tabBarIcon: ({color, size}) => <Icon name="account" size={size} color={color} />}}
      />
    </Tab.Navigator>
  );
};

export default PassengerNavigator;
