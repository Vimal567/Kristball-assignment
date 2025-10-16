const Transfer = require('../models/Transfer.model');
const Asset = require('../models/Asset.model');
const logAction = require('../middleware/audit');

exports.createTransfer = async (req, res) => {
    try {
        const { assetId, fromBaseId, toBaseId, quantity } = req.body;

        if (fromBaseId === toBaseId) {
            return res.status(400).json({ error: 'From and To base cannot be same' });
        }

        // 1. Check if asset exists at the "from" base
        const sourceAsset = await Asset.findOne({
            _id: assetId,
            baseIds: { $in: [fromBaseId] }
        });

        if (!sourceAsset || sourceAsset.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock at from base' });
        }

        // Update quantities
        sourceAsset.quantity -= quantity;

        // 3. Ensure `toBaseId` is present in baseIds (if not, add it)
        if (!sourceAsset.baseIds.some(id => id.toString() === toBaseId)) {
            sourceAsset.baseIds.push(toBaseId);
        }

        await sourceAsset.save();

        // 4. Create transfer record
        const transfer = await Transfer.create({
            assetId,
            fromBaseId,
            toBaseId,
            quantity,
            initiatedBy: req.user._id
        });

        // 5. Log action
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
