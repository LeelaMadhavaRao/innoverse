import { Outlet } from 'react-router-dom';
import TeamSidebar from './team-sidebar';

function TeamLayout({ children }) {
  return (
    <div className="team-layout">
      <TeamSidebar />
      <main className="team-content">
        <Outlet />
      </main>
    </div>
  );
}

export default TeamLayout;
