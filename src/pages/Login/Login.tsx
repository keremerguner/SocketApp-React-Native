import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_URL =
  Platform.OS === 'ios'
    ? 'http://localhost:3000/api/auth/login'
    : 'http://10.0.2.2:3000/api/auth/login';


  const handleLogin = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        navigation.navigate('Home', { userId: data.userId });
      } else {
        Alert.alert('Giriş hatası', data.error || 'Bir hata oluştu.');
      }
    } catch (error) {
      const err = error as Error;
      console.log(err.message)
      Alert.alert('Hata', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={{borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5}} />
      <TextInput placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry style={{borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5}} />
      <Button title="Giriş Yap" onPress={handleLogin} />
      <Button title="Kaydol" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default Login;
