import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';  // Ana ekran
import PinnedLocationsScreen from './PinnedLocationsScreen';  // Pinlenen noktaları gösteren ekran

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Harita' }} />
                <Stack.Screen name="PinnedLocations" component={PinnedLocationsScreen} options={{ title: 'Pinlenen Konumlar' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
