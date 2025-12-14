
export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  mimeType: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ProcessingResult {
  imageUrl: string | null;
  error: string | null;
}

export enum EditMode {
  CONVERSATIONAL = 'CONVERSATIONAL',
  PRESET = 'PRESET'
}

export type PresetAction = 'REMOVE_BG' | 'UPSCALE' | 'CYBERPUNK' | 'SKETCH';

export type FilterType = 'GRAYSCALE' | 'SEPIA' | 'INVERT' | 'BLUR' | 'BRIGHTNESS' | 'CONTRAST';

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}
