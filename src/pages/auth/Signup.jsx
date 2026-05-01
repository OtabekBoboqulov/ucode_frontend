import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {BASE_URL} from '../../constants.jsx';
import Error from '../../components/Error/Error.jsx';
import HomeButton from '../../components/HomeButton/HomeButton.jsx';
import ButtonLoadingAnimation from '../../components/ButtonLoadingAnimation/ButtonLoadingAnimation.jsx';
import './auth.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${BASE_URL}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({username, password, email}),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Xatolik yuz berdi');
      }

      navigate('/login');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1 className="auth-title">Ro'yxatdan o'tish</h1>
        {errorMessage && <Error error_message={errorMessage} />}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className="text-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="text-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Parol"
              className="text-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </span>
          </div>
          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? <ButtonLoadingAnimation /> : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>
        <p className="goto-login-signup">
          Hisobingiz bormi?
          <Link to="/login" className="link">Kirish</Link>
        </p>
      </div>
      <HomeButton />
    </div>
  );
};

export default Signup;
