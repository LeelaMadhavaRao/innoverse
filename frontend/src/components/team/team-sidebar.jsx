import { Link, useLocation } from 'react-router-dom';

function TeamSidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="team-sidebar">
      <nav>
        <ul>
          <li>
            <Link to="/team" className={isActive('/team') ? 'active' : ''}>
              Overview
            </Link>
          </li>
          <li>
            <Link to="/team/profile" className={isActive('/team/profile') ? 'active' : ''}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/team/gallery" className={isActive('/team/gallery') ? 'active' : ''}>
              Gallery
            </Link>
          </li>
          <li>
            <Link to="/team/results" className={isActive('/team/results') ? 'active' : ''}>
              Results
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default TeamSidebar;
