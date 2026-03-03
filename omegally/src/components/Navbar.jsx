import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import products from '../data/products.json';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { cartItems } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const categoriesRef = useRef(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const categories = ['all', ...new Set(products.map(p => p.category))];

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.logo}>
          Omegally
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          <Link to="/" className={styles.navLink}>Home</Link>

          {/* Categories Dropdown */}
          <div className={styles.dropdown} ref={categoriesRef}>
            <button
              className={styles.dropdownToggle}
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              onMouseEnter={() => setIsCategoriesOpen(true)}
            >
              Categories ▼
            </button>
            {isCategoriesOpen && (
              <div className={styles.dropdownMenu}>
                {categories.map(cat => (
                  <Link
                    key={cat}
                    to={`/products?category=${cat}`}
                    className={styles.dropdownItem}
                    onClick={() => setIsCategoriesOpen(false)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className={styles.navLink}>About</Link>
          
          <Link to="/cart" className={styles.navLink}>
            Cart
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>

          {/* User Icon with Dropdown */}
          <div className={styles.userMenuContainer} ref={userMenuRef}>
            <button
              className={styles.userIconButton}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User menu"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
              </svg>
            </button>
            {isUserMenuOpen && (
              <div className={styles.userDropdown}>
                {user ? (
                  <>
                    <span className={styles.userEmail}>
                      {user.name || user.email}
                    </span>
                    <Link 
                      to="/profile" 
                      className={styles.dropdownItem} 
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className={styles.dropdownItem}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className={styles.dropdownItem} 
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className={styles.dropdownItem} 
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button onClick={toggleDarkMode} className={styles.themeToggle}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
          
          <div className={styles.mobileCategories}>
            <div className={styles.mobileCategoriesTitle}>Categories</div>
            {categories.map(cat => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className={styles.mobileCategoryLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            ))}
          </div>

          <Link to="/about" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/cart" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Cart ({cartCount})</Link>
          
          {user ? (
            <>
              <span className={styles.mobileUserEmail}>
                {user.name || user.email}
              </span>
              <Link to="/profile" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }} 
                className={styles.mobileLink}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          )}
          
          <button onClick={toggleDarkMode} className={styles.mobileThemeToggle}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;