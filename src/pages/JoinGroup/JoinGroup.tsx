import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';

const JoinGroup: React.FC = ({navigation, route}: any) => {
  const {userId} = route.params;
  const [groupCode, setGroupCode] = useState('');

  const handleJoinGroup = async () => {
    try {
      console.log('Kullanıcı ID:', userId);
      const response = await fetch('http://localhost:3000/api/group/join', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({groupCode, userId}),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Gruba katılındı:', data);
        Alert.alert('Gruba katılındı');
        navigation.navigate('Home', {refresh: true});
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
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#4CAF50',
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderWidth: 1,
          borderColor: '#c3c3c3',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../images/back.png')} // Geri butonu için ikon yolu
            style={{width: 24, height: 24, tintColor: 'white'}}
          />
        </TouchableOpacity>
        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
          Socket Chat
        </Text>
        <View style={{width: 29}} /> {/* Sağ tarafta boş alan için */}
      </View>

      {/* İçerik */}
      <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
          }}>
          Gruba Katıl
        </Text>
        <TextInput
          placeholder="Grup Kodu"
          value={groupCode}
          onChangeText={setGroupCode}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 5,
            marginBottom: 20,
          }}
        />
        <TouchableOpacity
          onPress={handleJoinGroup}
          style={{
            backgroundColor: '#4CAF50',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 16}}>Gruba Katıl</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JoinGroup;
