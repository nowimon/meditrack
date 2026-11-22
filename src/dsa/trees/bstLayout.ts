import type { BSTNode } from './bst';

export interface NodePos {
  key: number;
  label: string;
  x: number;
  y: number;
}

/**
 * Calculates (x, y) coordinates for SVG rendering of the BST.
 */
export function layoutTree(
  root: BSTNode | null,
  x: number,
  y: number,
  spread: number,
  result: NodePos[],
  edges: [number, number, number, number][],
): void {
  if (!root) return;
  result.push({ key: root.key, label: root.label, x, y });
  if (root.left) {
    const cx = x - spread;
    const cy = y + 60;
    edges.push([x, y, cx, cy]);
    layoutTree(root.left, cx, cy, spread / 2, result, edges);
  }
  if (root.right) {
    const cx = x + spread;
    const cy = y + 60;
    edges.push([x, y, cx, cy]);
    layoutTree(root.right, cx, cy, spread / 2, result, edges);
  }
}
