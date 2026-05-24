import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar       from './components/Navbar';
import Home         from './pages/Home';
import Login        from './pages/Login';
import Register     from './pages/Register';
import VerifyEmail  from './pages/VerifyEmail';
import SavedPlans   from './pages/SavedPlans';
import Diary        from './pages/Diary';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/saved-plans"  element={<SavedPlans />} />
          <Route path="/diary"        element={<Diary />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
