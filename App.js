import 'react-native-gesture-handler'; // Must be at the top
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import Details from './src/screens/Details';

// Stack Navigator for controlling transitions
const Stack = createStackNavigator();

// Stack Navigator to handle screen transitions

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Login'
        screenOptions={{
          headerShown: false,
          animation:'slide_from_right'
        }}
      >
      <Stack.Screen name='Login' component={Login}/>
      <Stack.Screen name='Dashboard' component={Dashboard}/>
      {/* <Stack.Screen name='Login' component={Login}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
