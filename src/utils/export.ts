import { toPng } from 'html-to-image';

/**
 * Captures WebGL canvas content before html-to-image processing.
 * WebGL canvases lose their content after the drawing buffer is cleared,
 * so we need to capture them as images first.
 */
const prepareCanvasesForCapture = (element: HTMLElement): (() => void) => {
    const canvases = element.querySelectorAll('canvas');
    const overlays: HTMLDivElement[] = [];

    canvases.forEach((canvas) => {
        if (canvas instanceof HTMLCanvasElement) {
            try {
                // Get canvas data as image
                const dataUrl = canvas.toDataURL('image/png');

                // Create an overlay image positioned exactly over the canvas
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url(${dataUrl});
                    background-size: cover;
                    pointer-events: none;
                    z-index: 9999;
                `;

                // Position the canvas container relatively if not already
                const parent = canvas.parentElement;
                if (parent) {
                    const originalPosition = parent.style.position;
                    if (!originalPosition || originalPosition === 'static') {
                        parent.style.position = 'relative';
                    }
                    parent.appendChild(overlay);
                    overlays.push(overlay);
                }
            } catch (e) {
                console.warn('Could not capture canvas:', e);
            }
        }
    });

    // Return cleanup function
    return () => {
        overlays.forEach(overlay => overlay.remove());
    };
};

export const exportCardAsPng = async (elementId: string, username: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    // Prepare canvases and get cleanup function
    const cleanup = prepareCanvasesForCapture(element);

    try {
        const dataUrl = await toPng(element, {
            quality: 1.0,
            pixelRatio: 2,
            cacheBust: true,
        });

        const link = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        link.download = `minecard_${username}_${date}.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Export failed:', error);
        throw error;
    } finally {
        cleanup();
    }
};

export const copyCardAsImage = async (elementId: string): Promise<void> => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    // Prepare canvases and get cleanup function
    const cleanup = prepareCanvasesForCapture(element);

    try {
        const dataUrl = await toPng(element, {
            quality: 1.0,
            pixelRatio: 2,
            cacheBust: true,
        });

        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        // Copy to clipboard
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
    } catch (error) {
        console.error('Copy failed:', error);
        throw error;
    } finally {
        cleanup();
    }
};
