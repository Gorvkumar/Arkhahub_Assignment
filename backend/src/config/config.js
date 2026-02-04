// Configuration for EnergyGrid API
module.exports = {
  API_URL: process.env.API_URL || 'http://localhost:3000/device/real/query',
  TOKEN: process.env.TOKEN || 'interview_token_123',
  RATE_LIMIT_MS: 1000,        // 1 request per second
  BATCH_SIZE: 10,              // Max 10 devices per request
  TOTAL_DEVICES: 500,          // Total devices to query
  MAX_RETRIES: 3,              // Retry attempts for failed requests
  SERVER_PORT: process.env.PORT || 5000  // Backend server port
};
