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
            className="relative w-[800px] h-[500px] rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-cover bg-center border-4 border-zinc-800"
            style={{
                backgroundColor,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined
            }}
        >
            {/* Content Grid */}
            <div className="absolute inset-0 flex bg-black/20 backdrop-blur-[2px]">
                {/* Left side: Text content */}
                <div className="w-1/2 p-10 flex flex-col justify-between z-10">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-70 mb-2" style={{ color: textColor }}>Destinatario:</p>
                        <h2
                            className="text-2xl font-bold mb-6 break-words drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                            style={{ color: textColor }}
                        >
                            {recipient || 'Jugador'}
                        </h2>
                    </div>

                    <div className="flex-1 flex items-center">
                        <p
                            className="text-lg leading-relaxed break-words whitespace-pre-wrap drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                            style={{
                                color: textColor,
                                fontSize: message.length > 140 ? '0.9rem' : '1.1rem',
                            }}
                        >
                            {message || 'Escribe tu mensaje aquí...'}
                        </p>
                    </div>
                </div>

                {/* Right side: Skin preview */}
                <div className="w-1/2 flex items-end justify-center pb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    <div className="relative z-20 transform hover:scale-105 transition-transform duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                        {skinElement}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardCanvas;
