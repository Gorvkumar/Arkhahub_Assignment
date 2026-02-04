# EnergyGrid CLI Tool

Command-line tool to fetch telemetry from 500 solar inverters.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` to configure:
- `API_URL`: The EnergyGrid API endpoint
- `TOKEN`: Your authentication token
- `RATE_LIMIT_MS`: Milliseconds between requests (default: 1000)
- `BATCH_SIZE`: Number of devices per batch (default: 10)
- `TOTAL_DEVICES`: Total number of devices to query (default: 500)
- `MAX_RETRIES`: Maximum retry attempts per batch (default: 3)

## Usage

```bash
npm start
```

Results are saved to `results.json`

## Deployment to Render

This CLI tool can be deployed to Render as a cron job or background worker:

1. Create a new **Background Worker** or **Cron Job** on Render
2. Connect your repository
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Add environment variables in Render dashboard:
   - `API_URL`
   - `TOKEN`
   - `RATE_LIMIT_MS` (optional)
   - `BATCH_SIZE` (optional)
   - `TOTAL_DEVICES` (optional)
   - `MAX_RETRIES` (optional)

For cron jobs, set your desired schedule (e.g., `0 */6 * * *` for every 6 hours).


