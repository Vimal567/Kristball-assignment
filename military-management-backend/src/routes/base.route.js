const express = require("express");
const router = express.Router();
const Base = require("../models/Base.model");

router.get('/', async (req, res) => {
    try {
        const data = await Base.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
