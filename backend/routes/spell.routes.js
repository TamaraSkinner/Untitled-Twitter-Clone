const express = require('express');
const router = express.Router();
const authenticateWiz = require('../middleware/auth.middlewear.js');

router.post('/cast', authenticateWiz, (req, res) => {
    res.json({ message: `Spell cast successfully by ${req.wizard.username}!` });
});

module.exports = router;