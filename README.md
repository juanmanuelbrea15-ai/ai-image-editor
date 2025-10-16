# AI Image Editor

Advanced AI-powered image editing application with Gemini API integration for intelligent photo manipulation and retouching.

## Features

### 🎨 Three Powerful Editing Modes

#### 1. Retouch Tab
- AI-powered prop integration using Gemini API
- Automatic background removal
- Interactive selection tool for precise placement
- Smart generation with:
  - Illumination matching
  - Shadow consistency
  - Perspective correction
- Custom prompt input for additional instructions

#### 2. Adjust Tab
- 7 professional presets (Natural, Vivid, Warm, Cool, Dramatic, Soft, Bright)
- Real-time adjustments with automatic slider sync
- 12 manual controls organized in 4 groups:
  - **Color:** Temperature, Tint
  - **Light:** Exposure, Contrast
  - **Tones:** Highlights, Shadows, Whites, Blacks
  - **Presence:** Clarity, Dehaze, Vibrance, Saturation

#### 3. Restore Tab
- Professional brush tool with customizable size (1-500px) and opacity
- Two-layer canvas system for selective restoration
- Real-time brush strokes (60fps)
- Individual stroke tracking for precise undo

### 🚀 Core Features

- **Smart Upload:** Drag-and-drop with automatic navigation
- **Non-linear Navigation:** Jump between tabs freely without losing work
- **Complete History:** Full undo/redo system tracking every action
- **Compare Mode:** Hold to see original, release to see edited
- **Precise Export:** Automatic resize to 1350x1080px (4:5 aspect ratio)
- **Gallery System:** Manage props and processed images
- **Responsive Design:** Works on desktop, tablet, and mobile

### 🔧 Advanced Viewport

- Aspect ratio preservation
- Multiple zoom levels (25%, 50%, 100%, 150%, 200%, Fit)
- Pan and drag navigation
- Fullscreen mode
- Optional rule-of-thirds grid overlay

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **State Management:** Zustand
- **Canvas Manipulation:** Fabric.js
- **Styling:** Tailwind CSS
- **API Client:** Axios
- **AI Integration:** Google Gemini API

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Gemini API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))
- Background removal API key (optional, for remove.bg or similar service)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/juanmanuelbrea15-ai/ai-image-editor.git
cd ai-image-editor
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_REMBG_API_URL=your_background_removal_service_url_here
```

5. Start development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-image-editor/
├── src/
│   ├── components/
│   │   ├── Upload/          # Initial upload page
│   │   ├── Editor/          # Main editor page
│   │   ├── Tabs/            # Tab components (Retouch, Adjust, Restore)
│   │   ├── Gallery/         # Gallery management
│   │   ├── Controls/        # Global controls
│   │   ├── Viewport/        # Canvas viewport
│   │   └── UI/              # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Zustand state management
│   ├── utils/               # Utility functions
│   ├── services/            # API services (Gemini, background removal)
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage Guide

### 1. Upload an Image

- Drag and drop an image or click to browse
- Supported formats: JPEG, PNG, WebP, HEIC (max 20MB)
- Automatic navigation to editor after upload

### 2. Edit Your Image

#### Retouch Tab
1. Upload a prop image
2. Click "Remove Background" to process
3. Select area on viewport for placement
4. Choose generation options (illumination, shadows, perspective)
5. Add custom instructions (optional)
6. Click "Generate Image"

#### Adjust Tab
1. Select a preset for quick adjustments
2. Or manually adjust sliders for precise control
3. All changes apply in real-time (<100ms)
4. Presets automatically sync slider values

#### Restore Tab
1. Adjust brush size and opacity
2. Paint on image to reveal original beneath edits
3. Each stroke is instantly visible
4. Use undo to remove individual strokes

### 3. Save Your Work

- Click "Download" to export as 1350x1080px JPEG
- Image automatically added to gallery
- Toast notification confirms download

### Keyboard Shortcuts

- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- `Ctrl/Cmd + R` - Reset to original

## Performance Targets

- ✅ Slider adjustments: <100ms response time
- ✅ Brush strokes: <16ms per frame (60fps)
- ✅ Image loading: <2s for average size
- ✅ AI generation: <30s with progress feedback

## API Integration

### Gemini API

The app uses Google's Gemini API for AI-powered image generation. Key features:

- Photorealistic prop integration
- Intelligent lighting and shadow matching
- Perspective-aware composition
- Custom prompt support
- 30-second timeout with retry logic

### Background Removal

Integrates with background removal services (e.g., remove.bg) for:

- Automatic subject detection
- Clean edge extraction
- Transparent PNG output with 20px padding
- Auto-crop to bounding box

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Google Gemini API for AI image generation
- Fabric.js for canvas manipulation
- Tailwind CSS for styling
- Zustand for state management

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and AI