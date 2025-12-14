import React, { useState, useRef } from 'react';
import { Upload, Download, AlertCircle, Layers, ArrowRight, Check, X } from 'lucide-react';
import { Button } from './Button';
import { fileToBase64, editImageWithGemini } from '../services/geminiService';
import { PRESET_PROMPTS } from '../constants';

export const BgRemoverTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setProcessedUrl(null);
      setError(null);
      setProgress(0);
    }
  };

  const handleRemoveBackground = async () => {
    if (!file) return;

    setLoading(true);
    setProgress(0);
    setError(null);
    setProcessedUrl(null);

    // Simulate progress while waiting for API
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Cap at 90% until actual response comes back
        if (prev >= 90) return prev;
        // Random increment between 5-15%
        const increment = Math.floor(Math.random() * 10) + 5;
        return Math.min(prev + increment, 90);
      });
    }, 600);

    try {
      const base64 = await fileToBase64(file);
      const resultUrl = await editImageWithGemini(
        base64, 
        file.type, 
        PRESET_PROMPTS.REMOVE_BG
      );
      
      clearInterval(progressInterval);
      setProgress(100);

      // Short delay to let user see 100% completion before showing result
      setTimeout(() => {
        setProcessedUrl(resultUrl);
        setLoading(false);
      }, 500);

    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      setError(err.message || "Failed to remove background");
      setLoading(false);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setError(null);
    setProgress(0);
  };

  const getProgressLabel = () => {
    if (progress < 30) return "Analyzing image structure...";
    if (progress < 60) return "Identifying main subject...";
    if (progress < 90) return "Isolating background...";
    return "Polishing pixels...";
  };

  return (
    <div className="max-w-6xl mx-auto h-full p-6">
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-xl min-h-[600px] flex flex-col">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-6 h-6 text-yellow-400" />
              Background Remover
            </h2>
            <p className="text-slate-400 mt-1">Instant high-precision subject isolation</p>
          </div>
          {previewUrl && (
            <Button variant="outline" size="sm" onClick={reset} icon={<X className="w-4 h-4"/>}>
              Clear
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8">
          
          {/* Input Area */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Source Image</h3>
            <div 
              className={`flex-1 relative border-2 border-dashed rounded-xl overflow-hidden transition-all ${
                !previewUrl 
                  ? 'border-slate-700 hover:border-slate-500 bg-slate-800/30' 
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Source" className="w-full h-full object-contain p-4" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-300 font-medium mb-1">Drop your image here</p>
                  <p className="text-slate-500 text-sm mb-6">Supports JPG, PNG, WEBP</p>
                  <Button onClick={triggerUpload} variant="secondary">Browse Files</Button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>

          {/* Action Area (Desktop Center) */}
          <div className="flex lg:flex-col items-center justify-center gap-4">
            <div className="hidden lg:block h-full w-px bg-slate-800/50" />
            
            <Button 
              onClick={handleRemoveBackground}
              disabled={!file || loading || !!processedUrl}
              isLoading={loading}
              className="w-full lg:w-auto min-w-[160px]"
              size="lg"
              icon={!loading && <ArrowRight className="w-5 h-5" />}
            >
              {processedUrl ? 'Completed' : 'Remove Background'}
            </Button>

            <div className="hidden lg:block h-full w-px bg-slate-800/50" />
          </div>

          {/* Output Area */}
          <div className="flex-1 flex flex-col">
             <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Result</h3>
             <div className="flex-1 relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[300px]">
                
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 z-20 backdrop-blur-sm px-8">
                    <div className="w-full max-w-sm space-y-4">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                         <span>Processing</span>
                         <span className="text-yellow-400">{progress}%</span>
                      </div>
                      
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                        <div 
                           className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(250,204,21,0.3)]"
                           style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      <div className="text-center pt-2">
                        <p className="text-slate-200 text-sm font-medium animate-pulse">
                          {getProgressLabel()}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">Powered by Gemini 2.5 Flash</p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                    <p className="text-red-400 font-medium">{error}</p>
                    <Button variant="ghost" size="sm" onClick={handleRemoveBackground} className="mt-4 text-slate-400">
                      Try Again
                    </Button>
                  </div>
                )}

                {processedUrl ? (
                  <>
                    <img src={processedUrl} alt="Processed" className="w-full h-full object-contain p-4 bg-[url('https://media.istockphoto.com/id/1133442656/vector/checker-seamless-pattern.jpg?s=612x612&w=0&k=20&c=e5M_LwIq2E1e4n8k1K1l5_6l1n4_9n0_4_1_9_8')] bg-repeat" />
                    <div className="absolute bottom-4 right-4">
                      <a href={processedUrl} download="removed-bg.png">
                        <Button icon={<Download className="w-4 h-4" />}>Download</Button>
                      </a>
                    </div>
                  </>
                ) : (
                   !loading && !error && (
                     <div className="absolute inset-0 flex items-center justify-center opacity-20">
                       <Layers className="w-16 h-16 text-slate-500" />
                     </div>
                   )
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};