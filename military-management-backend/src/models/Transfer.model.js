const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    fromBaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    toBaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    quantity: { type: Number, required: true },
    transferDate: { type: Date, default: Date.now },
    initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);
