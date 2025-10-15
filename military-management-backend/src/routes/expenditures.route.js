const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/rbac');
const expenditureController = require('../controllers/expenditure.controller');

router.post('/', auth, permit('Admin', 'BaseCommander'), expenditureController.createExpenditure);
router.get('/', auth, permit('Admin', 'BaseCommander', 'LogisticsOfficer'), expenditureController.getExpenditures);

module.exports = router;
