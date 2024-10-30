import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  Platform,
  Image,
} from 'react-native';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Chat = ({route, navigation}: any) => {
  const {group, userId} = route.params;

  const API_URL =
    Platform.OS === 'ios'
      ? 'http://localhost:3000/api/group'
      : 'http://10.0.2.2:3000/api/group';

  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [userMap, setUserMap] = useState<{[key: string]: string}>({});

  const fetchGroupMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/${group.groupCode}/members`);
      const data = await response.json();
      if (response.ok) {
        const map: {[key: string]: string} = {};
        data.members.forEach((member: any) => {
          map[member._id] = member.username;
        });
        setUserMap(map);
      } else {
        Alert.alert('Üye bilgileri alınamadı', data.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      Alert.alert('Hata', 'Üye bilgileri alınamadı');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLeaveGroup} style={{marginRight: 10}}>
          <Text style={{color: 'white', fontSize: 16}}>Gruptan Çık</Text>
        </TouchableOpacity>
      ),
    });

    socket.emit('joinGroup', group.groupCode);
    fetchGroupMembers();
    socket.on('receiveMessage', (messageData: any) => {
      setMessages(prevMessages => [...prevMessages, messageData]);
    });

    socket.on('groupDeleted', () => {
      Alert.alert('Grup Silindi', 'Grup sahibi tarafından silindi');
      navigation.navigate('Home', {refresh: true});
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('groupDeleted');
      socket.emit('leaveGroup', group.groupCode);
    };
  }, []);

  const handleLeaveGroup = async () => {
    try {
      const response = await fetch(`${API_URL}/leave`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({groupCode: group.groupCode, userId}),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Gruptan başarıyla çıkıldı');
        navigation.navigate('Home', {refresh: true});
      } else {
        Alert.alert('Çıkış işlemi başarısız', data.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      Alert.alert('Çıkış işlemi başarısız', 'Sunucu hatası oluştu.');
    }
  };

  const handleDeleteGroup = async () => {
    Alert.alert(
      "Grubu Sil",
      "Bu grubu silmek istediğinizden emin misiniz?",
      [
        {
          text: "Hayır",
          style: "cancel",
        },
        {
          text: "Evet",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupCode: group.groupCode, userId }),
              });
    
              const data = await response.json();
              if (response.ok) {
                Alert.alert('Başarılı', 'Grup başarıyla silindi');
                socket.emit('groupDeleted', group.groupCode);
                navigation.navigate('Home', { refresh: true });
              } else {
                Alert.alert('Silme hatası', data.error || 'Bir hata oluştu');
              }
            } catch (error) {
              Alert.alert('Grup silme hatası', 'Bir hata oluştu');
            }
          },
        },
      ]
    );
  };
  
  const handleSendMessage = () => {
    if (messageText.trim()) {
      const messageData = {
        sender: userId,
        text: messageText,
        groupCode: group.groupCode,
      };
      socket.emit('sendMessage', messageData);
      setMessageText('');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      {/* Grup Bilgisi */}
      {/* Grup Bilgisi */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 15,
          paddingHorizontal: 20,
          backgroundColor: '#4CAF50',
        }}>
        {/* Geri Butonu */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../images/back.png')} // Geri butonu için ikon yolu
            style={{width: 24, height: 24, tintColor: 'white'}}
          />
        </TouchableOpacity>

        {/* Grup Adı */}
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Grup Adı: {group.groupName}
        </Text>

        {/* Silme Butonu */}
        {group.createdBy === userId ? (
          <TouchableOpacity onPress={handleDeleteGroup}>
            <Image
              source={require('../../images/delete.png')} // Silme ikonu için ikon yolu
              style={{width: 24, height: 24, tintColor: 'red'}}
            />
          </TouchableOpacity>
        ) : (
          <View style={{width: 24}} /> // İkona göre boşluk bırakmak için
        )}
      </View>

      {/* Mesaj Listesi */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}: any) => (
          <View
            style={{
              padding: 10,
              backgroundColor: item.sender === userId ? '#DCF8C5' : '#ECECEC',
              borderRadius: 10,
              marginVertical: 5,
              maxWidth: '75%',
              alignSelf: item.sender === userId ? 'flex-end' : 'flex-start',
            }}>
            <Text style={{fontWeight: 'bold'}}>
              {item.sender === userId
                ? 'Ben'
                : userMap[item.sender] || item.sender}
            </Text>
            <Text>{item.text}</Text>
          </View>
        )}
        style={{flex: 1, paddingHorizontal: 10}}
      />

      {/* Mesaj Yazma Alanı */}
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
        <TextInput
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 20,
            backgroundColor: 'white',
            borderColor: '#ccc',
            borderWidth: 1,
            marginRight: 10,
          }}
          placeholder="Mesaj yazın..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={{
            backgroundColor: '#4CAF50',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20,
          }}>
          <Text style={{color: 'white', fontSize: 16}}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
