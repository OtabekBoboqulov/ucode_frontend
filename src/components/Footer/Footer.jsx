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
              <div className="flex space-x-2">
                <a href="" target="_blank" className="footer-social-icons">
                  <span className="sr-only">Linkedin</span>
                  <svg fill="currentColor" viewBox="0 0 24 24"
                       className="h-6 w-6" aria-hidden="true">
                    <path fillRule="evenodd"
                          d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                          clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="" target="_blank" className="footer-social-icons">
                  <span className="sr-only">Twitter</span>
                  <svg fill="currentColor" viewBox="0 0 24 24"
                       className="h-6 w-6" aria-hidden="true">
                    <path
                      d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84">
                    </path>
                  </svg>
                </a>
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
