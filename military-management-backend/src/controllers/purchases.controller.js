const Purchase = require('../models/Purchase.model');
const Asset = require('../models/Asset.model');
const logAction = require('../middleware/audit');

// Create a new purchase
exports.createPurchase = async (req, res) => {
    try {
        const { assetId, baseId, quantity } = req.body;

        if (!assetId || !baseId || !quantity || quantity <= 0) {
            return res.status(400).json({ error: 'assetId, baseId, and quantities are required' });
        }

        // Check if asset is available in the base
        let asset = await Asset.findOne({ _id: assetId });
        if (!asset.baseIds.find(base => base._id == baseId)) {
            return res.status(404).json({ error: 'Asset not found in this base' });
        }

        // Update asset quantity
        const beforeQuantity = asset.quantity;
        asset.quantity += quantity;
        await asset.save();

        // Save purchase record
        const purchase = await Purchase.create({
            assetId,
            baseId,
            quantity,
            addedBy: req.user._id
        });

        // Audit log
        await logAction({
            userId: req.user._id,
            action: 'create_purchase',
            resourceType: 'Purchase',
            resourceId: purchase._id,
            before: { assetQuantity: beforeQuantity },
            after: { assetQuantity: asset.quantity }
        });

        res.status(201).json(purchase);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all purchases (with optional filters: baseId, assetId, date range)
exports.getPurchases = async (req, res) => {
    try {
        const { baseId, assetType, startDate, endDate } = req.query;

        let filter = {};

        if (baseId) { 
            filter.baseId = baseId; 
        }

        if (startDate || endDate) {
            filter.purchaseDate = {};
            if (startDate) {
                filter.purchaseDate.$gte = new Date(startDate); // MM/DD/YYYY
            }
            if (endDate) {
                filter.purchaseDate.$lte = new Date(endDate); // MM/DD/YYYY
            }
        }

        // If assetType is provided, find asset IDs with that type
        if (assetType) {
            const assets = await Asset.find({ type: assetType }).select('_id');
            const assetIds = assets.map(a => a._id);
            filter.assetId = { $in: assetIds };
        }

        const purchases = await Purchase.find(filter)
            .populate('assetId', 'name type')
            .populate('baseId', 'name location')
            .populate('addedBy', 'name email')
            .sort({ purchaseDate: -1 });

        res.json(purchases);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

