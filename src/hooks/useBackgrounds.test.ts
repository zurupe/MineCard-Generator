import { renderHook } from '@testing-library/react';
import { useBackgrounds } from '../hooks/useBackgrounds';
import { describe, it, expect } from 'vitest';

describe('useBackgrounds hook', () => {
    it('should return a list of default backgrounds', () => {
        const { result } = renderHook(() => useBackgrounds());
        expect(result.current.backgrounds).toBeDefined();
        expect(result.current.backgrounds.length).toBeGreaterThan(0);
    });

    it('should contain specific Minecraft biomes', () => {
        const { result } = renderHook(() => useBackgrounds());
        const names = result.current.backgrounds.map(bg => bg.name);
        expect(names).toContain('Llanura');
        expect(names).toContain('Bosque');
        expect(names).toContain('Nether');
    });

    it('should have valid Unsplash URLs for backgrounds', () => {
        const { result } = renderHook(() => useBackgrounds());
        result.current.backgrounds.forEach(bg => {
            expect(bg.url).toContain('unsplash.com');
        });
    });
});
