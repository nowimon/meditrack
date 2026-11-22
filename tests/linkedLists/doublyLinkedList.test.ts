import { describe, it, expect } from 'vitest';
import { DoublyLinkedList } from '../../src/dsa/linkedLists/doublyLinkedList';

describe('Unit 3: Doubly Linked List', () => {
  it('should initialize empty with 0 size and null head/tail', () => {
    const dll = new DoublyLinkedList<number>();
    expect(dll.isEmpty()).toBe(true);
    expect(dll.size()).toBe(0);
    expect(dll.getHead()).toBeNull();
    expect(dll.getTail()).toBeNull();
    expect(dll.toArray()).toEqual([]);
    expect(dll.toArrayReverse()).toEqual([]);
  });

  it('should support insertAtBeginning and bidirectional traversal', () => {
    const dll = new DoublyLinkedList<number>();
    dll.insertAtBeginning(30);
    dll.insertAtBeginning(20);
    dll.insertAtBeginning(10);

    expect(dll.size()).toBe(3);
    expect(dll.getHead()).toBe(10);
    expect(dll.getTail()).toBe(30);
    expect(dll.toArray()).toEqual([10, 20, 30]);
    expect(dll.toArrayReverse()).toEqual([30, 20, 10]);
  });

  it('should support insertAtEnd correctly', () => {
    const dll = new DoublyLinkedList<string>();
    dll.insertAtEnd('A');
    dll.insertAtEnd('B');
    dll.insertAtEnd('C');

    expect(dll.toArray()).toEqual(['A', 'B', 'C']);
    expect(dll.toArrayReverse()).toEqual(['C', 'B', 'A']);
    expect(dll.getHead()).toBe('A');
    expect(dll.getTail()).toBe('C');
  });

  it('should handle insertAtPosition with valid and invalid positions', () => {
    const dll = new DoublyLinkedList<number>();
    expect(dll.insertAtPosition(10, 0)).toBe(true);
    expect(dll.insertAtPosition(30, 1)).toBe(true);
    // Insert in middle
    expect(dll.insertAtPosition(20, 1)).toBe(true);

    expect(dll.toArray()).toEqual([10, 20, 30]);
    expect(dll.toArrayReverse()).toEqual([30, 20, 10]);

    // Out of bounds
    expect(dll.insertAtPosition(999, -1)).toBe(false);
    expect(dll.insertAtPosition(999, 10)).toBe(false);
  });

  it('should deleteAtBeginning and deleteAtEnd in O(1) time', () => {
    const dll = new DoublyLinkedList<string>();
    dll.insertAtEnd('First');
    dll.insertAtEnd('Second');
    dll.insertAtEnd('Third');

    // Delete at end (tail)
    const removedEnd = dll.deleteAtEnd();
    expect(removedEnd).toBe('Third');
    expect(dll.toArray()).toEqual(['First', 'Second']);
    expect(dll.toArrayReverse()).toEqual(['Second', 'First']);
    expect(dll.getTail()).toBe('Second');

    // Delete at beginning (head)
    const removedStart = dll.deleteAtBeginning();
    expect(removedStart).toBe('First');
    expect(dll.toArray()).toEqual(['Second']);
    expect(dll.toArrayReverse()).toEqual(['Second']);
    expect(dll.getHead()).toBe('Second');
    expect(dll.getTail()).toBe('Second');

    // Delete last remaining
    const removedLast = dll.deleteAtEnd();
    expect(removedLast).toBe('Second');
    expect(dll.isEmpty()).toBe(true);
    expect(dll.getHead()).toBeNull();
    expect(dll.getTail()).toBeNull();

    // Deletion on empty list
    expect(dll.deleteAtBeginning()).toBeNull();
    expect(dll.deleteAtEnd()).toBeNull();
  });

  it('should deleteAtPosition for interior nodes', () => {
    const dll = new DoublyLinkedList<number>();
    dll.insertAtEnd(100);
    dll.insertAtEnd(200);
    dll.insertAtEnd(300);

    const deletedMid = dll.deleteAtPosition(1);
    expect(deletedMid).toBe(200);
    expect(dll.toArray()).toEqual([100, 300]);
    expect(dll.toArrayReverse()).toEqual([300, 100]);

    // Invalid position
    expect(dll.deleteAtPosition(5)).toBeNull();
  });

  it('should deleteByValue for first matching element and maintain duplicates', () => {
    const dll = new DoublyLinkedList<string>();
    dll.insertAtEnd('REQ-1');
    dll.insertAtEnd('REQ-2');
    dll.insertAtEnd('REQ-2');
    dll.insertAtEnd('REQ-3');

    const deleted = dll.deleteByValue((val) => val === 'REQ-2');
    expect(deleted).toBe(true);
    expect(dll.toArray()).toEqual(['REQ-1', 'REQ-2', 'REQ-3']);
    expect(dll.toArrayReverse()).toEqual(['REQ-3', 'REQ-2', 'REQ-1']);
  });

  it('should search for elements correctly', () => {
    const dll = new DoublyLinkedList<number>();
    dll.insertAtEnd(15);
    dll.insertAtEnd(30);
    dll.insertAtEnd(45);

    const hit = dll.search((val) => val === 30);
    expect(hit.found).toBe(true);
    expect(hit.index).toBe(1);
    expect(hit.value).toBe(30);

    const miss = dll.search((val) => val === 999);
    expect(miss.found).toBe(false);
    expect(miss.index).toBe(-1);
    expect(miss.value).toBeNull();
  });
});
