/**
 * Rate-limited queue processor
 * Ensures requests are sent with proper spacing (1 req/sec)
 */
class RateLimitedQueue {
  constructor(rateLimitMs) {
    this.rateLimitMs = rateLimitMs;
    this.queue = [];
    this.processing = false;
    this.lastRequestTime = 0;
  }

  /**
   * Add a task to the queue
   * Returns a promise that resolves when the task completes
   */
  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process queue items one at a time with rate limiting
   */
  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const { task, resolve, reject } = this.queue.shift();

    // Calculate wait time to respect rate limit
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const waitTime = Math.max(0, this.rateLimitMs - timeSinceLastRequest);

    // Wait if needed
    if (waitTime > 0) {
      await new Promise(r => setTimeout(r, waitTime));
    }

    // Execute the task
    try {
      this.lastRequestTime = Date.now();
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // Process next item
    this.processQueue();
  }
}

module.exports = { RateLimitedQueue };
