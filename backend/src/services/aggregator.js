const { fetchDeviceData } = require('../utils/api');
const { RateLimitedQueue } = require('../utils/queue');

/**
 * Main aggregator class
 * Handles batching, rate limiting, and error handling
 */
class EnergyGridAggregator {
  constructor(config) {
    this.config = config;
    this.queue = new RateLimitedQueue(config.RATE_LIMIT_MS);
    this.results = [];
    this.errors = [];
  }

  /**
   * Generate serial numbers (SN-000 to SN-499)
   */
  generateSerialNumbers() {
    const serialNumbers = [];
    for (let i = 0; i < this.config.TOTAL_DEVICES; i++) {
      serialNumbers.push(`SN-${String(i).padStart(3, '0')}`);
    }
    return serialNumbers;
  }

  /**
   * Split array into batches
   */
  createBatches(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Fetch data for a single batch with retry logic
   */
  async fetchBatchWithRetry(batch, batchIndex) {
    let attempts = 0;
    
    while (attempts < this.config.MAX_RETRIES) {
      try {
        const result = await this.queue.enqueue(() =>
          fetchDeviceData(this.config.API_URL, this.config.TOKEN, batch)
        );
        
        console.log(`✓ Batch ${batchIndex + 1} completed (${batch.length} devices)`);
        return result.data;
      } catch (error) {
        attempts++;
        console.log(`✗ Batch ${batchIndex + 1} failed (attempt ${attempts}/${this.config.MAX_RETRIES})`);
        
        if (attempts >= this.config.MAX_RETRIES) {
          this.errors.push({ batch, error: error.message || error });
          return null;
        }
        
        // Wait before retry
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  /**
   * Fetch all device data
   */
  async fetchAll() {
    console.log('🚀 Starting EnergyGrid Data Aggregation\n');
    
    // Generate serial numbers
    const serialNumbers = this.generateSerialNumbers();
    console.log(`📋 Generated ${serialNumbers.length} serial numbers`);
    
    // Create batches
    const batches = this.createBatches(serialNumbers, this.config.BATCH_SIZE);
    console.log(`📦 Created ${batches.length} batches (${this.config.BATCH_SIZE} devices each)`);
    console.log(`⏱️  Estimated time: ~${batches.length} seconds\n`);
    
    const startTime = Date.now();
    
    // Process all batches
    for (let i = 0; i < batches.length; i++) {
      const data = await this.fetchBatchWithRetry(batches[i], i);
      if (data) {
        this.results.push(...data);
      }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 AGGREGATION COMPLETE');
    console.log('='.repeat(50));
    console.log(`✓ Successfully fetched: ${this.results.length} devices`);
    console.log(`✗ Failed batches: ${this.errors.length}`);
    console.log(`⏱️  Total time: ${duration}s`);
    console.log('='.repeat(50));
    
    return {
      success: this.results,
      errors: this.errors,
      summary: {
        total: this.config.TOTAL_DEVICES,
        successful: this.results.length,
        failed: this.config.TOTAL_DEVICES - this.results.length,
        duration: `${duration}s`
      }
    };
  }
}

module.exports = { EnergyGridAggregator };
