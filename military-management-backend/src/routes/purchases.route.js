const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/rbac');
const purchaseController = require('../controllers/purchases.controller');

router.post('/', auth, permit('Admin', 'BaseCommander', 'LogisticsOfficer'), purchaseController.createPurchase);
router.get('/', auth, permit('Admin', 'BaseCommander', 'LogisticsOfficer'), purchaseController.getPurchases);

module.exports = router;
