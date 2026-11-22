/**
 * MediTrack DSA Lab - Unit 4: Priority Queue (Binary Heap ADT)
 *
 * Theoretical & Memory Characteristics:
 * - Complete Binary Tree represented as a contiguous array buffer.
 * - Array indexing formulas (0-based):
 *   - Parent of index i: `Math.floor((i - 1) / 2)`
 *   - Left child of index i: `2 * i + 1`
 *   - Right child of index i: `2 * i + 2`
 * - Priority Ordering:
 *   - Default Max-Heap: Highest numerical priority extracted first.
 *   - Supports Min-Heap mode or custom comparator.
 * - FIFO Handling for Equal Priorities:
 *   - Monotonically increasing sequence numbers (`insertOrder`) break priority ties.
 *   - If priorities are identical, the item enqueued earlier is extracted first.
 * - Safe Empty-Queue Operations:
 *   - `dequeue()` and `peek()` throw `QueueUnderflowError` when empty.
 *   - `tryDequeue()`, `tryPeek()`, and `peekPriority()` return `null` safely without throwing.
 * - Domain Application: Biohazard Emergency Triage — prioritizing pathological waste (Yellow)
 *   and sharps (White) over general and cytotoxic waste with strict FIFO dispatch within each priority tier.
 *
 * Complexities:
 * - enqueue: O(log n) time
 * - dequeue: O(log n) time
 * - peek: O(1) time
 * - tryPeek / tryDequeue: O(1) / O(log n) time
 * - isEmpty / size: O(1) time
 * - Space: O(n)
 */

import { QueueUnderflowError } from './linearQueue';

export { QueueUnderflowError };

export type PriorityQueueMode = 'max' | 'min';

export interface PriorityQueueEntry<T> {
  item: T;
  priority: number;
  insertOrder: number;
}

export interface PriorityQueueOptions<T> {
  mode?: PriorityQueueMode;
  comparator?: (a: T, b: T) => number;
}

export class PriorityQueue<T> {
  private heap: PriorityQueueEntry<T>[] = [];
  private sequenceCounter = 0;
  private readonly mode: PriorityQueueMode;
  private readonly customComparator?: (a: T, b: T) => number;

  constructor(options?: PriorityQueueMode | PriorityQueueOptions<T>) {
    if (typeof options === 'string') {
      this.mode = options;
    } else {
      this.mode = options?.mode ?? 'max';
      this.customComparator = options?.comparator;
    }
  }

  /**
   * Evaluates whether entry A has higher precedence than entry B.
   * Enforces strict FIFO tie-breaking when priorities are equal.
   */
  private hasHigherPrecedence(a: PriorityQueueEntry<T>, b: PriorityQueueEntry<T>): boolean {
    if (this.customComparator) {
      const cmp = this.customComparator(a.item, b.item);
      if (cmp !== 0) {
        return this.mode === 'max' ? cmp > 0 : cmp < 0;
      }
    } else if (a.priority !== b.priority) {
      return this.mode === 'max' ? a.priority > b.priority : a.priority < b.priority;
    }

    // Equal priorities: earlier arrival (lower insertOrder) has higher precedence (FIFO)
    return a.insertOrder < b.insertOrder;
  }

  /**
   * Restores heap invariant by bubbling up the element at index.
   * Time Complexity: O(log n)
   */
  private bubbleUp(index: number): void {
    let currentIdx = index;
    while (currentIdx > 0) {
      const parentIdx = Math.floor((currentIdx - 1) / 2);
      if (this.hasHigherPrecedence(this.heap[currentIdx], this.heap[parentIdx])) {
        // Swap current with parent
        const temp = this.heap[currentIdx];
        this.heap[currentIdx] = this.heap[parentIdx];
        this.heap[parentIdx] = temp;
        currentIdx = parentIdx;
      } else {
        break;
      }
    }
  }

