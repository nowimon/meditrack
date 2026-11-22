# MediTrack DSA Lab — Complexity & Algorithm Foundations (Unit 1 Reference)

This document provides the theoretical and mathematical foundation for analyzing algorithms in the **MediTrack DSA Lab** project, matching the university syllabus requirements for Unit 1.

---

## 1. Asymptotic Notations: Big-O, Big-Ω, and Big-Θ

Asymptotic notations describe how an algorithm's running time or memory usage scales as the input size $n$ approaches infinity ($n \to \infty$).

### 1.1 Big-O Notation ($O$) — Asymptotic Upper Bound
- **Mathematical Definition:**
  $$f(n) = O(g(n)) \iff \exists \text{ positive constants } c > 0 \text{ and } n_0 \ge 1 \text{ such that } 0 \le f(n) \le c \cdot g(n) \quad \forall n \ge n_0$$
- **Meaning:** Worst-case guarantee. The execution time of the algorithm will not exceed $c \cdot g(n)$ for sufficiently large inputs.
- **Example in MediTrack:** Linear search has $O(n)$ time complexity. If the target medical-waste request is at the last index or missing, it makes at most $n$ comparisons.

### 1.2 Big-Omega Notation ($\Omega$) — Asymptotic Lower Bound
- **Mathematical Definition:**
  $$f(n) = \Omega(g(n)) \iff \exists \text{ positive constants } c > 0 \text{ and } n_0 \ge 1 \text{ such that } 0 \le c \cdot g(n) \le f(n) \quad \forall n \ge n_0$$
- **Meaning:** Best-case guarantee. The algorithm will require at least $c \cdot g(n)$ operations.
- **Example in MediTrack:** Bubble sort with an early-exit swap flag is $\Omega(n)$ when the request array is already sorted in ascending order (a single verification pass of $n-1$ comparisons).

### 1.3 Big-Theta Notation ($\Theta$) — Asymptotically Tight Bound
- **Mathematical Definition:**
  $$f(n) = \Theta(g(n)) \iff \exists \text{ positive constants } c_1, c_2 > 0 \text{ and } n_0 \ge 1 \text{ such that } 0 \le c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \quad \forall n \ge n_0$$
- **Equivalence:** $f(n) = \Theta(g(n)) \iff f(n) = O(g(n)) \text{ and } f(n) = \Omega(g(n))$.
- **Meaning:** The exact growth rate. The running time is trapped between $c_1 \cdot g(n)$ and $c_2 \cdot g(n)$.
- **Example in MediTrack:** Merge sort runs in $\Theta(n \log n)$ across all cases (best, average, worst) because it unconditionally splits the array in halves and merges them.

---

## 2. Best, Average, and Worst-Case Analysis

1. **Best Case:** The minimum number of steps required on an input of size $n$ under the most favorable configuration (e.g. searching for an element at index 0).
2. **Average Case:** The expected number of steps over all possible permutations of inputs of size $n$, assuming a uniform probability distribution.
3. **Worst Case:** The maximum number of steps required on an adversary input of size $n$ (e.g. searching for a missing element, or sorting reverse-ordered data with simple quick sort).

---

## 3. Time-Space Trade-Offs

In software and algorithmic systems, optimizing for speed often consumes additional memory, and minimizing memory often increases computational steps:

| Approach | Time Complexity | Auxiliary Space | Trade-Off Description |
|---|---|---|---|
| **Merge Sort** | $O(n \log n)$ | $O(n)$ | Fast, stable, guaranteed $O(n \log n)$, but requires an auxiliary array of size $n$ during merge passes. |
| **Quick Sort (In-Place)** | $O(n \log n)$ avg, $O(n^2)$ worst | $O(\log n)$ stack | In-place partition avoids the $O(n)$ auxiliary buffer, but recursive call stack consumes memory and worst-case time degrades to $O(n^2)$ if pivot choice is skewed. |
| **Insertion Sort** | $O(n^2)$ avg, $O(n)$ best | $O(1)$ | Strictly in-place with zero auxiliary memory, highly efficient on small or nearly-sorted datasets, but unacceptably slow on large random arrays. |
| **Linear Search** | $O(n)$ | $O(1)$ | Requires zero pre-processing or memory overhead; operates on unsorted raw incoming streams. |
| **Binary Search** | $O(\log n)$ | $O(1)$ | Exponentially faster query time, but incurs the precondition cost of maintaining sorted array order ($O(n \log n)$ initial sort or $O(n)$ sorted insertion). |

---

## 4. Recursion and Recurrence Analysis

A recursive algorithm breaks a problem into smaller sub-instances of the same problem, continuing until a **base case** is reached.

### 4.1 Master Theorem Reference (Divide & Conquer)
For recurrences of the form:
$$T(n) = a \cdot T(n / b) + f(n)$$
where $a \ge 1$, $b > 1$:
- **Merge Sort:** $T(n) = 2T(n/2) + \Theta(n) \implies a = 2, b = 2, f(n) = \Theta(n)$.
  Here $n^{\log_b a} = n^{\log_2 2} = n^1$. Since $f(n) = \Theta(n)$, Case 2 applies:
  $$T(n) = \Theta(n \log n)$$
- **Binary Search:** $T(n) = T(n/2) + \Theta(1) \implies a = 1, b = 2, f(n) = \Theta(1)$.
  Here $n^{\log_b a} = n^{\log_2 1} = n^0 = 1$. Case 2 applies:
  $$T(n) = \Theta(\log n)$$
- **Linear Recursion (e.g. Recursive Waste Sum):**
  $$T(n) = T(n-1) + \Theta(1) \implies T(n) = \Theta(n) \text{ time, } \Theta(n) \text{ call-stack space}$$
