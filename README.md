# MineCard Generator 🎮

MineCard Generator is a web application that allows Minecraft players to create personalized greeting cards or profiles featuring their custom character skins in 3D.

## ✨ Features

- **3D Skin Preview**: View any Minecraft skin in 3D with animations (walk, run, etc.).
- **Real-time Customization**: Change messages, recipient names, background colors, and text colors.
- **High-Quality Export**: Download your creations as high-resolution PNG images.
- **Minecraft Aesthetic**: Fully themed UI for the ultimate immersion.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zurupe/MineCard-Generator.git
   ```

2. Navigate to the project directory:
   ```bash
   cd MineCard-Generator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Building for Production

To create an optimized production build:
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D Rendering**: [Three.js](https://threejs.org/) & [react-skinview3d](https://github.com/bs-community/react-skinview3d)
- **Export**: [html-to-image](https://github.com/bubkoo/html-to-image)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

