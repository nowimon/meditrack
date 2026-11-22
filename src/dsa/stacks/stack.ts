/**
 * MediTrack DSA Lab - Unit 4: Stack ADT
 *
 * Theoretical & Memory Characteristics:
 * - LIFO (Last-In, First-Out) Abstract Data Type.
 * - Primary operations: `push`, `pop`, `peek`, `isEmpty`, `isFull`, `size`.
 * - In bounded stacks, `push` when `size === capacity` results in Stack Overflow.
 * - In all stacks, `pop` or `peek` when `size === 0` results in Stack Underflow.
 * - Viva Question: "What are real-world applications of the Stack ADT?"
 *   Answer:
 *   1. Function call stacks in recursion and runtime execution environments.
 *   2. Expression parsing (Infix to Postfix conversion and Postfix evaluation).
 *   3. Syntax verification (Balanced bracket / delimiter matching).
 *   4. Undo / Redo history buffers in application user interfaces.
 *   5. Depth-First Search (DFS) graph and tree traversals.
 *
 * Complexities:
 * - push: O(1) time, O(1) auxiliary space
 * - pop: O(1) time, O(1) auxiliary space
 * - peek: O(1) time, O(1) auxiliary space
 * - isEmpty / isFull / size: O(1) time
 */

export class StackUnderflowError extends Error {
  constructor(message = 'Stack Underflow: Attempted to pop/peek from an empty stack.') {
    super(message);
    this.name = 'StackUnderflowError';
  }
}

export class StackOverflowError extends Error {
  constructor(message = 'Stack Overflow: Attempted to push into a full bounded stack.') {
    super(message);
    this.name = 'StackOverflowError';
  }
}

export class Stack<T> {
  private items: T[] = [];
  private readonly maxCapacity: number;

  /**
   * Creates a Stack.
   * @param capacity Optional upper bound limit (default: Infinity)
   */
  constructor(capacity = Infinity) {
    if (capacity <= 0) {
      throw new Error('Capacity must be a positive integer.');
    }
    this.maxCapacity = capacity;
  }

  /**
   * Pushes an element onto the top of the stack.
   * Throws StackOverflowError if stack is bounded and full.
   * Time Complexity: O(1)
   */
  push(item: T): void {
    if (this.isFull()) {
      throw new StackOverflowError(
        `Stack Overflow: Capacity of ${this.maxCapacity} elements exceeded.`
      );
    }
    this.items.push(item);
  }

  /**
   * Removes and returns the top element of the stack.
   * Throws StackUnderflowError if stack is empty.
   * Time Complexity: O(1)
   */
  pop(): T {
    if (this.isEmpty()) {
      throw new StackUnderflowError();
    }
    return this.items.pop()!;
  }

  /**
   * Returns the top element without removing it.
   * Throws StackUnderflowError if stack is empty.
   * Time Complexity: O(1)
   */
  peek(): T {
    if (this.isEmpty()) {
      throw new StackUnderflowError();
    }
    return this.items[this.items.length - 1];
  }

  /**
   * Safe peek that returns null instead of throwing on empty.
   */
  tryPeek(): T | null {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  /**
   * Returns true if stack contains no elements.
   * Time Complexity: O(1)
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Returns true if bounded stack has reached capacity.
   * Time Complexity: O(1)
   */
  isFull(): boolean {
    return this.items.length >= this.maxCapacity;
  }

  /**
   * Returns the number of elements in the stack.
   * Time Complexity: O(1)
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Returns maximum capacity.
   */
  capacity(): number {
    return this.maxCapacity;
  }

  /**
   * Clears all elements from the stack.
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Returns snapshot of elements from bottom to top.
   */
  toArray(): T[] {
    return [...this.items];
  }
}

/**
 * Meaningful Demonstration 1: Balanced Brackets Checker
 * Validates matching pairs of (), [], and {} delimiters.
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function isBalancedParentheses(expression: string): {
  isBalanced: boolean;
  errorReason?: string;
} {
  const stack = new Stack<string>();
  const matchingPairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{',
  };
  const openingBrackets = new Set(['(', '[', '{']);
  const closingBrackets = new Set([')', ']', '}']);

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    if (openingBrackets.has(char)) {
      stack.push(char);
    } else if (closingBrackets.has(char)) {
      if (stack.isEmpty()) {
        return {
          isBalanced: false,
          errorReason: `Unmatched closing bracket '${char}' at index ${i}.`,
        };
      }
      const top = stack.pop();
      if (top !== matchingPairs[char]) {
        return {
          isBalanced: false,
          errorReason: `Mismatched brackets: expected matching pair for '${top}', but found '${char}' at index ${i}.`,
        };
      }
    }
  }

  if (!stack.isEmpty()) {
    return {
      isBalanced: false,
      errorReason: `Unclosed bracket '${stack.peek()}' remaining on stack.`,
    };
  }

  return { isBalanced: true };
}

/**
 * Meaningful Demonstration 2: Postfix (Reverse Polish Notation) Expression Evaluation
 * Evaluates expressions like "15 4 + 2 *" -> (15 + 4) * 2 = 38.
 * Handles +, -, *, /, %, ^ with safe division-by-zero checks.
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function evaluatePostfix(expression: string): {
  result: number | null;
  isValid: boolean;
  error?: string;
  steps: string[];
} {
  const stack = new Stack<number>();
  const steps: string[] = [];
  const tokens = expression.trim().split(/\s+/);

  if (expression.trim().length === 0) {
    return {
      result: null,
      isValid: false,
      error: 'Empty expression.',
      steps: ['Expression is empty.'],
    };
  }

  for (const token of tokens) {
    // If token is a valid numeric operand
    if (!isNaN(Number(token))) {
      const num = Number(token);
      stack.push(num);
      steps.push(`Push operand ${num} -> Stack: [${stack.toArray().join(', ')}]`);
    } else if (['+', '-', '*', '/', '%', '^'].includes(token)) {
      if (stack.size() < 2) {
        return {
          result: null,
          isValid: false,
          error: `Insufficient operands for operator '${token}'.`,
          steps,
        };
      }
      const b = stack.pop();
      const a = stack.pop();
      let res = 0;

      switch (token) {
        case '+':
          res = a + b;
          break;
        case '-':
          res = a - b;
          break;
        case '*':
          res = a * b;
          break;
        case '/':
          if (b === 0) {
            return {
              result: null,
              isValid: false,
              error: 'Division by zero error.',
              steps,
            };
          }
          res = a / b;
          break;
        case '%':
          if (b === 0) {
            return {
              result: null,
              isValid: false,
              error: 'Modulo by zero error.',
              steps,
            };
          }
          res = a % b;
          break;
        case '^':
          res = Math.pow(a, b);
          break;
      }

      stack.push(res);
      steps.push(`Evaluate: ${a} ${token} ${b} = ${res} -> Stack: [${stack.toArray().join(', ')}]`);
    } else {
      return {
        result: null,
        isValid: false,
        error: `Unrecognized token '${token}'.`,
        steps,
      };
    }
  }

  if (stack.size() !== 1) {
    return {
      result: null,
      isValid: false,
      error: `Malformed expression: ${stack.size()} unreduced operands remain on stack.`,
      steps,
    };
  }

  const finalResult = stack.pop();
  return {
    result: finalResult,
    isValid: true,
    steps,
  };
}
