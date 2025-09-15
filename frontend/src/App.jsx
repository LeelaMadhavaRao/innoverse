import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/error-boundary';
import { useToast } from './hooks/use-toast';

// Admin Components

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
import EvaluatorDashboard from './pages/evaluator/dashboard';
import EvaluatorProfile from './pages/evaluator/profile';
import EvaluationCriteria from './pages/evaluator/criteria';
import TeamEvaluation from './pages/evaluator/evaluation';
import TeamEvaluationForm from './pages/evaluator/evaluation-form';
import EvaluatorTeams from './pages/evaluator/teams';
import EvaluatorEvaluations from './pages/evaluator/evaluations';

// Faculty Components
import FacultyLayout from './components/faculty/faculty-layout';
import FacultyProfile from './pages/faculty/profile';
import FacultyTeams from './pages/faculty/teams';
import FacultyEvaluation from './pages/faculty/evaluation';
import FacultyResults from './pages/faculty/results';

// Public Components
import Home from './pages/home';
import Login from './pages/login';
import Gallery from './pages/gallery';
import PosterLaunch from './pages/poster-launch';

// Auth Context Provider
import { AuthProvider, useAuth } from './context/auth-context';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const handler = (e) => {
      addToast({ title: 'Session expired', description: 'Your session has expired. Please login again.', type: 'destructive' });
      navigate('/login');
    };
    window.addEventListener('sessionExpired', handler);
    return () => window.removeEventListener('sessionExpired', handler);
  }, []);
  return (
    <ErrorBoundary>
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
            {/* Evaluator Dashboard (separate from layout) */}
            <Route
              path="/evaluator"
              element={
                <ProtectedRoute requiredRole="evaluator">
                  <EvaluatorDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Evaluator Profile (separate from layout) */}
            <Route
              path="/evaluator/profile"
              element={
                <ProtectedRoute requiredRole="evaluator">
                  <EvaluatorProfile />
                </ProtectedRoute>
              }
            />
            
            {/* Evaluation Criteria (separate from layout) */}
            <Route
              path="/evaluator/criteria"
              element={
                <ProtectedRoute requiredRole="evaluator">
                  <EvaluationCriteria />
                </ProtectedRoute>
              }
            />
            
            {/* Team Evaluation Routes */}
            <Route
              path="/evaluator/evaluation"
              element={
                <ProtectedRoute requiredRole="evaluator">
                  <TeamEvaluation />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/evaluator/evaluation/:teamId"
              element={
                <ProtectedRoute requiredRole="evaluator">
                  <TeamEvaluationForm />
                </ProtectedRoute>
              }
            />
            
            {/* Other Evaluator Routes with Layout */}
            <Route
              path="/evaluator/teams"
              element={
                <ProtectedRoute requiredRole="evaluator">
                  <EvaluatorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<EvaluatorTeams />} />
            </Route>
            
            <Route
              path="/evaluator/evaluations"
              element={
                <ProtectedRoute requiredRole="evaluator">
                  <EvaluatorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<EvaluatorEvaluations />} />
            </Route>

            {/* Faculty Routes */}
            <Route
              path="/faculty"
              element={<Navigate to="/faculty/profile" replace />}
            />
            <Route
              path="/faculty/profile"
              element={
                <ProtectedRoute requiredRole="faculty">
                  <FacultyProfile />
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
            <Route
              path="/faculty/evaluation"
              element={
                <ProtectedRoute requiredRole="faculty">
                  <FacultyEvaluation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/results"
              element={
                <ProtectedRoute requiredRole="faculty">
                  <FacultyResults />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
          </ThemeProvider>
        </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
