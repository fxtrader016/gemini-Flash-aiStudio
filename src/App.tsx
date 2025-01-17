import React, { useState } from 'react';
import { getGeminiResponse } from './lib/gemini';
import Chat from './components/Chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      setMessages(prev => [...prev, { role: 'user', content: message }]);
      
      const response = await getGeminiResponse(message, messages);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred while processing your request';
        
      console.error('Chat Error:', { error });
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${errorMessage}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col">
        <Chat
          messages={messages}
          onSend={handleSend}
          onNewChat={handleNewChat}
          inputValue={inputValue}
          setInputValue={setInputValue}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;