'use client';

import { useState, useEffect } from 'react';

export default function TestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestQuestions, setNewTestQuestions] = useState('');

  const loadTests = () => {
    fetch('/api/tests/list')
      .then((res) => res.json())
      .then(setTests)
      .catch((err) => {
        console.error('Ошибка загрузки тестов:', err);
        alert('Не удалось загрузить список тестов');
      });
  };

  useEffect(() => {
    loadTests();
  }, []);

  const handleCreateTest = async () => {
    try {
      const questions = JSON.parse(newTestQuestions);
      const res = await fetch('/api/tests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTestTitle, questions }),
      });
      if (res.ok) {
        setNewTestTitle('');
        setNewTestQuestions('');
        loadTests();
      } else {
        throw new Error('Сервер вернул ошибку');
      }
    } catch (e) {
      alert('Неверный формат вопросов (ожидается JSON)');
    }
  };

  const handleDeleteTest = async (index: number) => {
    if (!confirm('Удалить тест?')) return;
    try {
      const res = await fetch(`/api/tests/delete?id=${index + 1}`, { method: 'DELETE' });
      if (res.ok) {
        loadTests();
      } else {
        alert('Не удалось удалить тест');
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка при удалении');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Управление тестами</h1>

      <div className="card bg-white p-4 mb-6 rounded shadow">
        <h2 className="text-xl mb-3">Создать новый тест</h2>
        <input
          type="text"
          placeholder="Название теста"
          value={newTestTitle}
          onChange={(e) => setNewTestTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder='JSON: [{"text":"Вопрос 1","options":["A","B"]}, ...]'
          value={newTestQuestions}
          onChange={(e) => setNewTestQuestions(e.target.value)}
          className="w-full h-32 p-2 border rounded mb-2"
        />
        <button onClick={handleCreateTest} className="bg-blue-600 text-white px-4 py-2 rounded">
          Создать
        </button>
      </div>

      <div>
        <h2 className="text-xl mb-3">Существующие тесты</h2>
        {tests.length === 0 ? (
          <p>Нет тестов</p>
        ) : (
          tests.map((test, idx) => (
            <div key={idx} className="card bg-white p-4 mb-3 flex justify-between items-center rounded shadow">
              <div>
                <strong>{test.title}</strong> ({test.questions?.length || 0} вопросов)
              </div>
              <button
                onClick={() => handleDeleteTest(idx)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Удалить
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
