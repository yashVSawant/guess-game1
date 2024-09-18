const express = require('express');

const controller = require('../controllers/user');

const router = express.Router();

router.get('/info',controller.info);
router.get('/leaderboard/:type',controller.topTenHighestScore);
router.get('/score',controller.pastScores);

module.exports = router;