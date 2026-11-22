/**
 * MediTrack DSA Lab - Unit 3: Circular Singly Linked List
 *
 * Theoretical & Memory Characteristics:
 * - In a Circular Singly Linked List, the `next` pointer of the last node (`tail`) points back
 *   to the first node (`head`), forming a closed ring.
 * - For a single node, `node.next = node`.
 * - Advantages:
 *   1. Any node can serve as a starting point for full-list traversal.
 *   2. Natural fit for cyclic round-robin scheduling algorithms (e.g. rotating medical waste collection vans).
 *   3. No NULL pointer dereferencing at the end of the list.
 * - Disadvantages:
 *   1. Infinite loop hazard: Traversals must track visited count or detect when `curr === head` on the second pass.
 *   2. Deleting the tail or head still requires updating the tail's next link to maintain circularity.
 * - Viva Question: "How is end-of-list detected in a Circular Linked List if there is no NULL pointer?"
 *   Answer: Traversal starts at `head` and continues while `curr.next !== head` (or by tracking the number of
 *   visited nodes up to `length`). Reaching a node whose `next` references `head` indicates completion of one full cycle.
 *
 * Complexities:
 * - Insert at Beginning: O(1) time (with tail pointer), O(1) space
 * - Insert at End: O(1) time (with tail pointer), O(1) space
 * - Insert at Position k: O(k) time, O(1) space
 * - Delete at Beginning: O(1) time, O(1) space
 * - Delete at End: O(n) time, O(1) space (requires traversing to second-to-last node)
 * - Round-Robin Advance: O(1) time
 * - Traversal (1 cycle): O(n) time, O(1) space
 */

export class CircularLinkedListNode<T> {
  data: T;
  next: CircularLinkedListNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

export class CircularLinkedList<T> {
  private head: CircularLinkedListNode<T> | null = null;
  private tail: CircularLinkedListNode<T> | null = null;
  private currentRoundRobinNode: CircularLinkedListNode<T> | null = null;
  private length = 0;

  /**
   * Inserts a new node at the beginning.
   * Maintains circular link: tail.next = head
   * Time Complexity: O(1)
   */
  insertAtBeginning(data: T): void {
    const newNode = new CircularLinkedListNode(data);
    if (!this.head || !this.tail) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = newNode; // Points to itself
      this.currentRoundRobinNode = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
      this.tail.next = this.head; // Maintain circular link
    }
    this.length++;
  }

  /**
   * Inserts a new node at the end.
   * Maintains circular link: tail.next = head
   * Time Complexity: O(1)
   */
  insertAtEnd(data: T): void {
    const newNode = new CircularLinkedListNode(data);
    if (!this.head || !this.tail) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = newNode;
      this.currentRoundRobinNode = newNode;
    } else {
      this.tail.next = newNode;
      newNode.next = this.head; // Close the circle
      this.tail = newNode;
    }
    this.length++;
  }

  /**
   * Inserts at a 0-based position.
   * Valid range: 0 <= position <= length
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

    const newNode = new CircularLinkedListNode(data);
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
   * Deletes the head node.
   * Maintains circular link: tail.next = new head
   * Time Complexity: O(1)
   */
  deleteAtBeginning(): T | null {
    if (!this.head || !this.tail) return null;

    const removedData = this.head.data;

    // Single node in list
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      this.currentRoundRobinNode = null;
    } else {
      if (this.currentRoundRobinNode === this.head) {
        this.currentRoundRobinNode = this.head.next;
      }
      this.head = this.head.next;
      this.tail.next = this.head; // Close circle with new head
    }

    this.length--;
    return removedData;
  }

  /**
   * Deletes the tail node.
   * Traverses to find second-to-last node, then updates its next to head.
   * Time Complexity: O(n)
   */
  deleteAtEnd(): T | null {
    if (!this.head || !this.tail) return null;

    const removedData = this.tail.data;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      this.currentRoundRobinNode = null;
    } else {
      // Find second-to-last node
      let curr = this.head;
      while (curr.next !== this.tail) {
        curr = curr.next!;
      }

      if (this.currentRoundRobinNode === this.tail) {
        this.currentRoundRobinNode = this.head;
      }
      this.tail = curr;
      this.tail.next = this.head; // Close circle
    }

    this.length--;
    return removedData;
  }

  /**
   * Deletes the first node matching the predicate.
   * Preserves circular invariant.
   */
  deleteByValue(predicate: (val: T) => boolean): boolean {
    if (!this.head || !this.tail) return false;

    if (predicate(this.head.data)) {
      this.deleteAtBeginning();
      return true;
    }

    let prev = this.head;
    let curr = this.head.next;

    while (curr && curr !== this.head) {
      if (predicate(curr.data)) {
        prev.next = curr.next;
        if (curr === this.tail) {
          this.tail = prev;
          this.tail.next = this.head;
        }
        if (this.currentRoundRobinNode === curr) {
          this.currentRoundRobinNode = curr.next;
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
   * Deletes the node at a 0-based position.
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

    let prev = this.head;
    for (let i = 0; i < position - 1; i++) {
      prev = prev.next!;
    }

    const targetNode = prev.next!;
    const removedData = targetNode.data;
    prev.next = targetNode.next;

    if (this.currentRoundRobinNode === targetNode) {
      this.currentRoundRobinNode = targetNode.next;
    }

    this.length--;
    return removedData;
  }

  /**
   * Advances the round-robin pointer by 1 step in the cycle and returns the active node's data.
   * Used for round-robin dispatching of medical waste vehicles.
   */
  advanceRoundRobin(): T | null {
    if (!this.currentRoundRobinNode) return null;
    const currentData = this.currentRoundRobinNode.data;
    this.currentRoundRobinNode = this.currentRoundRobinNode.next;
    return currentData;
  }

  getCurrentRoundRobin(): T | null {
    return this.currentRoundRobinNode ? this.currentRoundRobinNode.data : null;
  }

  /**
   * Searches for a node matching the predicate across one full cycle.
   */
  search(predicate: (val: T) => boolean): { found: boolean; index: number; value: T | null } {
    if (!this.head) return { found: false, index: -1, value: null };

    let curr: CircularLinkedListNode<T> | null = this.head;
    let index = 0;

    do {
      if (predicate(curr.data)) {
        return { found: true, index, value: curr.data };
      }
      curr = curr.next;
      index++;
    } while (curr && curr !== this.head && index < this.length);

    return { found: false, index: -1, value: null };
  }

  /**
   * Traverses exactly one full cycle of the circular list and returns values.
   */
  toArray(): T[] {
    if (!this.head) return [];
    const result: T[] = [];
    let curr: CircularLinkedListNode<T> | null = this.head;
    let count = 0;

    while (curr && count < this.length) {
      result.push(curr.data);
      curr = curr.next;
      count++;
    }

    return result;
  }

  /**
   * Confirms circular integrity: verifies that tail.next strictly equals head.
   */
  isCircularIntact(): boolean {
    if (!this.head || !this.tail) return true;
    return this.tail.next === this.head;
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
    this.currentRoundRobinNode = null;
    this.length = 0;
  }
}
