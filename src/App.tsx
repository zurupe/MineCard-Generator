import { useState, useEffect } from 'react';
import { Download, Copy } from 'lucide-react';
import { useSkin } from './hooks/useSkin';
import SkinViewer from './components/SkinViewer';
import Sidebar from './components/Sidebar';
import type { CardState } from './components/Sidebar';
import CardCanvas from './components/CardCanvas';
import { exportCardAsPng, copyCardAsImage } from './utils/export';

function App() {
  const skinState = useSkin();
  const [cardState, setCardState] = useState<CardState>({
    recipient: '',
    message: '',
    backgroundColor: '#8b4513',
    backgroundImage: '',
    textColor: '#ffffff',
    orientation: 'horizontal',
  });
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < window.innerHeight || window.innerWidth < 1024;
    setCardState(prev => ({
      ...prev,
      orientation: isMobile ? 'vertical' : 'horizontal'
    }));
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
    <div className={`flex bg-zinc-900 overflow-hidden relative ${cardState.orientation === 'vertical' ? 'h-screen flex-row' : 'h-screen flex-col lg:flex-row'}`}>
      <Sidebar
        skinState={skinState}
        cardState={cardState}
        setCardState={setCardState}
        layout={cardState.orientation === 'horizontal' ? 'horizontal' : 'vertical'}
      />

      <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 px-4 md:p-8 space-y-6">
        <h1 className="text-3xl font-minecraft text-minecraft-green drop-shadow-md text-center">
          MineCard Generator
        </h1>

        <CardCanvas
          recipient={cardState.recipient}
          message={cardState.message}
          backgroundColor={cardState.backgroundColor}
          backgroundImage={cardState.backgroundImage}
          textColor={cardState.textColor}
          orientation={cardState.orientation}
          skinElement={
            <SkinViewer
              skinUrl={skinState.skinData.textureUrl}
              model={skinState.skinData.model}
              pose={skinState.pose}
              viewMode={skinState.viewMode}
              width={cardState.orientation === 'vertical' ? 320 : 380}
              height={cardState.orientation === 'vertical' ? 380 : 440}
            />
          }
        />

        <div className="flex flex-wrap justify-center gap-4 py-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-minecraft-green hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95"
          >
            <Download size={20} />
            DESCARGAR
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95 ${copyFeedback
              ? 'bg-blue-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            <Copy size={20} />
            {copyFeedback ? 'COPIADO!' : 'COPIAR'}
          </button>
        </div>

        <p className="text-xs text-zinc-500 text-center">
          Jugador: <span className="text-white font-mono">{skinState.username}</span>
          {' '}({skinState.skinData.model})
        </p>
      </div>
    </div>
  );
}

export default App;
