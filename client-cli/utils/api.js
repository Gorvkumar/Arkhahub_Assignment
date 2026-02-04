const http = require('http');
const { URL } = require('url');
const { generateSignature } = require('./signature');

async function fetchDeviceData(apiUrl, token, serialNumbers) {
  const url = new URL(apiUrl);
  const timestamp = Date.now().toString();
  const signature = generateSignature(url.pathname, token, timestamp);

  const payload = JSON.stringify({ sn_list: serialNumbers });

  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'signature': signature,
      'timestamp': timestamp
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject({ statusCode: res.statusCode, message: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

module.exports = { fetchDeviceData };
