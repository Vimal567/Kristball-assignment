const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (userId) => {
    return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register user (Admin only)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, baseId } = req.body;

        if (!['Admin', 'BaseCommander', 'LogisticsOfficer'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            passwordHash,
            role,
            baseId: baseId || null
        });

        res.status(201).json({ message: 'User created successfully', userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                baseId: user.baseId
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};