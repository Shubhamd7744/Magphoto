import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Download, Upload, Maximize2, AlertCircle, Crop as CropIcon, Check, X } from 'lucide-react';
import { Button } from './Button';
import { ProcessingStatus } from '../types';
import { getCroppedImg } from '../services/imageUtils';

interface ImageWorkspaceProps {
  originalImage: string | null;
  generatedImage: string | null;
  status: ProcessingStatus;
  errorMessage: string | null;
  onUploadClick: () => void;
  onImageUpdate: (file: File) => void;
}

export const ImageWorkspace: React.FC<ImageWorkspaceProps> = ({
  originalImage,
  generatedImage,
  status,
  errorMessage,
  onUploadClick,
  onImageUpdate
}) => {
  // Cropping State
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const croppedFile = await getCroppedImg(imgRef.current, completedCrop, "cropped-image.png");
        onImageUpdate(croppedFile);
        setIsCropping(false);
        setCrop(undefined);
      } catch (e) {
        console.error("Failed to crop image", e);
      }
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setCrop(undefined);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px]">
      {/* Original Image Container */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {isCropping ? 'Crop Mode' : 'Original'}
          </h3>
          <div className="flex gap-2">
            {originalImage && !isCropping && (
              <>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => setIsCropping(true)} 
                   className="text-xs h-7 text-yellow-400 hover:text-yellow-300"
                   icon={<CropIcon className="w-3 h-3"/>}
                 >
                   Crop
                 </Button>
                 <Button variant="ghost" size="sm" onClick={onUploadClick} className="text-xs h-7">
                   Replace
                 </Button>
              </>
            )}
            {isCropping && (
               <>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={handleCancelCrop} 
                   className="text-xs h-7 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                   icon={<X className="w-3 h-3"/>}
                 >
                   Cancel
                 </Button>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={handleCropComplete} 
                   className="text-xs h-7 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                   icon={<Check className="w-3 h-3"/>}
                 >
                   Apply
                 </Button>
               </>
            )}
          </div>
        </div>
        
        <div className={`relative flex-1 bg-slate-900/50 border-2 ${isCropping ? 'border-yellow-400/50' : 'border-slate-800 border-dashed'} rounded-xl overflow-hidden group hover:border-slate-700 transition-colors`}>
          {originalImage ? (
            <div className="w-full h-full flex items-center justify-center p-4 bg-slate-900/30">
               {isCropping ? (
                 <ReactCrop 
                   crop={crop} 
                   onChange={(c) => setCrop(c)} 
                   onComplete={(c) => setCompletedCrop(c)}
                   className="max-h-full max-w-full"
                 >
                   <img 
                     ref={imgRef}
                     src={originalImage} 
                     alt="Crop source" 
                     className="max-h-full max-w-full object-contain"
                     style={{ maxHeight: 'calc(100vh - 300px)' }} // Ensure it fits within viewport in crop mode
                   />
                 </ReactCrop>
               ) : (
                 <img 
                   src={originalImage} 
                   alt="Original" 
                   className="w-full h-full object-contain"
                 />
               )}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
                <Upload className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-300 font-medium mb-1">Upload a photo</p>
              <p className="text-slate-500 text-sm mb-4">JPG, PNG up to 10MB</p>
              <Button onClick={onUploadClick} variant="secondary">
                Select File
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Generated Image Container */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {status === ProcessingStatus.PROCESSING ? 'Generating...' : 'Result'}
          </h3>
          {generatedImage && (
             <a href={generatedImage} download="nano-banana-edit.png">
                <Button variant="ghost" size="sm" className="text-xs h-7" icon={<Download className="w-3 h-3"/>}>
                  Download
                </Button>
             </a>
          )}
        </div>

        <div className={`relative flex-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden ${status === ProcessingStatus.PROCESSING ? 'animate-pulse' : ''}`}>
           {status === ProcessingStatus.PROCESSING && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900/80 backdrop-blur-sm">
               <div className="w-12 h-12 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mb-4"></div>
               <p className="text-yellow-400 font-medium">Banana magic happening...</p>
             </div>
           )}

           {status === ProcessingStatus.ERROR && (
             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
               <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
               <p className="text-red-400 font-medium mb-2">Generation Failed</p>
               <p className="text-slate-400 text-sm max-w-xs">{errorMessage}</p>
             </div>
           )}

           {generatedImage ? (
             <img 
               src={generatedImage} 
               alt="Generated" 
               className="w-full h-full object-contain p-4"
             />
           ) : status !== ProcessingStatus.PROCESSING && status !== ProcessingStatus.ERROR ? (
             <div className="absolute inset-0 flex items-center justify-center text-slate-600">
               <div className="text-center">
                 <Maximize2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                 <p className="text-sm">Processed image will appear here</p>
               </div>
             </div>
           ) : null}
        </div>
      </div>
    </div>
  );
};