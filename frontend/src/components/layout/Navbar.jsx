import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/login');
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const isChatPage = location.pathname === '/chat';

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      {/* Logo */}
      <Link to="/" className={styles.logo}>
        TRAVELM<span>Ai</span>T
      </Link>

      {/* Desktop links — hide on chat page */}
      {!isChatPage && (
        <ul className={styles.links}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      )}

      {/* Right controls */}
      <div className={styles.right}>
        {user ? (
          <>
            <div className={styles.profileContainer}>
              <button
                className={styles.avatarBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {getInitial(user.name)}
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <span>Signed in as</span>
                    <strong>{user.name}</strong>
                  </div>
                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login"    className={styles.loginBtn}>Log In</Link>
            <Link to="/register" className={styles.registerBtnGhost}>Register</Link>
          </>
        )}

        {/* Hamburger — hidden on chat page */}
        {!isChatPage && (
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <i className={menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} />
          </button>
        )}
      </div>

      {/* Mobile drawer */}
      {menuOpen && !isChatPage && (
        <div className={styles.drawer}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}

          <div className={styles.drawerDivider}></div>

          {user ? (
            <>
              <span className={styles.drawerUser}>Hi, {user.name}</span>
              <button className={styles.drawerLogout} onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)} className={styles.loginBtn}>Log In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className={styles.registerBtnGhost} style={{ width: 'fit-content' }}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}