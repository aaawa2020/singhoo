import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentApiKey: string | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (currentApiKey) {
      setApiKey(currentApiKey);
    } else {
      setApiKey('');
    }
  }, [currentApiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(apiKey);
    onClose();
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={handleOverlayClick}
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-gray-800 border border-gray-700/50 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <h2 className="text-xl font-bold text-white mb-4">设置 Gemini API Key</h2>
        <p className="text-sm text-gray-400 mb-4">
          您的 API Key 将会安全地存储在您的浏览器本地。它不会被发送到我们的服务器。
          您可以从{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">
            Google AI Studio
          </a>{' '}
          获取您的 API Key。
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 mb-1">
              API Key
            </label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-pink-500 focus:border-pink-500 transition"
              placeholder="在此处粘贴您的 API Key"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-md transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
