import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, View} from 'react-native';

// Bileşenler
import {Register} from './src/pages/Register';
import {Login} from './src/pages/Login';
import {Home} from './src/pages/Home';
import {JoinGroup} from './src/pages/JoinGroup';
import {CreateGroup} from './src/pages/CreateGroup';
import Chat from './src/pages/Chat/Chat';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null); // Başlangıçta null, böylece yükleme durumu gösterilebilir

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token); // Token varsa true, yoksa false
      } catch (error) {
        console.error('Kullanıcı durumu kontrol edilemedi:', error);
        setIsLoggedIn(false); // Hata durumunda login ekranına yönlendir
      }
    };

    checkLoginStatus();
  }, []);

  // Yükleme sırasında bir indikatör göster
  if (isLoggedIn === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'Home' : 'Login'}
        screenOptions={{headerShown: false}}>
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
