import { Outlet } from 'react-router-dom';
import AdminSidebar from './admin-sidebar';

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
