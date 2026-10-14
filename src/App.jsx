import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/auth.jsx';
import Landing from './pages/Landing.jsx';
import Catalog from './pages/Catalog.jsx';
import Checkout from './pages/Checkout.jsx';
import { Login, Signup } from './pages/Auth.jsx';
import { Dashboard, Profile, NotesPage, TestsPage } from './pages/Student.jsx';
import Learn from './pages/Learn.jsx';
import Protected from './components/Protected.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/courses" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout/:id" element={<Protected><Checkout /></Protected>} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/learn/:id" element={<Protected><Learn /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/notes" element={<Protected><NotesPage /></Protected>} />
          <Route path="/tests" element={<Protected><TestsPage /></Protected>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
