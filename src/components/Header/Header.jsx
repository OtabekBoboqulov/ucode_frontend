import React, {useEffect, useState} from 'react';
import './Header.css';
import logoLight from '../../assets/logo_light.png';
import logoDark from '../../assets/logo_dark.png';
import headerBanner from '../../assets/header-banner.png';
import {Link} from "react-router-dom";
import {BASE_URL, MEDIA_BASE_URL} from "../../constants.jsx";
import LoadingAnimation from "../LoadingAnimation.jsx";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const userData = JSON.parse(localStorage.getItem('loginData'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = async () => {
    setIsLoading(true);
    const accessToken = userData.access;
    const refreshToken = userData.refresh;
    localStorage.removeItem('loginData');
    const response = await fetch(`${BASE_URL}/api/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });
    setDropDown(false);
    setIsLoading(false);
    window.location.reload();
  }

  return (
    <div>
      <div className={`header ${scrolled ? 'shadow-md' : 'shadow-none'} ${!userData ? 'no-user-header' : ''}`}>
        <Link to={"/"} className="h-1/3 md:h-1/2">
          <img src={logoLight} alt="Logo" className="h-full dark:hidden block"/>
          <img src={logoDark} alt="Logo" className="h-full dark:block hidden"/>
        </Link>
        {!userData && (
          <div className="auth flex gap-2">
            <Link to={"/signup"} className="auth-btn">
              Ro'yxatadan o'tish
            </Link>
            <Link to={"/login"} className="auth-btn">
              Kirish
            </Link>
          </div>
        )}
        {userData && (
          <div className="user-data">
            <div className="username" onClick={() => setDropDown(!dropDown)}>
              {userData.username}
            </div>
            <div className="user-image" onClick={() => setDropDown(!dropDown)}>
              <img src={`${MEDIA_BASE_URL}${userData.profile_image}`} alt="profile image"/>
            </div>
            <div
              className={`drop-down transition-transform duration-500 ease-in-out ${dropDown ? '' : 'translate-x-full'}`}>
              <ul>
                <li className="drop-down-item" onClick={logout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                       className="bi bi-box  inline-block"
                       viewBox="0 0 16 16">
                    <path
                      d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
                  </svg>
                  &nbsp;
                  Dashboard
                </li>
                <li className="drop-down-item" onClick={logout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                       className="bi bi-box-arrow-left inline-block" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                    <path fillRule="evenodd"
                          d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                  </svg>
                  &nbsp;
                  Chiqish
                </li>
              </ul>

            </div>
          </div>
        )}
      </div>
      <div className="header-banner">
        <div className="header-banner-text">
          <h1 className="header-greeting">
            Dasturlash olamiga xush kelibsiz!
          </h1>
          <p className="header-message">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus alias cum, exercitationem iste itaque
            laborum magni odit perferendis quas voluptas. Start today and earn your certificate!
          </p>
          {!userData && (
            <Link to="/signup" className="header-btn">
              Boshlash
            </Link>
          )}
        </div>
        <div className="header-banner-image">
          <img src={headerBanner} alt="banner image"/>
        </div>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <LoadingAnimation/>
        </div>
      )}
    </div>
  );
};


export default Header;