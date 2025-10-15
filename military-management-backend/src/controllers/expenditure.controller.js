const Expenditure = require('../models/Expenditure.model');
const Asset = require('../models/Asset.model');
const Base = require('../models/Base.model');
const logAction = require('../middleware/audit');

exports.createExpenditure = async (req, res) => {
    try {
        const { assignedTo, assetId, quantity, reason } = req.body;

        const asset = await Asset.findOne({ _id: assetId });
        if (!asset || asset.quantity < quantity)
            return res.status(400).json({ error: 'Insufficient stock to expend' });

        asset.quantity -= quantity;
        await asset.save();

        const expenditure = await Expenditure.create({ assignedTo, assetId, quantity, reason });

        await logAction({
            userId: req.user._id,
            action: 'create_expenditure',
            resourceType: 'Expenditure',
            resourceId: expenditure._id,
            before: { assetQuantity: asset.quantity + quantity },
            after: expenditure
        });

        res.status(201).json(expenditure);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getExpenditures = async (req, res) => {
    try {
        const expenditures = await Expenditure.find()
            .populate({
                path: 'assetId',
                model: Asset,
                populate: {
                    path: 'baseIds',
                    model: Base
                }
            });

        res.json(expenditures);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
