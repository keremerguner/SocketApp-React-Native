import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Sunucunuzun adresini buraya yazın

const Chat = ({route, navigation}: any) => {
  const {group, userId} = route.params;

  const API_URL =
    Platform.OS === 'ios'
      ? 'http://localhost:3000/api/group'
      : 'http://10.0.2.2:3000/api/group';

  interface Message {
    sender: string;
    text: string;
    groupCode: string;
  }

  const [messages, setMessages] = useState<Message[]>([]); // Gelen mesajları saklar
  const [messageText, setMessageText] = useState(''); // Yazılan mesajı saklar
  const [userMap, setUserMap] = useState<{[key: string]: string}>({}); // userId -> username eşleşmesi

  // Grup üyelerini alarak userId -> username eşleşmesini oluştur
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
      console.error('Üye bilgileri alınamadı:', error);
      Alert.alert('Hata', 'Üye bilgileri alınamadı');
    }
  };

  useEffect(() => {
    // Sağ üst köşeye "Gruptan Çık" butonu ekle
    navigation.setOptions({
      headerRight: () => (
        <Button title="Gruptan Çık" onPress={handleLeaveGroup} />
      ),
    });

    // Kullanıcı belirli bir gruba katılır
    socket.emit('joinGroup', group.groupCode);

    // Grubun üyelerini al
    fetchGroupMembers();

    // Sunucudan gelen mesajları dinle
    socket.on('receiveMessage', (messageData: Message) => {
      setMessages(prevMessages => [...prevMessages, messageData]);
    });

    // Grup silindiğinde kullanıcıları yönlendir
    socket.on('grupSilindi', () => {
      Alert.alert('Grup Silindi', 'Grup sahibi tarafından silindi');
      navigation.navigate('Home', {refresh: true});
    });
    // Grubun silindiğini dinleyen olay dinleyicisi
    socket.on('groupDeleted', () => {
      Alert.alert('Grup silindi', 'Grup sahibi tarafından silindi');
      navigation.navigate('Home', {refresh: true}); // Home ekranına yönlendir
    });

    // Ekrandan çıkarken bağlantıyı kes
    return () => {
      socket.off('receiveMessage');
      socket.off('grupSilindi');
      socket.emit('leaveGroup', group.groupCode);
    };
  }, []);

  // Gruptan çıkma işlemi
  const handleLeaveGroup = async () => {
    try {
      const response = await fetch(`${API_URL}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({groupCode: group.groupCode, userId}),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Gruptan başarıyla çıkıldı');
        navigation.navigate('Home', {refresh: true}); // Home ekranına yönlendir
      } else {
        Alert.alert('Çıkış işlemi başarısız', data.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      console.error('Gruptan çıkış hatası:', error);
      Alert.alert('Çıkış işlemi başarısız', 'Sunucu hatası oluştu.');
    }
  };

  // Grubu silme fonksiyonu
  const handleDeleteGroup = async () => {
    try {
      const response = await fetch(`${API_URL}/delete`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({groupCode: group.groupCode, userId}),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Başarılı', 'Grup başarıyla silindi');
        socket.emit('grupSilindi', group.groupCode); // Grup silindi olayını yayınla
        navigation.navigate('Home', {refresh: true}); // Home ekranına yönlendir
      } else {
        Alert.alert('Silme hatası', data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Grup silme hatası:', error);
      Alert.alert('Grup silme hatası', 'Bir hata oluştu');
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const messageData = {
        sender: userId,
        text: messageText,
        groupCode: group.groupCode,
      };

      // Mesajı sunucuya gönder
      socket.emit('sendMessage', messageData);

      setMessageText('');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, padding: 20}}>
      <View style={{flex: 0.1, padding: 20}}>
        <Text style={{fontSize: 18}}>Grup: {group.groupName}</Text>
        {/* Grubu silme butonu (sadece grubu oluşturan kullanıcıya göster) */}
        {group.createdBy === userId && (
          <Button title="Grubu Sil" onPress={handleDeleteGroup} color="red" />
        )}
      </View>

      {/* Mesaj Listesi */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View
            style={{
              padding: 10,
              backgroundColor: item.sender === userId ? '#d3f3d3' : '#f3d3d3', // Kullanıcıya göre renk seçimi
              marginVertical: 4,
              borderRadius: 10,
              alignSelf: item.sender === userId ? 'flex-end' : 'flex-start', // Mesaj hizalama
              maxWidth: '70%',
            }}>
            <Text style={{fontWeight: 'bold'}}>
              {item.sender === userId
                ? 'Ben'
                : userMap[item.sender] || item.sender}
            </Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      {/* Mesaj Yazma Alanı */}
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            padding: 10,
            marginRight: 10,
            borderRadius: 5,
          }}
          placeholder="Mesaj yazın..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <Button title="Gönder" onPress={handleSendMessage} />
      </View>
    </SafeAreaView>
  );
};

export default Chat;
