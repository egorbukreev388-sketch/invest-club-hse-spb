
import React, { useState } from 'react';
import { Quiz } from '../types';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx: number) => {
    const newAnswers = [...answers, idx];
    if (currentIdx < quiz.questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIdx(currentIdx + 1);
    } else {
      setAnswers(newAnswers);
      setFinished(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    answers.forEach((ans, i) => {
      if (ans === quiz.questions[i].correctIndex) score++;
    });
    return score;
  };

  if (finished) {
    const score = calculateScore();
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-auto">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold mb-2">Тест завершен!</h2>
        <p className="text-gray-600 mb-6">Ваш результат: <span className="text-blue-600 font-bold">{score} / {quiz.questions.length}</span></p>
        <button 
          onClick={() => onComplete(score)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  const q = quiz.questions[currentIdx];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-blue-600">Вопрос {currentIdx + 1} из {quiz.questions.length}</span>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">Отмена</button>
      </div>
      <h3 className="text-xl font-bold mb-8">{q.text}</h3>
      <div className="space-y-4">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className="w-full text-left p-4 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <span className="inline-block w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-center leading-8 mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>
      <div className="mt-8 bg-gray-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-500" 
          style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default QuizPlayer;
