import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import victorLogo from '../assets/victor.png';
import './Header.css';

function Header({ compareCount, onOpenCompare, onProductsClick, onLogoClick, onOpenSearch, onTeamVictorClick }) {
  const { user, logout, isAdmin } = useAuth();
  const { openUserProfile } = useClerk();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="header glass-panel">
        <div className="container header-content">
          <button className="logo-btn" onClick={() => { onLogoClick(); closeMobileMenu(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <div className="logo">
              <img src={victorLogo} alt="VICTOR Logo" className="logo-img" />
              <svg width="150" height="50" viewBox="0 2 150 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="8" y="38" fontSize="32" fontWeight="900" fontFamily="Arial, sans-serif" fill="#003DA5" letterSpacing="1.5">
                  VICTOR
                </text>
              </svg>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="nav-links">
            <a href="" onClick={(e) => { e.preventDefault(); onProductsClick(); }}>SẢN PHẨM</a>
            <a href="" onClick={(e) => { e.preventDefault(); onTeamVictorClick && onTeamVictorClick(); }}>TEAM VICTOR</a>
            <a href="" onClick={(e) => { e.preventDefault(); onOpenSearch(); }} style={{ cursor: 'pointer' }}>TÌM KIẾM</a>
          </nav>

          <div className="header-actions">
            <button className="compare-icon-btn" onClick={onOpenCompare} title="So sánh sản phẩm">
              <i className="fa-solid fa-scale-balanced"></i>
              {compareCount > 0 && <span className="compare-badge">{compareCount}</span>}
            </button>

            {/* Desktop user menu */}
            <div className="header-user-desktop">
              {user ? (
                <div className="user-menu" ref={dropdownRef}>
                  <button className="user-avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="user-avatar" />
                      : <span className="user-initial">{user.name?.charAt(0).toUpperCase()}</span>
                    }
                    <span className="user-name-short">{user.name?.split(' ').pop()}</span>
                    <i className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'}`} style={{ fontSize: 11 }}></i>
                  </button>
                  {dropdownOpen && (
                    <div className="user-dropdown">
                      <div className="dropdown-info">
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                        <span className={`dropdown-role ${user.role}`}>{user.role === 'admin' ? '👑 Admin' : '👤 User'}</span>
                      </div>
                      <div className="dropdown-divider" />
                      <button className="dropdown-item" onClick={() => { openUserProfile(); setDropdownOpen(false); }}>
                        <i className="fa-solid fa-gear"></i> Quản lý tài khoản
                      </button>
                      {isAdmin && (
                        <button className="dropdown-item" onClick={() => { navigate('/admin'); setDropdownOpen(false); }}>
                          <i className="fa-solid fa-shield-halved"></i> Quản lý Thông Tin
                        </button>
                      )}
                      <button className="dropdown-item logout" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="btn-login" onClick={() => navigate('/login')}>
                  <i className="fa-solid fa-user"></i> Đăng nhập
                </button>
              )}
            </div>

            {/* Hamburger button (mobile only) */}
            <button
              className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mở menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu} />
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-links">
          <a href="" onClick={(e) => { e.preventDefault(); onProductsClick(); closeMobileMenu(); }}>SẢN PHẨM</a>
          <a href="" onClick={(e) => { e.preventDefault(); onTeamVictorClick && onTeamVictorClick(); closeMobileMenu(); }}>TEAM VICTOR</a>
          <a href="" onClick={(e) => { e.preventDefault(); onOpenSearch(); closeMobileMenu(); }}>TÌM KIẾM</a>
        </nav>
        <div className="mobile-menu-footer">
          {user ? (
            <>
              <div className="mobile-user-info">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="user-avatar" />
                  : <span className="user-initial">{user.name?.charAt(0).toUpperCase()}</span>
                }
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{user.email}</div>
                </div>
              </div>
              <button className="mobile-menu-item" onClick={() => { openUserProfile(); closeMobileMenu(); }}>
                <i className="fa-solid fa-gear"></i> Quản lý tài khoản
              </button>
              {isAdmin && (
                <button className="mobile-menu-item" onClick={() => { navigate('/admin'); closeMobileMenu(); }}>
                  <i className="fa-solid fa-shield-halved"></i> Quản lý Thông Tin
                </button>
              )}
              <button className="mobile-menu-item logout" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
              </button>
            </>
          ) : (
            <button className="btn-login" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { navigate('/login'); closeMobileMenu(); }}>
              <i className="fa-solid fa-user"></i> Đăng nhập
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