  /**
   * Restores heap invariant by sinking down the element at index.
   * Time Complexity: O(log n)
   */
  private sinkDown(index: number): void {
    const length = this.heap.length;
    let currentIdx = index;

    while (true) {
      let candidateIdx = currentIdx;
      const leftChildIdx = 2 * currentIdx + 1;
      const rightChildIdx = 2 * currentIdx + 2;

      if (
        leftChildIdx < length &&
        this.hasHigherPrecedence(this.heap[leftChildIdx], this.heap[candidateIdx])
      ) {
        candidateIdx = leftChildIdx;
      }

      if (
        rightChildIdx < length &&
        this.hasHigherPrecedence(this.heap[rightChildIdx], this.heap[candidateIdx])
      ) {
        candidateIdx = rightChildIdx;
      }

      if (candidateIdx !== currentIdx) {
        const temp = this.heap[currentIdx];
        this.heap[currentIdx] = this.heap[candidateIdx];
        this.heap[candidateIdx] = temp;
        currentIdx = candidateIdx;
      } else {
        break;
      }
    }
  }

  /**
   * Enqueues an item with specified numerical priority.
   * Time Complexity: O(log n)
   */
  enqueue(item: T, priority = 0): void {
    const entry: PriorityQueueEntry<T> = {
      item,
      priority,
      insertOrder: this.sequenceCounter++,
    };
    this.heap.push(entry);
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * Dequeues and returns the highest priority element.
   * Throws QueueUnderflowError if the queue is empty.
   * Time Complexity: O(log n)
   */
  dequeue(): T {
    if (this.isEmpty()) {
      throw new QueueUnderflowError('PriorityQueue Underflow: Queue is empty.');
    }

    const root = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }

    return root.item;
  }

  /**
   * Safe dequeue operation. Returns null if empty instead of throwing.
   * Time Complexity: O(log n)
   */
  tryDequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.dequeue();
  }

  /**
   * Returns the highest priority element without removing it.
   * Throws QueueUnderflowError if the queue is empty.
   * Time Complexity: O(1)
   */
  peek(): T {
    if (this.isEmpty()) {
      throw new QueueUnderflowError('PriorityQueue Underflow: Queue is empty.');
    }
    return this.heap[0].item;
  }

  /**
   * Safe peek operation. Returns null if empty instead of throwing.
   * Time Complexity: O(1)
   */
  tryPeek(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.heap[0].item;
  }

  /**
   * Returns priority number of top element without removing it, or null if empty.
   * Time Complexity: O(1)
   */
  peekPriority(): number | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.heap[0].priority;
  }

  /**
   * Returns root entry ({ item, priority }) without removing it, or null if empty.
   * Time Complexity: O(1)
   */
  peekEntry(): { item: T; priority: number } | null {
    if (this.isEmpty()) {
      return null;
    }
    const root = this.heap[0];
    return { item: root.item, priority: root.priority };
  }

  /**
   * Returns true if queue has no elements.
   * Time Complexity: O(1)
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Returns total number of elements in the priority queue.
   * Time Complexity: O(1)
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * Clears all elements from the priority queue and resets insertion counter.
   */
  clear(): void {
    this.heap = [];
    this.sequenceCounter = 0;
  }

  /**
   * Returns an array of items ordered from highest priority to lowest priority (extraction order).
   * Time Complexity: O(n log n)
   */
  toArray(): T[] {
    const clone = new PriorityQueue<T>({
      mode: this.mode,
      comparator: this.customComparator,
    });
    clone.heap = this.heap.map((entry) => ({ ...entry }));
    clone.sequenceCounter = this.sequenceCounter;

    const result: T[] = [];
    while (!clone.isEmpty()) {
      result.push(clone.dequeue());
    }
    return result;
  }

  /**
   * Returns an array of entries with priority ordered from highest to lowest.
   */
  entries(): { item: T; priority: number }[] {
    const clone = new PriorityQueue<T>({
      mode: this.mode,
      comparator: this.customComparator,
    });
    clone.heap = this.heap.map((entry) => ({ ...entry }));
    clone.sequenceCounter = this.sequenceCounter;

    const result: { item: T; priority: number }[] = [];
    while (!clone.isEmpty()) {
      const top = clone.peekEntry()!;
      clone.dequeue();
      result.push(top);
    }
    return result;
  }
}
