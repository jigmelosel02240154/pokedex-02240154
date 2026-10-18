import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const theme = {
  colors: {
    primary: '#2563eb',
  },
};

const headerOptions = {
  headerStyle: { backgroundColor: theme.colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: '800',
  },
};

const icon = (emoji) => ({ focused }) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
);

// 1. Pokedex Screen Component
export function PokedexScreen() {
  return (
    <View style={styles.screen}>
      <Text>Pokedex</Text>
    </View>
  );
}

// 2. My Team Screen Component
export function MyTeamScreen() {
  return (
    <View style={styles.screen}>
      <Text>My Team</Text>
    </View>
  );
}

// 3. Game Screen Component
export function GameScreen() {
  return (
    <View style={styles.screen}>
      <Text>Game</Text>
    </View>
  );
}

// Bottom Tabs Navigator
export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        ...headerOptions,
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tab.Screen
        name="Pokedex"
        component={PokedexScreen}
        options={{
          title: 'Pokedex',
          tabBarLabel: 'Pokedex',
          tabBarIcon: icon('📖'),
        }}
      />
      <Tab.Screen
        name="My Team"
        component={MyTeamScreen}
        options={{
          title: 'My Team',
          tabBarLabel: 'My Team',
          tabBarIcon: icon('🧑‍🤝‍🧑'),
        }}
      />
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{
          title: 'Game',
          tabBarLabel: 'Game',
          tabBarIcon: icon('🎮'),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justify: 'center',
  },
});