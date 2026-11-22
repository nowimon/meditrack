/**
 * MediTrack DSA Lab - Unit 4: Linear FIFO Queue
 *
 * Theoretical & Memory Characteristics:
 * - First-In, First-Out (FIFO) Abstract Data Type.
 * - Elements are inserted at `rear` and removed from `front`.
 * - Models standard chronological waste pickup requests where hospitals are serviced in order of submission.
 * - Viva Question: "Why does an array-based queue suffer from 'false overflow' or O(n) dequeue if not implemented carefully?"
 *   Answer: If `dequeue()` simply increments a `front` pointer in a fixed array, previously vacated memory
 *   at the beginning cannot be reused, causing the queue to appear full even when empty slots exist.
 *   This issue directly motivates the Circular Queue.
 *
 * Complexities:
 * - enqueue: O(1) amortized
 * - dequeue: O(1) amortized
 * - peek / front: O(1)
 * - isEmpty / size: O(1)
 */

export class QueueUnderflowError extends Error {
  constructor(message = 'Queue Underflow: Attempted to dequeue or peek from an empty queue.') {
    super(message);
    this.name = 'QueueUnderflowError';
  }
}

export class LinearQueue<T> {
  private items: T[] = [];
  private frontIndex = 0;

  /**
   * Enqueues an element to the rear of the queue.
   * Time Complexity: O(1)
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Dequeues and returns the element from the front.
   * Throws QueueUnderflowError if empty.
   * Time Complexity: O(1) amortized (with periodic compaction)
   */
  dequeue(): T {
    if (this.isEmpty()) {
      throw new QueueUnderflowError();
    }

    const item = this.items[this.frontIndex];
    this.frontIndex++;

    // Periodic memory compaction when dead slots exceed threshold
    if (this.frontIndex > 64 && this.frontIndex * 2 >= this.items.length) {
      this.items = this.items.slice(this.frontIndex);
      this.frontIndex = 0;
    }

    return item;
  }

  /**
   * Returns the front element without removing it.
   * Throws QueueUnderflowError if empty.
   */
  peek(): T {
    if (this.isEmpty()) {
      throw new QueueUnderflowError();
    }
    return this.items[this.frontIndex];
  }

  tryPeek(): T | null {
    if (this.isEmpty()) return null;
    return this.items[this.frontIndex];
  }

  isEmpty(): boolean {
    return this.frontIndex >= this.items.length;
  }

  size(): number {
    return this.items.length - this.frontIndex;
  }

  clear(): void {
    this.items = [];
    this.frontIndex = 0;
  }

  toArray(): T[] {
    return this.items.slice(this.frontIndex);
  }
}
