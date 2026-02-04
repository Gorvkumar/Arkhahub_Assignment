# EnergyGrid Mock API

Mock server for testing the EnergyGrid Data Aggregator.

## Setup

```bash
npm install
npm start
```

Server runs on http://localhost:3000

## API Details

- **Endpoint:** `POST /device/real/query`
- **Token:** `interview_token_123`
- **Rate Limit:** 1 req/sec
- **Batch Size:** Max 10 devices

## Headers Required

- `signature`: MD5(URL + Token + Timestamp)
- `timestamp`: Current time in milliseconds

