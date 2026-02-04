const { EnergyGridAggregator } = require('./services/aggregator');
const config = require('./config/config');
const fs = require('fs');

async function main() {
  const aggregator = new EnergyGridAggregator(config);
  
  try {
    const results = await aggregator.fetchAll();
    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
    console.log('\nResults saved to results.json');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
