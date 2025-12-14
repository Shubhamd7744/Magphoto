import React, { useState, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageWorkspace } from './components/ImageWorkspace';
import { ControlPanel } from './components/ControlPanel';
import { BgRemoverTool } from './components/BgRemoverTool';
import { fileToBase64, editImageWithGemini } from './services/geminiService';
import { applyImageFilter } from './services/imageUtils';
import { ProcessingStatus, PresetAction, ImageState, HistoryItem, FilterType } from './types';
import { PRESET_PROMPTS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'editor' | 'bg-remover'>('editor');
  
  // Editor State
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    previewUrl: null,
    mimeType: ''
  });
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Shared function to update image state from a File object
  const updateImageState = (file: File) => {
    // Revoke old URL if it exists to prevent memory leaks
    if (imageState.previewUrl) {
      URL.revokeObjectURL(imageState.previewUrl);
    }

    // Reset processing state
    setGeneratedImage(null);
    setStatus(ProcessingStatus.IDLE);
    setError(null);
    // Note: We intentionally do NOT clear history or prompt here to allow workflow continuity if desired,
    // but typically a new source image implies a new session.
    // For now, let's keep history but reset the generated view.
    
    const objectUrl = URL.createObjectURL(file);
    setImageState({
      file,
      previewUrl: objectUrl,
      mimeType: file.type
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For completely new uploads, we also clear history
    setHistory([]);
    setPrompt('');
    updateImageState(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const processImage = useCallback(async (textPrompt: string) => {
    if (!imageState.file || !imageState.mimeType) return;

    setStatus(ProcessingStatus.PROCESSING);
    setError(null);

    try {
      const base64 = await fileToBase64(imageState.file);
      const resultBase64 = await editImageWithGemini(base64, imageState.mimeType, textPrompt);
      
      setGeneratedImage(resultBase64);
      setStatus(ProcessingStatus.SUCCESS);

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        imageUrl: resultBase64,
        prompt: textPrompt,
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev]);

    } catch (err: any) {
      console.error(err);
      setStatus(ProcessingStatus.ERROR);
      setError(err.message || "Something went wrong while communicating with Gemini.");
    }
  }, [imageState]);

  const handlePromptSubmit = () => {
    if (prompt.trim()) {
      processImage(prompt);
    }
  };

  const handlePresetSelect = (action: PresetAction) => {
    if (action === 'REMOVE_BG') {
      setView('bg-remover');
      return;
    }

    const presetPrompt = PRESET_PROMPTS[action];
    if (presetPrompt) {
      setPrompt(presetPrompt);
      processImage(presetPrompt);
    }
  };

  const handleFilterApply = async (filterType: FilterType) => {
    if (!imageState.file) return;
    try {
      const filteredFile = await applyImageFilter(imageState.file, filterType);
      updateImageState(filteredFile);
    } catch (err) {
      console.error("Failed to apply filter", err);
      setError("Failed to apply image filter");
    }
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setGeneratedImage(item.imageUrl);
    setPrompt(item.prompt);
    setStatus(ProcessingStatus.SUCCESS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header currentView={view} onViewChange={setView} />
      
      <main className="flex-1 flex flex-col overflow-hidden max-h-[calc(100vh-64px)]">
        {view === 'bg-remover' ? (
          <div className="flex-1 overflow-y-auto bg-slate-950">
            <BgRemoverTool />
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row h-full">
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/webp" 
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Main Workspace Area */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-slate-950">
              <div className="max-w-6xl mx-auto h-full">
                <div className="bg-slate-900/30 rounded-2xl border border-slate-800/50 p-1 h-full shadow-2xl">
                  <div className="bg-slate-950 rounded-xl h-full p-4 lg:p-8">
                    <ImageWorkspace 
                      originalImage={imageState.previewUrl}
                      generatedImage={generatedImage}
                      status={status}
                      errorMessage={error}
                      onUploadClick={triggerFileUpload}
                      onImageUpdate={updateImageState}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Control Panel */}
            <ControlPanel 
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={handlePromptSubmit}
              isProcessing={status === ProcessingStatus.PROCESSING}
              onPresetSelect={handlePresetSelect}
              onApplyFilter={handleFilterApply}
              hasImage={!!imageState.file}
              history={history}
              onRestoreHistory={handleRestoreHistory}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
