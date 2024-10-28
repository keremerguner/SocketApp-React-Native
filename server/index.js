const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());

const PORT = process.env.PORT || 3000;

// `io` nesnesini `app` nesnesine ekleyin
app.set('socketio', io);

// API Routes
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/group');
const userRoutes = require('./routes/user'); // Yeni user route'unu dahil ettik

app.use('/api/user', userRoutes); // Yeni route'u ekledik
app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);

// MongoDB Bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı!'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Socket.IO Bağlantısı
io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);

  // Belirli bir gruba katılma
  socket.on('joinGroup', (groupCode) => {
    socket.join(groupCode);
    console.log(`Kullanıcı ${socket.id}, ${groupCode} grubuna katıldı.`);
  });

  // Mesaj gönderme
  socket.on('sendMessage', (messageData) => {
    const { groupCode, text, sender } = messageData;
    console.log('Yeni mesaj alındı:', messageData);

    // Gruba katılan diğer kullanıcılara mesajı gönder
    io.to(groupCode).emit('receiveMessage', { sender, text });
  });

  // Grup silindiğinde grup üyelerine bildirim gönderme
  socket.on('deleteGroup', (groupCode) => {
    io.to(groupCode).emit('groupDeleted', 'Grup sahibi tarafından silindi');
    console.log(`Grup ${groupCode} silindi ve tüm kullanıcılara bildirildi.`);
  });

  // Kullanıcı ayrıldığında
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
