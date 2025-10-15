const Audit = require('../models/Audit.model');

const logAction = async ({ userId, action, resourceType, resourceId, before, after, meta }) => {
    await Audit.create({ userId, action, resourceType, resourceId, before, after, meta });
};

module.exports = logAction;
