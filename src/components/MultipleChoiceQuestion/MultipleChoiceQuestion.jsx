import React, {useEffect, useState} from 'react';
import './MultipleChoiceQuestion.css';
import {checkAnswer} from "../../utils/lesson-utils.jsx";
import QuestionLoadingAnimation from "../QuestionLoadingAnimation/QuestionLoadingAnimation.jsx";

const MultipleChoiceQuestions = ({question_data, id, isVip}) => {

  const [isDoneCorrect, setIsDoneCorrect] = useState(false);
  const [isDoneIncorrect, setIsDoneIncorrect] = useState(false);
  const [triesLeft, setTriesLeft] = useState(question_data.options.length - 1);
  const [isLoading, setIsLoading] = useState(false);

  const handleMultipleChoiceSubmit = (e) => {
    e.preventDefault();
    const checkedRadio = e.target.querySelector('input[type="radio"]:checked');
    const value = checkedRadio ? checkedRadio.value : null;
    setIsLoading(true);
    checkAnswer(value, id).then((is_correct) => {
      is_correct ? setIsDoneCorrect(true) : setTriesLeft(triesLeft - 1);
      isVip && setTriesLeft(triesLeft + 1);
    }).then(() => setIsLoading(false));
  };

  useEffect(() => {
    if (id === null) {
      setIsDoneCorrect(true);
    }
    if (triesLeft === 0) {
      setIsDoneIncorrect(true);
    }
  }, [triesLeft]);

  return (
    <div className="question-container">
      <form onSubmit={handleMultipleChoiceSubmit}>
        <div className="question">{question_data.question}</div>
        {question_data.options.map((option) => (
          <div className="option">
            <label htmlFor={`${option.option.toLowerCase()}${option.id}`} className='option-text'>
              <input type="radio" name={option.question} id={`${option.option.toLowerCase()}${option.id}`}
                     value={option.is_correct} className='radio-btn'/>
              {option.option}
            </label>
          </div>
        ))}
        <div className='btn'>
          <button className="submit-question">Tekshirish</button>
        </div>
      </form>
      <div className="tries-left">
        {!isVip && Array.from({length: triesLeft}).map((_, index) => (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="bi bi-cup-hot-fill inline-block mr-2" viewBox="0 0 16 16">
            <path fillRule="evenodd"
                  d="M.5 6a.5.5 0 0 0-.488.608l1.652 7.434A2.5 2.5 0 0 0 4.104 16h5.792a2.5 2.5 0 0 0 2.44-1.958l.131-.59a3 3 0 0 0 1.3-5.854l.221-.99A.5.5 0 0 0 13.5 6zM13 12.5a2 2 0 0 1-.316-.025l.867-3.898A2.001 2.001 0 0 1 13 12.5"/>
            <path
              d="m4.4.8-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 3.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 3.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 3 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 4.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 6.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 6.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 6 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 7.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.252.382l-.019.025-.005.008-.002.002A.5.5 0 0 1 9.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 9.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 9 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 10.4.8"/>
          </svg>
        )) || (
          <div className="infinity-tries cosmic-gradient">
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="30"
                 height="30"
                 className="drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                 viewBox="0 0 16 16">
              <defs>
                <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316"/>
                  <stop offset="20%" stopColor="#ec4899"/>
                  <stop offset="40%" stopColor="#7c3aed"/>
                  <stop offset="60%" stopColor="#a855f7"/>
                  <stop offset="80%" stopColor="#ec4899"/>
                  <stop offset="100%" stopColor="#f97316"/>
                </linearGradient>
              </defs>
              <path fill="url(#cosmicGradient)"
                    d="M5.68 5.792 7.345 7.75 5.681 9.708a2.75 2.75 0 1 1 0-3.916ZM8 6.978 6.416 5.113l-.014-.015a3.75 3.75 0 1 0 0 5.304l.014-.015L8 8.522l1.584 1.865.014.015a3.75 3.75 0 1 0 0-5.304l-.014.015zm.656.772 1.663-1.958a2.75 2.75 0 1 1 0 3.916z"/>
            </svg>
          </div>
        )}
      </div>
      <div className={`question-layer ${isDoneCorrect ? 'block' : 'hidden'}`}></div>
      <div className={`question-layer question-layer-loading ${isLoading ? 'block' : 'hidden'}`}>
        <QuestionLoadingAnimation/>
      </div>
      <div className={`question-layer question-layer-incorrect ${isDoneIncorrect ? 'block' : 'hidden'}`}></div>
    </div>
  );
};

export default MultipleChoiceQuestions;
