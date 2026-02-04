const crypto = require('crypto');

/**
 * Generate MD5 signature for API authentication
 * Formula: MD5(URL + Token + Timestamp)
 */
function generateSignature(url, token, timestamp) {
  const data = url + token + timestamp;
  return crypto.createHash('md5').update(data).digest('hex');
}

module.exports = { generateSignature };
