import { describe, it, expect } from 'vitest';
import { CircularLinkedList } from '../../src/dsa/linkedLists/circularLinkedList';

describe('Unit 3: Circular Linked List', () => {
  it('should initialize empty and maintain circular integrity', () => {
    const cll = new CircularLinkedList<string>();
    expect(cll.isEmpty()).toBe(true);
    expect(cll.size()).toBe(0);
    expect(cll.toArray()).toEqual([]);
    expect(cll.isCircularIntact()).toBe(true);
  });

  it('should handle single-element insertion with self-referencing cycle', () => {
    const cll = new CircularLinkedList<string>();
    cll.insertAtBeginning('VAN-01');

    expect(cll.size()).toBe(1);
    expect(cll.getHead()).toBe('VAN-01');
    expect(cll.getTail()).toBe('VAN-01');
    expect(cll.toArray()).toEqual(['VAN-01']);
    expect(cll.isCircularIntact()).toBe(true);
  });

  it('should preserve circular links upon insertAtBeginning and insertAtEnd', () => {
    const cll = new CircularLinkedList<string>();
    cll.insertAtEnd('VAN-01');
    cll.insertAtEnd('VAN-02');
    cll.insertAtBeginning('VAN-00');

    expect(cll.size()).toBe(3);
    expect(cll.toArray()).toEqual(['VAN-00', 'VAN-01', 'VAN-02']);
    expect(cll.getHead()).toBe('VAN-00');
    expect(cll.getTail()).toBe('VAN-02');
    expect(cll.isCircularIntact()).toBe(true);
  });

  it('should insert at valid and invalid positions and preserve circularity', () => {
    const cll = new CircularLinkedList<number>();
    cll.insertAtPosition(10, 0); // At head
    cll.insertAtPosition(30, 1); // At tail
    cll.insertAtPosition(20, 1); // In middle

    expect(cll.toArray()).toEqual([10, 20, 30]);
    expect(cll.isCircularIntact()).toBe(true);

    // Out of bounds
    expect(cll.insertAtPosition(999, -1)).toBe(false);
    expect(cll.insertAtPosition(999, 10)).toBe(false);
  });

  it('should delete at beginning and preserve circular link (tail.next = head)', () => {
    const cll = new CircularLinkedList<string>();
    cll.insertAtEnd('A');
    cll.insertAtEnd('B');
    cll.insertAtEnd('C');

    const removed = cll.deleteAtBeginning();
    expect(removed).toBe('A');
    expect(cll.toArray()).toEqual(['B', 'C']);
    expect(cll.getHead()).toBe('B');
    expect(cll.getTail()).toBe('C');
    expect(cll.isCircularIntact()).toBe(true);
  });

  it('should delete at end and preserve circular link', () => {
    const cll = new CircularLinkedList<string>();
    cll.insertAtEnd('A');
    cll.insertAtEnd('B');
    cll.insertAtEnd('C');

    const removed = cll.deleteAtEnd();
    expect(removed).toBe('C');
    expect(cll.toArray()).toEqual(['A', 'B']);
    expect(cll.getHead()).toBe('A');
    expect(cll.getTail()).toBe('B');
    expect(cll.isCircularIntact()).toBe(true);
  });

  it('should handle deletion of single remaining element', () => {
    const cll = new CircularLinkedList<number>();
    cll.insertAtEnd(42);
    expect(cll.deleteAtEnd()).toBe(42);
    expect(cll.isEmpty()).toBe(true);
    expect(cll.getHead()).toBeNull();
    expect(cll.getTail()).toBeNull();
    expect(cll.isCircularIntact()).toBe(true);
  });

  it('should deleteByValue and deleteAtPosition accurately', () => {
    const cll = new CircularLinkedList<number>();
    cll.insertAtEnd(10);
    cll.insertAtEnd(20);
    cll.insertAtEnd(30);
    cll.insertAtEnd(40);

    // Delete middle value
    expect(cll.deleteByValue((v) => v === 20)).toBe(true);
    expect(cll.toArray()).toEqual([10, 30, 40]);
    expect(cll.isCircularIntact()).toBe(true);

    // Delete at position 1 (which is 30)
    expect(cll.deleteAtPosition(1)).toBe(30);
    expect(cll.toArray()).toEqual([10, 40]);
    expect(cll.isCircularIntact()).toBe(true);
  });

  it('should simulate round-robin vehicle dispatching across multiple cycles', () => {
    const dispatchCll = new CircularLinkedList<string>();
    dispatchCll.insertAtEnd('TRUCK-NORTH');
    dispatchCll.insertAtEnd('VAN-SOUTH');
    dispatchCll.insertAtEnd('AUTO-EAST');

    // Round 1
    expect(dispatchCll.advanceRoundRobin()).toBe('TRUCK-NORTH');
    expect(dispatchCll.advanceRoundRobin()).toBe('VAN-SOUTH');
    expect(dispatchCll.advanceRoundRobin()).toBe('AUTO-EAST');

    // Round 2 (cycles back to first)
    expect(dispatchCll.advanceRoundRobin()).toBe('TRUCK-NORTH');
    expect(dispatchCll.advanceRoundRobin()).toBe('VAN-SOUTH');
  });

  it('should search for elements correctly within the cycle', () => {
    const cll = new CircularLinkedList<string>();
    cll.insertAtEnd('HOSP-01');
    cll.insertAtEnd('HOSP-02');
    cll.insertAtEnd('HOSP-03');

    const resFound = cll.search((val) => val === 'HOSP-02');
    expect(resFound.found).toBe(true);
    expect(resFound.index).toBe(1);

    const resNotFound = cll.search((val) => val === 'HOSP-99');
    expect(resNotFound.found).toBe(false);
  });
});
