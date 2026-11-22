import { describe, it, expect } from 'vitest';
import {
  Stack,
  StackUnderflowError,
  StackOverflowError,
  isBalancedParentheses,
  evaluatePostfix,
} from '../../src/dsa/stacks/stack';

describe('Unit 4: Stack ADT & Demonstrations', () => {
  it('should initialize empty with size 0', () => {
    const stack = new Stack<number>();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.isFull()).toBe(false);
    expect(stack.size()).toBe(0);
    expect(stack.tryPeek()).toBeNull();
  });

  it('should push and pop in LIFO order', () => {
    const stack = new Stack<string>();
    stack.push('REQ-1');
    stack.push('REQ-2');
    stack.push('REQ-3');

    expect(stack.size()).toBe(3);
    expect(stack.peek()).toBe('REQ-3');
    expect(stack.pop()).toBe('REQ-3');
    expect(stack.pop()).toBe('REQ-2');
    expect(stack.pop()).toBe('REQ-1');
    expect(stack.isEmpty()).toBe(true);
  });

  it('should throw StackUnderflowError on empty pop or peek', () => {
    const stack = new Stack<number>();
    expect(() => stack.pop()).toThrow(StackUnderflowError);
    expect(() => stack.peek()).toThrow(StackUnderflowError);
  });

  it('should enforce bounded capacity and throw StackOverflowError', () => {
    const bounded = new Stack<number>(2);
    expect(bounded.capacity()).toBe(2);
    bounded.push(10);
    bounded.push(20);
    expect(bounded.isFull()).toBe(true);

    expect(() => bounded.push(30)).toThrow(StackOverflowError);
  });

  describe('Balanced Parentheses Demonstration', () => {
    it('should identify balanced nested bracket expressions', () => {
      expect(isBalancedParentheses('{[()]}').isBalanced).toBe(true);
      expect(isBalancedParentheses('(weight * 2) + [penalty / 4]').isBalanced).toBe(true);
      expect(isBalancedParentheses('').isBalanced).toBe(true);
    });

    it('should detect unmatched closing and unclosed opening brackets', () => {
      const resUnclosed = isBalancedParentheses('(((');
      expect(resUnclosed.isBalanced).toBe(false);
      expect(resUnclosed.errorReason).toContain('Unclosed bracket');

      const resMismatched = isBalancedParentheses('([)]');
      expect(resMismatched.isBalanced).toBe(false);
      expect(resMismatched.errorReason).toContain('Mismatched brackets');

      const resPremature = isBalancedParentheses(')');
      expect(resPremature.isBalanced).toBe(false);
      expect(resPremature.errorReason).toContain('Unmatched closing');
    });
  });

  describe('Postfix Expression Evaluation Demonstration', () => {
    it('should evaluate standard postfix arithmetic correctly', () => {
      // (15 + 4) * 2 = 38
      const res1 = evaluatePostfix('15 4 + 2 *');
      expect(res1.isValid).toBe(true);
      expect(res1.result).toBe(38);

      // 20 - (4 / 2) = 18
      const res2 = evaluatePostfix('20 4 2 / -');
      expect(res2.isValid).toBe(true);
      expect(res2.result).toBe(18);

      // 2 ^ 3 = 8
      const res3 = evaluatePostfix('2 3 ^');
      expect(res3.isValid).toBe(true);
      expect(res3.result).toBe(8);
    });

    it('should catch division by zero safely', () => {
      const resDivZero = evaluatePostfix('10 0 /');
      expect(resDivZero.isValid).toBe(false);
      expect(resDivZero.error).toContain('Division by zero');
    });

    it('should catch insufficient operands and malformed inputs', () => {
      const resFew = evaluatePostfix('+');
      expect(resFew.isValid).toBe(false);
      expect(resFew.error).toContain('Insufficient operands');

      const resMalformed = evaluatePostfix('5 10 15 +');
      expect(resMalformed.isValid).toBe(false);
      expect(resMalformed.error).toContain('Malformed expression');

      const resInvalidToken = evaluatePostfix('5 foo +');
      expect(resInvalidToken.isValid).toBe(false);
      expect(resInvalidToken.error).toContain('Unrecognized token');
    });
  });
});
