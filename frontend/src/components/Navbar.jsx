import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { openCart } from '../store/cartSlice';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cart = useSelector(state => state.cart);
  const items = cart?.items || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo-link">
             <img src="/logo.png" alt="BK Shop" className="nav-logo" />
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          {isAuthenticated ? (
            <>
              <span className="user-greeting">Hi, {user?.username}</span>
              {user?.is_staff && (
                <Link to="/admin-dashboard">Admin</Link>
              )}
              <button onClick={handleLogout} className="nav-btn">Logout</button>
            </>
          ) : (
             <Link to="/login">Login</Link>
          )}
          <button className="nav-btn cart-icon" onClick={() => dispatch(openCart())}>
              Cart ({items.length})
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
