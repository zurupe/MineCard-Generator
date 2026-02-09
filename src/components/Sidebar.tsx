import React from 'react';
import { Search, Upload } from 'lucide-react';
import type { UseSkinResult, PoseType, ViewMode } from '../hooks/useSkin';
import { useBackgrounds } from '../hooks/useBackgrounds';

export interface CardState {
    recipient: string;
    message: string;
    backgroundColor: string;
    backgroundImage: string;
    textColor: string;
    orientation: 'horizontal' | 'vertical';
}

interface SidebarProps {
    skinState: UseSkinResult;
    cardState: CardState;
    setCardState: (state: CardState) => void;
}

const POSES: { id: PoseType; label: string; emoji: string }[] = [
    { id: 'standing', label: 'De Pie', emoji: '🧍' },
    { id: 'waving', label: 'Saludando', emoji: '👋' },
    { id: 'jumping', label: 'Saltando', emoji: '🦘' },
    { id: 'pointing', label: 'Señalando', emoji: '👉' },
    { id: 'crossed', label: 'Cruzado', emoji: '🤞' },
    { id: 'relaxed', label: 'Relajado', emoji: '😌' },
];

const Sidebar: React.FC<SidebarProps> = ({
    skinState,
    cardState,
    setCardState,
}: SidebarProps) => {
    const { backgrounds = [] } = useBackgrounds();
    const { username, setUsername, loading, error, pose, setPose } = skinState;
    const [inputValue, setInputValue] = React.useState(username);
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setUsername(inputValue);
    };

    const updateCard = <K extends keyof CardState>(field: K, value: CardState[K]) => {
        setCardState({ ...cardState, [field]: value });
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-minecraft-green text-white p-4 rounded-full shadow-2xl active:scale-95 transition-transform"
            >
                {isOpen ? '✕' : '⚙️'}
            </button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`
                fixed lg:relative z-40 h-full w-80 bg-zinc-800 p-6 flex flex-col gap-6 border-r border-zinc-700 overflow-y-auto transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <h2 className="text-xl text-minecraft-green font-bold">Controls</h2>

                {/* Orientation Toggle */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Orientación</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['horizontal', 'vertical'] as const).map((id) => (
                            <button
                                key={id}
                                onClick={() => updateCard('orientation', id)}
                                className={`p-2 rounded text-[10px] uppercase border transition-all flex items-center justify-center gap-2 ${cardState.orientation === id
                                    ? 'bg-minecraft-green border-minecraft-green text-white scale-[1.02]'
                                    : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-zinc-400'
                                    }`}
                            >
                                <span>{id === 'horizontal' ? '↔️' : '↕️'}</span>
                                <span>{id === 'horizontal' ? 'Horizontal' : 'Vertical'}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Skin Section */}
                <div className="space-y-4 border-t border-zinc-700 pt-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Minecraft User</label>
                        <label className="cursor-pointer bg-zinc-700 hover:bg-zinc-600 p-1.5 rounded transition-colors text-zinc-200" title="Subir Skin (.png)">
                            <Upload size={14} />
                            <input
                                type="file"
                                accept="image/png"
                                className="hidden"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = e.target.files?.[0];
                                    if (file) skinState.uploadSkin(file);
                                }}
                            />
                        </label>
                    </div>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-minecraft-green font-mono text-sm"
                            placeholder="Username"
                        />
                        <button
                            type="submit"
                            className="bg-minecraft-green p-2 rounded hover:bg-green-600 transition-colors"
                            disabled={loading}
                        >
                            <Search size={20} />
                        </button>
                    </form>
                    {error && (
                        <div className="bg-red-900/30 border border-red-500/50 p-2 rounded flex flex-col gap-1">
                            <p className="text-red-400 text-[10px] uppercase font-bold">Error</p>
                            <p className="text-red-200 text-xs">{error}</p>
                        </div>
                    )}
                    {loading && (
                        <div className="bg-yellow-900/30 border border-yellow-500/50 p-2 rounded flex items-center gap-2 animate-pulse">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <p className="text-yellow-200 text-xs font-bold uppercase">Buscando Skin...</p>
                        </div>
                    )}
                </div>

                {/* View Mode Section */}
                <div className="space-y-2 border-t border-zinc-700 pt-4">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Vista de Skin</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'head-2d', label: '🎭 Cabeza 2D' },
                            { id: 'full-body', label: '🧍 Cuerpo Completo' }
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => skinState.setViewMode(mode.id as ViewMode)}
                                className={`p-2 rounded text-[10px] uppercase border transition-all ${skinState.viewMode === mode.id
                                    ? 'bg-minecraft-green border-minecraft-green text-white scale-[1.02]'
                                    : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-zinc-400'
                                    }`}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pose Section - only show for full-body */}
                {skinState.viewMode === 'full-body' && (
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Pose</label>
                        <div className="grid grid-cols-2 gap-2">
                            {POSES.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPose(p.id)}
                                    className={`p-2 rounded text-[10px] border flex items-center justify-center gap-1 transition-all ${pose === p.id
                                        ? 'bg-minecraft-green border-minecraft-green text-white scale-[1.02]'
                                        : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-zinc-400'
                                        }`}
                                >
                                    <span>{p.emoji}</span>
                                    <span>{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Card Content Section */}
                <div className="border-t border-zinc-700 pt-4 space-y-4">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Card Content</label>

                    <div className="space-y-2">
                        <label className="text-xs text-zinc-300">Destinatario (max 20)</label>
                        <input
                            type="text"
                            maxLength={20}
                            value={cardState.recipient}
                            onChange={(e) => updateCard('recipient', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-minecraft-green text-sm"
                            placeholder="Nombre del jugador"
                        />
                        <span className="text-xs text-zinc-500">{cardState.recipient.length}/20</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-zinc-300">Mensaje (max 280)</label>
                        <textarea
                            maxLength={280}
                            value={cardState.message}
                            onChange={(e) => updateCard('message', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-minecraft-green text-sm h-32 resize-none"
                            placeholder="Escribe tu mensaje..."
                        />
                        <span className="text-xs text-zinc-500">{cardState.message.length}/280</span>
                    </div>
                </div>

                {/* Background Section */}
                <div className="border-t border-zinc-700 pt-4 space-y-4">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Background</label>

                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => updateCard('backgroundImage', '')}
                            className={`p-2 rounded text-[10px] uppercase border ${!cardState.backgroundImage ? 'border-minecraft-green bg-zinc-900 text-minecraft-green' : 'border-zinc-700 bg-zinc-900 text-zinc-400'}`}
                        >
                            Solid
                        </button>
                        {backgrounds.map((bg) => (
                            <button
                                key={bg.id}
                                onClick={() => updateCard('backgroundImage', bg.url)}
                                className={`p-2 rounded text-[10px] uppercase border truncate ${cardState.backgroundImage === bg.url ? 'border-minecraft-green bg-zinc-900 text-minecraft-green' : 'border-zinc-700 bg-zinc-900 text-zinc-400'}`}
                                title={bg.name}
                            >
                                {bg.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs text-zinc-300">Solid Color</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={cardState.backgroundColor}
                                    onChange={(e) => updateCard('backgroundColor', e.target.value)}
                                    className="w-10 h-10 rounded cursor-pointer border-2 border-zinc-700"
                                />
                                <input
                                    type="text"
                                    value={cardState.backgroundColor}
                                    onChange={(e) => updateCard('backgroundColor', e.target.value)}
                                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded p-1 text-white text-[10px] font-mono focus:outline-none focus:border-minecraft-green"
                                />
                            </div>
                        </div>

                        <div className="flex-1 space-y-2">
                            <label className="text-xs text-zinc-300">Text Color</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={cardState.textColor}
                                    onChange={(e) => updateCard('textColor', e.target.value)}
                                    className="w-10 h-10 rounded cursor-pointer border-2 border-zinc-700"
                                />
                                <input
                                    type="text"
                                    value={cardState.textColor}
                                    onChange={(e) => updateCard('textColor', e.target.value)}
                                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded p-1 text-white text-[10px] font-mono focus:outline-none focus:border-minecraft-green"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
