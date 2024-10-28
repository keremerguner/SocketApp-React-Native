import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Bileşenler
import {Register} from './src/pages/Register';
import {Login} from './src/pages/Login';
import {Home} from './src/pages/Home';
import {JoinGroup} from './src/pages/JoinGroup';
import {CreateGroup} from './src/pages/CreateGroup';
import Chat from './src/pages/Chat/Chat';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="JoinGroup" component={JoinGroup} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
