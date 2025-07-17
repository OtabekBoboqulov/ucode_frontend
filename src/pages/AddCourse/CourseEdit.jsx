import React, {useEffect, useRef, useState} from 'react';
import './AddCourse.css';
import Section from "../../components/Section/Section.jsx";
import default_banner from "../../assets/default_banner.jpg";
import Error from "../../components/Error/Error.jsx";
import {BASE_URL, MEDIA_BASE_URL} from "../../constants.jsx";
import {refreshToken} from "../../utils/auth-utils.jsx";
import {useParams} from "react-router-dom";
import ButtonLoadingAnimation from "../../components/ButtonLoadingAnimation/ButtonLoadingAnimation.jsx";
import HomeButton from "../../components/HomeButton/HomeButton.jsx";

const CourseEdit = () => {
  const {id} = useParams();
  const [imageSrc, setImageSrc] = useState(default_banner);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseComplexity, setCourseComplexity] = useState('');
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

  const handleCourseNameChange = (e) => {
    const value = e.target.value;
    setCourseName(value);
  }

  const handleCourseDescriptionChange = (e) => {
    const value = e.target.value;
    setCourseDescription(value);
  }

  const handleCourseComplexityChange = (e) => {
    const value = e.target.value;
    setCourseComplexity(value);
  }

  const handleContainerClick = () => {
    fileInputRef.current.click();
  };

  const updateCourse = async (formData) => {
    try {
      userData = JSON.parse(localStorage.getItem('loginData'));
      const response = await fetch(`${BASE_URL}/api/courses/update/${id}/`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.access}`,
        }
      });
      if (response.status === 401) {
        if (await refreshToken() === 'success') {
          await updateCourse(formData);
        } else {
          localStorage.removeItem('loginData');
          window.location.href = '/login';
        }
      }
      window.location.href = `/courses/${id}`;
    } catch (error) {
      console.error('Error during course creation:', error);
    }
  }

  const handleCourseUpdateForm = (e) => {
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
    updateCourse(formData);
  };

  const getCourse = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/courses/update/${id}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.access}`,
        }
      });
      if (response.status === 401) {
        if (await refreshToken() === 'success') {
          await getCourse();
        } else {
          localStorage.removeItem('loginData');
          window.location.href = '/login';
        }
      }
      const data = await response.json();
      setImageSrc(`${MEDIA_BASE_URL}${data.banner_image}`)
      setCourseName(data.name);
      setCourseDescription(data.description);
      setCourseComplexity(data.complexity);
    } catch (error) {
      console.error('Error during course creation:', error);
    }
  }

  useEffect(() => {
    getCourse();
  }, [])

  return (
    <div className="add-course">
      <div className="form-container">
        <Section title='Kursni o`zgartirish' textSize='text-3xl'/>
        {hasError && (<Error error_message={errorMessage}/>)}
        <form onSubmit={handleCourseUpdateForm}>
          <div>
            <label htmlFor="name" className="form-label">Kurs nomi</label>
            <input type="text" name="name" id="name" placeholder="Python Django" className="form-input" required
                   value={courseName} onChange={handleCourseNameChange}/>
          </div>
          <div>
            <label htmlFor="complexity" className="form-label">Daraja</label>
            <select name="complexity" id="complexity" className="form-select" required value={courseComplexity}
                    onChange={handleCourseComplexityChange}>
              <option value="junior">Junior</option>
              <option value="middle">Middle</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="form-label">Tavsif</label>
            <textarea name="description" id="description" cols="30" rows="5" placeholder="Kursni tavsifini kiriting"
                      className="form-textarea" required onChange={handleCourseDescriptionChange}
                      value={courseDescription}>
            </textarea>
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

export default CourseEdit;
