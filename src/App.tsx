import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { WasteRequests } from './pages/WasteRequests';
import { SearchSortExplorer } from './pages/SearchSortExplorer';
import { LinkedListExplorer } from './pages/LinkedListExplorer';
import { StackQueueExplorer } from './pages/StackQueueExplorer';
import { BSTExplorer } from './pages/BSTExplorer';
import { GraphExplorer } from './pages/GraphExplorer';
import { RoutePlanner } from './pages/RoutePlanner';
import { PerformanceLab } from './pages/PerformanceLab';
import { useApp } from './context/AppContext';

export function App() {
  const { resetRequests } = useApp();

  const handleResetData = () => {
    if (window.confirm('Reset all data to the default 20-record sample dataset?')) {
      resetRequests();
    }
  };

  return (
    <HashRouter>
      <div className="flex min-h-screen flex-col bg-slate-100/60 font-sans text-slate-900 antialiased">
        <Header onResetData={handleResetData} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-slate-50/50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/requests" element={<WasteRequests />} />
              <Route path="/search-sort" element={<SearchSortExplorer />} />
              <Route path="/linked-lists" element={<LinkedListExplorer />} />
              <Route path="/stacks-queues" element={<StackQueueExplorer />} />
              <Route path="/bst" element={<BSTExplorer />} />
              <Route path="/graphs" element={<GraphExplorer />} />
              <Route path="/route-planner" element={<RoutePlanner />} />
              <Route path="/benchmarks" element={<PerformanceLab />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
