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
                transition={{duration: 1}}
                id="intro">
      <div className="teacher-wrap">
        <img src={teacher} alt="Teacher" className="teacher-image"/>
      </div>
      <div className="intro-text">
        Mamatqulov Ulug`bek Babakulovich. <br/>
        1979 yil 7 sentyabrda O`zbekiston Respublikasi, Qashqadaryo viloyat Koson tumanida, ziyoli oilasida tug`ilgan.
        1996 yili Koson tumanidagi 9-sonli Hamid Olimjon nomli maktabni oltin medal bilan tamomlab, shu yili Qashqadaryo
        viloyat Qarshi Davlat universitetiga, "Amaliy matematika va informatika" fakultetiga, byudjet asosida o`qishga
        qabul qilingan. <br/>
        2000 yili o`qishni tamomlab, Koson tumanidagi 1-2-9-92-maktablarda informatika va AT fani o`qituvchisi
        lavosimida faoliyat yuritgan. <br/>
        2002-2017 yillar davomida Koson kompyuter texnologiyalari kasb-hunar kollejida Axborot texnologiyalari maxsus
        fanlari o`qituvchisi, bo`lim boshlig`i, bosh usta, uslubchi va kollej direktori lavozimlarida faoliyat yuritgan.
        Hozirgi kunda Qashqadaryo viloyat Koson tuman 9-maktabda Informatika va AT fani o`qituvchisi lavozimida faoliyat
        yuritadi. <br/>
        Oliy toifali, Xalq ta`limi a`lochisi, "Bir million o`zbek dasturchilari" loyihasi Respublika bosqichi g`olibi,
        ishlari Respublika miqyosida ommalashtirilgan.
      </div>
    </motion.div>
  );
};

export default Intro;