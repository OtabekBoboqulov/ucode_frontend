import React, {useEffect, useState} from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import './CodingQuestion.css';
import {checkAnswer} from "../../utils/lesson-utils.jsx";
import QuestionLoadingAnimation from "../QuestionLoadingAnimation/QuestionLoadingAnimation.jsx";
import {getLanguageExtension} from "../../utils/lesson-utils.jsx";

const CodingQuestion = ({question_data, id}) => {
  const [code, setCode] = useState('');
  const [isDoneCorrect, setIsDoneCorrect] = useState(false);
  const [isDoneIncorrect, setIsDoneIncorrect] = useState(false);
  const [triesLeft, setTriesLeft] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeSubmit = () => {
    setIsLoading(true);
    checkAnswer(code, id).then((is_correct) => {
      is_correct ? setIsDoneCorrect(true) : setTriesLeft(triesLeft - 1);
    }).then(() => setIsLoading(false));
  };

  useEffect(() => {
    setCode(question_data.pre_written_code);
  }, []);

  useEffect(() => {
    if (id === null) {
      setIsDoneCorrect(true);
    }
    if (triesLeft === 0) {
      setIsDoneIncorrect(true);
    }
  }, [triesLeft]);

  return (
    <div className="editor-container">
      <h1 className="question coding-question">{question_data.question}</h1>
      <div className="editor-wrapper">
        <CodeMirror
          value={code}
          height="400px"
          extensions={[getLanguageExtension(question_data.language)]}
          theme={dracula}
          onChange={(value) => setCode(value)}
          className="editor"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            bracketMatching: true,
            tabSize: 2,
            indentWithTab: true,
          }}
        />
      </div>
      <div className='btn' onClick={handleCodeSubmit}>
        <button className="submit-question">Tekshirish</button>
      </div>
      <div className="tries-left">
        {Array.from({length: triesLeft}).map((_, index) => (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="bi bi-cup-hot-fill inline-block mr-2" viewBox="0 0 16 16">
            <path fillRule="evenodd"
                  d="M.5 6a.5.5 0 0 0-.488.608l1.652 7.434A2.5 2.5 0 0 0 4.104 16h5.792a2.5 2.5 0 0 0 2.44-1.958l.131-.59a3 3 0 0 0 1.3-5.854l.221-.99A.5.5 0 0 0 13.5 6zM13 12.5a2 2 0 0 1-.316-.025l.867-3.898A2.001 2.001 0 0 1 13 12.5"/>
            <path
              d="m4.4.8-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 3.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 3.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 3 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 4.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 6.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 6.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 6 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 7.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.252.382l-.019.025-.005.008-.002.002A.5.5 0 0 1 9.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 9.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 9 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 10.4.8"/>
          </svg>
        ))}
      </div>
      <div className={`question-layer ${isDoneCorrect ? 'block' : 'hidden'}`}></div>
      <div className={`question-layer question-layer-loading ${isLoading ? 'block' : 'hidden'}`}>
        <QuestionLoadingAnimation/>
      </div>
      <div className={`question-layer question-layer-incorrect ${isDoneIncorrect ? 'block' : 'hidden'}`}></div>
    </div>
  );
};

export default CodingQuestion;
