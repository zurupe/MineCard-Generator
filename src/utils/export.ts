import { toPng } from 'html-to-image';

export const exportCardAsPng = async (elementId: string, username: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    try {
        const dataUrl = await toPng(element, {
            quality: 1.0,
            pixelRatio: 2, // High resolution export for better quality
        });

        const link = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        link.download = `minecard_${username}_${date}.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Export failed:', error);
        throw error;
    }
};
