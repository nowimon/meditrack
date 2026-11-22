import { describe, it, expect } from 'vitest';
import {
  bstInsert,
  bstDelete,
  bstSearch,
  inorder,
  preorder,
  postorder,
  bstHeight,
} from '../../src/dsa/trees/bst';
import type { BSTNode } from '../../src/dsa/trees/bst';

describe('BST Operations', () => {
  it('inserts nodes maintaining BST ordering', () => {
    let root: BSTNode | null = null;
    root = bstInsert(root, 50, 'Apex');
    root = bstInsert(root, 30, 'City Care');
    root = bstInsert(root, 70, 'St. Jude');

    expect(root.key).toBe(50);
    expect(root.left?.key).toBe(30);
    expect(root.right?.key).toBe(70);
  });

  it('searches for keys and records traversal path', () => {
    let root: BSTNode | null = null;
    [50, 30, 70, 20, 40].forEach((k) => {
      root = bstInsert(root, k, `Fac-${k}`);
    });

    const found = bstSearch(root, 40);
    expect(found.found).toBe(true);
    expect(found.path).toEqual([50, 30, 40]);

    const missing = bstSearch(root, 99);
    expect(missing.found).toBe(false);
    expect(missing.path).toEqual([50, 70]);
  });

  it('produces correct in-order, pre-order, and post-order traversals', () => {
    let root: BSTNode | null = null;
    [50, 30, 70].forEach((k) => {
      root = bstInsert(root, k, `F${k}`);
    });

    expect(inorder(root)).toEqual(['30:F30', '50:F50', '70:F70']);
    expect(preorder(root)).toEqual(['50:F50', '30:F30', '70:F70']);
    expect(postorder(root)).toEqual(['30:F30', '70:F70', '50:F50']);
  });

  it('computes correct tree height', () => {
    let root: BSTNode | null = null;
    expect(bstHeight(root)).toBe(0);

    root = bstInsert(root, 50, 'Apex');
    expect(bstHeight(root)).toBe(1);

    root = bstInsert(root, 30, 'City Care');
    expect(bstHeight(root)).toBe(2);

    root = bstInsert(root, 20, 'LifeSpring');
    expect(bstHeight(root)).toBe(3);
  });

  it('deletes leaf nodes, single-child nodes, and two-child nodes', () => {
    let root: BSTNode | null = null;
    [50, 30, 70, 20, 40, 60, 80].forEach((k) => {
      root = bstInsert(root, k, `F${k}`);
    });

    // Delete leaf
    root = bstDelete(root, 20);
    expect(bstSearch(root, 20).found).toBe(false);

    // Delete node with two children (50) - replaced by inorder successor (60)
    root = bstDelete(root, 50);
    expect(bstSearch(root, 50).found).toBe(false);
    expect(inorder(root)).toEqual(['30:F30', '40:F40', '60:F60', '70:F70', '80:F80']);
  });
});
