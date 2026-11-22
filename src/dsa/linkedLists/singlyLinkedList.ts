/**
 * MediTrack DSA Lab - Unit 3: Singly Linked List
 *
 * Theoretical & Memory Characteristics:
 * - Dynamic Data Structure: Nodes are allocated dynamically in heap memory rather than in contiguous blocks.
 * - Each node stores data and a single pointer (`next`) pointing to the successive node.
 * - Advantages:
 *   1. Dynamic size: No fixed-capacity allocation required upfront; grows and shrinks on demand.
 *   2. Constant-time insertion/deletion at the head: O(1) without shifting elements.
 * - Disadvantages:
 *   1. No random access: Direct indexing by k is O(k) because pointers must be traversed sequentially from head.
 *   2. Extra memory overhead: Requires memory for pointers in addition to the data payload.
 *   3. Deleting the tail node requires O(n) traversal to locate the node preceding tail (unlike DLL).
 * - Viva Question: "Why is deleting at the tail O(n) in a Singly Linked List with a tail pointer?"
 *   Answer: While insertion at tail is O(1) via `tail.next = newNode; tail = newNode`, deletion at tail
 *   requires updating `tail` to point to the *second-to-last* node. In a Singly Linked List, there are no backward
 *   pointers, so finding the second-to-last node requires traversing n-1 nodes from the head.
 *
 * Complexities:
 * - Insert at Beginning: O(1) time, O(1) space
 * - Insert at End (with tail pointer): O(1) time, O(1) space
 * - Insert at Position k: O(k) time, O(1) space
 * - Delete at Head: O(1) time, O(1) space
 * - Delete at Tail: O(n) time, O(1) space
 * - Delete by Value / Position: O(n) time, O(1) space
 * - Search: O(n) time, O(1) space
 * - Traversal: O(n) time, O(1) space
 */

export class SinglyLinkedListNode<T> {
  data: T;
  next: SinglyLinkedListNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

export class SinglyLinkedList<T> {
  private head: SinglyLinkedListNode<T> | null = null;
  private tail: SinglyLinkedListNode<T> | null = null;
  private length = 0;

  /**
   * Inserts a new node at the very beginning of the list.
   * Time Complexity: O(1)
   */
  insertAtBeginning(data: T): void {
    const newNode = new SinglyLinkedListNode(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
  }

  /**
   * Inserts a new node at the end of the list.
   * Time Complexity: O(1) with maintained tail pointer.
   */
  insertAtEnd(data: T): void {
    const newNode = new SinglyLinkedListNode(data);
    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  /**
   * Inserts a node at a specified 0-based position.
   * Valid range: 0 <= position <= length
   * Returns true if insertion succeeded, false if position is invalid.
   * Time Complexity: O(k) where k is position.
   */
  insertAtPosition(data: T, position: number): boolean {
    if (position < 0 || position > this.length) {
      return false; // Out of bounds
    }

    if (position === 0) {
      this.insertAtBeginning(data);
      return true;
    }

    if (position === this.length) {
      this.insertAtEnd(data);
      return true;
    }

    const newNode = new SinglyLinkedListNode(data);
    let prev = this.head;
    for (let i = 0; i < position - 1; i++) {
      if (!prev) return false;
      prev = prev.next;
    }

    if (!prev) return false;
    newNode.next = prev.next;
    prev.next = newNode;
    this.length++;
    return true;
  }

  /**
   * Deletes the first node that satisfies the predicate.
   * Returns true if a node was found and deleted, false otherwise.
   * Time Complexity: O(n)
   */
  deleteByValue(predicate: (val: T) => boolean): boolean {
    if (!this.head) return false;

    // Check head
    if (predicate(this.head.data)) {
      this.head = this.head.next;
      this.length--;
      if (this.length === 0) {
        this.tail = null;
      }
      return true;
    }

    let prev = this.head;
    let curr = this.head.next;

    while (curr) {
      if (predicate(curr.data)) {
        prev.next = curr.next;
        // If deleting tail, update tail pointer to prev
        if (curr === this.tail) {
          this.tail = prev;
        }
        this.length--;
        return true;
      }
      prev = curr;
      curr = curr.next;
    }

    return false;
  }

  /**
   * Deletes the head node.
   * Time Complexity: O(1)
   */
  deleteAtBeginning(): T | null {
    return this.deleteAtPosition(0);
  }

  /**
   * Deletes the tail node.
   * Requires traversing to find the second-to-last node.
   * Time Complexity: O(n)
   */
  deleteAtEnd(): T | null {
    if (this.length === 0) return null;
    return this.deleteAtPosition(this.length - 1);
  }

  /**
   * Deletes the node at a given 0-based position.
   * Valid range: 0 <= position < length
   * Returns the deleted data, or null if position is invalid.
   * Time Complexity: O(k) where k is position.
   */
  deleteAtPosition(position: number): T | null {
    if (position < 0 || position >= this.length || !this.head) {
      return null;
    }

    // Deleting head
    if (position === 0) {
      const removedData = this.head.data;
      this.head = this.head.next;
      this.length--;
      if (this.length === 0) {
        this.tail = null;
      }
      return removedData;
    }

    let prev = this.head;
    for (let i = 0; i < position - 1; i++) {
      if (!prev.next) return null;
      prev = prev.next;
    }

    const targetNode = prev.next;
    if (!targetNode) return null;

    const removedData = targetNode.data;
    prev.next = targetNode.next;

    if (targetNode === this.tail) {
      this.tail = prev;
    }

    this.length--;
    return removedData;
  }

  /**
   * Searches for the first node satisfying the predicate.
   * Returns found boolean, index, and value.
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
   * Traverses the list and returns all values in an array.
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
   * Returns number of elements.
   */
  size(): number {
    return this.length;
  }

  /**
   * Returns true if the list contains no elements.
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Returns data at head without removing it.
   */
  getHead(): T | null {
    return this.head ? this.head.data : null;
  }

  /**
   * Returns data at tail without removing it.
   */
  getTail(): T | null {
    return this.tail ? this.tail.data : null;
  }

  /**
   * Empties the list.
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}
