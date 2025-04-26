import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

export default function ChatApp() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]); // { sender: 'user'|'bot', text }
  const [lastRaw, setLastRaw] = useState(''); // store previous raw assistant output
  const bottomRef = useRef(null);
  const {backendUrl} = useContext(AppContext)

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  // Remove everything up through the last "Assistant:" label
  const stripContext = (raw) => raw.replace(/^[\s\S]*Assistant:\s*/, '').trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setChat((c) => [...c, { sender: 'user', text: userMessage }]);
    setInput('');

    try {
      const resp = await axios.post( backendUrl + '/api/medical-chat', { message: userMessage });
      const payload = resp.data.response;

      // Extract raw assistant text
      let rawText = '';
      if (payload && Array.isArray(payload.data) && payload.data.length) {
        rawText = payload.data[0];
      } else if (Array.isArray(payload) && payload.length) {
        rawText = payload[0];
      } else {
        rawText = '⚠️ Unexpected response format.';
      }

      // Remove any repeated content from the previous response
      let newRaw = rawText;
      if (lastRaw && newRaw.startsWith(lastRaw)) {
        newRaw = newRaw.slice(lastRaw.length);
      }
      setLastRaw(rawText);

      // Clean out context markers
      const aiText = stripContext(newRaw);

      setChat((c) => [...c, { sender: 'bot', text: aiText }]);
    } catch (err) {
      console.error('API error', err);
      setChat((c) => [
        ...c,
        { sender: 'bot', text: '⚠️ Failed to get a response. Please try again.' },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto border rounded shadow">
      {/* Chat header */}
      <div className="p-4 bg-blue-600 text-white text-center font-semibold">
        Medical AI Assistant
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((m, i) => (
          <div key={i} className={m.sender === 'user' ? 'text-right' : 'text-left'}>
            <span
              className={
                'inline-block px-3 py-2 rounded-lg ' +
                (m.sender === 'user'
                  ? 'bg-blue-200 text-blue-900'
                  : 'bg-gray-100 text-gray-800')
              }
            >
              {m.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center space-x-2">
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none"
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
