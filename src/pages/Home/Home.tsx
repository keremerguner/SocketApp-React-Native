import React, { useEffect, useState, useCallback } from 'react';
import { View, Button, FlatList, Text, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Home = ({ navigation }: any) => {
  const [groups, setGroups] = useState([]); // Kullanıcının gruplarını saklayacak
  const [userId, setUserId] = useState(''); // Kullanıcı kimliğini saklar
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [username, setUsername] = useState(''); // Kullanıcı adını saklar

  const API_URL =
    Platform.OS === 'ios'
      ? 'http://localhost:3000/api/user/groups'
      : 'http://10.0.2.2:3000/api/user/groups';

  // Kullanıcının gruplarını almak için bir API isteği
  const fetchUserGroups = async () => {
    if (!userId) return; // Eğer userId tanımlı değilse isteği yapma

    setLoading(true); // Yüklemeyi başlat
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Oturum hatası', 'Token bulunamadı');
        return;
      }

      const response = await fetch(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text); // JSON ayrıştırmayı deneyin
      } catch (jsonError) {
        console.error('Beklenmeyen yanıt formatı:', text); // Yanıt JSON değilse hata ver
        Alert.alert('Sunucu hatası', 'Beklenmedik yanıt alındı.');
        return;
      }

      if (response.ok) {
        setGroups(data.groups || []); // Grupları duruma ekle
      } else {
        Alert.alert('Gruplar alınamadı', data.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      console.error('Hata:', error);
      Alert.alert('Hata', 'Gruplar alınamadı');
    } finally {
      setLoading(false); // Yükleme durumunu durdur
    }
  };

  // `userId` ve `username` bilgilerini `AsyncStorage`'dan al
  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('token');
      const storedUsername = await AsyncStorage.getItem('username'); // `username`'i çekiyoruz
      if (token) {
        const { userId } = JSON.parse(atob(token.split('.')[1]));
        setUserId(userId); // Kullanıcı ID'yi kaydet
      }
      if (storedUsername) {
        setUsername(storedUsername); // Kullanıcı adını kaydet
      }
    };

    fetchUserData();
  }, []);

  // `navigation` odaklandığında grupları getir
  useFocusEffect(
    useCallback(() => {
      if (userId) fetchUserGroups();
    }, [userId])
  );

  return (
    <View style={{ padding: 20, flex: 1 }}>
      {/* Grup Oluştur ve Gruba Katıl butonları */}
      <Button title="Grup Oluştur" onPress={() => navigation.navigate('CreateGroup', { userId, username })} />
      <Button title="Gruba Katıl" onPress={() => navigation.navigate('JoinGroup', { userId, username })} />
  
      <Text style={{ marginTop: 20, fontSize: 18 }}>Katıldığınız Gruplar</Text>
  
      {/* Yüklenme durumu ve grup kontrolü */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : groups.length > 0 ? (
        <FlatList
          data={groups}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Chat', { group: item, userId, username })}>
              <Text style={{ padding: 10, fontSize: 16 }}>{item.groupName}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={{ marginTop: 20, fontSize: 16, textAlign: 'center' }}>
          Henüz bir gruba katılmadınız
        </Text>
      )}
    </View>
  );
  
};

export default Home;
