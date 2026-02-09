import { renderHook, waitFor, act } from '@testing-library/react';
import { useSkin } from '../hooks/useSkin';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

describe('useSkin hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default Steve skin', () => {
        const { result } = renderHook(() => useSkin());
        expect(result.current.username).toBe('Steve');
        expect(result.current.skinData.textureUrl).toContain('mc-heads.net/skin/Steve');
    });

    it('should fetch skin for valid username', async () => {
        const mockUuid = '069a79f4-44e9-4726-a5be-fca90e38aaf5';
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({
                uuid: mockUuid,
                textures: { slim: false }
            }),
        });

        const { result } = renderHook(() => useSkin());

        act(() => {
            result.current.setUsername('Notch');
        });

        await waitFor(() => {
            expect(result.current.skinData.textureUrl).toContain(mockUuid);
        }, { timeout: 2000 });
    });

    it('should handle API errors by falling back to mc-heads directly', async () => {
        (global.fetch as any).mockRejectedValue(new Error('API Down'));

        const { result } = renderHook(() => useSkin());

        act(() => {
            result.current.setUsername('Alex');
        });

        await waitFor(() => {
            expect(result.current.error).toBeTruthy();
            expect(result.current.skinData.textureUrl).toContain('mc-heads.net/skin/Alex');
        }, { timeout: 2000 });
    });

    it('should update pose correctly', () => {
        const { result } = renderHook(() => useSkin());
        act(() => {
            result.current.setPose('jumping');
        });
        expect(result.current.pose).toBe('jumping');
    });

    it('should update view mode correctly', () => {
        const { result } = renderHook(() => useSkin());
        act(() => {
            result.current.setViewMode('head-2d');
        });
        expect(result.current.viewMode).toBe('head-2d');
    });
});
