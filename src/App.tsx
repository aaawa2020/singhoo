import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { ApiKeyModal } from './components/ApiKeyModal';
import { 
  generateImage, 
  editImage, 
  generateComplexScene, 
  getCharacterIdeas,
  setApiKey as saveApiKey,
  getApiKey,
  hasApiKey as checkHasApiKey
} from './services/geminiService';
import type { Mode, AspectRatio, ImageQuality, GroundingSource, HistoryItem } from './types';

// Custom hook for managing state with undo/redo functionality
// FIX: Changed from generic arrow function to a regular function to avoid JSX parsing issues.
function useHistoryState<T>(initialState: T) {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const setState = useCallback((newState: T, overwrite = false) => {
    if (overwrite) {
      const newHistory = [...history];
      newHistory[currentIndex] = newState;
      setHistory(newHistory);
    } else {
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
    }
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { state, setState, undo, redo, canUndo, canRedo };
}


interface ResultState {
  image: string | null;
  text: string | null;
  sources: GroundingSource[] | null;
}

const initialResultState: ResultState = {
  image: null,
  text: null,
  sources: null,
};


const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');
  const [prompt, setPrompt] = useState<string>('一个美丽的动漫女孩，银色头发，蓝色眼睛，站在花丛中，细节丰富，色彩鲜艳');
  const [editPrompt, setEditPrompt] = useState<string>('把她的头发变成粉色');
  const [scenePrompt, setScenePrompt] = useState<string>('午夜的魔法图书馆');
  const [ideasPrompt, setIdeasPrompt] = useState<string>('近期galgame中有哪些流行的角色原型？');
  
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('3:4');
  const [imageQuality, setImageQuality] = useState<ImageQuality>('hd');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Advanced Edit State
  const [isAdvancedEditOpen, setIsAdvancedEditOpen] = useState(false);
  const [styleStrength, setStyleStrength] = useState(50);
  const [creativity, setCreativity] = useState(50);
  const [negativePrompt, setNegativePrompt] = useState('');

  const { 
    state: resultState, 
    setState: setResultState, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useHistoryState<ResultState>(initialResultState);

  const [imageToEdit, setImageToEdit] = useState<{ file: File; dataUrl: string } | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const key = getApiKey();
    setApiKey(key);
    const keyExists = checkHasApiKey();
    setHasApiKey(keyExists);
    if (!keyExists) {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    saveApiKey(key);
    setApiKey(key);
    setHasApiKey(checkHasApiKey());
    setIsApiKeyModalOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImageToEdit({ file, dataUrl });
        setResultState({ image: dataUrl, text: null, sources: null });
        setEditPrompt(''); // Clear old prompt when new image is uploaded
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearResults = () => {
      setResultState(initialResultState);
      setError(null);
  }

  const addToHistory = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 20)); // Keep last 20 items
  }, []);

  const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
    if (item.type === 'generate' || item.type === 'edit') {
      setResultState({ image: item.data, text: null, sources: null });
    } else {
      setResultState({ image: null, text: item.data, sources: null });
    }
  }, [setResultState]);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt) {
      setError('请输入提示词。');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const imageB64 = await generateImage(prompt, aspectRatio, imageQuality);
      const dataUrl = `data:image/jpeg;base64,${imageB64}`;
      setResultState({ image: dataUrl, text: null, sources: null });
      addToHistory({
        type: 'generate',
        prompt,
        data: dataUrl,
        thumbnail: dataUrl,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : '发生未知错误。');
      setResultState(initialResultState);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio, imageQuality, addToHistory, setResultState]);

  const handleEditImage = useCallback(async () => {
    if (!editPrompt) {
      setError('请输入编辑指令。');
      return;
    }
    if (!imageToEdit) {
      setError('请上传一张图片进行编辑。');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const editedImageB64 = await editImage(
        editPrompt, 
        imageToEdit.dataUrl,
        styleStrength,
        creativity,
        negativePrompt
      );
      const dataUrl = `data:image/png;base64,${editedImageB64}`;
      setResultState({ image: dataUrl, text: null, sources: null });
      addToHistory({
        type: 'edit',
        prompt: editPrompt,
        data: dataUrl,
        thumbnail: dataUrl,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : '发生未知错误。');
      setResultState(initialResultState);
    } finally {
      setIsLoading(false);
    }
  }, [editPrompt, imageToEdit, styleStrength, creativity, negativePrompt, addToHistory, setResultState]);

  const handleGenerateScene = useCallback(async () => {
    if (!scenePrompt) {
      setError('请输入场景想法。');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const text = await generateComplexScene(scenePrompt);
      setResultState({ image: null, text, sources: null });
      addToHistory({
        type: 'scene',
        prompt: scenePrompt,
        data: text,
        thumbnail: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : '发生未知错误。');
      setResultState(initialResultState);
    } finally {
      setIsLoading(false);
    }
  }, [scenePrompt, addToHistory, setResultState]);

  const handleGetIdeas = useCallback(async () => {
    if (!ideasPrompt) {
      setError('请输入您的问题。');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { text, sources } = await getCharacterIdeas(ideasPrompt);
      setResultState({ image: null, text, sources });
      addToHistory({
        type: 'ideas',
        prompt: ideasPrompt,
        data: text,
        thumbnail: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : '发生未知错误。');
      setResultState(initialResultState);
    } finally {
      setIsLoading(false);
    }
  }, [ideasPrompt, addToHistory, setResultState]);

  const dataURLtoFile = (dataurl: string, filename: string): File | null => {
      const arr = dataurl.split(',');
      const match = arr[0].match(/:(.*?);/);
      if (!arr[0] || !match) return null;
      const mime = match[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
  };

  const handleTransferToEdit = useCallback(() => {
    if (resultState.image) {
        const file = dataURLtoFile(resultState.image, 'generated-image.jpg');
        if (file) {
            setImageToEdit({ file, dataUrl: resultState.image });
            setMode('edit');
            setEditPrompt(''); // Clear prompt for new edit
        } else {
            setError("无法转换图像以进行编辑。");
        }
    }
  }, [resultState.image]);


  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen md:h-screen bg-gray-900 text-gray-100 md:overflow-hidden">
        <Sidebar
          mode={mode}
          setMode={setMode}
          prompt={prompt}
          setPrompt={setPrompt}
          editPrompt={editPrompt}
          setEditPrompt={setEditPrompt}
          scenePrompt={scenePrompt}
          setScenePrompt={setScenePrompt}
          ideasPrompt={ideasPrompt}
          setIdeasPrompt={setIdeasPrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          imageQuality={imageQuality}
          setImageQuality={setImageQuality}
          isLoading={isLoading}
          onGenerateImage={handleGenerateImage}
          onEditImage={handleEditImage}
          onGenerateScene={handleGenerateScene}
          onGetIdeas={handleGetIdeas}
          onFileChange={handleFileChange}
          imageToEdit={imageToEdit}
          history={history}
          onSelectHistoryItem={handleSelectHistoryItem}
          isAdvancedEditOpen={isAdvancedEditOpen}
          setIsAdvancedEditOpen={setIsAdvancedEditOpen}
          styleStrength={styleStrength}
          setStyleStrength={setStyleStrength}
          creativity={creativity}
          setCreativity={setCreativity}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          hasApiKey={hasApiKey}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />
        <MainContent
          mode={mode}
          isLoading={isLoading}
          error={error}
          generatedImage={resultState.image}
          generatedText={resultState.text}
          groundingSources={resultState.sources}
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onTransferToEdit={handleTransferToEdit}
        />
      </div>
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
        currentApiKey={apiKey}
      />
    </>
  );
};

export default App;
