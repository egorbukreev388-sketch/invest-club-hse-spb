'use client';

import { useState, useEffect } from 'react';
import { getAllTests, createTest, deleteTest } from '@/lib/googleSheets';

export default function TestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestQuestions, setNewTestQuestions] = useState('');

  useEffect(() => { loadTests(); }, []);
  const loadTests = async () => { const data = await getAllTests(); setTests(data); };

  const handleCreateTest = async () => {
    try { const questions = JSON.parse(newTestQuestions); await createTest(newTestTitle, questions); setNewTestTitle(''); setNewTestQuestions(''); loadTests(); }
    catch (e) { alert('Неверный формат вопросов (ожидается JSON)'); }
  };

  const handleDeleteTest = async (index: number) => { if (confirm('Удалить тест?')) { await deleteTest(index); loadTests(); } };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Управление тестами</h1>
      <div className="card mb-6">
        <h2 className="text-xl mb-3">Создать новый тест</h2>
        <input type="text" placeholder="Название теста" value={newTestTitle} onChange={(e) => setNewTestTitle(e.target.value)} className="form-input mb-2 w-full" />
        <textarea placeholder='JSON: [{"text":"Вопрос 1","options":["A","B"]}, ...]' value={newTestQuestions} onChange={(e) => setNewTestQuestions(e.target.value)} className="form-input w-full h-32 mb-2" />
        <button onClick={handleCreateTest} className="btn-primary">Создать</button>
      </div>
      <div>
        <h2 className="text-xl mb-3">Существующие тесты</h2>
        {tests.map((test, idx) => (
          <div key={idx} className="card mb-3 flex justify-between items-center">
            <div><strong>{test.title}</strong> ({test.questions.length} вопросов)</div>
            <button onClick={() => handleDeleteTest(idx)} className="btn-danger text-sm">Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
