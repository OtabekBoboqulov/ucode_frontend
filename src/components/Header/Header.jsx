import React, {useEffect, useState} from 'react';
import './Header.css';
import logoLight from '../../assets/logo_light.png';
import logoDark from '../../assets/logo_dark.png';
import headerBanner from '../../assets/header-banner.png';
import {Link} from "react-router-dom";
import {BASE_URL, MEDIA_BASE_URL, phrases} from "../../constants.jsx";
import LoadingAnimation from "../LoadingAnimation.jsx";
import {useInView} from "react-intersection-observer";

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

  const getPhrase = () => {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  return (
    <div>
      <div className={`header ${scrolled ? 'shadow-md' : 'shadow-none'} ${!userData ? 'no-user-header' : ''}`}>
        <Link to={"/"} className="h-1/3 md:h-3/4">
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
                <Link to="/courses/enrolled">
                  <li className="drop-down-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="size-6 inline-block">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
                    </svg>
                    &nbsp;Mening kurslarim
                  </li>
                </Link>
                <Link to="/profile/edit">
                  <li className="drop-down-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="size-6 inline-block">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                    &nbsp;Profil
                  </li>
                </Link>
                <li className="drop-down-item" onClick={logout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                       className="bi bi-box-arrow-left inline-block" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                    <path fillRule="evenodd"
                          d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                  </svg>
                  &nbsp;Chiqish
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
            {getPhrase()}
          </p>
          {!userData && (
            <Link to="/signup" className="header-btn">
              Boshlash
            </Link>
          )}
        </div>
        <div className="header-banner-image">
          <img src={headerBanner} alt="banner image" className="header-banner-imagefile"/>
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