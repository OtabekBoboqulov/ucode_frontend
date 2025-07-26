import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import './auth.css';
import Section from '../../components/Section/Section.jsx';
import default_profile_image from '../../assets/default_profile_image.jpg';
import {BASE_URL} from "../../constants.jsx";
import Error from "../../components/Error/Error.jsx";
import {isAuthorized} from "../../utils/auth-utils.jsx";
import HomeButton from "../../components/HomeButton/HomeButton.jsx";
import ButtonLoadingAnimation from "../../components/ButtonLoadingAnimation/ButtonLoadingAnimation.jsx";
import {Eye, EyeOff} from "lucide-react";
import GoogleSignInButton from "../../components/GoogleSignInButton.jsx";

const Signup = () => {
  const [imageSrc, setImageSrc] = useState(default_profile_image);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  }

  useEffect(() => {
    if (isAuthorized()) {
      navigate('/');
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setHasError(true);
      setErrorMessage('Rasm formatidagi faylni yuklang')
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current.click();
  };

  const signUp = async (formData) => {
    const result = await fetch(`${BASE_URL}/api/signup/`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      }
    });
    if (!result.ok) {
      setHasError(true);
      setErrorMessage('email yoki username ro\'yxatdan o\'tkazilgan');
      setIsLoading(false);
      return;
    }
    const data = await result.json();
    navigate('/login', {
      state: {
        message: 'Signed up successfully',
        username: data.username,
      }
    });
  };

  const isPasswordValid = (password) => {
    setErrorMessage('');
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    const hasValidChars = /^[A-Za-z\d@$!%*?&]*$/.test(password);

    if (!hasValidChars) {
      setHasError(true);
      setErrorMessage(prev => prev + 'Parolda taqiqlangan belgi ishlatilgan. ');
    }
    if (!hasLowercase) {
      setHasError(true);
      setErrorMessage(prev => prev + 'Parolda kichik harf bo\'lishi kerak. ');
    }
    if (!hasUppercase) {
      setHasError(true);
      setErrorMessage(prev => prev + 'Parolda katta harf bo\'lishi kerak. ');
    }
    if (!hasDigit) {
      setHasError(true);
      setErrorMessage(prev => prev + 'Parolda raqam bo\'lishi kerak. ');
    }
    if (!hasMinLength) {
      setHasError(true);
      setErrorMessage(prev => prev + 'Parolda 8 ta belgi bo\'lishi kerak. ');
    }
    return hasValidChars && hasLowercase && hasUppercase && hasDigit && hasMinLength;
  }

  const handleSignUpForm = (e) => {
    e.preventDefault();
    const filterPattern = /[^a-zA-Z0-9\s'-.]/;
    const formData = new FormData();
    const formValues = Object.fromEntries(new FormData(e.target));
    if (formValues.password !== formValues['password-confirmation']) {
      setErrorMessage('Parolni tadiqlash muvaffqiyatsiz bajarildi');
      setHasError(true);
      return;
    }
    if (!(formValues.username && formValues.first_name && formValues.last_name && formValues.email && formValues.password)) {
      setErrorMessage('Barcha ma\'lumotlarni to\'ldiring');
      setHasError(true);
      return;
    }
    if (/[^a-zA-Z0-9\s-.]/.test(formValues.username) || filterPattern.test(formValues.first_name) || filterPattern.test(formValues.last_name)) {
      setErrorMessage('Username, First Name, Last Namelarda quyidagi belgilar bo\'lishi mumkin emas: !#@&*()_+{}|:"<>?');
      setHasError(true);
      return;
    }
    if (!isPasswordValid(formValues.password)) {
      return;
    } else {
      setHasError(false);
    }
    setIsLoading(true);
    formData.append('username', formValues.username);
    formData.append('first_name', formValues.first_name);
    formData.append('last_name', formValues.last_name);
    formData.append('email', formValues.email);
    formData.append('password', formValues.password);
    if (imageFile) {
      formData.append('profile_image', imageFile);
    }
    signUp(formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Section title="Ro'yxatdan o'tish" textSize='text-2xl'/>
        {hasError && (<Error error_message={errorMessage}/>)}
        <form onSubmit={handleSignUpForm}>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            className="text-input"
            required
            aria-label="Username"
          />
          <input
            type="text"
            name="first_name"
            id="first_name"
            placeholder="First Name"
            className="text-input"
            required
            aria-label="First Name"
          />
          <input
            type="text"
            name="last_name"
            id="last_name"
            placeholder="Last Name"
            className="text-input"
            required
            aria-label="Last Name"
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="text-input"
            required
            aria-label="Email"
          />
          <input
            type="file"
            name="avatar"
            id="avatar"
            accept="image/*"
            className="image-input"
            onChange={handleImageChange}
            ref={fileInputRef}
            aria-hidden="true"
          />
          <div
            className="image-preview"
            onClick={handleContainerClick}
            role="button"
            aria-label="Upload profile image"
          >
            <img
              src={imageSrc}
              alt="Profile preview"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Password"
              className="text-input"
              required
              aria-label="Password"
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
          <div className="password-input">
            <input
              type={showPasswordConfirmation ? 'text' : 'password'}
              name="password-confirmation"
              id="password-confirmation"
              placeholder="Password Confirmation"
              className="text-input"
              required
              aria-label="Password Confirmation"
            />
            <button
              type="button"
              onClick={togglePasswordConfirmationVisibility}
              className="toggle-password"
              aria-label={showPasswordConfirmation ? 'Hide password' : 'Show password'}
            >
              {showPasswordConfirmation ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>
          <button type="submit" className="auth-submit-btn">
            <span className={!isLoading ? 'block' : 'hidden'}>Ro'yxatdan o'tish</span>
            <div className={`loading ${isLoading ? 'block' : 'hidden'}`}>
              <ButtonLoadingAnimation/>
            </div>
          </button>
          <GoogleSignInButton/>
          <div className="goto-login-signup">Akkaunt bormi? <Link to={"/login"} className="link">Kirish</Link></div>
        </form>
      </div>
      <HomeButton/>
    </div>
  );
};

export default Signup;