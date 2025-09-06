import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Innoverse</h3>
          <p>Your platform for innovation and collaboration</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/evaluator">Evaluator</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Innoverse. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
