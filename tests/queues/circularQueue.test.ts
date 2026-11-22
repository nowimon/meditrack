import { describe, it, expect } from 'vitest';
import { CircularQueue, QueueOverflowError } from '../../src/dsa/queues/circularQueue';
import { QueueUnderflowError } from '../../src/dsa/queues/linearQueue';

describe('Unit 4: Circular Queue (Ring Buffer)', () => {
  it('should initialize empty with valid capacity', () => {
    const cq = new CircularQueue<number>(5);
    expect(cq.isEmpty()).toBe(true);
    expect(cq.isFull()).toBe(false);
    expect(cq.size()).toBe(0);
    expect(cq.capacity()).toBe(5);
    expect(cq.tryPeek()).toBeNull();

    expect(() => new CircularQueue<number>(0)).toThrow();
    expect(() => new CircularQueue<number>(-2)).toThrow();
  });

  it('should enqueue up to capacity and throw QueueOverflowError', () => {
    const cq = new CircularQueue<string>(3);
    cq.enqueue('Temp-1');
    cq.enqueue('Temp-2');
    cq.enqueue('Temp-3');

    expect(cq.size()).toBe(3);
    expect(cq.isFull()).toBe(true);
    expect(() => cq.enqueue('Temp-4')).toThrow(QueueOverflowError);
  });

  it('should dequeue elements in FIFO order and throw QueueUnderflowError', () => {
    const cq = new CircularQueue<number>(3);
    cq.enqueue(10);
    cq.enqueue(20);

    expect(cq.peek()).toBe(10);
    expect(cq.dequeue()).toBe(10);
    expect(cq.dequeue()).toBe(20);
    expect(cq.isEmpty()).toBe(true);

    expect(() => cq.dequeue()).toThrow(QueueUnderflowError);
    expect(() => cq.peek()).toThrow(QueueUnderflowError);
  });

  it('should correctly wrap around indices and maintain FIFO order', () => {
    // Capacity 3
    const cq = new CircularQueue<string>(3);
    cq.enqueue('A'); // index 0
    cq.enqueue('B'); // index 1
    cq.enqueue('C'); // index 2 -> full

    expect(cq.isFull()).toBe(true);
    expect(cq.getRearIndex()).toBe(2);
    expect(cq.getFrontIndex()).toBe(0);

    // Dequeue 2 items (frees slots at 0 and 1)
    expect(cq.dequeue()).toBe('A');
    expect(cq.dequeue()).toBe('B');
    expect(cq.size()).toBe(1);
    expect(cq.getFrontIndex()).toBe(2);

    // Enqueue 2 new items (must wrap around to slots 0 and 1)
    cq.enqueue('D'); // wraps to index 0
    cq.enqueue('E'); // wraps to index 1

    expect(cq.isFull()).toBe(true);
    expect(cq.getRearIndex()).toBe(1);
    expect(cq.getFrontIndex()).toBe(2);

    // Verify logical order: 'C', then 'D', then 'E'
    expect(cq.toArray()).toEqual(['C', 'D', 'E']);

    // Dequeue all and verify sequence
    expect(cq.dequeue()).toBe('C');
    expect(cq.dequeue()).toBe('D');
    expect(cq.dequeue()).toBe('E');
    expect(cq.isEmpty()).toBe(true);
  });

  it('should clear buffer and reset front/rear pointers', () => {
    const cq = new CircularQueue<number>(4);
    cq.enqueue(1);
    cq.enqueue(2);
    cq.clear();

    expect(cq.isEmpty()).toBe(true);
    expect(cq.size()).toBe(0);
    expect(cq.getFrontIndex()).toBe(0);
    expect(cq.getRearIndex()).toBe(-1);
  });
});
