import { Outlet } from 'react-router-dom';

function TeamLayout({ children }) {
  return (
    <div className="team-layout min-h-screen">
      <main className="team-content w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default TeamLayout;
