const express = require('express');
const router = express.Router();
const { getSeniors,getSenior } = require('../controllers/previousYrBook.controller.js');
const { byPeer } = require("../middlewares/rateLimit");

router.use("/previousYrBook", byPeer(180));
router.get("/previousYrBook/getSeniors", getSeniors);
router.get("/previousYrBook/getSenior/:roll_no", getSenior);

module.exports = router;
