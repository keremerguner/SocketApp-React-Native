// models/Group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupCode: { type: String, required: true, unique: true },
  groupName: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Grubu oluşturan kullanıcı
});

module.exports = mongoose.model('Group', groupSchema);
