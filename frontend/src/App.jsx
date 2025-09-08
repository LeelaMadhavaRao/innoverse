import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/error-boundary';

// Admin Components
import AdminLayout from './components/admin/admin-layout';
import AdminDashboard from './pages/admin/index';
import AdminUsers from './pages/admin/users';
import AdminTeams from './pages/admin/teams';
import AdminFaculty from './pages/admin/faculty';
import AdminEvaluators from './pages/admin/evaluators';
import AdminEvaluations from './pages/admin/evaluations';
import AdminEmails from './pages/admin/emails';
import AdminGallery from './pages/admin/gallery';
import AdminPosterLaunch from './pages/admin/poster-launch';
import AdminCertificates from './pages/admin/certificates';

// Team Components
import TeamLayout from './components/team/team-layout';
import TeamProfile from './pages/team/profile';
import TeamResults from './pages/team/results';

// Evaluator Components
import EvaluatorLayout from './components/evaluator/evaluator-layout';
import EvaluatorTeams from './pages/evaluator/teams';
import EvaluatorEvaluations from './pages/evaluator/evaluations';

// Faculty Components
import FacultyLayout from './components/faculty/faculty-layout';
import FacultyDashboard from './pages/faculty';
import FacultyTeams from './pages/faculty/teams';

// Public Components
import Home from './pages/home';
import Login from './pages/login';
import Gallery from './pages/gallery';
import PosterLaunch from './pages/poster-launch';

// Auth Context Provider
import { AuthProvider, useAuth } from './context/auth-context';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ThemeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/poster-launch" element={<PosterLaunch />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="teams" element={<AdminTeams />} />
              <Route path="faculty" element={<AdminFaculty />} />
              <Route path="evaluators" element={<AdminEvaluators />} />
              <Route path="evaluations" element={<AdminEvaluations />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="emails" element={<AdminEmails />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="poster-launch" element={<AdminPosterLaunch />} />
              <Route path="certificates" element={<AdminCertificates />} />
            </Route>

            {/* Team Routes */}
            <Route
              path="/team"
              element={
                <ProtectedRoute requiredRole="team">
                  <TeamLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<TeamProfile />} />
              <Route path="results" element={<TeamResults />} />
            </Route>

            {/* Evaluator Routes */}
            <Route
              path="/evaluator"
              element={
                <ProtectedRoute requiredRole="evaluator">
                  <EvaluatorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="teams" replace />} />
              <Route path="teams" element={<EvaluatorTeams />} />
              <Route path="evaluations" element={<EvaluatorEvaluations />} />
            </Route>

            {/* Faculty Routes */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute requiredRole="faculty">
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/teams"
              element={
                <ProtectedRoute requiredRole="faculty">
                  <FacultyTeams />
                </ProtectedRoute>
              }
            />
          </Routes>
          
          <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
