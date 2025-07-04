import React, {useEffect, useRef, useState} from 'react';
import './AddCourse.css';
import Section from "../../components/Section/Section.jsx";
import default_banner from "../../assets/default_banner.jpg";
import Error from "../../components/Error/Error.jsx";
import {BASE_URL} from "../../constants.jsx";
import {refreshToken} from "../../utils/auth-utils.jsx";

const AddCourse = () => {
  const [imageSrc, setImageSrc] = useState(default_banner);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  let userData = JSON.parse(localStorage.getItem('loginData'));
  useEffect(() => {
    if (!userData || !userData.is_staff) {
      window.location.href = '/';
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

  const createCourse = async (formData) => {
    try {
      userData = JSON.parse(localStorage.getItem('loginData'));
      const response = await fetch(`${BASE_URL}/api/courses/create/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.access}`,
        }
      });
      if (response.status === 401) {
        if (await refreshToken() === 'success') {
          await createCourse(formData);
        } else {
          localStorage.removeItem('loginData');
          window.location.href = '/login';
        }
      }
      window.location.href = '/';
    } catch (error) {
      console.error('Error during course creation:', error);
    }
  }

  const handleCourseCreateForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const formValues = Object.fromEntries(new FormData(e.target));
    if (!(formValues.name && formValues.complexity && formValues.description)) {
      setErrorMessage('Barcha ma\'lumotlarni to\'ldiring');
      setHasError(true);
      return;
    }
    setIsLoading(true);
    formData.append('name', formValues.name);
    formData.append('complexity', formValues.complexity);
    formData.append('description', formValues.description);
    if (imageFile) {
      formData.append('banner_image', imageFile);
    }
    createCourse(formData);
  };

  return (
    <div className="add-course">
      <div className="form-container">
        <Section title='Kurs yaratish' textSize='text-3xl'/>
        {hasError && (<Error error_message={errorMessage}/>)}
        <form onSubmit={handleCourseCreateForm}>
          <div>
            <label htmlFor="name" className="form-label">Kurs nomi</label>
            <input type="text" name="name" id="name" placeholder="Python Django" className="form-input"/>
          </div>
          <div>
            <label htmlFor="complexity" className="form-label">Daraja</label>
            <select name="complexity" id="complexity" className="form-select">
              <option value="junior">Junior</option>
              <option value="middle">Middle</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="form-label">Tavsif</label>
            <textarea name="description" id="description" cols="30" rows="5" placeholder="Kursni tavsifini kiriting"
                      className="form-textarea"></textarea>
          </div>
          <div>
            <label htmlFor="banner_image" className="form-label">Banner rasmi</label>
            <input type="file" name="banner_image" id="banner_image" className="image-input" accept="image/*"
                   onChange={handleImageChange} ref={fileInputRef} aria-hidden="true"/>
            <div
              className="banner-preview"
              onClick={handleContainerClick}
              role="button"
              aria-label="Upload profile image"
            >
              <img src={imageSrc} alt="Profile preview" className="w-full h-full object-cover object-center"/>
            </div>
          </div>
          <button type="submit" className="form-button">
            <span className={!isLoading ? 'block' : 'hidden'}>Yaratish</span>
            <div className={`loading ${isLoading ? 'block' : 'hidden'}`}>
              <section className="dots-container">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </section>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
