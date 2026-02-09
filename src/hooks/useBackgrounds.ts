import { useState } from 'react';

export interface Background {
    id: string;
    name: string;
    url: string;
    color: string;
}

// Using high-quality Minecraft wallpapers from public sources
const DEFAULT_BACKGROUNDS: Background[] = [
    {
        id: 'plains',
        name: 'Llanura',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        color: '#90EE90'
    },
    {
        id: 'forest',
        name: 'Bosque',
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
        color: '#228B22'
    },
    {
        id: 'desert',
        name: 'Desierto',
        url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
        color: '#EDC9AF'
    },
    {
        id: 'ocean',
        name: 'Océano',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
        color: '#1E90FF'
    },
    {
        id: 'nether',
        name: 'Nether',
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
        color: '#8B0000'
    },
    {
        id: 'night',
        name: 'Noche',
        url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
        color: '#191970'
    }
];

export const useBackgrounds = () => {
    const [backgrounds] = useState<Background[]>(DEFAULT_BACKGROUNDS);
    const [loading] = useState(false);

    return { backgrounds, loading };
};
