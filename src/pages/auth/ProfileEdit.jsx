import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import './auth.css';
import Section from '../../components/Section/Section.jsx';
import default_profile_image from '../../assets/default_profile_image.jpg';
import {BASE_URL, MEDIA_BASE_URL} from "../../constants.jsx";
import Error from "../../components/Error/Error.jsx";
import {isAuthorized, refreshToken} from "../../utils/auth-utils.jsx";
import HomeButton from "../../components/HomeButton/HomeButton.jsx";
import ButtonLoadingAnimation from "../../components/ButtonLoadingAnimation/ButtonLoadingAnimation.jsx";

const ProfileEdit = () => {
  const [imageSrc, setImageSrc] = useState(default_profile_image);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const userData = JSON.parse(localStorage.getItem('loginData'));


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

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

  const setNewValues = (image_url) => {
    userData.username = username;
    userData.first_name = firstName;
    userData.last_name = lastName;
    userData.email = email;
    if (image_url) {
      image_url = image_url.replace(MEDIA_BASE_URL, '');
      userData.profile_image = image_url;
    }
    localStorage.setItem('loginData', JSON.stringify(userData));
    navigate('/');
  };

  const editProfile = async (formData) => {
    try {
      const result = await fetch(`${BASE_URL}/api/profile/edit/`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.access}`
        }
      });
      if (result.status === 401) {
        const refreshResult = await refreshToken();
        if (refreshResult === 'success') {
          const retryResponse = await fetch(`${BASE_URL}/api/profile/edit/`, {
            method: 'PUT',
            body: formData,
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loginData'))?.access}`,
            },
          });

          if (!retryResponse.ok) {
            throw new Error(`Failed to edit profile data: ${retryResponse.status}`);
          }
          const retryData = await retryResponse.json();
          setNewValues(retryData.profile_image);
        } else {
          localStorage.removeItem('loginData');
          navigate('/login');
        }
      } else if (!result.ok) {
        throw new Error(`Failed to edit profile data: ${response.status}`);
      } else {
        const data = await result.json();
        setNewValues(data.profile_image);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileEditForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const formValues = Object.fromEntries(new FormData(e.target));
    if (!(formValues.username && formValues.first_name && formValues.last_name && formValues.email)) {
      setErrorMessage('Barcha ma\'lumotlarni to\'ldiring');
      setHasError(true);
      return;
    }
    setIsLoading(true);
    formData.append('username', formValues.username);
    formData.append('first_name', formValues.first_name);
    formData.append('last_name', formValues.last_name);
    formData.append('email', formValues.email);
    if (imageFile) {
      formData.append('profile_image', imageFile);
    }
    editProfile(formData);
  };

  useEffect(() => {
    if (!isAuthorized()) {
      navigate('/');
    } else {
      setUsername(userData.username);
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setEmail(userData.email);
      setImageSrc(`${MEDIA_BASE_URL}${userData.profile_image}`)
    }
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Section title="Profil" textSize='text-2xl'/>
        {hasError && (<Error error_message={errorMessage}/>)}
        <form onSubmit={handleProfileEditForm}>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            className="text-input"
            required
            aria-label="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <input
            type="text"
            name="first_name"
            id="first_name"
            placeholder="First Name"
            className="text-input"
            required
            aria-label="First Name"
            value={firstName}
            onChange={handleFirstNameChange}
          />
          <input
            type="text"
            name="last_name"
            id="last_name"
            placeholder="Last Name"
            className="text-input"
            required
            aria-label="Last Name"
            value={lastName}
            onChange={handleLastNameChange}
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="text-input"
            required
            aria-label="Email"
            value={email}
            onChange={handleEmailChange}
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
          <button type="submit" className="auth-submit-btn">
            <span className={!isLoading ? 'block' : 'hidden'}>O`zgartirish</span>
            <div className={`loading ${isLoading ? 'block' : 'hidden'}`}>
              <ButtonLoadingAnimation/>
            </div>
          </button>
        </form>
      </div>
      <HomeButton/>
    </div>
  );
};

export default ProfileEdit;