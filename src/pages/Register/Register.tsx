import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  Platform,
  ImageBackground,
} from 'react-native';

const Register = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_URL =
    Platform.OS === 'ios'
      ? 'http://localhost:3000/api/auth/register'
      : 'http://10.0.2.2:3000/api/auth/register';

  const handleRegister = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Kayıt başarılı', 'Giriş yapabilirsiniz.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Kayıt hatası', data.error || 'Bir hata oluştu.');
      }
    } catch (error) {
      const err = error as Error;
      Alert.alert('Hata', err.message);
    }
  };

  return (
    <ImageBackground
      source={require('../../images/background.png')}
      style={{ flex: 1, justifyContent: 'center' }}
      resizeMode="cover"
    >
      <View style={{ padding: 20, borderRadius: 10 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Kayıt Ol
        </Text>
        <TextInput
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
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
        
        <TouchableOpacity
          onPress={handleRegister}
          style={{
            backgroundColor: '#4CAF50',
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Kaydol</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <Text style={{ fontSize: 14, color: '#333' }}>Zaten hesabınız var mı?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ fontSize: 14, color: '#4CAF50', marginLeft: 5 }}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Register;
