import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  Platform,
  ImageBackground,
} from 'react-native';
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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        navigation.navigate('Home', {userId: data.userId});
      } else {
        Alert.alert('Giriş hatası', data.error || 'Bir hata oluştu.');
      }
    } catch (error) {
      const err = error as Error;
      console.log(err.message);
      Alert.alert('Hata', err.message);
    }
  };

  return (
    <ImageBackground
      source={require('../../images/background.png')}
      style={{flex: 1, justifyContent: 'center'}}
      resizeMode="cover">
      <View style={{padding: 20, borderRadius: 10}}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
          }}>
          Giriş Yap
        </Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={{
            borderWidth: 1,
            padding: 10,
            borderColor: '#ccc',
            backgroundColor: '#fff',
            marginBottom: 10,
            borderRadius: 5,
          }}
        />
        <TextInput
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            padding: 10,
            borderColor: '#ccc',
            backgroundColor: '#fff',
            marginBottom: 10,
            borderRadius: 5,
          }}
        />
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: '#4CAF50',
              padding: 10,
              borderRadius: 5,
              marginBottom: 10,
              width: '100%',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 16}}>Giriş Yap</Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text style={{fontSize: 14, color: '#333'}}>
              Hala kayıt olmadınız mı?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{fontSize: 14, color: '#4CAF50', marginLeft: 5}}>
                Kaydol
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;
