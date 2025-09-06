import { Link, useLocation } from 'react-router-dom';

function EvaluatorSidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="evaluator-sidebar">
      <nav>
        <ul>
          <li>
            <Link to="/evaluator" className={isActive('/evaluator') ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/evaluator/teams" className={isActive('/evaluator/teams') ? 'active' : ''}>
              Teams
            </Link>
          </li>
          <li>
            <Link to="/evaluator/evaluations" className={isActive('/evaluator/evaluations') ? 'active' : ''}>
              Evaluations
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default EvaluatorSidebar;
