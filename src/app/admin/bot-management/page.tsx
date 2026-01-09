'use client';

import { useState } from 'react';
import { sendBroadcastToGroup, sendMessageToUser } from '@/lib/telegram';
import { readSheet } from '@/lib/googleSheets';

export default function BotManagementPage() {
  const [messageText, setMessageText] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    const data = await readSheet('Main');
    setUsers(data.slice(1).map(row => ({ id: row[1], name: `${row[2]} ${row[3]}` })));
  };

  const handleBroadcast = async () => { const { sentCount } = await sendBroadcastToGroup('Main', messageText); alert(`Рассылка отправлена ${sentCount} пользователям`); };
  const handlePersonalSend = async () => { const result = await sendMessageToUser(targetUserId, personalMessage); if (result.success) alert('Сообщение отправлено'); else alert('Ошибка: ' + result.error); };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Управление Telegram-ботом</h1>
      <div className="card mb-6">
        <h2 className="text-xl mb-3">Массовая рассылка</h2>
        <textarea placeholder="Текст рассылки" value={messageText} onChange={(e) => setMessageText(e.target.value)} className="form-input w-full h-24 mb-2" />
        <button onClick={handleBroadcast} className="btn-success">Отправить всем</button>
      </div>
      <div className="card">
        <h2 className="text-xl mb-3">Личное сообщение</h2>
        <input type="text" placeholder="ID пользователя" value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} className="form-input mb-2" />
        <textarea placeholder="Текст сообщения" value={personalMessage} onChange={(e) => setPersonalMessage(e.target.value)} className="form-input w-full h-24 mb-2" />
        <button onClick={handlePersonalSend} className="btn-primary">Отправить</button>
        <button onClick={loadUsers} className="btn-secondary ml-2">Загрузить список</button>
        {users.length > 0 && (<div className="mt-4 max-h-40 overflow-y-auto">{users.map(u => (<div key={u.id} className="text-sm">{u.name} — {u.id}</div>))}</div>)}
      </div>
    </div>
  );
}
