const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
    assignedTo: { type: String, required: true },
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    quantity: { type: Number, required: true },
    reason: { type: String, enum: ['Used', 'Damaged', 'Expired'], required: true },
    dateExpended: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expenditure', expenditureSchema);
