import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { PackageProvider } from "./context/PackageContext";
import { LanguageProvider } from "./context/LanguageContext";
// Public Pages
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Packages from "./pages/Packages";

import Contact from "./pages/Contact";
import About from "./pages/About";

// Admin
import Admin from "./admin/Admin";
import AdminLogin from "./pages/AdminLogin"; // ← Added

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!currentUser || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <PackageProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-black text-white">
            <Navbar />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/packages" element={<Packages />} />

              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />

              {/* Admin Routes */}
              <Route path="/login" element={<AdminLogin />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <h1 className="text-center py-20 text-3xl">Page Not Found</h1>
                }
              />
            </Routes>

            <Footer />
          </div>
        </LanguageProvider>
      </PackageProvider>
    </AuthProvider>
  );
}

export default App;
