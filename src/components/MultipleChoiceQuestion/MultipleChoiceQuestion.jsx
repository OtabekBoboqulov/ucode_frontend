import React from 'react';
import './MultipleChoiceQuestion.css';
import {BASE_URL} from "../../constants.jsx";

const MultipleChoiceQuestions = ({question_data, id}) => {

  const userData = JSON.parse(localStorage.getItem('loginData'));

  const checkAnswer = async (answer) => {
    const response = await fetch(`${BASE_URL}/api/task-check/${id}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.access}`,
      },
      body: JSON.stringify({
        answer: answer
      })
    });
    const data = await response.json();
    console.log(data);
  };

  const handleMultipleChoiceSubmit = (e) => {
    e.preventDefault();
    const checkedRadio = e.target.querySelector('input[type="radio"]:checked');
    const value = checkedRadio ? checkedRadio.value : null;
    checkAnswer(value);
  };

  return (
    <div className="question-container">
      <form onSubmit={handleMultipleChoiceSubmit}>
        <div className="question">{question_data.question}</div>
        {question_data.options.map((option) => (
          <div className="option">
            <label htmlFor={option.option.toLowerCase()} className='option-text'>
              <input type="radio" name={option.question} id={option.option.toLowerCase()} value={option.is_correct}
                     className='radio-btn'/>
              {option.option}
            </label>
          </div>
        ))}
        <div className='btn'>
          <button className="submit-question">Tekshirish</button>
        </div>
      </form>
    </div>
  );
};

export default MultipleChoiceQuestions;
