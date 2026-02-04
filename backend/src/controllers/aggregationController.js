const { EnergyGridAggregator } = require('../services/aggregator');
const config = require('../config/config');

let aggregationInProgress = false;
let currentProgress = { completed: 0, total: 0, status: 'idle' };
let latestResults = null;

/**
 * Get current aggregation status
 */
const getStatus = (req, res) => {
  res.json({
    inProgress: aggregationInProgress,
    progress: currentProgress,
    hasResults: latestResults !== null
  });
};

/**
 * Start data aggregation process
 */
const startAggregation = async (req, res) => {
  if (aggregationInProgress) {
    return res.status(409).json({ error: 'Aggregation already in progress' });
  }

  aggregationInProgress = true;
  currentProgress = { completed: 0, total: 50, status: 'running' };
  
  res.json({ message: 'Aggregation started', total: 50 });

  // Run aggregation in background
  const aggregator = new EnergyGridAggregator(config);
  
  // Override console.log to track progress
  const originalLog = console.log;
  console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes(' Batch') && message.includes('completed')) {
      const match = message.match(/Batch (\d+)/);
      if (match) {
        currentProgress.completed = parseInt(match[1]);
      }
    }
    originalLog(...args);
  };

  try {
    const results = await aggregator.fetchAll();
    latestResults = results;
    currentProgress.status = 'completed';
  } catch (error) {
    currentProgress.status = 'error';
    console.error('Aggregation error:', error);
  } finally {
    aggregationInProgress = false;
    console.log = originalLog;
  }
};

/**
 * Get aggregation results
 */
const getResults = (req, res) => {
  if (!latestResults) {
    return res.status(404).json({ error: 'No results available' });
  }
  res.json(latestResults);
};

/**
 * Get device statistics
 */
const getStats = (req, res) => {
  if (!latestResults) {
    return res.status(404).json({ error: 'No results available' });
  }

  const devices = latestResults.success;
  const online = devices.filter(d => d.status === 'Online').length;
  const offline = devices.filter(d => d.status === 'Offline').length;
  
  const totalPower = devices.reduce((sum, d) => {
    return sum + parseFloat(d.power);
  }, 0);

  const avgPower = (totalPower / devices.length).toFixed(2);

  res.json({
    total: devices.length,
    online,
    offline,
    totalPower: totalPower.toFixed(2),
    avgPower,
    uptime: ((online / devices.length) * 100).toFixed(1)
  });
};

module.exports = {
  getStatus,
  startAggregation,
  getResults,
  getStats
};
