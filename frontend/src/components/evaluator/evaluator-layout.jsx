import { Outlet } from 'react-router-dom';
import EvaluatorSidebar from './evaluator-sidebar';

function EvaluatorLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <EvaluatorSidebar />
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default EvaluatorLayout;
