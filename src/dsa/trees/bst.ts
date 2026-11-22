// Binary Search Tree (BST) operations for Facility Indexing

export interface BSTNode {
  key: number;
  label: string;
  left: BSTNode | null;
  right: BSTNode | null;
}

/**
 * Inserts a key-label pair into the BST. Duplicate keys are ignored.
 */
export function bstInsert(root: BSTNode | null, key: number, label: string): BSTNode {
  if (!root) return { key, label, left: null, right: null };
  if (key < root.key) return { ...root, left: bstInsert(root.left, key, label) };
  if (key > root.key) return { ...root, right: bstInsert(root.right, key, label) };
  return root; // duplicate ignored
}

/**
 * Deletes a key from the BST using standard in-order successor replacement.
 */
export function bstDelete(root: BSTNode | null, key: number): BSTNode | null {
  if (!root) return null;
  if (key < root.key) return { ...root, left: bstDelete(root.left, key) };
  if (key > root.key) return { ...root, right: bstDelete(root.right, key) };
  // Found node to delete
  if (!root.left) return root.right;
  if (!root.right) return root.left;
  // Two children: find inorder successor (minimum of right subtree)
  let succ = root.right;
  while (succ.left) succ = succ.left;
  return { ...succ, left: root.left, right: bstDelete(root.right, succ.key) };
}

/**
 * Searches for a key in the BST, recording the comparison path.
 */
export function bstSearch(
  root: BSTNode | null,
  key: number,
  path: number[] = [],
): { found: boolean; path: number[] } {
  if (!root) return { found: false, path };
  const newPath = [...path, root.key];
  if (key === root.key) return { found: true, path: newPath };
  if (key < root.key) return bstSearch(root.left, key, newPath);
  return bstSearch(root.right, key, newPath);
}

/**
 * In-order traversal: Left -> Root -> Right (produces sorted order).
 */
export function inorder(root: BSTNode | null): string[] {
  if (!root) return [];
  return [...inorder(root.left), `${root.key}:${root.label}`, ...inorder(root.right)];
}

/**
 * Pre-order traversal: Root -> Left -> Right.
 */
export function preorder(root: BSTNode | null): string[] {
  if (!root) return [];
  return [`${root.key}:${root.label}`, ...preorder(root.left), ...preorder(root.right)];
}

/**
 * Post-order traversal: Left -> Right -> Root.
 */
export function postorder(root: BSTNode | null): string[] {
  if (!root) return [];
  return [...postorder(root.left), ...postorder(root.right), `${root.key}:${root.label}`];
}

/**
 * Computes maximum depth of the BST.
 */
export function bstHeight(root: BSTNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(bstHeight(root.left), bstHeight(root.right));
}
