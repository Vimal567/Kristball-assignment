const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/rbac');
const dashboardController = require('../controllers/dashboard.controller');

router.get('/summary', auth, permit('Admin', 'BaseCommander', 'LogisticsOfficer'), dashboardController.getSummary);

module.exports = router;
