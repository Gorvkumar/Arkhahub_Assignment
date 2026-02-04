class RateLimitedQueue {
  constructor(rateLimitMs) {
    this.rateLimitMs = rateLimitMs;
    this.queue = [];
    this.processing = false;
    this.lastRequestTime = 0;
  }

  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const { task, resolve, reject } = this.queue.shift();

    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const waitTime = Math.max(0, this.rateLimitMs - timeSinceLastRequest);

    if (waitTime > 0) {
      await new Promise(r => setTimeout(r, waitTime));
    }

    try {
      this.lastRequestTime = Date.now();
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    }

    this.processQueue();
  }
}

module.exports = { RateLimitedQueue };
