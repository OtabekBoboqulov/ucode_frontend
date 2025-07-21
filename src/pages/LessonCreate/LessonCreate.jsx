import React, {useEffect, useRef, useState} from 'react';
import HomeButton from "../../components/HomeButton/HomeButton.jsx";
import './LessonCreate.css';
import Section from "../../components/Section/Section.jsx";
import Modal from 'react-modal';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link'
import video from "../../assets/video.png";
import text from "../../assets/text.png";
import mcq from "../../assets/mcq.png";
import moq from "../../assets/moq.png";
import coding from "../../assets/coding.png";
import Video from "../../components/Video/Video.jsx";
import Text from "../../components/Text/Text.jsx";
import MultipleChoiceQuestion from "../../components/MultipleChoiceQuestion/MultipleChoiceQuestion.jsx";
import MultipleOptionsQuestion from "../../components/MultipleOptionsQuestion/MultipleOptionsQuestion.jsx";
import CodingQuestion from "../../components/CodingQuestion/CodingQuestion.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import {BASE_URL} from "../../constants.jsx";
import {refreshToken} from "../../utils/auth-utils.jsx";
import Error from "../../components/Error/Error.jsx";
import LoadingAnimation from "../../components/LoadingAnimation.jsx";

const LessonCreate = () => {
  const {id} = useParams();
  const {state} = useLocation();
  const navigate = useNavigate();
  const [lessonTitle, setLessonTitle] = useState('Yangi dars');
  const [lessonSerialNumber, setLessonSerialNumber] = useState(state?.serial_number || 1);
  const [maxScore, setMaxScore] = useState(0);
  const [isLessonOpen, setIsLessonOpen] = useState(true);
  const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);
  const [lessonType, setLessonType] = useState('video');
  const [components, setComponents] = useState([]);
  const [componentSerialNumber, setComponentSerialNumber] = useState(1);
  const [savedHtml, setSavedHtml] = useState('');
  const [options, setOptions] = useState([]);
  const [newOptionText, setNewOptionText] = useState('');
  const [newOptionIsCorrect, setNewOptionIsCorrect] = useState(false);
  const [materialsSrc, setMaterialsSrc] = useState(null);
  const [materialsFile, setMaterialsFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false, // Prevent links from opening when clicked in the editor
        HTMLAttributes: {
          target: '_blank', // Open links in a new tab
          rel: 'noopener noreferrer', // Security attributes
          class: 'link',
        },
      }),
    ],
    content: '<p>Tekstni shu yerga yozing...</p>',
    onUpdate: ({editor}) => {
      const html = editor.getHTML();
      setSavedHtml(html);
    },
  });

  const setLink = (e) => {
    e.stopPropagation();
    if (editor) {
      const url = window.prompt('Enter the URL (e.g., https://example.com):');
      if (url === null) return; // User canceled the prompt
      if (url === '') {
        editor.chain().focus().unsetLink().run(); // Remove link if URL is empty
      } else {
        editor.chain().focus().setLink({href: url}).run(); // Set link
      }
    }
  };

  const closeLessonModal = () => setIsLessonOpen(false);
  const openAddComponentModal = () => setIsAddComponentOpen(true);
  const closeAddComponentModal = () => setIsAddComponentOpen(false);

  const userData = JSON.parse(localStorage.getItem('loginData'));

  const handleLessonSerialNumberChange = (e) => {
    const {value} = e.target;
    setLessonSerialNumber(value);
  };

  const handleLessonTitleChange = (e) => {
    const {value} = e.target;
    setLessonTitle(value);
  };

  const handleMaxScoreChange = (e) => {
    const {value} = e.target;
    setMaxScore(value);
  };

  const handleLessonTypeChange = (e) => {
    const {value} = e.target;
    setLessonType(value);
  };

  const handleComponentSerialNumberChange = (e) => {
    const {value} = e.target;
    setComponentSerialNumber(value);
  }

  const handleNewOptionChange = (e) => {
    const {value} = e.target;
    setNewOptionText(value);
  }

  const addNewOption = () => {
    setOptions([...options, {option: newOptionText, is_correct: newOptionIsCorrect}]);
    setNewOptionText('');
    setNewOptionIsCorrect(false);
  }

  const removeOption = (index) => {
    setOptions(options.filter((option, i) => i !== index));
  }

  const removeComponent = (index) => {
    setComponents(components.filter((component, i) => i !== index));
    setComponentSerialNumber(componentSerialNumber - 1);
  }

  const handleMaterialsChange = (e) => {
    const file = e.target.files[0];
    setMaterialsFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setMaterialsSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addComponent = (e) => {
    e.preventDefault();
    let newComponent = {};
    if (lessonType === 'video') {
      newComponent = {
        type: lessonType,
        video_url: e.target.video_url.value,
      };
    } else if (lessonType === 'text') {
      newComponent = {
        type: lessonType,
        content: savedHtml,
      };
    } else if (lessonType === 'mcq' || lessonType === 'moq') {
      if (options.length === 0 ||
        !options.find((option) => option.is_correct === true)) {
        alert('Bu savol uchun to`g`ri javob bo`lishi kerak.')
        return;
      }
      newComponent = {
        type: lessonType,
        question: e.target.question.value,
        options: options,
      }
    }
    newComponent.max_score = e.target.max_score.value;
    newComponent.serial_number = e.target.serial_number.value;
    const updatedComponents = [...components, newComponent];
    updatedComponents.sort((a, b) => a.serial_number - b.serial_number);
    setComponents(updatedComponents);
    setComponentSerialNumber(componentSerialNumber + 1);
    setOptions([]);
    setLessonType('video');
    closeAddComponentModal();
  };

  const submitLesson = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/lessons/create/`, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.access}`
        }
      });

      if (response.status === 401) {
        const refreshResult = await refreshToken();
        if (refreshResult === 'success') {
          const retryResponse = await fetch(`${BASE_URL}/api/lessons/create/`, {
            method: 'POST',
            body: data,
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userData.access}`
            }
          });
          if (!retryResponse.ok) {
            throw new Error(`Failed to fetch lesson data: ${retryResponse.status}`);
          }

          const retryData = await retryResponse.json();
          if (retryResponse.status === 200) {
            navigate(`/courses/${id}`);
          }
        } else {
          localStorage.removeItem('loginData');
          navigate('/login');
        }
      } else if (!response.ok) {
        throw new Error(`Failed to fetch course data: ${response.status}`);
      } else {
        const data = await response.json();
        if (response.status === 200) {
          navigate(`/courses/${id}`);
        }
      }
    } catch (err) {
      console.error('Error creating lesson:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLessonCreate = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('course_id', id);
    submitData.append('title', lessonTitle);
    submitData.append('max_score', maxScore);
    submitData.append('serial_number', lessonSerialNumber);
    if (materialsFile) {
      submitData.append('lesson_materials', materialsFile);
    }
    submitData.append('components', JSON.stringify(components));
    submitLesson(submitData);
  };

  useEffect(() => {
    if (!userData || !userData.is_staff) {
      window.location.href = '/';
    }
  }, []);

  return (
    <div>
      <div className='add-lesson-container'>
        <div className="lesson-caption">
          <Section title={`${lessonSerialNumber}. ${lessonTitle}`} textSize='md:text-4xl'
                   textSizeSm='text-lg'/>
        </div>
        {components && components.map((component, index) => {
          return (
            <div className="component">
              {component.type === 'video' && (<Video key={index} videoUrl={component.video_url}/>)
                || component.type === 'text' && (<Text key={index} content={component.content}/>)
                || component.type === 'mcq' && (
                  <MultipleChoiceQuestion key={index} question_data={component} id={null}/>)
                || component.type === 'moq' && (
                  <MultipleOptionsQuestion key={index} question_data={component} id={null}/>)
                || component.type === 'coding' && (
                  <CodingQuestion key={component.id} question_data={component.data} id={component.id}/>)
                || null
              }
              <button className="remove-component-btn" onClick={() => removeComponent(index)} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                     className="bi bi-trash3" viewBox="0 0 16 16">
                  <path
                    d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
              </button>
            </div>
          )
        })}
        <div className="add-element-btn" onClick={openAddComponentModal}>
          <img src={video} alt="video-icon" className="add-element-icon"/>
          <img src={text} alt="text-icon" className="add-element-icon"/>
          <img src={mcq} alt="mcq-icon" className="add-element-icon"/>
          <img src={moq} alt="moq-icon" className="add-element-icon"/>
          <img src={coding} alt="coding-icon" className="add-element-icon"/>
        </div>
        <div className="mt-2 dark:text-white">
          <form onSubmit={handleLessonCreate}>
            <label htmlFor="materials">Dars uchun materiallar (agar bo'lsa)</label>
            <input type="file" name="materials" id="materials" className="new-materials-input"
                   onChange={handleMaterialsChange}/>
            <div className="flex justify-end">
              <button className="lesson-create-btn">
                Yaratish
              </button>
            </div>
          </form>
        </div>
        <Modal
          isOpen={isLessonOpen}
          onRequestClose={closeLessonModal}
          className="modal-window"
          overlayClassName="modal-overlay"
          contentLabel="Create New Lesson"
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={false}
        >
          <h2 className="modal-title">Yangi dars qo'shish</h2>
          <form className="space-y-4" onSubmit={closeLessonModal}>
            <div>
              <label className="modal-label">Dars nomi</label>
              <input type="text" name="title" className="modal-input" placeholder="Sarlavha"
                     onChange={handleLessonTitleChange} required/>
            </div>
            <div>
              <label className="modal-label">Tartib raqami</label>
              <input type="number" name="serial_number" id="serial_number" className="modal-input"
                     value={lessonSerialNumber} onChange={handleLessonSerialNumberChange} required/>
            </div>
            <div>
              <label className="modal-label">Maksimal ball</label>
              <input type="number" name="max_score" id="max_score" className="modal-input" value={maxScore}
                     onChange={handleMaxScoreChange} required/>
            </div>
            <div className="modal-button-container">
              <button
                type="submit"
                className="modal-submit-btn"
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          isOpen={isAddComponentOpen}
          onRequestClose={closeAddComponentModal}
          className="modal-window"
          overlayClassName="modal-overlay"
          contentLabel="Add New Component"
        >
          <h2 className="modal-title">Yangi element qo'shish</h2>
          <form className="space-y-4" onSubmit={addComponent}>
            <div>
              <label className="modal-label">Element turi</label>
              <select name="element_type" id="element_type" className="modal-input" onChange={handleLessonTypeChange}
                      required>
                <option value="video" className="modal-option-item">Video</option>
                <option value="text" className="modal-option-item">Text</option>
                <option value="mcq" className="modal-option-item">Variant tanlash</option>
                <option value="moq" className="modal-option-item">To'g'ri javoblarni tanlash</option>
                <option value="coding" className="modal-option-item">Dasturlash</option>
              </select>
            </div>
            <div className="modal-component-detalls">
              {lessonType === 'video' && (
                <div>
                  <label htmlFor="video_url" className="modal-label">Video manzili</label>
                  <input type="text" name="video_url" id="video_url" className="modal-input"/>
                </div>
              ) || lessonType === 'text' && (
                <div className="modal-editor-container">
                  <div className="toolbar">
                    <button className="toolbar-btn" type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}>
                      <strong>B</strong>
                    </button>
                    <button className="toolbar-btn" type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}>
                      <i>I</i>
                    </button>
                    <button className="toolbar-btn" type="button" onClick={setLink}>
                      <span>🔗</span>
                    </button>
                  </div>
                  <EditorContent editor={editor} className="modal-editor-content"/>
                </div>
              ) || lessonType === 'mcq' && (
                <div className="modal-mcq-container">
                  <div>
                    <label htmlFor="question" className="modal-label">Savol</label>
                    <input type="text" name="question" id="question" className="modal-input"/>
                  </div>
                  <div>
                    <label className="modal-label">Variantlar</label>
                    <div className="space-y-2">
                      {options && options.map((option, index) => {
                        return (
                          <div className="new-option-container" key={option.id}>
                            <div className={`new-option-text ${option.is_correct ? 'correct-option' : ''}`}>
                              {option.option}
                            </div>
                            <button onClick={() => removeOption(index)} className="remove-option-btn" type="button">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                   className="bi bi-trash3" viewBox="0 0 16 16">
                                <path
                                  d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                              </svg>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    <div className="new-option-container">
                      <input type="text" name="new_option" id="new_option" className="new-option-input"
                             value={newOptionText} onChange={handleNewOptionChange}/>
                      {!options.find((option) => option.is_correct) && (
                        <input type="checkbox" name="is_correct" id="is_correct" className="new-option-checkbox"
                               checked={newOptionIsCorrect}
                               onChange={() => setNewOptionIsCorrect(!newOptionIsCorrect)}/>
                      )}
                      <button className="new-option-btn" onClick={addNewOption} type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                             className="bi bi-check-lg"
                             viewBox="0 0 16 16">
                          <path
                            d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) || lessonType === 'moq' && (
                <div className="modal-mcq-container">
                  <div>
                    <label htmlFor="question" className="modal-label">Savol</label>
                    <input type="text" name="question" id="question" className="modal-input"/>
                  </div>
                  <div>
                    <label className="modal-label">Variantlar</label>
                    <div className="space-y-2">
                      {options && options.map((option, index) => {
                        return (
                          <div className="new-option-container" key={option.id}>
                            <div className={`new-option-text ${option.is_correct ? 'correct-option' : ''}`}>
                              {option.option}
                            </div>
                            <button onClick={() => removeOption(index)} className="remove-option-btn" type="button">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                   className="bi bi-trash3" viewBox="0 0 16 16">
                                <path
                                  d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                              </svg>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    <div className="new-option-container">
                      <input type="text" name="new_option" id="new_option" className="new-option-input"
                             value={newOptionText} onChange={handleNewOptionChange}/>
                      <input type="checkbox" name="is_correct" id="is_correct" className="new-option-checkbox"
                             checked={newOptionIsCorrect}
                             onChange={() => setNewOptionIsCorrect(!newOptionIsCorrect)}/>
                      <button className="new-option-btn" type="button" onClick={addNewOption}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                             className="bi bi-check-lg"
                             viewBox="0 0 16 16">
                          <path
                            d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="max_score" className="modal-label">Maksimal ball (max:100)</label>
              <input type="number" name="max_score" id="max_score" className="modal-input" max="100" min="0" required/>
            </div>
            <div>
              <label htmlFor="serial_number" className="modal-label">Tartib raqami</label>
              <input type="number" name="serial_number" id="serial_number" className="modal-input" min="1" max="100"
                     value={componentSerialNumber} onChange={handleComponentSerialNumberChange} required/>
            </div>
            <div className="modal-button-container">
              <button
                type="submit"
                className="modal-submit-btn"
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <LoadingAnimation/>
        </div>
      )}
      <Footer/>
      <HomeButton/>
    </div>
  );
};

export default LessonCreate;
