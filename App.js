import React from 'react';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TeamProvider, useTeam } from './src/context/TeamContext';
import PokedexScreen from './src/screens/PokedexScreen';
import TeamScreen from './src/screens/TeamScreen';
import GameScreen from './src/screens/GameScreen';
import DetailScreen from './src/screens/DetailScreen';
import { STUDENT_NAME, THEME } from './src/config';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: THEME.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '800' },
};

const icon = (emoji) => ({ focused }) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
);

// Bottom tabs: Pokédex | My Team | Game
function Tabs() {
  const { team } = useTeam();
  return (
    <Tab.Navigator
      screenOptions={{
        ...headerOptions,
        tabBarActiveTintColor: THEME.primary,
      }}
    >
      <Tab.Screen
        name="Pokedex"
        component={PokedexScreen}
        options={{
          title: `${STUDENT_NAME}’s Pokédex`,
          tabBarLabel: 'Pokédex',
          tabBarIcon: icon('📖'),
        }}
      />
      <Tab.Screen
        name="MyTeam"
        component={TeamScreen}
        options={{
          title: `${STUDENT_NAME}’s Team`,
          tabBarLabel: 'My Team',
          tabBarIcon: icon('⭐'),
          tabBarBadge: team.length > 0 ? team.length : undefined,
        }}
      />
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{
          title: 'Who’s That Pokémon?',
          tabBarLabel: 'Game',
          tabBarIcon: icon('🎮'),
        }}
      />
    </Tab.Navigator>
  );
}

// Stack on top of the tabs, so Detail opens over them
export default function App() {
  return (
    <TeamProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={headerOptions}>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Pokémon' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TeamProvider>
  );
}
