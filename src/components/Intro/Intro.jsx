import React from 'react';
import teacher from '../../assets/teacher.jpg';
import './Intro.css';
import {motion} from 'framer-motion';
import {useInView} from 'react-intersection-observer';

const Intro = () => {
  const {ref, inView} = useInView({triggerOnce: true});
  return (
    <motion.div className="intro"
                ref={ref}
                initial={{opacity: 0, y: 50}}
                animate={inView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 1}}>
      <div className="teacher-wrap">
        <img src={teacher} alt="Teacher" className="teacher-image"/>
      </div>
      <div className="intro-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aspernatur at aut, autem
        blanditiis cupiditate deleniti dolore eaque earum harum labore magnam minus neque obcaecati, quae, quam qui
        repudiandae soluta tempore temporibus vero vitae voluptate. Commodi consequuntur eos eum temporibus? Alias
        aliquid assumenda blanditiis consectetur esse harum id maxime nulla quae, reiciendis. Aliquid
      </div>
    </motion.div>
  );
};

export default Intro;