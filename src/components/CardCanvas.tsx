import React from 'react';

interface CardCanvasProps {
    recipient: string;
    message: string;
    backgroundColor: string;
    backgroundImage?: string;
    textColor: string;
    skinElement?: React.ReactNode;
    orientation?: 'horizontal' | 'vertical';
}

const CardCanvas: React.FC<CardCanvasProps> = ({
    recipient,
    message,
    backgroundColor,
    backgroundImage,
    textColor,
    skinElement,
    orientation = 'horizontal',
}) => {
    const isVertical = orientation === 'vertical';

    return (
        <div className="max-w-full overflow-hidden flex justify-center p-4">
            <div
                id="minecard-canvas"
                className={`
                relative flex transition-all duration-500 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-cover bg-center border-4 border-zinc-700
                ${isVertical ? 'w-[400px] h-[650px] flex-col' : 'w-[800px] h-[500px] flex-row'}
                `}
                style={{
                    backgroundColor,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                    scale: 'var(--card-scale, 1)',
                    transformOrigin: 'top center'
                }}
            >
                {/* Content Container */}
                <div className={`
                    absolute inset-0 flex
                    ${isVertical ? 'flex-col' : 'flex-row'}
                `}>
                    {/* Skin Preview Section (Order 1 in vertical, positioned above or right) */}
                    <div className={`
                        flex items-center justify-center relative overflow-hidden
                        ${isVertical ? 'h-[55%] w-full order-1' : 'h-full w-3/5 order-2'}
                    `}>
                        <div className="relative z-20 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] flex items-center justify-center w-full h-full">
                            <div className="transform scale-[1.1] transition-transform duration-500 hover:scale-[1.15]">
                                {skinElement}
                            </div>
                        </div>
                    </div>

                    {/* Text Section (Order 2 in vertical, positioned below or left) */}
                    <div className={`
                        flex flex-col justify-center z-10 p-8
                        ${isVertical ? 'h-[45%] w-full text-center items-center order-2 border-t border-white/10 bg-black/20 backdrop-blur-sm' : 'h-full w-2/5 order-1'}
                    `}>
                        <div className={`mb-4 w-full ${isVertical ? 'text-center' : ''}`}>
                            <p className="text-[9px] uppercase tracking-widest opacity-80 mb-1" style={{ color: textColor }}>Para:</p>
                            <h2
                                className={`font-bold break-words drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${isVertical ? 'text-2xl' : 'text-xl'}`}
                                style={{ color: textColor }}
                            >
                                {recipient || 'Jugador'}
                            </h2>
                        </div>

                        <div className={`flex items-center w-full ${isVertical ? 'justify-center' : ''}`}>
                            <p
                                className="leading-relaxed break-words whitespace-pre-wrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                                style={{
                                    color: textColor,
                                    fontSize: message.length > 140 ? '0.75rem' : '0.875rem',
                                    textAlign: isVertical ? 'center' : 'left',
                                    width: '100%'
                                }}
                            >
                                {message || 'Escribe tu mensaje aquí...'}
                            </p>
                        </div>

                        {/* Stamp mark */}
                        <div className={`mt-auto opacity-60 w-full ${isVertical ? 'text-center' : ''}`}>
                            <p className="text-[8px] uppercase tracking-widest" style={{ color: textColor }}>
                                ⛏ MineCard
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardCanvas;
