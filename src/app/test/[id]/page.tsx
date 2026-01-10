'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function TakeTestPage() {
  const { id } = useParams();
  const testId = Number(id) - 1;
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Загружаем список тестов с сервера
    fetch('/api/tests/list')
      .then((res) => res.json())
      .then((tests) => {
        if (testId >= 0 && testId < tests.length) {
          const t = tests[testId];
          setTest(t);
          setAnswers(Array(t.questions.length).fill(null));
        }
      })
      .catch((err) => {
        console.error('Ошибка загрузки теста:', err);
        alert('Не удалось загрузить тест');
      });
  }, [testId]);

  const handleAnswer = (qIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      await fetch('/api/tests/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: testId + 1,
          userId: 'anonymous',
          answers,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Ошибка отправки результата:', err);
      alert('Не удалось отправить результат');
    }
  };

  if (!test) return <div className="p-4">Загрузка теста...</div>;
  if (submitted)
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="card bg-green-50 border border-green-200 rounded p-6">
          ✅ Спасибо! Тест успешно отправлен.
        </div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{test.title}</h1>
      {test.questions.map((q: any, idx: number) => (
        <div key={idx} className="card bg-white p-4 mb-4 rounded shadow">
          <p className="mb-2">
            <strong>{idx + 1}.</strong> {q.text}
          </p>
          {q.options?.map((opt: string, optIdx: number) => (
            <label key={optIdx} className="block mb-1">
              <input
                type="radio"
                name={`q${idx}`}
                checked={answers[idx] === opt}
                onChange={() => handleAnswer(idx, opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={answers.some((a) => a === null)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded disabled:bg-gray-400"
      >
        Отправить результат
      </button>
    </div>
  );
}
