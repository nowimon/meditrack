import { describe, it, expect } from 'vitest';
import { LinearQueue, QueueUnderflowError } from '../../src/dsa/queues/linearQueue';

describe('Unit 4: Linear Queue (FIFO)', () => {
  it('should initialize empty with size 0', () => {
    const q = new LinearQueue<number>();
    expect(q.isEmpty()).toBe(true);
    expect(q.size()).toBe(0);
    expect(q.tryPeek()).toBeNull();
  });

  it('should enqueue and dequeue in strict FIFO order', () => {
    const q = new LinearQueue<string>();
    q.enqueue('Req-A');
    q.enqueue('Req-B');
    q.enqueue('Req-C');

    expect(q.size()).toBe(3);
    expect(q.peek()).toBe('Req-A');
    expect(q.dequeue()).toBe('Req-A');
    expect(q.dequeue()).toBe('Req-B');
    expect(q.dequeue()).toBe('Req-C');
    expect(q.isEmpty()).toBe(true);
  });

  it('should throw QueueUnderflowError on empty dequeue or peek', () => {
    const q = new LinearQueue<number>();
    expect(() => q.dequeue()).toThrow(QueueUnderflowError);
    expect(() => q.peek()).toThrow(QueueUnderflowError);
  });

  it('should compact and maintain integrity across repeated operations', () => {
    const q = new LinearQueue<number>();
    for (let i = 0; i < 150; i++) {
      q.enqueue(i);
    }
    expect(q.size()).toBe(150);

    for (let i = 0; i < 100; i++) {
      expect(q.dequeue()).toBe(i);
    }
    expect(q.size()).toBe(50);
    expect(q.peek()).toBe(100);

    q.clear();
    expect(q.isEmpty()).toBe(true);
  });
});
