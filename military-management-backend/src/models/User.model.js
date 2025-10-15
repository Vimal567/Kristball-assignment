const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'BaseCommander', 'LogisticsOfficer'], required: true },
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
