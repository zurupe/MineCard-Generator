import { useState, useEffect } from 'react';

interface SkinData {
    textureUrl: string;
    model: 'classic' | 'slim';
}

export type ViewMode = 'head-2d' | 'full-body';
export type PoseType = 'standing' | 'waving' | 'jumping' | 'pointing' | 'crossed' | 'relaxed';

export interface UseSkinResult {
    username: string;
    setUsername: (name: string) => void;
    isValid: boolean;
    loading: boolean;
    error: string | null;
    skinData: SkinData;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    pose: PoseType;
    setPose: (pose: PoseType) => void;
    uploadSkin: (file: File) => void;
}

const DEFAULT_SKIN = 'https://mc-heads.net/skin/Notch';
const STEVE_MODEL = 'classic';

export const useSkin = (): UseSkinResult => {
    const [username, setUsername] = useState<string>('Notch');
    const [debouncedName, setDebouncedName] = useState<string>('Notch');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('full-body');
    const [pose, setPose] = useState<PoseType>('waving');
    const [skinData, setSkinData] = useState<SkinData>({
        textureUrl: DEFAULT_SKIN,
        model: STEVE_MODEL,
    });

    const uploadSkin = (file: File) => {
        const url = URL.createObjectURL(file);
        setSkinData({
            textureUrl: url,
            model: 'classic',
        });
        setUsername('Custom Skin');
        setError(null);
    };

    // Debounce username input
    useEffect(() => {
        if (username === 'Custom Skin') return;
        const timer = setTimeout(() => {
            setDebouncedName(username);
        }, 800);
        return () => clearTimeout(timer);
    }, [username]);

    useEffect(() => {
        const fetchSkin = async () => {
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
                const textureUrl = `https://mc-heads.net/skin/${data.uuid}`;
                const model = data.textures?.slim ? 'slim' : 'classic';

                setSkinData({ textureUrl, model });
            } catch (err) {
                console.error('Error fetching skin:', err);
                setError('User not found or API error. Using default.');

                if (debouncedName.length >= 3 && debouncedName.length <= 16) {
                    setSkinData({
                        textureUrl: `https://mc-heads.net/skin/${debouncedName}`,
                        model: STEVE_MODEL
                    });
                } else {
                    setSkinData({ textureUrl: DEFAULT_SKIN, model: STEVE_MODEL });
                }
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
        skinData,
        viewMode,
        setViewMode,
        pose,
        setPose,
        uploadSkin
    };
};
