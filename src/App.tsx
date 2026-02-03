import { useState } from 'react';
import { Download } from 'lucide-react';
import { useSkin } from './hooks/useSkin';
import SkinViewer from './components/SkinViewer';
import Sidebar from './components/Sidebar';
import type { CardState } from './components/Sidebar';
import CardCanvas from './components/CardCanvas';
import { exportCardAsPng } from './utils/export';

function App() {
  const skinState = useSkin();
  const [animation, setAnimation] = useState<'idle' | 'walk' | 'run' | 'none'>('idle');
  const [cardState, setCardState] = useState<CardState>({
    recipient: '',
    message: '',
    backgroundColor: '#8b4513',
    backgroundImage: '',
    textColor: '#ffffff',
  });

  const handleExport = async () => {
    try {
      await exportCardAsPng('minecard-canvas', skinState.username);
    } catch (error) {
      alert('Error al exportar la tarjeta. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        skinState={skinState}
        cardState={cardState}
        setCardState={setCardState}
        setAnimation={setAnimation}
        currentAnimation={animation}
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
            <div className="scale-75 origin-bottom">
              <SkinViewer
                skinUrl={skinState.skinData.textureUrl}
                model={skinState.skinData.model}
                animation={animation}
                width={300}
                height={350}
              />
            </div>
          }
        />

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-minecraft-green hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg"
        >
          <Download size={20} />
          DESCARGAR TARJETA
        </button>

        <p className="text-xs text-zinc-500">
          Usuario: <span className="text-white font-mono">{skinState.username}</span>
          {' '}({skinState.skinData.model})
        </p>
      </div>
    </div>
  );
}

export default App;
