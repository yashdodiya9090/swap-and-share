import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import NewItems from './pages/NewItems';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import HowItWorks from './pages/HowItWorks';


// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => (
  <div className="page-wrapper">
    <Header />
    <main className="page-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/new-items" element={<NewItems />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/add-item" element={
          <ProtectedRoute><AddItem /></ProtectedRoute>
        } />
        <Route path="/edit-item/:type/:id" element={
          <ProtectedRoute><EditItem /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
