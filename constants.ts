export const MODEL_NAME = 'gemini-2.5-flash-image';

export const PRESET_PROMPTS: Record<string, string> = {
  REMOVE_BG: "Isolate the main subject of this image on a plain white background. Ensure high precision for the subject's edges.",
  UPSCALE: "Enhance the resolution and details of this image significantly. Make it look like a high-definition photograph.",
  CYBERPUNK: "Transform this image into a cyberpunk style with neon lights, high contrast, and a futuristic atmosphere.",
  SKETCH: "Convert this image into a detailed charcoal pencil sketch."
};

export const SAMPLE_IMAGE_URL = "https://picsum.photos/800/600";