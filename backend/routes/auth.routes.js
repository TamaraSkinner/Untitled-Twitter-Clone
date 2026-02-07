const express = require('express');
const router = express.Router();

const { registerWizard, loginWizard, logoutWizard} = require('../controllers/auth.controller.js');

router.post('/register', registerWizard);
router.post('/login', loginWizard);
routet.post('/logout', logoutWizard);

module.exports = router;