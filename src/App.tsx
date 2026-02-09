import { useState } from 'react';
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
  });
  const [copyFeedback, setCopyFeedback] = useState(false);

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
    <div className="flex h-screen">
      <Sidebar
        skinState={skinState}
        cardState={cardState}
        setCardState={setCardState}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 bg-zinc-900">
        <h1 className="text-3xl text-minecraft-green drop-shadow-md">MineCard Generator</h1>

        <CardCanvas
          recipient={cardState.recipient}
          message={cardState.message}
          backgroundColor={cardState.backgroundColor}
          backgroundImage={cardState.backgroundImage}
          textColor={cardState.textColor}
          skinElement={
            <SkinViewer
              skinUrl={skinState.skinData.textureUrl}
              model={skinState.skinData.model}
              pose={skinState.pose}
              viewMode={skinState.viewMode}
              width={350}
              height={420}
            />
          }
        />

        <div className="flex gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-minecraft-green hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg"
          >
            <Download size={20} />
            DESCARGAR TARJETA
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors shadow-lg ${copyFeedback
              ? 'bg-blue-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            <Copy size={20} />
            {copyFeedback ? 'COPIADO!' : 'COPIAR'}
          </button>
        </div>

        <p className="text-xs text-zinc-500">
          Usuario: <span className="text-white font-mono">{skinState.username}</span>
          {' '}({skinState.skinData.model})
        </p>
      </div>
    </div>
  );
}

export default App;
