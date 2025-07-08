import React from 'react';
import './MultipleOptionsQuestion.css';
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

  const handleMultipleOptionsSubmit = (e) => {
    e.preventDefault();
    const checkedRadio = e.target.querySelectorAll('input[type="checkbox"]:checked');
    const answers = [];
    checkedRadio.forEach((radio) => {
      answers.push(radio.value);
    });
    checkAnswer(answers);
  };

  return (
    <div className="question-container">
      <form onSubmit={handleMultipleOptionsSubmit}>
        <div className="question">{question_data.question}</div>
        {question_data.options.map((option) => (
          <div className="option">
            <label htmlFor={option.option.toLowerCase()} className='option-text'>
              <input type="checkbox" name={option.id} id={option.option.toLowerCase()} value={option.is_correct}
                     className='check-btn'/>
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
