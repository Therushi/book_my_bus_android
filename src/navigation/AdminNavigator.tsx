import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AdminDashboard from '@/screens/admin/AdminDashboard';
import ManageBuses from '@/screens/admin/ManageBuses';
import ManageRoutes from '@/screens/admin/ManageRoutes';
import ManageOperators from '@/screens/admin/ManageOperators';
import AdminBookings from '@/screens/admin/AdminBookings';
import ReportsScreen from '@/screens/admin/ReportsScreen';
import ProfileScreen from '@/screens/passenger/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '@/theme/theme';

const Tab = createBottomTabNavigator();

const AdminNavigator: React.FC = () => {
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
        component={AdminDashboard}
        options={{tabBarIcon: ({color, size}) => <Icon name="view-dashboard" size={size} color={color} />}}
      />
      <Tab.Screen
        name="Buses"
        component={ManageBuses}
        options={{tabBarIcon: ({color, size}) => <Icon name="bus" size={size} color={color} />}}
      />
      <Tab.Screen
        name="Routes"
        component={ManageRoutes}
        options={{tabBarIcon: ({color, size}) => <Icon name="map-marker-path" size={size} color={color} />}}
      />
      <Tab.Screen
        name="Bookings"
        component={AdminBookings}
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

export default AdminNavigator;
