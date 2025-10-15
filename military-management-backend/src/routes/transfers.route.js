const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/rbac');
const transferController = require('../controllers/transfer.controller');

router.post('/', auth, permit('Admin', 'LogisticsOfficer'), transferController.createTransfer);
router.get('/', auth, permit('Admin', 'LogisticsOfficer', 'BaseCommander'), transferController.getTransfers);

module.exports = router;
