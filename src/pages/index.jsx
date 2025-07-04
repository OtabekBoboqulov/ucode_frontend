import React, {useEffect, useState} from 'react';
import Header from '../components/Header/Header.jsx';
import CourseCard from "../components/CourseCard/CourseCard.jsx";
import Intro from "../components/Intro/Intro.jsx";
import Section from "../components/Section/Section.jsx";
import CreateCourse from "../components/CreateCourse/CreateCourse.jsx";
import Footer from "../components/Footer/Footer.jsx";
import "../components/Section/Section.css";
import "./index.css";
import {BASE_URL} from "../constants.jsx";

const Index = () => {
  const [courses, setCourses] = useState([]);
  const userData = JSON.parse(localStorage.getItem('loginData'));
  const get_courses = async () => {
    const response = await fetch(`${BASE_URL}/api/courses/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    setCourses(data);
  }
  useEffect(() => {
    get_courses();
  }, []);
  return (
    <div className="main">
      <Header/>
      <div className="container mx-auto pt-24">
        <Intro/>
        <Section title="Kurslar" textSize='text-4xl'/>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course.id} course={course}/>
            ))
          ) : (
            <p>Loading courses...</p>
          )}
          {userData && userData.is_staff && <CreateCourse/>}
        </section>
      </div>
      <Footer/>
    </div>
  );
};

export default Index;