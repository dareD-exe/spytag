import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import ApiTest from './ApiTest';

// Protected route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-pulse text-accent-primary">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          } />
          
          <Route path="/login" element={
            <AppLayout>
              <LoginPage />
            </AppLayout>
          } />
          
          <Route path="/search" element={
            <AppLayout>
              <SearchPage />
            </AppLayout>
          } />
          
          <Route path="/about" element={
            <AppLayout>
              <AboutPage />
            </AppLayout>
          } />
          
          {/* API Testing route */}
          <Route path="/api-test" element={
            <AppLayout>
              <ApiTest />
            </AppLayout>
          } />
          
          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={
            <AppLayout>
              <div className="container-custom py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-gray-400 mb-8">Oops! The page you are looking for doesn't exist.</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            </AppLayout>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
