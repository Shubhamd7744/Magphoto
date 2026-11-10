<div align="center">
  <img width="1200" height="475" alt="Magphoto AI Studio Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # 📸 Magphoto — AI Background Removal & Photo Enhancement
  <p><strong>Browser-native intelligent photo restoration, background segmenting, and canvas refinement engine.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/TailwindCSS-v3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Vite-Bundler-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Gemini_API-Multimodal-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini" />
  </p>
</div>

---

## 📌 Overview

**Magphoto** is a lightweight, responsive photo processing suite engineered for instant image enhancement and alpha-channel segmentation. Built directly on top of client-side HTML5 Canvas APIs and multimodal vision intelligence, it allows users to strip backgrounds, sharpen low-resolution imagery, and fine-tune aspect ratios without heavy desktop software.

---

## ⚡ Core Capabilities
- ✂️ **Precise Background Isolation:** High-accuracy boundary detection for subjects, portraits, and product photography.
- 🪄 **Dynamic Contrast & Enhancement:** Canvas-level filtering to boost dynamic range, color vibrancy, and edge clarity.
- 🎨 **Instant Export Suite:** Direct PNG export with preserved transparency channels and zero compression artifacts.
- 📱 **Responsive Canvas Stage:** Smooth pan-and-zoom workspace designed for both desktop and mobile viewports.

---

## 📁 Project Architecture

```
Magphoto/
├── backend/            # Express image-processing microservice & API endpoints
├── components/         # Upload zones, canvas toolbar, and parameter sliders
├── services/           # Gemini vision API integration & image transformation helpers
├── types.ts            # Type definitions for image buffers, layers, and filters
├── constants.ts        # Canvas defaults, maximum resolution limits, and color tokens
├── App.tsx             # Root application orchestrator
└── vite.config.ts      # Fast development and production bundling pipeline
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **Gemini API Key**: Obtainable from Google AI Studio

### 2. Local Setup
```bash
# Clone the repository
git clone https://github.com/Shubhamd7744/Magphoto.git
cd Magphoto

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to preview the app.

---

<div align="center">
  <sub>Maintained by <a href="https://github.com/Shubhamd7744">Shubham Dutta</a> • UI/UX Designer & Frontend Developer</sub>
</div>