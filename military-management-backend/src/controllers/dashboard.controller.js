const Asset = require('../models/Asset.model');
const Purchase = require('../models/Purchase.model');
const Transfer = require('../models/Transfer.model');
const Expenditure = require('../models/Expenditure.model');

exports.getSummary = async (req, res) => {
    try {
        const { baseId, assetType } = req.query;

        const query = {};
        let asset;

        if (baseId) {
            query["baseIds"] = baseId;
        }
        if (assetType) {
            asset = await Asset.findOne({ type: assetType });
            query["assetId"] = asset._id;
        }

        const purchases = await Purchase.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        const transfersIn = await Transfer.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        const transfersOut = await Transfer.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        const expenditures = await Expenditure.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        const openingBalance = asset?.quantity ?? 100;
        const netMovement = (purchases[0]?.total ?? 0) + (transfersIn[0]?.total ?? 0) - (transfersOut[0]?.total ?? 0);
        const closingBalance = openingBalance + netMovement - (expenditures[0]?.total ?? 0);

        res.json({
            openingBalance,
            purchases: purchases[0]?.total ?? 0,
            transfersIn: transfersIn[0]?.total ?? 0,
            transfersOut: transfersOut[0]?.total ?? 0,
            expenditures: expenditures[0]?.total ?? 0,
            netMovement,
            closingBalance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
