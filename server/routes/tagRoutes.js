const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.get('/', tagController.getTags);
router.post('/add', tagController.addTags);

module.exports = router;
