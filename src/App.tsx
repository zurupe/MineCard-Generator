import { useState, useEffect } from 'react';
import { Download, Copy } from 'lucide-react';
import { useSkin } from './hooks/useSkin';
import SkinViewer from './components/SkinViewer';
import Sidebar from './components/Sidebar';
import type { CardState } from './components/Sidebar';

import CardCanvas from './components/CardCanvas';
import { exportCardAsPng, copyCardAsImage } from './utils/export';

function App() {
  const APP_VERSION = "v0.9";
  const skinState = useSkin();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [cardState, setCardState] = useState<CardState>({
    recipient: '',
    message: '',
    backgroundColor: '#1b3a17ff',
    backgroundImage: '',
    textColor: '#ffffff',
    orientation: window.innerWidth < 1024 ? 'vertical' : 'horizontal',
  });
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      return mobile;
    };

    const initialMobile = checkMobile();
    setCardState(prev => ({
      ...prev,
      orientation: initialMobile ? 'vertical' : 'horizontal'
    }));

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleExport = async () => {
    try {
      await exportCardAsPng('minecard-canvas', skinState.username);
    } catch {
      alert('Error al exportar la tarjeta. Por favor intenta de nuevo.');
    }
  };

  const handleCopy = async () => {
    try {
      await copyCardAsImage('minecard-canvas');
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      alert('Error al copiar la tarjeta. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="flex h-screen bg-zinc-900 overflow-hidden relative">
      <Sidebar
        skinState={skinState}
        cardState={cardState}
        setCardState={setCardState}
        version={APP_VERSION}
      />

      <div className="flex-1 h-screen overflow-hidden flex flex-col items-center justify-center py-4 md:py-6 px-4 md:px-8 bg-zinc-900">
        {/* PARTE 1: Título y Descripción */}
        <header className="flex flex-col items-center gap-1 mb-4 md:mb-6 flex-shrink-0">
          <h1 className="text-xl md:text-3xl font-minecraft text-minecraft-green drop-shadow-md text-center">
            MineCard Generator
          </h1>
          <p className="text-[10px] md:text-xs text-zinc-500 text-center">
            Jugador: <span className="text-white font-mono">{skinState.username}</span>
            {' '}({skinState.skinData.model})
          </p>
        </header>

        {/* PARTE 2: La Tarjeta y Botones laterales */}
        <main className="flex flex-col xl:flex-row items-center justify-center gap-6 md:gap-12 w-full max-h-[85vh]">
          <div className="flex-shrink-0 transition-transform duration-700 hover:scale-[1.02]">
            <CardCanvas
              recipient={cardState.recipient}
              message={cardState.message}
              backgroundColor={cardState.backgroundColor}
              backgroundImage={cardState.backgroundImage}
              textColor={cardState.textColor}
              orientation={cardState.orientation}
              titleFontSize={cardState.orientation === 'vertical' ? 'min(6vw, 1.5rem)' : 'min(3vw, 1.25rem)'}
              messageFontSize={cardState.orientation === 'vertical' ? 'min(4vw, 0.85rem)' : 'min(1.5vw, 0.875rem)'}
              skinElement={
                <SkinViewer
                  skinUrl={skinState.skinData.textureUrl}
                  model={skinState.skinData.model}
                  pose={skinState.pose}
                  viewMode={skinState.viewMode}
                  width={cardState.orientation === 'vertical' ? 300 : (isMobile ? 230 : 400)}
                  height={cardState.orientation === 'vertical' ? 280 : (isMobile ? 230 : 400)}
                  zoom={cardState.orientation === 'vertical' ? 1.8 : 1.8}
                  headScale={cardState.orientation === 'vertical' ? 0.6 : 0.7}
                  headOffsetX={cardState.orientation === 'vertical' ? 0 : 0}
                  headOffsetY={cardState.orientation === 'vertical' ? 10 : 15}
                  bodyOffsetX={cardState.orientation === 'vertical' ? 0 : 0}
                  bodyOffsetY={cardState.orientation === 'vertical' ? 0 : (isMobile ? -10 : -20)}
                  cameraDistance={cardState.orientation === 'vertical' ? 40 : 30}
                />
              }
            />
          </div>

          {/* Botones de Acción con animación */}
          <div className="flex flex-row xl:flex-col gap-4 md:gap-5 flex-shrink-0">
            <button
              onClick={handleExport}
              title="Descargar tarjeta como imagen"
              className="flex items-center justify-center bg-minecraft-green hover:bg-green-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-2xl font-bold transition-all shadow-[0_10px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_15px_30px_rgba(34,197,94,0.5)] active:scale-90 hover:scale-110 hover:-rotate-3 group relative"
            >
              <Download size={24} />
            </button>

            <button
              onClick={handleCopy}
              title={copyFeedback ? 'Copiado!' : 'Copiar Tarjeta al portapapeles'}
              className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl font-bold transition-all shadow-lg active:scale-90 hover:scale-110 hover:rotate-3 ${copyFeedback
                ? 'bg-blue-500 text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)]'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.5)]'
                }`}
            >
              <Copy size={24} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
