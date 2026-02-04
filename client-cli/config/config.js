require('dotenv').config();

module.exports = {
  API_URL: process.env.API_URL || 'http://localhost:3000/device/real/query',
  TOKEN: process.env.TOKEN || 'interview_token_123',
  RATE_LIMIT_MS: parseInt(process.env.RATE_LIMIT_MS || '1000', 10),
  BATCH_SIZE: parseInt(process.env.BATCH_SIZE || '10', 10),
  TOTAL_DEVICES: parseInt(process.env.TOTAL_DEVICES || '500', 10),
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES || '3', 10)
};
