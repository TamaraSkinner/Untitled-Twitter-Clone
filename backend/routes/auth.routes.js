const express = require('express');
const router = express.Router();

const authenticateWiz = require('../middleware/auth.middlewear.js');
const { registerWizard, loginWizard, getWizard} = require('../controllers/auth.controller.js');

router.post('/register', registerWizard);
router.post('/login', loginWizard);
router.get('/user', authenticateWiz, getWizard);



module.exports = router;