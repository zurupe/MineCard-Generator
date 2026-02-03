import React from 'react';
import { Search } from 'lucide-react';
import type { UseSkinResult } from '../hooks/useSkin';

export interface CardState {
    recipient: string;
    message: string;
    backgroundColor: string;
    backgroundImage: string;
    textColor: string;
}

interface SidebarProps {
    skinState: UseSkinResult;
    cardState: CardState;
    setCardState: (state: CardState) => void;
    setAnimation: (anim: 'idle' | 'walk' | 'run' | 'none') => void;
    currentAnimation: 'idle' | 'walk' | 'run' | 'none';
}

const Sidebar: React.FC<SidebarProps> = ({
    skinState,
    cardState,
    setCardState,
    setAnimation,
    currentAnimation
}) => {
    const { username, setUsername, loading, error } = skinState;
    const [inputValue, setInputValue] = React.useState(username);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setUsername(inputValue);
    };

    const updateCard = (field: keyof CardState, value: string) => {
        setCardState({ ...cardState, [field]: value });
    };

    return (
        <div className="w-80 bg-zinc-800 p-6 flex flex-col gap-6 border-r border-zinc-700 overflow-y-auto">
            <h2 className="text-xl text-minecraft-green font-bold">Controls</h2>

            {/* Skin Section */}
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Minecraft User</label>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
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

            {/* Pose Section */}
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Pose</label>
                <div className="grid grid-cols-2 gap-2">
                    {['idle', 'walk', 'run', 'none'].map((anim) => (
                        <button
                            key={anim}
                            onClick={() => setAnimation(anim as any)}
                            className={`p-2 rounded text-xs capitalize border ${currentAnimation === anim
                                ? 'bg-minecraft-green border-minecraft-green'
                                : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'
                                }`}
                        >
                            {anim}
                        </button>
                    ))}
                </div>
            </div>

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
                    {[
                        { name: 'Plains', url: 'https://minecraft.wiki/images/thumb/Plains_Biome.png/300px-Plains_Biome.png' },
                        { name: 'Forest', url: 'https://minecraft.wiki/images/thumb/Forest_Biome.png/300px-Forest_Biome.png' },
                        { name: 'Desert', url: 'https://minecraft.wiki/images/thumb/Desert_Biome.png/300px-Desert_Biome.png' },
                        { name: 'Nether', url: 'https://minecraft.wiki/images/thumb/Nether_Wastes_Biome.png/300px-Nether_Wastes_Biome.png' },
                        { name: 'The End', url: 'https://minecraft.wiki/images/thumb/The_End_Biome.png/300px-The_End_Biome.png' }
                    ].map((bg) => (
                        <button
                            key={bg.name}
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
    );
};

export default Sidebar;
