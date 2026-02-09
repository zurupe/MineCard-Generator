import React from 'react';

interface CardCanvasProps {
    recipient: string;
    message: string;
    backgroundColor: string;
    backgroundImage?: string;
    textColor: string;
    skinElement?: React.ReactNode;
}

const CardCanvas: React.FC<CardCanvasProps> = ({
    recipient,
    message,
    backgroundColor,
    backgroundImage,
    textColor,
    skinElement,
}) => {
    return (
        <div
            id="minecard-canvas"
            className="relative w-[800px] h-[500px] rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-cover bg-center border-4 border-zinc-700"
            style={{
                backgroundColor,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined
            }}
        >


            {/* Content Grid */}
            <div className="absolute inset-0 flex">
                {/* Left side: Text content */}
                <div className="w-2/5 p-8 flex flex-col justify-center z-10">
                    <div className="mb-4">
                        <p className="text-[9px] uppercase tracking-widest opacity-80 mb-1" style={{ color: textColor }}>Para:</p>
                        <h2
                            className="text-xl font-bold break-words drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                            style={{ color: textColor }}
                        >
                            {recipient || 'Jugador'}
                        </h2>
                    </div>

                    <div className="flex-1 flex items-center">
                        <p
                            className="text-sm leading-relaxed break-words whitespace-pre-wrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                            style={{
                                color: textColor,
                                fontSize: message.length > 140 ? '0.75rem' : '0.875rem',
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

                {/* Right side: Skin preview - BIGGER and CENTERED */}
                <div className="w-3/5 flex items-center justify-center relative">

                    <div className="relative z-20 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                        {skinElement}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardCanvas;
