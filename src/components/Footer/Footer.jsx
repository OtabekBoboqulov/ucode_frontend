import React from 'react';
import {Link} from 'react-router-dom';
import logoDark from '../../assets/logo_dark.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div>
            <Link to="/" className="h-8 block">
              <img src={logoDark} alt="Logo" className="h-full" />
            </Link>
            <p className="footer-message">
              Dasturlashni o'rganing, loyihalar yarating va kelajagingizni quring.
            </p>
          </div>
          <div className="footer-nav">
            <div>
              <h3 className="footer-nav-section-title">Platforma</h3>
              <ul className="footer-nav-links">
                <li><Link to="/" className="footer-nav-link">Kurslar</Link></li>
                <li><Link to="/about" className="footer-nav-link">Biz haqimizda</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="footer-nav-section-title">Bog'lanish</h3>
              <ul className="footer-nav-links">
                <li><a href="https://t.me/otabek_boboqulov2" target="_blank" className="footer-nav-link">Telegram</a></li>
                <li><a href="https://linkedin.com" target="_blank" className="footer-nav-link">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MuCode. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
