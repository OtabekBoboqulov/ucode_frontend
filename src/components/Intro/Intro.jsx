import React from 'react';
import teacher from '../../assets/teacher.jpg';
import './Intro.css';
import {motion} from 'framer-motion';
import {useInView} from 'react-intersection-observer';
import {phrases} from "../../constants.jsx";

const Intro = () => {
  const getPhrase = () => {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  const {ref, inView} = useInView({triggerOnce: true});
  return (
    <motion.div className="intro"
                ref={ref}
                initial={{opacity: 0, y: 50}}
                animate={inView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 1}}
                id="intro">
      <div className="teacher-wrap">
        <img src={teacher} alt="Teacher" className="teacher-image"/>
      </div>
      <div className="intro-text">{getPhrase()}</div>
    </motion.div>
  );
};

export default Intro;