const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/rbac');
const expenditureController = require('../controllers/expenditure.controller');

router.post('/', auth, permit('Admin', 'LogisticsOfficer'), expenditureController.createExpenditure);
router.get('/', auth, permit('Admin', 'LogisticsOfficer'), expenditureController.getExpenditures);

module.exports = router;
