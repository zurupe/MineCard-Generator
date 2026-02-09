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
                ${isVertical ? 'w-[450px] h-[750px] flex-col' : 'w-[800px] h-[500px] flex-row'}
                `}
                style={{
                    backgroundColor,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                    scale: 'var(--card-scale, 1)'
                }}
            >
                {/* Content Container */}
                <div className={`
                    absolute inset-0 flex
                    ${isVertical ? 'flex-col' : 'flex-row'}
                `}>
                    {/* Text Section */}
                    <div className={`
                        flex flex-col justify-center z-10 p-8
                        ${isVertical ? 'h-1/2 w-full text-center items-center order-2' : 'h-full w-2/5'}
                    `}>
                        <div className="mb-4">
                            <p className="text-[9px] uppercase tracking-widest opacity-80 mb-1" style={{ color: textColor }}>Para:</p>
                            <h2
                                className={`font-bold break-words drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${isVertical ? 'text-2xl' : 'text-xl'}`}
                                style={{ color: textColor }}
                            >
                                {recipient || 'Jugador'}
                            </h2>
                        </div>

                        <div className={`flex items-center ${isVertical ? 'justify-center' : ''}`}>
                            <p
                                className="leading-relaxed break-words whitespace-pre-wrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                                style={{
                                    color: textColor,
                                    fontSize: message.length > 140 ? '0.75rem' : '0.875rem',
                                    textAlign: isVertical ? 'center' : 'left'
                                }}
                            >
                                {message || 'Escribe tu mensaje aquí...'}
                            </p>
                        </div>

                        {/* Stamp mark */}
                        <div className="mt-4 opacity-60">
                            <p className="text-[8px] uppercase tracking-widest" style={{ color: textColor }}>
                                ⛏ MineCard
                            </p>
                        </div>
                    </div>

                    {/* Skin Preview Section */}
                    <div className={`
                        flex items-center justify-center relative
                        ${isVertical ? 'h-1/2 w-full order-1' : 'h-full w-3/5'}
                    `}>
                        <div className="relative z-20 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                            {skinElement}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardCanvas;
