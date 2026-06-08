import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider      from './context/AuthContext';
import ProtectedRoute    from './components/layout/ProtectedRoute';
import Navbar            from './components/layout/Navbar';
import Footer            from './components/layout/Footer';
import Home              from './pages/Home';
import Login             from './pages/Login';
import Register          from './pages/Register';
import ChatPage          from './components/chat/ChatPage';
import PlannerPage       from './components/planner/PlannerPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planner"
            element={
              <ProtectedRoute>
                <PlannerPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
