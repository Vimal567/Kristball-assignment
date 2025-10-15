const Transfer = require('../models/Transfer.model');
const Asset = require('../models/Asset.model');
const logAction = require('../middleware/audit');

exports.createTransfer = async (req, res) => {
    try {
        const { assetId, fromBaseId, toBaseId, quantity } = req.body;

        if (fromBaseId === toBaseId) return res.status(400).json({ error: 'From and To base cannot be same' });

        const sourceAsset = await Asset.findOne({ _id: assetId, baseId: fromBaseId });

        // Check fromBase has enough quantity
        if (!sourceAsset || sourceAsset.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock at from base' });
        }

        // Update quantities
        sourceAsset.quantity -= quantity;
        await sourceAsset.save();

        // Save transfer record
        const transfer = await Transfer.create({
            assetId, fromBaseId, toBaseId, quantity, initiatedBy: req.user._id
        });

        // Audit log
        await logAction({
            userId: req.user._id,
            action: 'create_transfer',
            resourceType: 'Transfer',
            resourceId: transfer._id,
            after: transfer
        });

        res.status(201).json(transfer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getTransfers = async (req, res) => {
    try {
        const transfers = await Transfer.find().populate('assetId fromBaseId toBaseId initiatedBy');
        res.json(transfers);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
