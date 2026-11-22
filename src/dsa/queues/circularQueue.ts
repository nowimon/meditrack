/**
 * MediTrack DSA Lab - Unit 4: Circular Queue (Ring Buffer)
 *
 * Theoretical & Memory Characteristics:
 * - Fixed-capacity circular memory buffer utilizing modulo arithmetic for index wrap-around.
 * - Solves the "False Overflow" issue of linear queues where freed slots at the front
 *   could not be reused without shifting.
 * - Empty vs Full distinction:
 *   - Empty: `count === 0` (or `front === -1`)
 *   - Full: `count === capacity` (or `(rear + 1) % capacity === front`)
 * - Modulo arithmetic:
 *   - Next rear index: `(rear + 1) % capacity`
 *   - Next front index: `(front + 1) % capacity`
 * - MediTrack Domain Application: Fixed-size IoT sensor telemetry buffer capturing fill-level and temperature readings
 *   from medical-waste autoclaves and collection bins.
 * - Viva Question: "How does a Circular Queue solve the False Overflow problem?"
 *   Answer: In a linear queue, when elements are dequeued, the space before `front` is wasted. Even if only 1 element
 *   remains at `rear = capacity - 1`, the queue reports full on the next enqueue. A Circular Queue wraps `rear`
 *   around to index 0 via `(rear + 1) % capacity`, reusing the freed memory slots.
 *
 * Complexities:
 * - enqueue: O(1) time, O(1) space
 * - dequeue: O(1) time, O(1) space
 * - peek: O(1) time, O(1) space
 * - isEmpty / isFull / size: O(1) time
 */

import { QueueUnderflowError } from './linearQueue';

export class QueueOverflowError extends Error {
  constructor(message = 'Queue Overflow: Attempted to enqueue into a full circular queue.') {
    super(message);
    this.name = 'QueueOverflowError';
  }
}

export class CircularQueue<T> {
  private buffer: (T | null)[];
  private readonly maxCapacity: number;
  private front = 0;
  private rear = -1;
  private count = 0;

  constructor(capacity: number) {
    if (capacity <= 0 || !Number.isInteger(capacity)) {
      throw new Error('Circular queue capacity must be a positive integer.');
    }
    this.maxCapacity = capacity;
    this.buffer = new Array<T | null>(capacity).fill(null);
  }

  /**
   * Enqueues an element at the rear index with circular wrap-around.
   * Throws QueueOverflowError if full.
   * Time Complexity: O(1)
   */
  enqueue(item: T): void {
    if (this.isFull()) {
      throw new QueueOverflowError(
        `Queue Overflow: Capacity of ${this.maxCapacity} elements is full.`
      );
    }

    this.rear = (this.rear + 1) % this.maxCapacity;
    this.buffer[this.rear] = item;
    this.count++;
  }

  /**
   * Dequeues and returns the front element with circular wrap-around.
   * Throws QueueUnderflowError if empty.
   * Time Complexity: O(1)
   */
  dequeue(): T {
    if (this.isEmpty()) {
      throw new QueueUnderflowError();
    }

    const item = this.buffer[this.front] as T;
    this.buffer[this.front] = null; // Clear slot
    this.front = (this.front + 1) % this.maxCapacity;
    this.count--;

    if (this.count === 0) {
      this.front = 0;
      this.rear = -1;
    }

    return item;
  }

  /**
   * Returns front element without removing it.
   */
  peek(): T {
    if (this.isEmpty()) {
      throw new QueueUnderflowError();
    }
    return this.buffer[this.front] as T;
  }

  tryPeek(): T | null {
    if (this.isEmpty()) return null;
    return this.buffer[this.front] as T;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  isFull(): boolean {
    return this.count === this.maxCapacity;
  }

  size(): number {
    return this.count;
  }

  capacity(): number {
    return this.maxCapacity;
  }

  getFrontIndex(): number {
    return this.front;
  }

  getRearIndex(): number {
    return this.rear;
  }

  /**
   * Returns array of active elements in logical FIFO order from front to rear.
   */
  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.count; i++) {
      const idx = (this.front + i) % this.maxCapacity;
      result.push(this.buffer[idx] as T);
    }
    return result;
  }

  /**
   * Returns raw internal buffer slots for visualization (including nulls).
   */
  getRawBuffer(): (T | null)[] {
    return [...this.buffer];
  }

  clear(): void {
    this.buffer = new Array<T | null>(this.maxCapacity).fill(null);
    this.front = 0;
    this.rear = -1;
    this.count = 0;
  }
}
