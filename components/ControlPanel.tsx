import React, { useState } from 'react';
import { Send, Sparkles, Scissors, Image as ImageIcon, Zap, Maximize2, History as HistoryIcon, Clock, Sliders, Droplet, Sun, Moon, Contrast } from 'lucide-react';
import { Button } from './Button';
import { PRESET_PROMPTS } from '../constants';
import { PresetAction, HistoryItem, FilterType } from '../types';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  onPresetSelect: (action: PresetAction) => void;
  onApplyFilter: (filter: FilterType) => void;
  hasImage: boolean;
  history: HistoryItem[];
  onRestoreHistory: (item: HistoryItem) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  isProcessing,
  onPresetSelect,
  onApplyFilter,
  hasImage,
  history,
  onRestoreHistory
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'presets' | 'filters' | 'history'>('chat');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isProcessing && hasImage) {
        onSubmit();
      }
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 lg:border-t-0 lg:border-l lg:w-96 flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'chat' 
              ? 'text-yellow-400 border-b-2 border-yellow-400 bg-slate-800/50' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
          title="Chat"
        >
          <span>Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'presets' 
              ? 'text-yellow-400 border-b-2 border-yellow-400 bg-slate-800/50' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
          title="Presets"
        >
          <span>Presets</span>
        </button>
        <button
          onClick={() => setActiveTab('filters')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'filters' 
              ? 'text-yellow-400 border-b-2 border-yellow-400 bg-slate-800/50' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
          title="Filters"
        >
          <Sliders className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'history' 
              ? 'text-yellow-400 border-b-2 border-yellow-400 bg-slate-800/50' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
          title="History"
        >
          <HistoryIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                What would you like to change?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="E.g., 'Make the hair red', 'Add a sunset background', 'Turn into a cartoon'"
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                disabled={isProcessing}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-slate-500 font-medium uppercase">Suggested Prompts</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Make it look cinematic",
                  "Change background to a beach",
                  "Add sunglasses to the person",
                  "Convert to black and white"
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(suggestion)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full mt-4"
              onClick={onSubmit}
              disabled={!prompt.trim() || !hasImage}
              isLoading={isProcessing}
              icon={<Send className="w-4 h-4" />}
            >
              Generate
            </Button>
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              <p className="text-xs text-slate-500 font-medium uppercase mb-1">Utilities</p>
              
              <button
                onClick={() => onPresetSelect('REMOVE_BG')}
                disabled={isProcessing || !hasImage}
                className="flex items-center p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-yellow-400/50 hover:bg-slate-800/80 transition-all group text-left disabled:opacity-50"
              >
                <div className="bg-slate-900 p-2 rounded-md mr-3 group-hover:bg-slate-800">
                  <Scissors className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-slate-200 font-medium text-sm">Remove Background</h4>
                  <p className="text-slate-500 text-xs">Isolate subject on white</p>
                </div>
              </button>

              <button
                onClick={() => onPresetSelect('UPSCALE')}
                disabled={isProcessing || !hasImage}
                className="flex items-center p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-yellow-400/50 hover:bg-slate-800/80 transition-all group text-left disabled:opacity-50"
              >
                <div className="bg-slate-900 p-2 rounded-md mr-3 group-hover:bg-slate-800">
                  <Maximize2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-slate-200 font-medium text-sm">Upscale & Enhance</h4>
                  <p className="text-slate-500 text-xs">Improve detail and clarity</p>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <p className="text-xs text-slate-500 font-medium uppercase mb-1">Creative Filters</p>
              
              <button
                onClick={() => onPresetSelect('CYBERPUNK')}
                disabled={isProcessing || !hasImage}
                className="flex items-center p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-pink-400/50 hover:bg-slate-800/80 transition-all group text-left disabled:opacity-50"
              >
                <div className="bg-slate-900 p-2 rounded-md mr-3 group-hover:bg-slate-800">
                  <Zap className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h4 className="text-slate-200 font-medium text-sm">Cyberpunk</h4>
                  <p className="text-slate-500 text-xs">Neon lights & futuristic vibe</p>
                </div>
              </button>

              <button
                onClick={() => onPresetSelect('SKETCH')}
                disabled={isProcessing || !hasImage}
                className="flex items-center p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-green-400/50 hover:bg-slate-800/80 transition-all group text-left disabled:opacity-50"
              >
                <div className="bg-slate-900 p-2 rounded-md mr-3 group-hover:bg-slate-800">
                  <ImageIcon className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-slate-200 font-medium text-sm">Artistic Sketch</h4>
                  <p className="text-slate-500 text-xs">Charcoal pencil style</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'filters' && (
          <div className="space-y-4">
             <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 mb-4">
               <p className="text-xs text-slate-400">
                 Apply these filters to the <strong>original</strong> image before using AI generation.
               </p>
             </div>

             <div className="grid grid-cols-2 gap-3">
               <Button
                 variant="secondary"
                 onClick={() => onApplyFilter('GRAYSCALE')}
                 disabled={!hasImage || isProcessing}
                 className="flex flex-col items-center justify-center h-24 gap-2"
               >
                 <Moon className="w-6 h-6 text-slate-400" />
                 <span>Grayscale</span>
               </Button>
               
               <Button
                 variant="secondary"
                 onClick={() => onApplyFilter('SEPIA')}
                 disabled={!hasImage || isProcessing}
                 className="flex flex-col items-center justify-center h-24 gap-2"
               >
                 <Sun className="w-6 h-6 text-orange-300" />
                 <span>Sepia</span>
               </Button>

               <Button
                 variant="secondary"
                 onClick={() => onApplyFilter('INVERT')}
                 disabled={!hasImage || isProcessing}
                 className="flex flex-col items-center justify-center h-24 gap-2"
               >
                 <Zap className="w-6 h-6 text-purple-400" />
                 <span>Invert</span>
               </Button>

               <Button
                 variant="secondary"
                 onClick={() => onApplyFilter('BLUR')}
                 disabled={!hasImage || isProcessing}
                 className="flex flex-col items-center justify-center h-24 gap-2"
               >
                 <Droplet className="w-6 h-6 text-blue-400" />
                 <span>Blur</span>
               </Button>

               <Button
                 variant="secondary"
                 onClick={() => onApplyFilter('BRIGHTNESS')}
                 disabled={!hasImage || isProcessing}
                 className="flex flex-col items-center justify-center h-24 gap-2"
               >
                 <Sun className="w-6 h-6 text-yellow-200" />
                 <span>Brighten</span>
               </Button>

               <Button
                 variant="secondary"
                 onClick={() => onApplyFilter('CONTRAST')}
                 disabled={!hasImage || isProcessing}
                 className="flex flex-col items-center justify-center h-24 gap-2"
               >
                 <Contrast className="w-6 h-6 text-slate-200" />
                 <span>Contrast</span>
               </Button>
             </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <HistoryIcon className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No edits yet.</p>
                <p className="text-slate-600 text-xs mt-1">Generated images will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => onRestoreHistory(item)}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-2 flex gap-3 cursor-pointer hover:border-yellow-400/50 hover:bg-slate-800/80 transition-all group"
                  >
                    <div className="w-16 h-16 bg-slate-900 rounded-md overflow-hidden flex-shrink-0 border border-slate-700">
                      <img 
                        src={item.imageUrl} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-slate-200 text-sm font-medium line-clamp-2 leading-tight group-hover:text-yellow-400 transition-colors">
                        {item.prompt}
                      </p>
                      <div className="flex items-center mt-1.5 text-xs text-slate-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(item.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!hasImage && (
        <div className="p-4 bg-yellow-400/10 border-t border-yellow-400/20 text-yellow-200 text-xs text-center">
          Please upload an image to start editing.
        </div>
      )}
    </div>
  );
};
