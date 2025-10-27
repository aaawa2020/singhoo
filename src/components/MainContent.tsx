import React from 'react';
import type { GroundingSource, Mode } from '../types';
import { UndoIcon, RedoIcon, SendToEditIcon } from './Icons';

interface MainContentProps {
  mode: Mode;
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
  generatedText: string | null;
  groundingSources: GroundingSource[] | null;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onTransferToEdit: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-t-4 border-pink-400 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-pink-300">正在创造您的构想...</p>
        <p className="text-sm text-gray-400">这可能需要一些时间。</p>
    </div>
);

const WelcomeMessage: React.FC = () => (
    <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 inline-block bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg transform -rotate-12"></div>
        <h2 className="text-3xl font-bold text-white mb-2">欢迎来到singhoo!! galgame工作室</h2>
        <p className="text-lg text-gray-400">请从侧边栏选择一个工具，开始创作您的杰作。</p>
    </div>
)

const UndoRedoToolbar: React.FC<{
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}> = ({ undo, redo, canUndo, canRedo }) => (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button 
            onClick={undo} 
            disabled={!canUndo}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Undo"
        >
            <UndoIcon className="w-5 h-5 text-gray-300" />
        </button>
        <button 
            onClick={redo} 
            disabled={!canRedo}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Redo"
        >
            <RedoIcon className="w-5 h-5 text-gray-300" />
        </button>
    </div>
);

export const MainContent: React.FC<MainContentProps> = ({ mode, isLoading, error, generatedImage, generatedText, groundingSources, undo, redo, canUndo, canRedo, onTransferToEdit }) => {
  const hasContent = generatedImage || generatedText || error;

  return (
    <main className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gray-900 overflow-y-auto relative">
      {(canUndo || canRedo) && !isLoading && <UndoRedoToolbar undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />}
      <div className="w-full h-full max-w-5xl max-h-full flex items-center justify-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-md">
            <h3 className="font-bold">错误</h3>
            <p>{error}</p>
          </div>
        ) : generatedImage ? (
          <div className="w-full h-full flex items-center justify-center relative group">
             <img src={generatedImage} alt="Generated art" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/50" />
             {mode === 'generate' && (
                <button 
                    onClick={onTransferToEdit}
                    className="absolute bottom-4 right-4 z-20 p-3 rounded-full bg-pink-600/80 hover:bg-pink-600 text-white shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    aria-label="在编辑器中打开"
                    title="在编辑器中打开"
                >
                    <SendToEditIcon className="w-6 h-6" />
                </button>
            )}
          </div>
        ) : generatedText ? (
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 max-w-3xl mx-auto">
              <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{generatedText}</p>
              {groundingSources && groundingSources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">来源：</h4>
                    <ul className="space-y-1">
                        {groundingSources.map((source, index) => (
                            <li key={index}>
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:text-green-300 hover:underline truncate block">
                                    {source.title || source.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                  </div>
              )}
            </div>
        ) : (
          <WelcomeMessage />
        )}
      </div>
    </main>
  );
};
