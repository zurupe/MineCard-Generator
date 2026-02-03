import { useState, useEffect } from 'react';

interface SkinData {
    textureUrl: string;
    model: 'classic' | 'slim';
}

export interface UseSkinResult {
    username: string;
    setUsername: (name: string) => void;
    isValid: boolean;
    loading: boolean;
    error: string | null;
    skinData: SkinData;
}

const DEFAULT_SKIN = 'https://textures.minecraft.net/texture/31f477eb1a695665b161c6b1a134d3522f60473e0a2977469602497042a578'; // Steve
const STEVE_MODEL = 'classic';

export const useSkin = (): UseSkinResult => {
    const [username, setUsername] = useState<string>('Steve');
    const [debouncedName, setDebouncedName] = useState<string>('Steve');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [skinData, setSkinData] = useState<SkinData>({
        textureUrl: DEFAULT_SKIN,
        model: STEVE_MODEL,
    });

    // Debounce username input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(username);
        }, 800);
        return () => clearTimeout(timer);
    }, [username]);

    useEffect(() => {
        const fetchSkin = async () => {
            // Basic validation: 3-16 chars, alphanumeric + _
            const validRegex = /^[a-zA-Z0-9_]{3,16}$/;

            if (!validRegex.test(debouncedName)) {
                if (debouncedName === '') return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${debouncedName}`);

                if (!response.ok) {
                    throw new Error('User not found');
                }

                const data = await response.json();
                // Use Crafatar as a proxy to avoid CORS issues with textures.minecraft.net
                const textureUrl = `https://crafatar.com/skins/${data.uuid}`;
                const model = data.textures.slim ? 'slim' : 'classic';

                setSkinData({ textureUrl, model });
            } catch (err) {
                console.error(err);
                setError('User not found, using Steve.');
                setSkinData({ textureUrl: DEFAULT_SKIN, model: STEVE_MODEL });
            } finally {
                setLoading(false);
            }
        };

        if (debouncedName) {
            fetchSkin();
        }
    }, [debouncedName]);

    return {
        username,
        setUsername,
        isValid: !error,
        loading,
        error,
        skinData
    };
};
