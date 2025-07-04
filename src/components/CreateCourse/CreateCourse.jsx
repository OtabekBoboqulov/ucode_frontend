import React from 'react';
import './CreateCourse.css';
import {motion} from 'framer-motion';
import {useInView} from "react-intersection-observer";
import plus from '../../assets/plus.png';
import {Link} from "react-router-dom";

const CreateCourse = () => {
  const {ref, inView} = useInView({triggerOnce: true});
  return (
    <motion.div className="create-course"
                ref={ref}
                initial={{opacity: 0, y: 50}}
                animate={inView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 1}}>
      <div className="create-button">
        <Link to='/add-course'>
          <img src={plus} alt="Add" className="plus-image"/>
        </Link>
      </div>
    </motion.div>
  );
};

export default CreateCourse;
