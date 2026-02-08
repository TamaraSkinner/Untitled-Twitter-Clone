const express = require('express');
const router = express.Router();
const authenticateWiz = require('../middleware/auth.middlewear.js');
const { incantifySpell } = require('../controllers/ai.controller.js');
const { castSpell } = require('../controllers/spell.controller.js');
const { Post } = require('../models/Posts.js');

router.post('/cast', authenticateWiz, castSpell);
router.post('/incantify', authenticateWiz, incantifySpell);

router.get('/feed', authenticateWiz, async (req, res) => {
    try {
        const spells = await Post.find();
        res.json(spells);
    } catch (error) {
        console.error('Error fetching spell feed:', error);
        res.status(500).json({ message: 'The grand archives are inaccessible at this moment', error: error.message });
    }
});

module.exports = router;