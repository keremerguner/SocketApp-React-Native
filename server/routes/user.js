const express = require('express');
const Group = require('../models/Group');

const router = express.Router();

// Belirli bir kullanıcının katıldığı grupları getiren endpoint
router.get('/groups/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // `userId` değerine sahip kullanıcının dahil olduğu grupları sorgula
    const groups = await Group.find({ members: userId });
    res.status(200).json({ groups });
  } catch (error) {
    console.error('Gruplar alınamadı:', error);
    res.status(500).json({ error: 'Gruplar alınamadı.' });
  }
});

module.exports = router;
