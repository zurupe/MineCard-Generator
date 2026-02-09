#!/usr/bin/env node

/**
 * Script para generar fondos Minecraft temáticos
 * Ejecutar: node scripts/generate-backgrounds.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backgroundsDir = path.join(__dirname, '../public/backgrounds');

// Asegurar que la carpeta existe
if (!fs.existsSync(backgroundsDir)) {
    fs.mkdirSync(backgroundsDir, { recursive: true });
}

// Definir fondos con colores Minecraft
const backgrounds = [
    {
        name: 'plains',
        colors: ['#90EE90', '#87CEEB', '#FFD700'],
        description: 'Plains Biome'
    },
    {
        name: 'forest',
        colors: ['#228B22', '#556B2F', '#8FBC8F'],
        description: 'Forest Biome'
    },
    {
        name: 'desert',
        colors: ['#EDC9AF', '#DEB887', '#D2B48C'],
        description: 'Desert Biome'
    },
    {
        name: 'ocean',
        colors: ['#1E90FF', '#4169E1', '#87CEEB'],
        description: 'Ocean Biome'
    },
    {
        name: 'nether',
        colors: ['#8B0000', '#DC143C', '#FF6347'],
        description: 'Nether'
    },
    {
        name: 'end',
        colors: ['#2F1B47', '#1a0033', '#4a0080'],
        description: 'The End'
    }
];

// Generar archivos SVG y guardar como JSON
backgrounds.forEach(bg => {
    const svg = generateMinecraftSVG(bg.name, bg.colors);
    const metadata = {
        name: bg.name,
        description: bg.description,
        colors: bg.colors,
        url: `/backgrounds/${bg.name}.svg`
    };
    
    // Guardar SVG
    fs.writeFileSync(
        path.join(backgroundsDir, `${bg.name}.svg`),
        svg,
        'utf-8'
    );
    
    console.log(`✓ Generated background: ${bg.description}`);
});

// Generar archivo backgrounds.json con metadata
const backgroundsList = backgrounds.map(bg => ({
    id: bg.name,
    name: bg.description,
    url: `/backgrounds/${bg.name}.svg`,
    color: bg.colors[0]
}));

fs.writeFileSync(
    path.join(backgroundsDir, 'backgrounds.json'),
    JSON.stringify(backgroundsList, null, 2),
    'utf-8'
);

console.log('\n✓ Generated backgrounds.json');
console.log(`✓ Total backgrounds created: ${backgrounds.length}`);

/**
 * Genera un SVG con patrón Minecraft
 */
function generateMinecraftSVG(name, colors) {
    const [color1, color2, color3] = colors;
    const blockSize = 32;
    const width = 800;
    const height = 500;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
    svg += `<defs><pattern id="pattern" x="0" y="0" width="${blockSize * 2}" height="${blockSize * 2}" patternUnits="userSpaceOnUse">`;
    
    // Patrón de bloques estilo Minecraft
    svg += `<rect x="0" y="0" width="${blockSize}" height="${blockSize}" fill="${color1}"/>`;
    svg += `<rect x="${blockSize}" y="0" width="${blockSize}" height="${blockSize}" fill="${color2}"/>`;
    svg += `<rect x="0" y="${blockSize}" width="${blockSize}" height="${blockSize}" fill="${color2}"/>`;
    svg += `<rect x="${blockSize}" y="${blockSize}" width="${blockSize}" height="${blockSize}" fill="${color1}"/>`;
    
    // Bordes oscuros para efecto 3D
    svg += `<line x1="0" y1="0" x2="${blockSize * 2}" y2="0" stroke="#000000" stroke-width="1" opacity="0.2"/>`;
    svg += `<line x1="0" y1="${blockSize}" x2="${blockSize * 2}" y2="${blockSize}" stroke="#000000" stroke-width="1" opacity="0.2"/>`;
    
    svg += `</pattern></defs>`;
    svg += `<rect width="${width}" height="${height}" fill="${color3}"/>`;
    svg += `<rect width="${width}" height="${height}" fill="url(#pattern)"/>`;
    svg += `</svg>`;
    
    return svg;
}
