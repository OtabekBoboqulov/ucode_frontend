import React, {useState} from 'react';
import {GoogleLogin, googleLogout} from '@react-oauth/google';
import {useNavigate} from 'react-router-dom';
import {BASE_URL} from "../constants.jsx";
import LoadingAnimation from "./LoadingAnimation.jsx";

const GoogleSignInButton = () => {
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/google-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: credentialResponse.credential,
          provider: 'google',
        }),
      });

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setIsLoggedIn(true);
      localStorage.setItem('loginData', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      console.error('Google auth error:', err);
      setError(err);
    }
  };

  const handleError = () => {
    console.log('Google Auth Failed');
    setError('Google authentication failed. Please try again.');
  };

  const handleLogout = () => {
    googleLogout();
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="my-2 flex justify-center">
      {isLoggedIn ? (
        <div>
          <p>Welcome, {user?.first_name}</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleAuth}
          onError={handleError}
          theme="filled_blue"
          size="large"
          text="continue_with"
        />
      )}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center bg-black/30">
          <LoadingAnimation/>
        </div>
      )}
    </div>
  );
};

export default GoogleSignInButton;