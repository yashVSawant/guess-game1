const express = require('express');

const controller = require('../controllers/game');

const router = express.Router();

router.post('/',controller.startGame);
router.put('/:id',controller.addScore);
router.put('/end/:id',controller.endGame);

module.exports = router;