import { useAuth } from '../../context/auth-context';

function FacultyLayout({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {children}
    </div>
  );
}

export default FacultyLayout;


