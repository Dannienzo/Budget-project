import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { DollarSign, User, Menu, X, EqualApproximately, Rss, HandCoins } from 'lucide-react';

const navLinks = [
  { to: '/', icon: EqualApproximately, label: 'Home' },
  { to: '/About', icon: EqualApproximately, label: 'About Us' },
  { to: '/Blog', icon: Rss, label: 'Blog' },
  { to: '/Pricing', icon: HandCoins, label: 'Pricing' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-[0.95rem] ${
      isActive
        ? 'text-primary bg-primary/10 font-semibold'
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-3 pt-5">
      <nav className="mx-auto max-w-5xl bg-[rgb(18,21,20)] rounded-xl shadow-[0_4px_12px_rgba(165,240,209,0.3)]">
        <div className="flex items-center justify-between px-4 py-3">

          {/* Brand Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary shrink-0">
              <DollarSign size={20} color="#0b0b0f" />
            </div>
            <span className="font-bold text-white text-sm hidden sm:inline">
              Smart Budget & Expenses
            </span>
            <span className="font-bold text-white text-xs sm:hidden">
              Budget
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={getLinkClass}
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right side — User button + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/Signup"
              onClick={closeMenu}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              <User size={18} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-3">
            <ul className="flex flex-col gap-1">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={closeMenu}
                    className={getLinkClass}
                  >
                    <Icon size={15} />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

      </nav>
    </div>
  );
};

export default Navbar;