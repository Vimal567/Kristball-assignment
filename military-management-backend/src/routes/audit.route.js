const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middleware/auth');
const { getAuditLogs, getAuditLogById } = require('../controllers/auditController');

router.get('/', auth, permit('Admin'), getAuditLogs);
router.get('/:id', auth, permit('Admin'), getAuditLogById);

module.exports = router;
