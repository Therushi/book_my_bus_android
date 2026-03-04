import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OperatorDashboard from '@/screens/operator/OperatorDashboard';
import ManageTrips from '@/screens/operator/ManageTrips';
import OperatorBookings from '@/screens/operator/OperatorBookings';
import ProfileScreen from '@/screens/passenger/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '@/theme/theme';

const Tab = createBottomTabNavigator();

const OperatorNavigator: React.FC = () => {
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
        name="Dashboard"
        component={OperatorDashboard}
        options={{tabBarIcon: ({color, size}) => <Icon name="view-dashboard" size={size} color={color} />}}
      />
      <Tab.Screen
        name="Trips"
        component={ManageTrips}
        options={{tabBarIcon: ({color, size}) => <Icon name="road-variant" size={size} color={color} />}}
      />
      <Tab.Screen
        name="Bookings"
        component={OperatorBookings}
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

export default OperatorNavigator;
