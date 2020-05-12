const express = require('express');
const router = express.Router();

router.post('/create', authenticate)
router.post('/delete', register)


module.exports = router