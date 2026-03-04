import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AdminDashboard from '@/screens/admin/AdminDashboard';
import ManageBuses from '@/screens/admin/ManageBuses';
import ManageRoutes from '@/screens/admin/ManageRoutes';
import AdminBookings from '@/screens/admin/AdminBookings';
import AdminManageTrips from '@/screens/admin/AdminManageTrips';
import ProfileScreen from '@/screens/passenger/ProfileScreen';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Fonts, Radii, Shadows } from '@/theme/theme';

const Tab = createBottomTabNavigator();

const AdminNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 0,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          ...Shadows.large,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: Fonts.sizes.xs,
          fontWeight: Fonts.weights.medium,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Icon
                name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Buses"
        component={ManageBuses}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Icon name={focused ? 'bus' : 'bus'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Routes"
        component={ManageRoutes}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Icon
                name={focused ? 'map-marker-path' : 'map-marker-path'}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Trips"
        component={AdminManageTrips}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Icon
                name={focused ? 'road-variant' : 'road-variant'}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={AdminBookings}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Icon
                name={
                  focused
                    ? 'ticket-confirmation'
                    : 'ticket-confirmation-outline'
                }
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Icon
                name={focused ? 'account' : 'account-outline'}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 30,
    borderRadius: Radii.full,
  },
  iconContainerActive: {
    backgroundColor: Colors.primary + '12',
  },
});

export default AdminNavigator;
