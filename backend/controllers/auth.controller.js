const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, UserBuilder} = require('../models/User.js');

const SALT_ROUNDS = 10;

exports.registerWizard = async (req, res) => {
    const { wizardname, email, password } = req.body;

    if (!wizardname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    try {
        const existingwizard = await User.getByEmail(email);
        if (existingwizard) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        
        // Hash the password and save the new user
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = new UserBuilder()
            .setInfo(null, wizardname, email, hashedPassword)
            .build();
        const userId = await newUser.save();
        res.status(201).json({ message: 'User created successfully', wizard : { id: userId, wizardname, email} });
    } catch (error) {
        // Rollback is handled in the User model's save method, so we just need to catch the error here
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

exports.loginWizard = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const wizard = await User.getByEmail(email);
        if (!wizard) {
            return res.status(404).json({ message: 'Wizard not found in ' });
        }
        const isPasswordValid = await bcrypt.compare(password, wizard.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid incantation' });
        }
        const token = jwt.sign({ id: wizard.id, wizardname: wizard.wizardname, email: wizard.email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

exports.getWizard = async (req, res) => {
    try {
        const wizard = await User.getByEmail(req.wizard.email);
        if (!wizard) {
            return res.status(404).json({ message: 'Wizard not found' });
        }
        res.json({ id: wizard.id, wizardname: wizard.username, email: wizard.email });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wizard data', error: error.message });
    }   
};