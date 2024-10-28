import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const CreateGroup = ({ navigation, route }: any) => {
  const { userId } = route.params; // userId'yi route.params ile alıyoruz
  const [groupCode, setGroupCode] = useState('');
  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/group/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupCode, groupName, userId }), // userId'yi burada kullanıyoruz
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Beklenmeyen yanıt formatı:', text);
        Alert.alert('Sunucu hatası', 'Beklenmeyen yanıt alındı.');
        return;
      }

      if (response.ok) {
        console.log('Grup başarıyla oluşturuldu:', data);
        Alert.alert('Grup başarıyla oluşturuldu');
        navigation.navigate('Home', {refresh: true})
      } else {
        console.log('Grup oluşturma hatası:', data);
        Alert.alert('Grup oluşturma hatası', data.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Grup oluşturma isteği hatası:', err);
      Alert.alert('Hata', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Grup Kodu"
        value={groupCode}
        onChangeText={setGroupCode}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Grup Adı"
        value={groupName}
        onChangeText={setGroupName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Grup Oluştur" onPress={handleCreateGroup} />
    </View>
  );
};

export default CreateGroup;
