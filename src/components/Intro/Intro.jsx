import React from 'react';
import teacher from '../../assets/teacher.jpg';
import './Intro.css';

const Intro = () => {
  return (
    <div className="intro">
      <div className="intro-text">
        <p>
          "Dasturlashni o'rganish — bu shunchaki kod yozish emas, bu muammolarni hal qilish va yangi dunyolar yaratish san'atidir.
          Bizning platformamizda siz nafaqat nazariy bilimlar, balki real loyihalar orqali haqiqiy tajribaga ega bo'lasiz.
          Har bir qadamda sizga yo'l ko'rsatadigan mentorlar va katta hamjamiyat sizni kutmoqda.
          Kelajak texnologiyalarini bugundan biz bilan birga quring."
        </p>
      </div>
      <div className="teacher-wrap">
        <div className="teacher-overlay"></div>
        <img src={teacher} alt="Mentor" className="teacher-image" />
      </div>
    </div>
  );
};

export default Intro;
