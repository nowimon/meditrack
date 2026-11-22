import { describe, it, expect } from 'vitest';
import { PriorityQueue, QueueUnderflowError } from '../../src/dsa/queues/priorityQueue';

describe('Unit 4: Priority Queue (Binary Heap ADT)', () => {
  it('should initialize empty with size 0 and safe empty operations', () => {
    const pq = new PriorityQueue<string>();
    expect(pq.isEmpty()).toBe(true);
    expect(pq.size()).toBe(0);
    expect(pq.tryPeek()).toBeNull();
    expect(pq.tryDequeue()).toBeNull();
    expect(pq.peekPriority()).toBeNull();
    expect(pq.peekEntry()).toBeNull();
    expect(pq.toArray()).toEqual([]);
  });

  it('should throw QueueUnderflowError on empty peek or dequeue', () => {
    const pq = new PriorityQueue<number>();
    expect(() => pq.peek()).toThrow(QueueUnderflowError);
    expect(() => pq.dequeue()).toThrow(QueueUnderflowError);
  });

  it('should extract elements in priority order (Max-Heap default)', () => {
    const pq = new PriorityQueue<string>();
    pq.enqueue('Low-Priority Paper', 1);
    pq.enqueue('Critical Biohazard', 10);
    pq.enqueue('Toxic Chemical', 5);
    pq.enqueue('Sharps Container', 8);

    expect(pq.size()).toBe(4);
    expect(pq.peek()).toBe('Critical Biohazard');
    expect(pq.peekPriority()).toBe(10);

    expect(pq.dequeue()).toBe('Critical Biohazard'); // priority 10
    expect(pq.dequeue()).toBe('Sharps Container');   // priority 8
    expect(pq.dequeue()).toBe('Toxic Chemical');    // priority 5
    expect(pq.dequeue()).toBe('Low-Priority Paper'); // priority 1
    expect(pq.isEmpty()).toBe(true);
  });

  it('should strictly enforce FIFO order for elements with equal priority', () => {
    const pq = new PriorityQueue<string>();
    // Four urgent tasks with identical priority 5
    pq.enqueue('Urgent-A', 5);
    pq.enqueue('Urgent-B', 5);
    pq.enqueue('Urgent-C', 5);
    pq.enqueue('Urgent-D', 5);

    expect(pq.size()).toBe(4);
    expect(pq.dequeue()).toBe('Urgent-A');
    expect(pq.dequeue()).toBe('Urgent-B');
    expect(pq.dequeue()).toBe('Urgent-C');
    expect(pq.dequeue()).toBe('Urgent-D');
    expect(pq.isEmpty()).toBe(true);
  });

  it('should maintain FIFO tie-breaking across mixed priorities', () => {
    const pq = new PriorityQueue<string>();
    pq.enqueue('Med-1', 5);
    pq.enqueue('High-1', 9);
    pq.enqueue('Med-2', 5);
    pq.enqueue('High-2', 9);
    pq.enqueue('Low-1', 2);
    pq.enqueue('Med-3', 5);

    expect(pq.dequeue()).toBe('High-1');
    expect(pq.dequeue()).toBe('High-2');
    expect(pq.dequeue()).toBe('Med-1');
    expect(pq.dequeue()).toBe('Med-2');
    expect(pq.dequeue()).toBe('Med-3');
    expect(pq.dequeue()).toBe('Low-1');
  });

  it('should support Min-Heap mode correctly', () => {
    const pq = new PriorityQueue<string>({ mode: 'min' });
    pq.enqueue('Task 30', 30);
    pq.enqueue('Task 10A', 10);
    pq.enqueue('Task 10B', 10);
    pq.enqueue('Task 50', 50);

    expect(pq.peek()).toBe('Task 10A');
    expect(pq.dequeue()).toBe('Task 10A'); // min priority 10, FIFO first
    expect(pq.dequeue()).toBe('Task 10B'); // min priority 10, FIFO second
    expect(pq.dequeue()).toBe('Task 30');  // min priority 30
    expect(pq.dequeue()).toBe('Task 50');  // min priority 50
    expect(pq.isEmpty()).toBe(true);
  });

  it('should support custom comparator function', () => {
    interface WasteItem {
      label: string;
      riskLevel: number;
    }

    const pq = new PriorityQueue<WasteItem>({
      comparator: (a, b) => a.riskLevel - b.riskLevel,
    });

    pq.enqueue({ label: 'Item 1', riskLevel: 3 });
    pq.enqueue({ label: 'Item 2', riskLevel: 9 });
    pq.enqueue({ label: 'Item 3', riskLevel: 6 });

    expect(pq.dequeue().label).toBe('Item 2');
    expect(pq.dequeue().label).toBe('Item 3');
    expect(pq.dequeue().label).toBe('Item 1');
  });

  it('should return toArray and entries in extraction order without mutating heap', () => {
    const pq = new PriorityQueue<string>();
    pq.enqueue('B', 5);
    pq.enqueue('A', 10);
    pq.enqueue('C', 5);
    pq.enqueue('D', 1);

    expect(pq.toArray()).toEqual(['A', 'B', 'C', 'D']);
    expect(pq.size()).toBe(4); // original unchanged
    expect(pq.peek()).toBe('A');

    const entries = pq.entries();
    expect(entries).toEqual([
      { item: 'A', priority: 10 },
      { item: 'B', priority: 5 },
      { item: 'C', priority: 5 },
      { item: 'D', priority: 1 },
    ]);
  });

  it('should clear all items and reset state', () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 10);
    pq.enqueue(2, 20);
    pq.clear();

    expect(pq.isEmpty()).toBe(true);
    expect(pq.size()).toBe(0);
    expect(pq.tryPeek()).toBeNull();
  });

  it('should maintain heap invariant with large pseudo-random insertions', () => {
    const pq = new PriorityQueue<number>();
    const count = 100;
    for (let i = 0; i < count; i++) {
      // Priority between 1 and 20
      const priority = ((i * 17 + 3) % 20) + 1;
      pq.enqueue(i, priority);
    }

    expect(pq.size()).toBe(count);

    let lastPriority = Number.POSITIVE_INFINITY;
    while (!pq.isEmpty()) {
      const topPriority = pq.peekPriority()!;
      expect(topPriority).toBeLessThanOrEqual(lastPriority);
      lastPriority = topPriority;
      pq.dequeue();
    }
  });
});
