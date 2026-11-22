import { describe, it, expect } from 'vitest';
import { SinglyLinkedList } from '../../src/dsa/linkedLists/singlyLinkedList';

describe('Unit 3: Singly Linked List', () => {
  it('should initialize empty with size 0 and null head/tail', () => {
    const sll = new SinglyLinkedList<number>();
    expect(sll.isEmpty()).toBe(true);
    expect(sll.size()).toBe(0);
    expect(sll.getHead()).toBeNull();
    expect(sll.getTail()).toBeNull();
    expect(sll.toArray()).toEqual([]);
  });

  it('should handle insertAtBeginning correctly', () => {
    const sll = new SinglyLinkedList<number>();
    sll.insertAtBeginning(30);
    expect(sll.getHead()).toBe(30);
    expect(sll.getTail()).toBe(30);
    expect(sll.size()).toBe(1);

    sll.insertAtBeginning(20);
    sll.insertAtBeginning(10);
    expect(sll.toArray()).toEqual([10, 20, 30]);
    expect(sll.getHead()).toBe(10);
    expect(sll.getTail()).toBe(30);
    expect(sll.size()).toBe(3);
  });

  it('should handle insertAtEnd correctly', () => {
    const sll = new SinglyLinkedList<string>();
    sll.insertAtEnd('A');
    expect(sll.getHead()).toBe('A');
    expect(sll.getTail()).toBe('A');

    sll.insertAtEnd('B');
    sll.insertAtEnd('C');
    expect(sll.toArray()).toEqual(['A', 'B', 'C']);
    expect(sll.getHead()).toBe('A');
    expect(sll.getTail()).toBe('C');
    expect(sll.size()).toBe(3);
  });

  it('should handle insertAtPosition with valid and invalid bounds', () => {
    const sll = new SinglyLinkedList<number>();
    // Position 0 on empty list
    expect(sll.insertAtPosition(100, 0)).toBe(true);
    expect(sll.toArray()).toEqual([100]);

    // Position 1 (tail)
    expect(sll.insertAtPosition(300, 1)).toBe(true);
    expect(sll.toArray()).toEqual([100, 300]);

    // Position 1 (middle)
    expect(sll.insertAtPosition(200, 1)).toBe(true);
    expect(sll.toArray()).toEqual([100, 200, 300]);

    // Invalid positions
    expect(sll.insertAtPosition(999, -1)).toBe(false);
    expect(sll.insertAtPosition(999, 10)).toBe(false);
    expect(sll.size()).toBe(3);
  });

  it('should handle deleteAtPosition for head, middle, and tail', () => {
    const sll = new SinglyLinkedList<string>();
    sll.insertAtEnd('X');
    sll.insertAtEnd('Y');
    sll.insertAtEnd('Z');

    // Delete middle
    const removedMid = sll.deleteAtPosition(1);
    expect(removedMid).toBe('Y');
    expect(sll.toArray()).toEqual(['X', 'Z']);
    expect(sll.getHead()).toBe('X');
    expect(sll.getTail()).toBe('Z');

    // Delete tail
    const removedTail = sll.deleteAtPosition(1);
    expect(removedTail).toBe('Z');
    expect(sll.toArray()).toEqual(['X']);
    expect(sll.getHead()).toBe('X');
    expect(sll.getTail()).toBe('X');

    // Delete head (last remaining)
    const removedHead = sll.deleteAtPosition(0);
    expect(removedHead).toBe('X');
    expect(sll.isEmpty()).toBe(true);
    expect(sll.getHead()).toBeNull();
    expect(sll.getTail()).toBeNull();

    // Delete on empty list or out of bounds
    expect(sll.deleteAtPosition(0)).toBeNull();
    expect(sll.deleteAtPosition(-1)).toBeNull();
  });

  it('should deleteByValue for first occurrence and preserve duplicates', () => {
    const sll = new SinglyLinkedList<number>();
    sll.insertAtEnd(10);
    sll.insertAtEnd(20);
    sll.insertAtEnd(20);
    sll.insertAtEnd(30);

    // Delete first 20
    const deleted = sll.deleteByValue((val) => val === 20);
    expect(deleted).toBe(true);
    expect(sll.toArray()).toEqual([10, 20, 30]);

    // Delete non-existent
    expect(sll.deleteByValue((val) => val === 999)).toBe(false);
    expect(sll.size()).toBe(3);
  });

  it('should search for values accurately', () => {
    const sll = new SinglyLinkedList<string>();
    sll.insertAtEnd('Ward-A');
    sll.insertAtEnd('Ward-B');
    sll.insertAtEnd('Ward-C');

    const hit = sll.search((val) => val === 'Ward-B');
    expect(hit.found).toBe(true);
    expect(hit.index).toBe(1);
    expect(hit.value).toBe('Ward-B');

    const miss = sll.search((val) => val === 'Ward-Z');
    expect(miss.found).toBe(false);
    expect(miss.index).toBe(-1);
    expect(miss.value).toBeNull();
  });

  it('should maintain state across repeated inserts and deletes', () => {
    const sll = new SinglyLinkedList<number>();
    for (let i = 1; i <= 5; i++) {
      sll.insertAtEnd(i * 10);
    }
    expect(sll.size()).toBe(5);

    // Delete head
    sll.deleteAtPosition(0); // removes 10
    // Delete tail
    sll.deleteAtPosition(3); // removes 50
    expect(sll.toArray()).toEqual([20, 30, 40]);
    expect(sll.getHead()).toBe(20);
    expect(sll.getTail()).toBe(40);

    sll.clear();
    expect(sll.isEmpty()).toBe(true);
    expect(sll.toArray()).toEqual([]);
  });

  it('should deleteAtBeginning and deleteAtEnd correctly', () => {
    const sll = new SinglyLinkedList<string>();
    expect(sll.deleteAtBeginning()).toBeNull();
    expect(sll.deleteAtEnd()).toBeNull();

    sll.insertAtEnd('A');
    sll.insertAtEnd('B');
    sll.insertAtEnd('C');

    expect(sll.deleteAtBeginning()).toBe('A');
    expect(sll.toArray()).toEqual(['B', 'C']);
    expect(sll.size()).toBe(2);

    expect(sll.deleteAtEnd()).toBe('C');
    expect(sll.toArray()).toEqual(['B']);
    expect(sll.size()).toBe(1);

    expect(sll.deleteAtBeginning()).toBe('B');
    expect(sll.isEmpty()).toBe(true);
    expect(sll.deleteAtEnd()).toBeNull();
  });
});
