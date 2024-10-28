import React, {useState} from 'react';
import {View, TextInput, Button, Alert} from 'react-native';

const JoinGroup: React.FC = ({navigation, route}: any) => {
  const {userId} = route.params;
  const [groupCode, setGroupCode] = useState('');

  const handleJoinGroup = async () => {
    try {
      console.log('Kullanıcı ID:', userId); // Kullanıcı ID’sini kontrol et
      const response = await fetch('http://localhost:3000/api/group/join', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({groupCode, userId}),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Gruba katılındı:', data);
        Alert.alert('Gruba katılındı');
        navigation.navigate('Home', {refresh: true})
      } else {
        console.log('Gruba katılma hatası:', data);
        Alert.alert('Gruba katılma hatası', data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Gruba katılma hatası:', err);
      Alert.alert('Gruba katılma hatası', err.message);
    }
  };

  return (
    <View style={{padding: 20}}>
      <TextInput
        placeholder="Grup Kodu"
        value={groupCode}
        onChangeText={setGroupCode}
        style={{borderWidth: 1, padding: 10, marginBottom: 10}}
      />
      <Button title="Gruba Katıl" onPress={handleJoinGroup} />
    </View>
  );
};

export default JoinGroup;
