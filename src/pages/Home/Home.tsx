import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Platform,
  ImageBackground,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = ({ navigation }: any) => {
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  const USER_GROUPS_API_URL =
    Platform.OS === 'ios'
      ? 'http://localhost:3000/api/user/groups'
      : 'http://10.0.2.2:3000/api/user/groups';

  const GROUP_API_URL =
    Platform.OS === 'ios'
      ? 'http://localhost:3000/api/group'
      : 'http://10.0.2.2:3000/api/group';

  const fetchUserGroups = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Oturum hatası', 'Token bulunamadı');
        return;
      }

      const response = await fetch(`${USER_GROUPS_API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setGroups(data.groups || []);
      } else {
        Alert.alert('Gruplar alınamadı', data.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      console.error('Hata:', error);
      Alert.alert('Hata', 'Gruplar alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('token');
      const storedUsername = await AsyncStorage.getItem('username');
      if (token) {
        const { userId } = JSON.parse(atob(token.split('.')[1]));
        setUserId(userId);
      }
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userId) fetchUserGroups();
    }, [userId]),
  );

  const handleLeaveGroup = async (groupCode: string) => {
    Alert.alert(
      "Gruptan Çık",
      "Bu gruptan çıkmak istediğinizden emin misiniz?",
      [
        {
          text: "Hayır",
          style: "cancel",
        },
        {
          text: "Evet",
          onPress: async () => {
            try {
              const response = await fetch(`${GROUP_API_URL}/leave`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupCode, userId }),
              });

              const data = await response.json();
              if (response.ok) {
                Alert.alert('Başarılı', 'Gruptan başarıyla çıkıldı');
                setGroups(prevGroups => prevGroups.filter((group: any) => group.groupCode !== groupCode));
              } else {
                console.log('API response error:', data);
                Alert.alert('Çıkış hatası', data.error || 'Bilinmeyen hata');
              }
            } catch (error) {
              console.error('Çıkış isteği sırasında hata:', error);
              Alert.alert('Çıkış hatası', 'Bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require('../../images/background.png')}
      style={{ flex: 1, justifyContent: 'center' }}
      resizeMode="cover"
    >
      {/* Header */}
      <SafeAreaView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#4CAF50',
          paddingHorizontal: 20,
          borderWidth: 1,
          borderColor: '#c3c3c3',
        }}
      >
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Socket Chat
        </Text>
        <TouchableOpacity onPress={() => {}}>
          <Image
            source={require('../../images/user.png')}
            style={{ width: 24, height: 24, tintColor: 'white' }}
          />
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView
        style={{
          paddingHorizontal: 20,
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 10,
          paddingBottom: 60, // Bottom bar için yer açmak
          paddingTop: -40,
        }}
      >
        {/* İçerik */}
        <View style={{ flex: 1 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', paddingVertical: 10 }}>
              Katıldığın Gruplar
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              padding: 10,
            }}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : groups.length > 0 ? (
              <FlatList
                data={groups}
                keyExtractor={(item: any) => item._id}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 10,
                      backgroundColor: '#f7f7f7',
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Chat', {
                          group: item,
                          userId,
                          username,
                        })
                      }
                      style={{ flex: 1 }}
                    >
                      <Text style={{ fontSize: 16, color: '#333' }}>{item.groupName}</Text>
                    </TouchableOpacity>

                    {/* Çıkma İkonu */}
                    <TouchableOpacity onPress={() => handleLeaveGroup(item.groupCode)}>
                      <Image
                        source={require('../../images/logout.png')} // Çıkma ikonu için ikon yolu
                        style={{ width: 24, height: 24, tintColor: 'red' }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, textAlign: 'center', color: '#333' }}>
                  Henüz bir gruba katılmadınız
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom Bar */}
        <SafeAreaView
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: 0,
            left: 20,
            right: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('JoinGroup', { userId, username })}
            style={{
              flex: 1,
              backgroundColor: '#ffb4e3',
              padding: 15,
              borderRadius: 5,
              alignItems: 'center',
              marginRight: 5,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Gruba Katıl</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateGroup', { userId, username })
            }
            style={{
              flex: 1,
              backgroundColor: '#b4cfff',
              padding: 15,
              borderRadius: 5,
              alignItems: 'center',
              marginLeft: 5,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Grup Oluştur</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Home;
