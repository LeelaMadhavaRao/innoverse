import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src="/assets/placeholder-logo.svg" alt="Innoverse Logo" />
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>
            Gallery
          </Link>
          <Link to="/team" className={location.pathname.startsWith('/team') ? 'active' : ''}>
            Team
          </Link>
          <Link to="/evaluator" className={location.pathname.startsWith('/evaluator') ? 'active' : ''}>
            Evaluator
          </Link>
          <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''}>
            Admin
          </Link>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
