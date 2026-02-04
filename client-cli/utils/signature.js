const crypto = require('crypto');

function generateSignature(url, token, timestamp) {
  const data = url + token + timestamp;
  return crypto.createHash('md5').update(data).digest('hex');
}

module.exports = { generateSignature };
