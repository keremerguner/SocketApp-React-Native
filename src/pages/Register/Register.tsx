import React, {useState} from 'react';
import {View, TextInput, Button, Alert, Platform} from 'react-native';

const Register = ({navigation}: any) => {
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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, password}),
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
    <View style={{padding: 20}}>
      <TextInput
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
        style={{borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5}}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5}}
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5}}
      />
      <Button title="Kaydol" onPress={handleRegister} />
      <Button title="Giriş Yap" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default Register;
