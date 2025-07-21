import React, { useState } from 'react';
import { Menu, X, DollarSign, Home, PieChart, CreditCard, Target, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const styles = {
    nav: {
      background: 'linear-gradient(to right, #2563eb, #7c3aed)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    },
    container: {
       maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '4rem'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    logoIcon: {
      backgroundColor: 'white',
      borderRadius: '50%',
      padding: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    brandText: {
      color: 'white',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      margin: 0
    },
    desktopNav: {
      display: 'none',
      alignItems: 'center',
      gap: '2rem'
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      transition: 'color 0.2s ease',
      cursor: 'pointer'
    },
    userProfile: {
      display: 'none',
      alignItems: 'center',
      gap: '1rem'
    },
    profileButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(4px)',
      borderRadius: '50%',
      padding: '0.5rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mobileMenuButton: {
      display: 'block',
      color: 'white',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      transition: 'color 0.2s ease'
    },
    mobileNav: {
      display: 'block',
      padding: '0.5rem',
      paddingTop: '0.5rem',
      paddingBottom: '0.75rem'
    },
    mobileNavContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(4px)',
      borderRadius: '0.5rem',
      marginTop: '0.5rem',
      marginBottom: '1rem',
      padding: '0.5rem'
    },
    mobileNavLink: {
      color: 'white',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      marginBottom: '0.25rem'
    },
    mobileDivider: {
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      paddingTop: '0.5rem',
      marginTop: '0.5rem'
    }
  };

  // Media queries using CSS-in-JS approach
  const mediaStyles = `
    @media (min-width: 768px) {
      .desktop-nav {
        display: flex !important;
      }
      .user-profile {
        display: flex !important;
      }
      .mobile-menu-button {
        display: none !important;
      }
      .mobile-nav {
        display: none !important;
      }
    }
  `;

  return (
    <>
      <style>{mediaStyles}</style>
      <nav style={styles.nav}>
        <div style={styles.container}>
          <div style={styles.headerRow}>
            {/* Logo and Brand */}
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <DollarSign size={24} color="#2563eb" />
              </div>
              <span style={styles.brandText}>Smart Budget</span>
            </div>

            {/* Desktop Navigation */}
            <div 
              className="desktop-nav"
              style={styles.desktopNav}
            >
              <a 
                href="#dashboard" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#bfdbfe'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                <Home size={16} />
                <span>Dashboard</span>
              </a>
              <a 
                href="/Expense" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#bfdbfe'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                <CreditCard size={16} />
                <span>Expenses</span>
              </a>
              <a 
                href="#budget" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#bfdbfe'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                <Target size={16} />
                <span>Budget</span>
              </a>
              <a 
                href="#reports" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#bfdbfe'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                <PieChart size={16} />
                <span>Reports</span>
              </a>
              <a 
                href="#settings" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#bfdbfe'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                <Settings size={16} />
                <span>Settings</span>
              </a>
            </div>
            {/* User Profile */}
            <div 
              className="user-profile"
              style={styles.userProfile}
            >  
              <div> <Link to="./Login`" >Login</Link> </div>
              <div> <Link to="./Signup" >Signup</Link> </div>

              <button 
                style={styles.profileButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              >
                <User size={20} color="white" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="mobile-menu-button"
              onClick={toggleMenu}
              style={styles.mobileMenuButton}
              onMouseEnter={(e) => e.target.style.color = '#bfdbfe'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div 
              className="mobile-nav"
              style={styles.mobileNav}
            >
              <div style={styles.mobileNavContainer}>
                <a 
                  href="#dashboard" 
                  style={styles.mobileNavLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#bfdbfe';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'white';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <Home size={16} />
                  <span>Dashboard</span>
                </a>
                <a 
                  href="/Expense" 
                  style={styles.mobileNavLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#bfdbfe';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'white';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <CreditCard size={16} />
                  <span>Expenses</span>
                </a>
                <a 
                  href="#budget" 
                  style={styles.mobileNavLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#bfdbfe';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'white';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <Target size={16} />
                  <span>Budget</span>
                </a>
                <a 
                  href="#reports" 
                  style={styles.mobileNavLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#bfdbfe';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'white';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <PieChart size={16} />
                  <span>Reports</span>
                </a>
                <a 
                  href="#settings" 
                  style={styles.mobileNavLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#bfdbfe';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'white';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </a>
                <div style={styles.mobileDivider}>
                  <a 
                    href="#profile" 
                    style={styles.mobileNavLink}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#bfdbfe';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'white';
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;