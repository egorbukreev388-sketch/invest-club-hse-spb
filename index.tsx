import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Modality, Type } from "@google/genai";

// --- Types ---
type AppMode = 'chat' | 'image' | 'voice';

interface Message {
  role: 'user' | 'model';
  text: string;
}

// --- Utilities ---
const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Components ---

const App = () => {
  const [mode, setMode] = useState<AppMode>('chat');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Image State
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');

  // Voice State
  const [voiceText, setVoiceText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    const newMsg: Message = { role: 'user', text: userInput };
    setChatMessages(prev => [...prev, newMsg]);
    setUserInput('');
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: { systemInstruction: 'Ты — профессиональный ассистент, эксперт в технологиях и дизайне. Отвечай кратко, но емко.' }
      });

      const response = await chat.sendMessageStream({ message: userInput });
      let fullText = '';
      
      // Placeholder for model response
      setChatMessages(prev => [...prev, { role: 'model', text: '...' }]);

      for await (const chunk of response) {
        fullText += chunk.text || '';
        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'model', text: fullText };
          return updated;
        });
      }
    } catch (err: any) {
      setError('Ошибка чата: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageGen = async () => {
    if (!imagePrompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePrompt }] },
        config: { imageConfig: { aspectRatio: aspectRatio as any } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImageUrl(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    } catch (err: any) {
      setError('Ошибка генерации: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceGen = async () => {
    if (!voiceText.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: voiceText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (err: any) {
      setError('Ошибка озвучки: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 glass flex flex-col border-r border-white/10 z-20">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hidden md:block">
            Gemini Nexus
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setMode('chat')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${mode === 'chat' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'hover:bg-white/5'}`}
          >
            <span className="md:mr-3">💬</span>
            <span className="hidden md:block">Чат</span>
          </button>
          <button 
            onClick={() => setMode('image')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${mode === 'image' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'hover:bg-white/5'}`}
          >
            <span className="md:mr-3">🎨</span>
            <span className="hidden md:block">Изображения</span>
          </button>
          <button 
            onClick={() => setMode('voice')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${mode === 'voice' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'hover:bg-white/5'}`}
          >
            <span className="md:mr-3">🔊</span>
            <span className="hidden md:block">Голос</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-full overflow-y-auto p-4 md:p-8">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg z-50">
            {error}
          </div>
        )}

        {mode === 'chat' && (
          <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
            <div className="flex-1 space-y-4 overflow-y-auto mb-4 pr-2">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                  <div className="text-6xl mb-4">✨</div>
                  <p>Начните диалог с искусственным интеллектом</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'glass text-slate-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChat} className="relative mt-auto">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Спросите о чем угодно..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-blue-500 transition-all text-white"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-2 px-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? '...' : 'Отправить'}
              </button>
            </form>
          </div>
        )}

        {mode === 'image' && (
          <div className="max-w-4xl mx-auto w-full flex flex-col space-y-6">
            <div className="glass p-8 rounded-3xl space-y-4">
              <h2 className="text-2xl font-bold">Image Lab</h2>
              <textarea 
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Опишите желаемое изображение (например, киберпанк-город в неоновых огнях)..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-all text-white"
              />
              <div className="flex flex-wrap gap-4 items-center">
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl p-2 outline-none text-white"
                >
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Portrait</option>
                  <option value="4:3">4:3 Standard</option>
                </select>
                <button 
                  onClick={handleImageGen}
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {loading ? 'Генерируем...' : 'Создать шедевр'}
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-[400px] glass rounded-3xl overflow-hidden flex items-center justify-center border-dashed border-2 border-white/10">
              {generatedImageUrl ? (
                <img src={generatedImageUrl} alt="AI Generated" className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-slate-500 text-center p-8">
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="w-16 h-16 bg-purple-500/20 rounded-full mx-auto" />
                      <p>Алгоритмы в процессе творчества...</p>
                    </div>
                  ) : (
                    <p>Здесь появится ваше изображение</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {mode === 'voice' && (
          <div className="max-w-2xl mx-auto w-full">
            <div className="glass p-8 rounded-3xl space-y-6">
              <h2 className="text-2xl font-bold flex items-center">
                Voice Studio <span className="ml-2 animate-bounce">🎙️</span>
              </h2>
              <textarea 
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="Введите текст для озвучки..."
                className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-emerald-500 transition-all text-white"
              />
              <div className="grid grid-cols-2 gap-4">
                {['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'].map(voice => (
                  <button
                    key={voice}
                    onClick={() => setSelectedVoice(voice)}
                    className={`p-3 rounded-xl border transition-all ${selectedVoice === voice ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                  >
                    {voice}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleVoiceGen}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? 'Синтезируем голос...' : 'Озвучить'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
