import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🥗 NutriPlanner
      </Link>
      <div className="navbar-actions">
        {user ? (
          <>
            <Link to="/diary"       className="nav-link">📓 Diary</Link>
            <Link to="/saved-plans" className="nav-link">📋 My Plans</Link>
            <span className="nav-user">👤 {user.name || user.email}</span>
            <button className="btn-nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="btn-nav-outline">Log in</Link>
            <Link to="/register" className="btn-nav-solid">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
