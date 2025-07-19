import React, {useEffect, useState} from 'react';
import {slide as Menu} from 'react-burger-menu';
import {useSwipeable} from 'react-swipeable';
import menuIcon from '../../assets/book.png';
import logoDark from '../../assets/logo_dark.png';
import logoLight from '../../assets/logo_light.png';
import {BASE_URL} from "../../constants.jsx";
import {refreshToken} from "../../utils/auth-utils.jsx";
import {Link, useNavigate} from "react-router-dom";
import './LessonsSidebar.css';

const LessonsSidebar = ({courseId}) => {
  const [isOpen, setIsOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem('loginData'));
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);

  const setMenuItemsFromData = (lessonData) => {
    const items = [(
      <div>
        <div className='logo-container' key='logo-container'>
          <Link to='/'>
            <img src={logoLight} alt="Logo" className="logo-image logo-light"/>
            <img src={logoDark} alt="Logo" className="logo-image logo-dark"/>
          </Link>
        </div>
      </div>
    ),
      (
        <Link
          to={`/courses/${courseId}`}
          key={`${courseId}`}
          className="link-container course-link"
        >
          <div className="link-text">
            Kurs sahifasiga o'tish
          </div>
        </Link>
      )];
    lessonData.forEach((lesson) => {
      const userScore = lesson.user_lessons.find((item) => {
        return item.user === userData.id
      })
      items.push(
        <div>
          <a href={`/courses/${courseId}/lessons/${lesson.id}`} className="link-container">
            <div className="link-text">
              {lesson.serial_number}. {lesson.title}
            </div>
            <div className="lesson-status">
              {userScore ? userScore.is_completed ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                     className="bi bi-check-lg"
                     viewBox="0 0 16 16">
                  <path
                    d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                </svg>
              ) : `${userScore.score}%` : ''}
            </div>
          </a>
        </div>
      )
    });
    setMenuItems(items)
  }

  const getLessons = async () => {
    const response = await fetch(`${BASE_URL}/api/courses/${courseId}/lessons/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${userData?.access}`,
      },
    });
    if (response.status === 401) {
      const refreshResult = await refreshToken();
      if (refreshResult === 'success') {
        const retryResponse = await fetch(`${BASE_URL}/api/courses/${courseId}/lessons/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loginData'))?.access}`,
          },
        });

        if (!retryResponse.ok) {
          throw new Error(`Failed to fetch lesson data: ${retryResponse.status}`);
        }

        const retryData = await retryResponse.json();
        setMenuItemsFromData(retryData);
      } else {
        localStorage.removeItem('loginData');
        navigate('/login');
      }
    } else if (!response.ok) {
      throw new Error(`Failed to fetch course data: ${response.status}`);
    } else {
      const data = await response.json();
      setMenuItemsFromData(data);
    }
  }

  const handleStateChange = (state) => {
    setIsOpen(state.isOpen);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setIsOpen(false);
    },
    onSwipedRight: () => {
      setIsOpen(true);
    },
    delta: 10, // Minimum swipe distance (pixels)
    preventScroll: true, // Prevent page scrolling during swipe
    trackTouch: true, // Enable touch events for mobile
  });

  useEffect(() => {
    getLessons();
  }, [courseId]);


  return (
    <div {...handlers}>
      <Menu
        isOpen={isOpen}
        onStateChange={handleStateChange}
        styles={{
          bmBurgerButton: {
            position: 'absolute',
            width: '36px',
            height: '36px',
            left: '16px',
            top: '16px',
            zIndex: '1000',
            backgroundImage: `url(${menuIcon})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          },
          bmBurgerBars: {
            display: 'none',
          },
          bmMenuWrap: {
            top: '1px',
          },
          bmOverlay: {
            background: 'rgba(0, 0, 0, 0.5)',
          },
        }}
        className="sidebar-menu"
      >
        {menuItems}
      </Menu>
    </div>
  );
}

export default LessonsSidebar;