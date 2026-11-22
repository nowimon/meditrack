import React, { useState, useCallback } from 'react';
import { PageShell } from '../components/layout/PageShell';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Stack, StackOverflowError, StackUnderflowError } from '../dsa/stacks/stack';
import { LinearQueue, QueueUnderflowError } from '../dsa/queues/linearQueue';
import { CircularQueue, QueueOverflowError } from '../dsa/queues/circularQueue';
import { PriorityQueue } from '../dsa/queues/priorityQueue';
import { StackPanel } from '../components/stackQueue/StackPanel';
import { LinearQueuePanel } from '../components/stackQueue/LinearQueuePanel';
import { CircularQueuePanel } from '../components/stackQueue/CircularQueuePanel';
import { PriorityQueuePanel } from '../components/stackQueue/PriorityQueuePanel';

type Tab = 'stack' | 'linear' | 'circular' | 'priority';

const CAPACITY = 8;

export const StackQueueExplorer: React.FC = () => {
  const { requests } = useApp();
  const [tab, setTab] = useState<Tab>('stack');

  // Operational feedback messages
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'warning' | 'info';
    message: string;
  } | null>(null);

  // Peeked highlight tracker
  const [peekedItem, setPeekedItem] = useState<string | null>(null);

  // --- 1. STACK STATE ---
  const [stack] = useState(() => new Stack<string>(CAPACITY));
  const [stackItems, setStackItems] = useState<string[]>([]);
  const [stackInput, setStackInput] = useState('');
  const [stackLog, setStackLog] = useState<string[]>([]);

  // --- 2. LINEAR QUEUE STATE ---
  const [lq] = useState(() => new LinearQueue<string>());
  const [lqItems, setLqItems] = useState<string[]>([]);
  const [lqInput, setLqInput] = useState('');
  const [lqLog, setLqLog] = useState<string[]>([]);

  // --- 3. CIRCULAR QUEUE STATE ---
  const [cq] = useState(() => new CircularQueue<string>(CAPACITY));
  const [cqItems, setCqItems] = useState<string[]>([]);
  const [cqRawBuffer, setCqRawBuffer] = useState<(string | null)[]>(new Array(CAPACITY).fill(null));
  const [cqFront, setCqFront] = useState(0);
  const [cqRear, setCqRear] = useState(-1);
  const [cqInput, setCqInput] = useState('');
  const [cqLog, setCqLog] = useState<string[]>([]);

  // --- 4. PRIORITY QUEUE STATE ---
  const [pq] = useState(() => new PriorityQueue<string>('max'));
  const [pqItems, setPqItems] = useState<{ item: string; priority: number }[]>([]);
  const [pqInput, setPqInput] = useState('ICU Viral Specimen (Hazardous)');
  const [pqPriority, setPqPriority] = useState(4);
  const [pqLog, setPqLog] = useState<string[]>([]);

  const addLog = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string[]>>, msg: string) => {
      setter((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15));
    },
    []
  );

  const showFeedback = useCallback((type: 'success' | 'warning' | 'info', message: string) => {
    setFeedback({ type, message });
  }, []);

  // -------------------------------------------------------------
  // STACK OPERATIONS (LIFO)
  // -------------------------------------------------------------
  const stackPush = useCallback(() => {
    setPeekedItem(null);
    const val = stackInput.trim() || `Action: Dispatch #${Math.floor(100 + Math.random() * 900)}`;
    try {
      stack.push(val);
      setStackItems(stack.toArray());
      addLog(setStackLog, `push("${val}") → Size: ${stack.size()}/${CAPACITY}`);
      showFeedback('success', `Push: Added "${val}" to top of Stack.`);
      setStackInput('');
    } catch (e) {
      if (e instanceof StackOverflowError) {
        showFeedback('warning', `⚠️ Stack Overflow! Max capacity of ${CAPACITY} items reached. Cannot push.`);
        addLog(setStackLog, `⚠️ OVERFLOW: Stack is full (capacity=${CAPACITY})`);
      }
    }
  }, [stack, stackInput, addLog, showFeedback]);

  const stackPop = useCallback(() => {
    setPeekedItem(null);
    try {
      const val = stack.pop();
      setStackItems(stack.toArray());
      addLog(setStackLog, `pop() → Removed "${val}" from Top · Remaining size=${stack.size()}`);
      showFeedback('info', `Pop: Removed "${val}" from the top.`);
    } catch (e) {
      if (e instanceof StackUnderflowError) {
        showFeedback('warning', `⚠️ Stack Underflow! Cannot pop because the stack is empty.`);
        addLog(setStackLog, `⚠️ UNDERFLOW: Stack is empty`);
      }
    }
  }, [stack, addLog, showFeedback]);

  const stackPeek = useCallback(() => {
    try {
      const val = stack.peek();
      setPeekedItem(val);
      addLog(setStackLog, `peek() → Top element is "${val}" (Item stays on stack)`);
      showFeedback('info', `Peek: Top element is "${val}" (not removed).`);
    } catch (e) {
      if (e instanceof StackUnderflowError) {
        showFeedback('warning', `⚠️ Stack Underflow! Cannot peek into an empty stack.`);
        addLog(setStackLog, `⚠️ UNDERFLOW: Stack is empty`);
      }
    }
  }, [stack, addLog, showFeedback]);

  const stackReset = useCallback(() => {
    stack.clear();
    setStackItems([]);
    setStackLog([]);
    setPeekedItem(null);
    showFeedback('info', 'Stack cleared to empty state.');
  }, [stack, showFeedback]);

  const loadStackDemo = useCallback(() => {
    stack.clear();
    const demoActions = [
      'Dispatched Van #1 to Surgery Ward',
      'Assigned Yellow Biohazard Bin #4',
      'Recorded 14.5 kg Sharps Waste',
      'Authorized Incinerator Transfer',
    ];
    demoActions.forEach((act) => stack.push(act));
    setStackItems(stack.toArray());
    setPeekedItem(null);
    addLog(setStackLog, `Loaded ${demoActions.length} MediTrack recent dispatch actions for Undo.`);
    showFeedback('success', `Loaded ${demoActions.length} demo actions into Undo Stack.`);
  }, [stack, addLog, showFeedback]);

  // -------------------------------------------------------------
  // LINEAR QUEUE OPERATIONS (FIFO)
  // -------------------------------------------------------------
  const lqEnqueue = useCallback(() => {
    setPeekedItem(null);
    const val = lqInput.trim() || `Routine Pickup: Ward ${Math.floor(1 + Math.random() * 8)}`;
    lq.enqueue(val);
    setLqItems(lq.toArray());
    addLog(setLqLog, `enqueue("${val}") → Queue Size: ${lq.size()}`);
    showFeedback('success', `Enqueue: Added "${val}" to REAR of queue.`);
    setLqInput('');
  }, [lq, lqInput, addLog, showFeedback]);

  const lqDequeue = useCallback(() => {
    setPeekedItem(null);
    try {
      const val = lq.dequeue();
      setLqItems(lq.toArray());
      addLog(setLqLog, `dequeue() → Serviced "${val}" from FRONT · Remaining: ${lq.size()}`);
      showFeedback('info', `Dequeue: Serviced "${val}" from the FRONT.`);
    } catch (e) {
      if (e instanceof QueueUnderflowError) {
        showFeedback('warning', `⚠️ Queue Underflow! Cannot dequeue because queue is empty.`);
        addLog(setLqLog, `⚠️ UNDERFLOW: Queue is empty`);
      }
    }
  }, [lq, addLog, showFeedback]);

  const lqPeek = useCallback(() => {
    try {
      const val = lq.peek();
      setPeekedItem(val);
      addLog(setLqLog, `peek() → Next to be serviced is "${val}"`);
      showFeedback('info', `Peek: FRONT item is "${val}" (not removed).`);
    } catch (e) {
      if (e instanceof QueueUnderflowError) {
        showFeedback('warning', `⚠️ Queue Underflow! Cannot peek into an empty queue.`);
        addLog(setLqLog, `⚠️ UNDERFLOW: Queue is empty`);
      }
    }
  }, [lq, addLog, showFeedback]);

  const lqReset = useCallback(() => {
    while (!lq.isEmpty()) {
      try { lq.dequeue(); } catch { break; }
    }
    setLqItems([]);
    setLqLog([]);
    setPeekedItem(null);
    showFeedback('info', 'Linear Queue cleared.');
  }, [lq, showFeedback]);

  const loadLqDemo = useCallback(() => {
    while (!lq.isEmpty()) {
      try { lq.dequeue(); } catch { break; }
    }
    const normalRequests = requests
      .filter((r) => r.urgencyScore < 70)
      .slice(0, 4)
      .map((r) => `Req #${r.id}: ${r.wardOrDepartment} (${r.wasteCategory} - ${r.wasteWeightKg}kg)`);

    const fallbacks = [
      'Req #101: General Ward A (Yellow - 12kg)',
      'Req #102: Pediatrics Clinic (Red - 8kg)',
      'Req #103: OPD Laboratory (Blue - 5kg)',
      'Req #104: Dialysis Center (White - 10kg)',
    ];

    const toLoad = normalRequests.length > 0 ? normalRequests : fallbacks;
    toLoad.forEach((item) => lq.enqueue(item));
    setLqItems(lq.toArray());
    setPeekedItem(null);
    addLog(setLqLog, `Loaded ${toLoad.length} MediTrack standard pickup requests.`);
    showFeedback('success', `Loaded ${toLoad.length} routine pickup requests into FIFO Queue.`);
  }, [lq, requests, addLog, showFeedback]);

  // -------------------------------------------------------------
  // CIRCULAR QUEUE OPERATIONS (RING BUFFER)
  // -------------------------------------------------------------
  const syncCqState = useCallback(() => {
    setCqItems(cq.toArray());
    setCqRawBuffer(cq.getRawBuffer());
    setCqFront(cq.getFrontIndex());
    setCqRear(cq.getRearIndex());
  }, [cq]);

  const cqEnqueue = useCallback(() => {
    setPeekedItem(null);
    const val = cqInput.trim() || `Bin #${Math.floor(10 + Math.random() * 90)}`;
    try {
      cq.enqueue(val);
      syncCqState();
      addLog(
        setCqLog,
        `enqueue("${val}") → Buffer: ${cq.size()}/${CAPACITY} slots used [Rear index: ${cq.getRearIndex()}]`
      );
      showFeedback('success', `Enqueue: Placed "${val}" at rear slot [${cq.getRearIndex()}].`);
      setCqInput('');
    } catch (e) {
      if (e instanceof QueueOverflowError) {
        showFeedback('warning', `⚠️ Circular Queue Overflow! All ${CAPACITY} van compartments are full.`);
        addLog(setCqLog, `⚠️ OVERFLOW: Ring buffer is completely full (size=${CAPACITY})`);
      }
    }
  }, [cq, cqInput, syncCqState, addLog, showFeedback]);

  const cqDequeue = useCallback(() => {
    setPeekedItem(null);
    try {
      const prevFront = cq.getFrontIndex();
      const val = cq.dequeue();
      syncCqState();
      addLog(setCqLog, `dequeue() → Unloaded "${val}" from slot [${prevFront}] · Remaining: ${cq.size()}/${CAPACITY}`);
      showFeedback('info', `Dequeue: Unloaded "${val}" from front slot [${prevFront}].`);
    } catch (e) {
      if (e instanceof QueueUnderflowError) {
        showFeedback('warning', `⚠️ Circular Queue Underflow! Buffer is empty. Nothing to dequeue.`);
        addLog(setCqLog, `⚠️ UNDERFLOW: Ring buffer is empty`);
      }
    }
  }, [cq, syncCqState, addLog, showFeedback]);

  const cqPeek = useCallback(() => {
    try {
      const val = cq.peek();
      setPeekedItem(val);
      addLog(setCqLog, `peek() → Front slot [${cq.getFrontIndex()}] contains "${val}"`);
      showFeedback('info', `Peek: Front slot [${cq.getFrontIndex()}] has "${val}".`);
    } catch (e) {
      if (e instanceof QueueUnderflowError) {
        showFeedback('warning', `⚠️ Circular Queue Underflow! Buffer is empty.`);
        addLog(setCqLog, `⚠️ UNDERFLOW: Ring buffer is empty`);
      }
    }
  }, [cq, addLog, showFeedback]);

  const cqReset = useCallback(() => {
    cq.clear();
    syncCqState();
    setCqLog([]);
    setPeekedItem(null);
    showFeedback('info', 'Circular buffer cleared.');
  }, [cq, syncCqState, showFeedback]);

  const loadCqDemo = useCallback(() => {
    cq.clear();
    const demoBins = [
      'ICU Sharps Bin',
      'ER Cytotoxic Vial',
      'Lab Blood Agar',
      'Surg Cloth Swabs',
      'Patho Tissue Tube',
    ];
    demoBins.forEach((b) => cq.enqueue(b));
    syncCqState();
    setPeekedItem(null);
    addLog(setCqLog, `Loaded ${demoBins.length} waste van collection compartments.`);
    showFeedback('success', `Loaded ${demoBins.length} bins into collection van buffer.`);
  }, [cq, syncCqState, addLog, showFeedback]);

  // -------------------------------------------------------------
  // PRIORITY QUEUE OPERATIONS (MAX-HEAP)
  // -------------------------------------------------------------
  const pqEnqueue = useCallback(() => {
    setPeekedItem(null);
    const val = pqInput.trim();
    if (!val) return;
    pq.enqueue(val, pqPriority);
    setPqItems(pq.entries());
    addLog(setPqLog, `enqueue("${val}", Priority=${pqPriority}) → Total Heap Size: ${pq.size()}`);
    showFeedback('success', `Enqueue: Added "${val}" with Priority ${pqPriority}.`);
  }, [pq, pqInput, pqPriority, addLog, showFeedback]);

  const pqDequeue = useCallback(() => {
    setPeekedItem(null);
    const top = pq.tryDequeue();
    if (top === null) {
      showFeedback('warning', `⚠️ Priority Queue Underflow! No items waiting.`);
      addLog(setPqLog, `⚠️ UNDERFLOW: Priority queue is empty`);
      return;
    }
    setPqItems(pq.entries());
    addLog(setPqLog, `dequeue() → Dispatched "${top}" (Highest priority extracted) · Heap size: ${pq.size()}`);
    showFeedback('info', `Dequeue: Dispatched highest priority request "${top}".`);
  }, [pq, addLog, showFeedback]);

  const pqPeek = useCallback(() => {
    const top = pq.tryPeek();
    const prio = pq.peekPriority();
    if (top === null) {
      showFeedback('warning', `⚠️ Priority Queue Underflow! Queue is empty.`);
      addLog(setPqLog, `⚠️ UNDERFLOW: Priority queue is empty`);
      return;
    }
    setPeekedItem(top);
    addLog(setPqLog, `peek() → Next highest priority item is "${top}" (Priority: ${prio})`);
    showFeedback('info', `Peek: Next in line is "${top}" (Priority P${prio}).`);
  }, [pq, addLog, showFeedback]);

  const pqReset = useCallback(() => {
    pq.clear();
    setPqItems([]);
    setPqLog([]);
    setPeekedItem(null);
    showFeedback('info', 'Priority queue cleared.');
  }, [pq, showFeedback]);

  const loadPqDemo = useCallback(() => {
    pq.clear();
    const urgentRequests = requests
      .filter((r) => r.urgencyScore >= 70)
      .slice(0, 5)
      .map((r) => ({
        label: `Req #${r.id}: ${r.wardOrDepartment} (${r.wasteCategory} - Urgency ${r.urgencyScore})`,
        priority: r.wasteCategory === 'YELLOW' ? 4 : r.wasteCategory === 'RED' ? 3 : 2,
      }));

    const fallbacks = [
      { label: 'Req #108: ICU COVID Isolation (YELLOW - Urgency 95)', priority: 4 },
      { label: 'Req #112: Oncology Cytotoxic Drugs (YELLOW - Urgency 92)', priority: 4 },
      { label: 'Req #105: Emergency Surgery Blood Tubing (RED - Urgency 82)', priority: 3 },
      { label: 'Req #103: Trauma Center Scalpels & Needles (WHITE - Urgency 78)', priority: 2 },
      { label: 'Req #110: Pharmacy Glass Ampoules (BLUE - Urgency 50)', priority: 1 },
    ];

    const toLoad = urgentRequests.length > 0 ? urgentRequests : fallbacks;
    toLoad.forEach((s) => pq.enqueue(s.label, s.priority));
    setPqItems(pq.entries());
    setPeekedItem(null);
    addLog(setPqLog, `Loaded ${toLoad.length} urgent MediTrack biohazard requests.`);
    showFeedback('success', `Loaded ${toLoad.length} high-priority biohazard requests into Priority Queue.`);
  }, [pq, requests, addLog, showFeedback]);

  // Tabs metadata
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'stack', label: 'Stack (LIFO)', icon: '📚' },
    { id: 'linear', label: 'Linear Queue (FIFO)', icon: '→' },
    { id: 'circular', label: 'Circular Queue (Ring Buffer)', icon: '↻' },
    { id: 'priority', label: 'Priority Queue (Max-Heap)', icon: '⚡' },
  ];

  return (
    <PageShell
      title="Stacks & Queues Explorer"
      subtitle="Interactive LIFO stack and FIFO/priority queue operations with visual feedback and live data connection"
      complexity="Push/Pop/Enqueue/Dequeue: O(1) · Priority Queue Insert/Extract: O(log n)"
    >
      {/* Operation Definition Bar (Beginner Friendly Cheatsheet) */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          <HelpCircle className="h-4 w-4 text-emerald-600" />
          <span>Quick Operation Reference for Viva & Faculty Demo</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            <span className="font-bold text-emerald-700 block">Stack</span>
            <span className="text-[11px] text-slate-600">LIFO: last action added is undone first.</span>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            <span className="font-bold text-emerald-700 block">Queue</span>
            <span className="text-[11px] text-slate-600">FIFO: first request added is processed first.</span>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            <span className="font-bold text-amber-700 block">Circular Queue</span>
            <span className="text-[11px] text-slate-600">Fixed ring buffer reusing empty slots.</span>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            <span className="font-bold text-indigo-700 block">Priority Queue</span>
            <span className="text-[11px] text-slate-600">Urgency-first: higher priority served first.</span>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            <span className="font-bold text-slate-700 block">Push / Enqueue</span>
            <span className="text-[11px] text-slate-600">Add an item to the collection.</span>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            <span className="font-bold text-rose-700 block">Pop / Dequeue</span>
            <span className="text-[11px] text-slate-600">Remove & return the next item.</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-5 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setPeekedItem(null);
              setFeedback(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              tab === t.id
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Global Status/Feedback Banner (Shows after every click) */}
      {feedback && (
        <div
          className={`mb-4 rounded-xl border px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-all ${
            feedback.type === 'warning'
              ? 'border-rose-300 bg-rose-50 text-rose-800'
              : feedback.type === 'success'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
              : 'border-blue-300 bg-blue-50 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'warning' ? (
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            ) : feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-[11px] font-normal hover:underline opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Panels */}
      {tab === 'stack' && (
        <StackPanel
          capacity={CAPACITY}
          stackItems={stackItems}
          peekedItem={peekedItem}
          stackInput={stackInput}
          setStackInput={setStackInput}
          stackPush={stackPush}
          stackPop={stackPop}
          stackPeek={stackPeek}
          stackReset={stackReset}
          loadStackDemo={loadStackDemo}
          stackLog={stackLog}
        />
      )}

      {tab === 'linear' && (
        <LinearQueuePanel
          lqItems={lqItems}
          peekedItem={peekedItem}
          lqInput={lqInput}
          setLqInput={setLqInput}
          lqEnqueue={lqEnqueue}
          lqDequeue={lqDequeue}
          lqPeek={lqPeek}
          lqReset={lqReset}
          loadLqDemo={loadLqDemo}
          lqLog={lqLog}
        />
      )}

      {tab === 'circular' && (
        <CircularQueuePanel
          capacity={CAPACITY}
          cqItems={cqItems}
          cqRawBuffer={cqRawBuffer}
          cqFront={cqFront}
          cqRear={cqRear}
          peekedItem={peekedItem}
          cqInput={cqInput}
          setCqInput={setCqInput}
          cqEnqueue={cqEnqueue}
          cqDequeue={cqDequeue}
          cqPeek={cqPeek}
          cqReset={cqReset}
          loadCqDemo={loadCqDemo}
          cqLog={cqLog}
        />
      )}

      {tab === 'priority' && (
        <PriorityQueuePanel
          pqItems={pqItems}
          peekedItem={peekedItem}
          pqInput={pqInput}
          setPqInput={setPqInput}
          pqPriority={pqPriority}
          setPqPriority={setPqPriority}
          pqEnqueue={pqEnqueue}
          pqDequeue={pqDequeue}
          pqPeek={pqPeek}
          pqReset={pqReset}
          loadPqDemo={loadPqDemo}
          pqLog={pqLog}
        />
      )}
    </PageShell>
  );
};
