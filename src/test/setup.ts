import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock URL.createObjectURL since jsdom doesn't support it
if (typeof window !== 'undefined') {
    window.URL.createObjectURL = vi.fn(() => 'mock-url');
}

// Mock navigator.clipboard
if (typeof navigator !== 'undefined') {
    Object.assign(navigator, {
        clipboard: {
            write: vi.fn(),
        },
    });
}
