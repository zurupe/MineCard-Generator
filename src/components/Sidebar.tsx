import React, { useState } from 'react';
import { Search, Upload } from 'lucide-react';
import type { UseSkinResult, PoseType } from '../hooks/useSkin';
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
    layout?: 'vertical' | 'horizontal';
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
    layout = 'vertical',
}: SidebarProps) => {
    const { backgrounds = [] } = useBackgrounds();
    const { username, setUsername, loading, error, pose, setPose } = skinState;
    const [inputValue, setInputValue] = useState(username);
    const [isOpen, setIsOpen] = useState(false);

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
                fixed lg:relative z-40 bg-zinc-800 border-zinc-700 overflow-auto transition-transform duration-300
                ${layout === 'vertical'
                    ? 'h-full w-80 p-6 flex flex-col gap-6 border-r'
                    : 'w-full h-auto lg:h-72 p-4 flex flex-col lg:flex-row gap-4 border-t lg:order-last'
                }
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <h2 className={`text-xl text-minecraft-green font-bold ${layout === 'horizontal' ? 'lg:hidden' : ''}`}>Controls</h2>

                <div className={`${layout === 'horizontal' ? 'flex flex-row flex-wrap gap-6 items-start w-full overflow-x-auto pb-4 lg:pb-0' : 'flex flex-col gap-6'}`}>

                    {/* Orientation Toggle */}
                    <div className={`space-y-2 ${layout === 'horizontal' ? 'min-w-[150px]' : ''}`}>
                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold text-nowrap">Orientación</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['horizontal', 'vertical'] as const).map((id) => (
                                <button
                                    key={id}
                                    onClick={() => updateCard('orientation', id)}
                                    className={`p-1.5 rounded text-[10px] uppercase border transition-all flex items-center justify-center gap-2 ${cardState.orientation === id
                                        ? 'bg-minecraft-green border-minecraft-green text-white scale-[1.02]'
                                        : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-zinc-400'
                                        }`}
                                >
                                    <span>{id === 'horizontal' ? '↔️' : '↕️'}</span>
                                    <span className={layout === 'horizontal' ? 'hidden sm:inline' : ''}>{id === 'horizontal' ? 'Horiz.' : 'Vert.'}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Skin Section */}
                    <div className={`space-y-4 ${layout === 'horizontal' ? 'min-w-[200px]' : 'border-t border-zinc-700 pt-4'}`}>
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
                            <div className="bg-red-900/40 border border-red-500/50 p-2 rounded">
                                <p className="text-red-400 text-[10px] uppercase font-bold">Error</p>
                                <p className="text-red-200 text-[10px] truncate" title={error}>{error}</p>
                            </div>
                        )}
                    </div>

                    {/* View Mode & Pose Section */}
                    <div className={`space-y-4 ${layout === 'horizontal' ? 'min-w-[250px]' : 'border-t border-zinc-700 pt-4'}`}>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Vista</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['head-2d', 'full-body'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => skinState.setViewMode(mode)}
                                        className={`p-1.5 rounded text-[10px] uppercase border transition-all ${skinState.viewMode === mode
                                            ? 'bg-minecraft-green border-minecraft-green text-white scale-[1.02]'
                                            : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-zinc-400'
                                            }`}
                                    >
                                        {mode === 'head-2d' ? '🎭 Cabeza' : '🧍 Cuerpo'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {skinState.viewMode === 'full-body' && (
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Pose</label>
                                <div className="grid grid-cols-3 gap-1">
                                    {POSES.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => setPose(p.id)}
                                            className={`p-1.5 rounded text-[10px] border flex items-center justify-center gap-1 transition-all ${pose === p.id
                                                ? 'bg-minecraft-green border-minecraft-green text-white'
                                                : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-zinc-400'
                                                }`}
                                        >
                                            <span title={p.label}>{p.emoji}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Card Content Section */}
                    <div className={`space-y-4 ${layout === 'horizontal' ? 'min-w-[300px] flex-1' : 'border-t border-zinc-700 pt-4'}`}>
                        <div className="flex gap-2">
                            <div className="flex-1 space-y-1">
                                <label className="text-[10px] text-zinc-400 uppercase font-bold">Para</label>
                                <input
                                    type="text"
                                    maxLength={20}
                                    value={cardState.recipient}
                                    onChange={(e) => updateCard('recipient', e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-minecraft-green text-sm"
                                    placeholder="Nombre"
                                />
                            </div>
                            <div className="flex-[2] space-y-1">
                                <label className="text-[10px] text-zinc-400 uppercase font-bold">Mensaje</label>
                                <textarea
                                    maxLength={280}
                                    value={cardState.message}
                                    onChange={(e) => updateCard('message', e.target.value)}
                                    className={`w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-minecraft-green text-sm resize-none ${layout === 'horizontal' ? 'h-10' : 'h-24'}`}
                                    placeholder="Escribe..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Background & Colors Section */}
                    <div className={`space-y-4 ${layout === 'horizontal' ? 'min-w-[280px]' : 'border-t border-zinc-700 pt-4'}`}>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Fondo & Colores</label>
                            <div className="flex gap-2">
                                <div className="flex-1 space-y-1">
                                    <label className="text-[10px] text-zinc-500">Card</label>
                                    <input
                                        type="color"
                                        value={cardState.backgroundColor}
                                        onChange={(e) => updateCard('backgroundColor', e.target.value)}
                                        className="w-full h-8 rounded cursor-pointer border-2 border-zinc-700 bg-zinc-900 p-0.5"
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-[10px] text-zinc-500">Texto</label>
                                    <input
                                        type="color"
                                        value={cardState.textColor}
                                        onChange={(e) => updateCard('textColor', e.target.value)}
                                        className="w-full h-8 rounded cursor-pointer border-2 border-zinc-700 bg-zinc-900 p-0.5"
                                    />
                                </div>
                                <div className="flex-[2] space-y-1">
                                    <label className="text-[10px] text-zinc-500">Imagen</label>
                                    <select
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-[10px] text-zinc-300 h-8"
                                        value={cardState.backgroundImage}
                                        onChange={(e) => updateCard('backgroundImage', e.target.value)}
                                    >
                                        <option value="">Sólido</option>
                                        {backgrounds.map(bg => <option key={bg.id} value={bg.url}>{bg.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Sidebar;
