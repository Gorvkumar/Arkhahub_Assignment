const express = require('express');
const router = express.Router();
const {
  getStatus,
  startAggregation,
  getResults,
  getStats
} = require('../controllers/aggregationController');

// API Routes
router.get('/status', getStatus);
router.post('/aggregate', startAggregation);
router.get('/results', getResults);
router.get('/stats', getStats);

module.exports = router;
