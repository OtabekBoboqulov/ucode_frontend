import audio_correct from "../assets/correct.mp3";
import audio_incorrect from "../assets/incorrect.mp3";
import {BASE_URL} from "../constants.jsx";

const soundCorrect = new Audio(`../../..${audio_correct}`);
const soundIncorrect = new Audio(`../../..${audio_incorrect}`);

const playSound = (is_correct) => {
  if (is_correct) {
    soundCorrect.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  } else {
    soundIncorrect.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  }
}

export const checkAnswer = async (answer, id) => {
  const userData = JSON.parse(localStorage.getItem('loginData'));
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
  playSound(data.is_correct);
  return data.is_correct;
};
