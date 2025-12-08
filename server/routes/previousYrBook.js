const express = require('express');
const router = express.Router();
const { getSeniors,getSenior } = require('../controllers/previousYrBook.controller.js');

router.get("/previousYrBook/getSeniors", getSeniors);
router.get("/previousYrBook/getSenior/:roll_no", getSenior);

module.exports = router;
