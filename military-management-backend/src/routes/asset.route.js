const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset.model");

router.get('/', async (req, res) => {
    try {
        const data = await Asset.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
