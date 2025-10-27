import React from 'react';
import type { Mode, AspectRatio, ImageQuality, HistoryItem } from '../types';
import { GenerateIcon, EditIcon, SceneIcon, IdeasIcon, ChevronDownIcon, SettingsIcon } from './Icons';

interface SidebarProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  editPrompt: string;
  setEditPrompt: (prompt: string) => void;
  scenePrompt: string;
  setScenePrompt: (prompt: string) => void;
  ideasPrompt: string;
  setIdeasPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  imageQuality: ImageQuality;
  setImageQuality: (quality: ImageQuality) => void;
  isLoading: boolean;
  onGenerateImage: () => void;
  onEditImage: () => void;
  onGenerateScene: () => void;
  onGetIdeas: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageToEdit: { file: File; dataUrl: string } | null;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  isAdvancedEditOpen: boolean;
  setIsAdvancedEditOpen: (isOpen: boolean) => void;
  styleStrength: number;
  setStyleStrength: (value: number) => void;
  creativity: number;
  setCreativity: (value: number) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-pink-500/20 text-pink-300 border-l-4 border-pink-400'
        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
    }`}
  >
    {children}
    <span className="ml-3">{label}</span>
  </button>
);

const AspectRatioButton: React.FC<{
    ratio: AspectRatio;
    currentRatio: AspectRatio;
    setRatio: (ratio: AspectRatio) => void;
}> = ({ ratio, currentRatio, setRatio }) => (
    <button
        onClick={() => setRatio(ratio)}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            currentRatio === ratio ? 'bg-pink-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
        }`}
    >
        {ratio}
    </button>
);

