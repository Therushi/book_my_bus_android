import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PassengerDashboard from '@/screens/passenger/PassengerDashboard';
import SearchBuses from '@/screens/passenger/SearchBuses';
import BookingHistory from '@/screens/passenger/BookingHistory';
import ProfileScreen from '@/screens/passenger/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Fonts, Radii, Shadows } from '@/theme/theme';

const Tab = createBottomTabNavigator();

const PassengerNavigator: React.FC = () => {
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
        name="Home"
        component={PassengerDashboard}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Icon
                name={focused ? 'home' : 'home-outline'}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="SearchBuses"
        component={SearchBuses}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Icon name="magnify" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingHistory}
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

export default PassengerNavigator;
