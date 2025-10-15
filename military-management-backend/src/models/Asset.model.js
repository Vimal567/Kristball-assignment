const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Weapon', 'Vehicle', 'Ammunition'], required: true },
    baseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true }],
    quantity: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
