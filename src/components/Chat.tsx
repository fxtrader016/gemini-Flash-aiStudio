import React from 'react';
import { MessageCircle, Send, Plus, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  messages: Message[];
  onSend: (message: string) => void;
  onNewChat: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  loading: boolean;
}

const containsArabic = (text: string) => {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
};

const markdownToHtml = (markdown: string) => {
  const html = markdown
    .replace(/^[\s]*[-*+][\s]+([^\n]+)/gm, '<ul><li>$1</li></ul>')
    .replace(/^[\s]*(\d+\.)[\s]+([^\n]+)/gm, '<ol><li>$2</li></ol>')
    .replace(/#{6}\s(.*)/g, '<h6>$1</h6>')
    .replace(/#{5}\s(.*)/g, '<h5>$1</h5>')
    .replace(/#{4}\s(.*)/g, '<h4>$1</h4>')
    .replace(/#{3}\s(.*)/g, '<h3>$1</h3>')
    .replace(/#{2}\s(.*)/g, '<h2>$1</h2>')
    .replace(/#{1}\s(.*)/g, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/<\/[ou]l>\s*<[ou]l>/g, '')
    .trim();

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><div style="font-family: Arial, sans-serif;">${html}</div></body></html>`;
};

export default function Chat({
  messages,
  onSend,
  onNewChat,
  inputValue,
  setInputValue,
  loading
}: ChatProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      const htmlContent = markdownToHtml(text);
      
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([text], { type: 'text/plain' });

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        })
      ]);

      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch (fallbackErr) {
        console.error('Copy failed:', fallbackErr);
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          setCopiedIndex(index);
          setTimeout(() => setCopiedIndex(null), 2000);
        } catch (e) {
          console.error('Final copy attempt failed:', e);
        }
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="bg-[#1a73e8] shadow-md rounded-t-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Gemini Flash 1.5 - AI Studio
            </h1>
            <p className="text-blue-100">By: Mohamed AIT MOUS</p>
          </div>
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => {
            const isArabic = containsArabic(message.content);
            return (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg relative shadow-sm transition-all duration-200 hover:shadow-md ${
                    message.role === 'user'
                      ? 'bg-[#e8f0fe] text-[#1a73e8]'
                      : 'bg-white text-gray-800'
                  }`}
                  style={{
                    direction: isArabic ? 'rtl' : 'ltr',
                    fontFamily: isArabic ? 'Noto Sans Arabic, Noto Sans, sans-serif' : 'Noto Sans, sans-serif',
                  }}
                >
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(message.content, index)}
                      className={`absolute -bottom-2 ${isArabic ? 'left-2' : 'right-2'} p-1.5 rounded-full bg-white hover:bg-gray-100 transition-all duration-200 group shadow-sm`}
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      )}
                    </button>
                  )}
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none prose-headings:text-[#1a73e8] prose-a:text-[#1a73e8] pb-4">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="font-noto-sans">{message.content}</p>
                  )}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="animate-pulse flex space-x-2">
                  <div className="w-2 h-2 bg-[#1a73e8] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#1a73e8] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-[#1a73e8] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-4 rounded-b-lg">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all duration-200"
              dir="auto"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1557b0] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}