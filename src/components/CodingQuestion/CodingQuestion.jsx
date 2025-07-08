import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import './CodingQuestion.css';

const CodingQuestion = ({question_data}) => {
  const [code, setCode] = useState('');

  return (
    <div className="editor-container">
      <h1 className="question coding-question">{question_data.question}</h1>
      <div className="editor-wrapper">
        <CodeMirror
          value={code}
          height="400px"
          extensions={[javascript()]}
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
      <div className='btn'>
        <button className="submit-question">Tekshirish</button>
      </div>
    </div>
  );
};

export default CodingQuestion;
