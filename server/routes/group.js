const express = require('express');
const mongoose = require('mongoose');
const Group = require('../models/Group');

const router = express.Router();

// Grup Katılma
router.post('/join', async (req, res) => {
  const { groupCode, userId } = req.body;

  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Geçersiz kullanıcı ID formatı.' });
    }

    const group = await Group.findOne({ groupCode });

    if (!group) {
      return res.status(404).json({ error: 'Grup bulunamadı.' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (!group.members.includes(userObjectId)) {
      group.members.push(userObjectId);
      await group.save();
    }

    res.status(200).json({ message: 'Gruba başarıyla katıldınız', group });
  } catch (error) {
    console.error('Gruba katılma hatası:', error);
    res.status(500).json({ error: 'Gruba katılamadı.' });
  }
});

// Grup oluşturma
router.post('/create', async (req, res) => {
  const { groupCode, groupName, userId } = req.body;

  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Geçersiz kullanıcı ID formatı.' });
    }

    const newGroup = new Group({
      groupCode,
      groupName,
      members: [userId],
      createdBy: userId,
    });

    await newGroup.save();
    res.status(201).json({ message: 'Grup başarıyla oluşturuldu', group: newGroup });
  } catch (error) {
    console.error('Grup oluşturma hatası:', error);
    res.status(500).json({ error: 'Grup oluşturulamadı.' });
  }
});

// Grubun üyelerini döndür
router.get('/:groupCode/members', async (req, res) => {
  try {
    const group = await Group.findOne({ groupCode: req.params.groupCode }).populate('members', 'username');
    if (!group) {
      return res.status(404).json({ error: 'Grup bulunamadı.' });
    }
    res.status(200).json({ members: group.members });
  } catch (error) {
    console.error('Üye bilgileri alınamadı:', error);
    res.status(500).json({ error: 'Üye bilgileri alınamadı.' });
  }
});

// Gruptan çıkma işlemi
router.post('/leave', async (req, res) => {
  const { groupCode, userId } = req.body;

  try {
    const group = await Group.findOne({ groupCode });

    if (!group) {
      return res.status(404).json({ error: 'Grup bulunamadı.' });
    }

    group.members = group.members.filter(
      (memberId) => memberId && memberId.toString() !== userId
    );

    await group.save();

    res.status(200).json({ message: 'Gruptan başarıyla çıkıldı' });
  } catch (error) {
    console.error('Gruptan çıkış hatası:', error);
    res.status(500).json({ error: 'Gruptan çıkış işlemi başarısız.' });
  }
});

// Grubu silme fonksiyonu
router.delete('/delete', async (req, res) => {
  const { groupCode, userId } = req.body;

  try {
    const group = await Group.findOne({ groupCode });

    if (!group) {
      return res.status(404).json({ error: 'Grup bulunamadı.' });
    }

    if (group.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Bu işlemi yapma yetkiniz yok.' });
    }

    await Group.deleteOne({ groupCode });

    // `io` nesnesini alın
    const io = req.app.get('socketio');
    io.to(groupCode).emit('groupDeleted', 'Grup sahibi tarafından silindi');

    res.status(200).json({ message: 'Grup başarıyla silindi' });
  } catch (error) {
    console.error('Grup silme hatası:', error);
    res.status(500).json({ error: 'Grup silinemedi' });
  }
});

module.exports = router;
