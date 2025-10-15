const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    resourceType: { type: String },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    before: { type: Object },
    after: { type: Object },
    meta: { type: Object },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audit', auditSchema);
