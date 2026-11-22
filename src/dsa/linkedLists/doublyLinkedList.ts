/**
 * MediTrack DSA Lab - Unit 3: Doubly Linked List
 *
 * Theoretical & Memory Characteristics:
 * - Each node contains data and TWO pointers: `prev` (pointing to previous node) and `next` (pointing to successive node).
 * - Advantages:
 *   1. Bidirectional Traversal: Can traverse both forward (head to tail) and backward (tail to head).
 *   2. Constant-time Tail Deletion: O(1) deletion at the tail because `tail.prev` directly references
 *      the preceding node, eliminating the O(n) traversal required in a Singly Linked List.
 *   3. Given a pointer to any interior node, it can be deleted in O(1) time without searching for its predecessor.
 * - Disadvantages:
 *   1. Greater Memory Overhead: Every node must store two pointer addresses (`prev` and `next`), increasing
 *      per-node heap memory footprint compared to SLL.
 *   2. More Complex Pointer Updates: Every insertion and deletion requires modifying 4 pointers instead of 2.
 * - Viva Question: "Why does Doubly Linked List achieve O(1) deletion at tail while Singly Linked List requires O(n)?"
 *   Answer: In a DLL with a tail pointer, the previous node is accessible in O(1) via `tail.prev`. We simply set
 *   `tail = tail.prev; tail.next = null;`. In an SLL, there is no `prev` pointer, requiring a traversal from `head`
 *   to find the node before tail.
 *
 * Complexities:
 * - Insert at Beginning: O(1) time, O(1) space
 * - Insert at End: O(1) time, O(1) space
 * - Insert at Position k: O(min(k, n-k)) time, O(1) space
 * - Delete at Beginning: O(1) time, O(1) space
 * - Delete at End: O(1) time, O(1) space
 * - Delete at Position k: O(min(k, n-k)) time, O(1) space
 * - Forward & Backward Traversals: O(n) time, O(1) space
 */

export class DoublyLinkedListNode<T> {
  data: T;
  next: DoublyLinkedListNode<T> | null = null;
  prev: DoublyLinkedListNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

export class DoublyLinkedList<T> {
  private head: DoublyLinkedListNode<T> | null = null;
  private tail: DoublyLinkedListNode<T> | null = null;
  private length = 0;

  /**
   * Inserts a node at the head.
   * Time Complexity: O(1)
   */
  insertAtBeginning(data: T): void {
    const newNode = new DoublyLinkedListNode(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.length++;
  }

  /**
   * Inserts a node at the tail.
   * Time Complexity: O(1)
   */
  insertAtEnd(data: T): void {
    const newNode = new DoublyLinkedListNode(data);
    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.length++;
  }

  /**
   * Inserts a node at position k (0-based).
   * Valid range: 0 <= position <= length
   * Time Complexity: O(k)
   */
  insertAtPosition(data: T, position: number): boolean {
    if (position < 0 || position > this.length) {
      return false;
    }

    if (position === 0) {
      this.insertAtBeginning(data);
      return true;
    }

    if (position === this.length) {
      this.insertAtEnd(data);
      return true;
    }

    const newNode = new DoublyLinkedListNode(data);
    let curr = this.head;
    for (let i = 0; i < position; i++) {
      if (!curr) return false;
      curr = curr.next;
    }

    if (!curr) return false;

    const previousNode = curr.prev;
    if (previousNode) {
      previousNode.next = newNode;
      newNode.prev = previousNode;
    }
    newNode.next = curr;
    curr.prev = newNode;

    this.length++;
    return true;
  }

  /**
   * Deletes the head node.
   * Time Complexity: O(1)
   */
  deleteAtBeginning(): T | null {
    if (!this.head) return null;

    const removedData = this.head.data;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
      if (this.head) {
        this.head.prev = null;
      }
    }
    this.length--;
    return removedData;
  }

  /**
   * Deletes the tail node in O(1) time using the prev pointer.
   * Time Complexity: O(1)
   */
  deleteAtEnd(): T | null {
    if (!this.tail) return null;

    const removedData = this.tail.data;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail.prev;
      if (this.tail) {
        this.tail.next = null;
      }
    }
    this.length--;
    return removedData;
  }

  /**
   * Deletes the first node satisfying the predicate.
   * Time Complexity: O(n)
   */
  deleteByValue(predicate: (val: T) => boolean): boolean {
    let curr = this.head;
    while (curr) {
      if (predicate(curr.data)) {
        if (curr === this.head) {
          this.deleteAtBeginning();
        } else if (curr === this.tail) {
          this.deleteAtEnd();
        } else {
          // Interior node
          if (curr.prev) curr.prev.next = curr.next;
          if (curr.next) curr.next.prev = curr.prev;
          this.length--;
        }
        return true;
      }
      curr = curr.next;
    }
    return false;
  }

  /**
   * Deletes node at 0-based position.
   * Time Complexity: O(k)
   */
  deleteAtPosition(position: number): T | null {
    if (position < 0 || position >= this.length || !this.head) {
      return null;
    }

    if (position === 0) {
      return this.deleteAtBeginning();
    }

    if (position === this.length - 1) {
      return this.deleteAtEnd();
    }

    let curr: DoublyLinkedListNode<T> | null = this.head;
    for (let i = 0; i < position; i++) {
      if (!curr) return null;
      curr = curr.next;
    }

    if (!curr) return null;

    const removedData = curr.data;
    if (curr.prev) curr.prev.next = curr.next;
    if (curr.next) curr.next.prev = curr.prev;

    this.length--;
    return removedData;
  }

  /**
   * Searches for the first node satisfying the predicate.
   * Time Complexity: O(n)
   */
  search(predicate: (val: T) => boolean): { found: boolean; index: number; value: T | null } {
    let curr = this.head;
    let index = 0;

    while (curr) {
      if (predicate(curr.data)) {
        return { found: true, index, value: curr.data };
      }
      curr = curr.next;
      index++;
    }

    return { found: false, index: -1, value: null };
  }

  /**
   * Forward traversal from head to tail.
   * Time Complexity: O(n)
   */
  toArray(): T[] {
    const result: T[] = [];
    let curr = this.head;
    while (curr) {
      result.push(curr.data);
      curr = curr.next;
    }
    return result;
  }

  /**
   * Reverse traversal from tail to head using prev pointers.
   * Time Complexity: O(n)
   */
  toArrayReverse(): T[] {
    const result: T[] = [];
    let curr = this.tail;
    while (curr) {
      result.push(curr.data);
      curr = curr.prev;
    }
    return result;
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  getHead(): T | null {
    return this.head ? this.head.data : null;
  }

  getTail(): T | null {
    return this.tail ? this.tail.data : null;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}
