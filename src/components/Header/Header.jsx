import React, {useEffect, useState} from 'react';
import './Header.css';
import logoLight from '../../assets/logo_light.png';
import logoDark from '../../assets/logo_dark.png';
import headerBanner from '../../assets/header-banner.png';
import {Link} from "react-router-dom";
import {BASE_URL, MEDIA_BASE_URL, phrases} from "../../constants.jsx";
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
    await fetch(`${BASE_URL}/api/logout/`, {
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
      <div className={`header ${scrolled ? 'backdrop-blur-2xl bg-slate-950/80 shadow-2xl' : ''}`}>
        <Link to={"/"} className="h-10">
          <img src={logoDark} alt="Logo" className="h-full block"/>
        </Link>
        {!userData ? (
          <div className="auth-btn-group">
            <Link to={"/login"} className="auth-btn auth-btn-login">
              Kirish
            </Link>
            <Link to={"/signup"} className="auth-btn auth-btn-signup">
              Ro'yxatdan o'tish
            </Link>
          </div>
        ) : (
          <div className="user-data" onClick={() => setDropDown(!dropDown)}>
            <div className="username">
              {userData.username}
            </div>
            <div className="user-image">
              <img src={`${MEDIA_BASE_URL}${userData.profile_image}`} alt="profile image" className="w-full h-full object-cover"/>
            </div>
            <div
              className={`drop-down transition-all duration-300 ${dropDown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
              <Link to="/courses/enrolled" className="drop-down-item">
                Mening kurslarim
              </Link>
              <Link to="/profile/edit" className="drop-down-item">
                Profil
              </Link>
              <div className="drop-down-item text-red-400" onClick={logout}>
                Chiqish
              </div>
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