const QualityButton: React.FC<{
    quality: ImageQuality;
    label: string;
    currentQuality: ImageQuality;
    setQuality: (quality: ImageQuality) => void;
}> = ({ quality, label, currentQuality, setQuality }) => (
    <button
        onClick={() => setQuality(quality)}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex-1 ${
            currentQuality === quality ? 'bg-pink-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
        }`}
    >
        {label}
    </button>
);


export const Sidebar: React.FC<SidebarProps> = (props) => {
  const {
    mode, setMode, prompt, setPrompt, editPrompt, setEditPrompt,
    scenePrompt, setScenePrompt, ideasPrompt, setIdeasPrompt, aspectRatio,
    setAspectRatio, imageQuality, setImageQuality, isLoading, onGenerateImage, onEditImage, onGenerateScene,
    onGetIdeas, onFileChange, imageToEdit, history, onSelectHistoryItem,
    isAdvancedEditOpen, setIsAdvancedEditOpen, styleStrength, setStyleStrength,
    creativity, setCreativity, negativePrompt, setNegativePrompt,
    hasApiKey, onOpenApiKeyModal
  } = props;
  
  const aspectRatios: AspectRatio[] = ['1:1', '3:4', '4:3', '9:16', '16:9'];
  const qualities: {quality: ImageQuality, label: string}[] = [{quality: 'standard', label: '标准'}, {quality: 'hd', label: '高清'}];
  const noApiKeyTitle = "请先在设置中配置您的 API Key";

  return (
    <aside className="w-full md:w-96 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col flex-shrink-0">
      <div className="flex-shrink-0">
        <div className="p-6 border-b border-gray-700/50">
          <h1 className="text-2xl font-bold text-white">singhoo!! galgame工作室</h1>
          <p className="text-sm text-gray-400 mt-1">AI插画创作工具</p>
        </div>
        <nav>
          <NavButton label="生成图像" isActive={mode === 'generate'} onClick={() => setMode('generate')}>
              <GenerateIcon className="w-5 h-5" />
          </NavButton>
          <NavButton label="编辑图像" isActive={mode === 'edit'} onClick={() => setMode('edit')}>
              <EditIcon className="w-5 h-5" />
          </NavButton>
          <NavButton label="构思场景" isActive={mode === 'scene'} onClick={() => setMode('scene')}>
              <SceneIcon className="w-5 h-5" />
          </NavButton>
           <NavButton label="角色灵感" isActive={mode === 'ideas'} onClick={() => setMode('ideas')}>
              <IdeasIcon className="w-5 h-5" />
          </NavButton>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
            {mode === 'generate' && (
              <div className="space-y-4">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">提示词</label>
                <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={6} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-pink-500 focus:border-pink-500 transition"></textarea>
                
                <label className="block text-sm font-medium text-gray-300">宽高比</label>
                <div className="flex flex-wrap gap-2">
                    {aspectRatios.map(r => <AspectRatioButton key={r} ratio={r} currentRatio={aspectRatio} setRatio={setAspectRatio} />)}
                </div>
                
                <label className="block text-sm font-medium text-gray-300">图像质量</label>
                <div className="flex flex-wrap gap-2">
                    {qualities.map(q => <QualityButton key={q.quality} quality={q.quality} label={q.label} currentQuality={imageQuality} setQuality={setImageQuality} />)}
                </div>

                <button onClick={onGenerateImage} disabled={isLoading || !hasApiKey} title={!hasApiKey ? noApiKeyTitle : ""} className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                  {isLoading ? '生成中...' : '生成'}
                </button>
              </div>
            )}
            {mode === 'edit' && (
              <div className="space-y-4">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300">上传图片</label>
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imageToEdit ? 
                        <img src={imageToEdit.dataUrl} alt="Preview" className="mx-auto h-24 w-auto rounded-md object-cover" /> :
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    }
                    <div className="flex text-sm text-gray-500">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-pink-400 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-pink-500">
                        <span>{imageToEdit ? '更换文件' : '上传文件'}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
                      </label>
                      <p className="pl-1">或拖拽文件</p>
                    </div>
                    <p className="text-xs text-gray-500">支持PNG, JPG, GIF, 最大10MB</p>
                  </div>
                </div>

                <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300">编辑指令</label>
                <textarea id="edit-prompt" value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} rows={3} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-pink-500 focus:border-pink-500 transition"></textarea>

                {/* Advanced Edit Section */}
                <div className="space-y-2 pt-2">
                    <button onClick={() => setIsAdvancedEditOpen(!isAdvancedEditOpen)} className="w-full flex justify-between items-center text-sm font-medium text-gray-300 hover:text-white">
                        <span>高级编辑</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isAdvancedEditOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isAdvancedEditOpen && (
                        <div className="pt-2 space-y-4 border-t border-gray-700/50">
                            <div>
                                <label htmlFor="style-strength" className="block text-xs font-medium text-gray-400">风格强度: <span className="font-semibold text-pink-400">{styleStrength}</span></label>
                                <p className="text-xs text-gray-500 mb-1">较低的值会保留更多原始风格。</p>
                                <input id="style-strength" type="range" min="0" max="100" value={styleStrength} onChange={(e) => setStyleStrength(Number(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-pink-500" />
                            </div>
                             <div>
                                <label htmlFor="creativity" className="block text-xs font-medium text-gray-400">创意程度: <span className="font-semibold text-pink-400">{creativity}</span></label>
                                <p className="text-xs text-gray-500 mb-1">较高的值会产生更具想象力的结果。</p>
                                <input id="creativity" type="range" min="0" max="100" value={creativity} onChange={(e) => setCreativity(Number(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-pink-500" />
                            </div>
                            <div>
                                <label htmlFor="negative-prompt" className="block text-xs font-medium text-gray-400">负面提示词</label>
                                <p className="text-xs text-gray-500 mb-1">描述您不希望在图像中看到的内容。</p>
                                <textarea id="negative-prompt" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} rows={2} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-xs text-gray-200 focus:ring-pink-500 focus:border-pink-500 transition" placeholder="例如：模糊、丑陋、多余的手指"></textarea>
                            </div>
                        </div>
                    )}
                </div>
                
                <button onClick={onEditImage} disabled={isLoading || !imageToEdit || !hasApiKey} title={!hasApiKey ? noApiKeyTitle : ""} className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                  {isLoading ? '编辑中...' : '应用编辑'}
                </button>
              </div>
            )}
            {mode === 'scene' && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-md text-sm text-blue-300">
                      <p><strong className="font-semibold">思考模式：</strong>输入一个简单的想法，我们最先进的模型将为您生成一个高度详细的场景描述，非常适合为复杂的插图寻找灵感。</p>
                  </div>
                  <label htmlFor="scene-prompt" className="block text-sm font-medium text-gray-300">场景想法</label>
                  <textarea id="scene-prompt" value={scenePrompt} onChange={(e) => setScenePrompt(e.target.value)} rows={4} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                  <button onClick={onGenerateScene} disabled={isLoading || !hasApiKey} title={!hasApiKey ? noApiKeyTitle : ""} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                      {isLoading ? '生成中...' : '生成场景'}
                  </button>
                </div>
            )}
            {mode === 'ideas' && (
                <div className="space-y-4">
                    <div className="p-3 bg-green-500/10 border border-green-400/30 rounded-md text-sm text-green-300">
                        <p><strong className="font-semibold">研究模式：</strong>提出关于角色、主题或风格的问题。此工具使用谷歌搜索为您的创作提供最新、最相关的想法。</p>
                    </div>
                    <label htmlFor="ideas-prompt" className="block text-sm font-medium text-gray-300">问题</label>
                    <textarea id="ideas-prompt" value={ideasPrompt} onChange={(e) => setIdeasPrompt(e.target.value)} rows={4} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-green-500 focus:border-green-500 transition"></textarea>
                    <button onClick={onGetIdeas} disabled={isLoading || !hasApiKey} title={!hasApiKey ? noApiKeyTitle : ""} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                        {isLoading ? '搜索中...' : '获取灵感'}
                    </button>
                </div>
            )}
        </div>

        <div className="px-6 pb-6 border-t border-gray-700/50">
          <h2 className="text-lg font-semibold text-white pt-4 mb-3">历史记录</h2>
          {history.length > 0 ? (
            <ul className="space-y-3">
              {history.map(item => (
                <li key={item.id}>
                  <button 
                    onClick={() => onSelectHistoryItem(item)}
                    className="w-full flex items-center gap-3 p-2 rounded-md bg-gray-700/50 hover:bg-gray-700 transition-colors text-left"
                    aria-label={`查看历史记录：${item.prompt}`}
                  >
                    {(item.type === 'generate' || item.type === 'edit') ? (
                      <img src={item.thumbnail} alt="History thumbnail" className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 flex-shrink-0 bg-gray-600 rounded-md flex items-center justify-center">
                        {item.type === 'scene' ? <SceneIcon className="w-6 h-6 text-gray-400" /> : <IdeasIcon className="w-6 h-6 text-gray-400" />}
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-medium text-gray-200 truncate" title={item.prompt}>{item.prompt}</p>
                        <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">暂无历史记录。开始创作吧！</p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 p-4 border-t border-gray-700/50">
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-200 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 rounded-md"
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="ml-3">API Key 设置</span>
          </button>
      </div>
    </aside>
  );
};
