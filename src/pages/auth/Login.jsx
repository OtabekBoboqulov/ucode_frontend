import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import './auth.css';
import Section from '../../components/Section/Section.jsx';
import Error from "../../components/Error/Error.jsx";
import {Eye, EyeOff} from 'lucide-react';
import {BASE_URL} from "../../constants.jsx";
import {isAuthorized} from "../../utils/auth-utils.jsx";
import HomeButton from "../../components/HomeButton/HomeButton.jsx";
import ButtonLoadingAnimation from "../../components/ButtonLoadingAnimation/ButtonLoadingAnimation.jsx";
import GoogleSignInButton from "../../components/GoogleSignInButton.jsx";

const Login = () => {
  const {state} = useLocation();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    username: state?.username || '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  useEffect(() => {
    if (isAuthorized()) {
      navigate('/');
    }
  }, []);

  const login = async (loginData) => {
    try {
      const response = await fetch(`${BASE_URL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('loginData', JSON.stringify(data));
        navigate('/', {
          state: {
            message: 'Logged in successfully'
          }
        })
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormValues({...formValues, [name]: value});
  };

  const handleLogInForm = (e) => {
    e.preventDefault();
    setIsLoading(true);
    login(formValues);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Section title="Kirish" textSize='text-2xl'/>
        {hasError && (<Error error_message="Username yoki parol noto'g'ri kiritilgan"/>)}
        <form onSubmit={handleLogInForm}>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            className="text-input"
            required
            aria-label="Username"
            value={formValues.username}
            onChange={handleInputChange}
          />
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Password"
              className="text-input"
              required
              aria-label="Password"
              value={formValues.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="toggle-password"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>
          <button type="submit" className="auth-submit-btn">
            <span className={!isLoading ? 'block' : 'hidden'}>Kirish</span>
            <div className={`loading ${isLoading ? 'block' : 'hidden'}`}>
              <ButtonLoadingAnimation/>
            </div>
          </button>
          <GoogleSignInButton/>
          <div className="goto-login-signup">Akkauntingiz yo'qmi? <Link to={"/signup"} className="link">Ro'yxat
            o'tish</Link>
          </div>
        </form>
      </div>
      <HomeButton/>
    </div>
  )
    ;
};

export default Login;
