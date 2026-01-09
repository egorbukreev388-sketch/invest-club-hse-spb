'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAllTests, saveTestResult } from '@/lib/googleSheets';

export default function TakeTestPage() {
  const { id } = useParams();
  const testId = Number(id) - 1;
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadTest = async () => {
      const tests = await getAllTests();
      if (testId >= 0 && testId < tests.length) {
        setTest(tests[testId]);
        setAnswers(Array(tests[testId].questions.length).fill(null));
      }
    };
    loadTest();
  }, [testId]);

  const handleAnswer = (qIndex: number, answer: any) => { const newAnswers = [...answers]; newAnswers[qIndex] = answer; setAnswers(newAnswers); };
  const handleSubmit = async () => { const userId = 'anonymous'; await saveTestResult(testId + 1, userId, answers); setSubmitted(true); };

  if (!test) return <div>Загрузка...</div>;
  if (submitted) return <div className="card text-center">✅ Спасибо! Тест отправлен.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{test.title}</h1>
      {test.questions.map((q: any, idx: number) => (
        <div key={idx} className="card mb-4">
          <p className="mb-2">{idx + 1}. {q.text}</p>
          {q.options?.map((opt: string, optIdx: number) => (
            <label key={optIdx} className="block mb-1">
              <input type="radio" name={`q${idx}`} checked={answers[idx] === opt} onChange={() => handleAnswer(idx, opt)} className="mr-2" />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} disabled={answers.some(a => a === null)} className="btn-primary w-full">Отправить результат</button>
    </div>
  );
}
