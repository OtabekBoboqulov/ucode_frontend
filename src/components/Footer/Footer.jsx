import React from 'react';
import './Footer.css';
import logoLight from '../../assets/logo_light.png';
import logoDark from '../../assets/logo_dark.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-inner-container">
          <div className="footer-main">
            <div className="space-y-4">
              <div>
                <a href="/">
                  <div className="footer-logo-container">
                    <span>
                      <img src={logoLight} alt="Logo" className="h-full dark:hidden block w-40"/>
                      <img src={logoDark} alt="Logo" className="h-full dark:block hidden w-40"/>
                    </span>
                  </div>
                </a>
              </div>
              <div className="footer-message">Bizning kurslarimiz sizga talabgir bo'lgan dasturlash
                ko'nikmalarini yuqori darajada o'zlashtirishga ko'mak beradi.
              </div>
            </div>
            <div className="footer-nav">
              <div className="footer-nav-section">
                <div className="mt-10 md:mt-0">
                  <h3 className="footer-nav-section-title">Navigatsiya</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="#intro"
                         className="footer-nav-link">Intro
                      </a>
                    </li>
                    <li>
                      <a href="#courses"
                         className="footer-nav-link">Kurslar
                      </a>
                    </li>
                    <li>
                      <a href="/courses/enrolled"
                         className="footer-nav-link">Mening kurslarim
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="footer-nav-section">
                <div className="mt-10 md:mt-0">
                  <h3 className="footer-nav-section-title">Havolalar</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="https://otabekboboqulov.uz" className="footer-nav-link" target="_blank">
                        Dasturchi
                      </a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/@ulugbekmamatqulov8385" className="footer-nav-link"
                         target="_blank">
                        YouTube
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="copyright">
              Copyright &copy; 2025. Created by
              <a href="https://otabekboboqulov.uz" target="_blank"> Otabek Boboqulov</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
