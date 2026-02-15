#!/usr/bin/env node

/**
 * Generador de iconos para PWA
 * Genera iconos monocromáticos simples
 * 
 * Uso:
 * npm install canvas
 * node generate-icons.js
 */

const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Fondo negro
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);
    
    // Símbolo de play/speaker monocromático
    ctx.fillStyle = '#ffffff';
    
    // Círculo exterior
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = size * 0.08;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    
    // Triángulo play
    const triSize = size * 0.18;
    const triX = centerX - triSize * 0.3;
    const triY = centerY;
    
    ctx.beginPath();
    ctx.moveTo(triX, triY - triSize);
    ctx.lineTo(triX + triSize * 1.5, triY);
    ctx.lineTo(triX, triY + triSize);
    ctx.closePath();
    ctx.fill();
    
    // Ondas de sonido
    const waveX = centerX + radius * 0.5;
    for (let i = 0; i < 2; i++) {
        const waveRadius = radius * (0.4 + i * 0.3);
        const startAngle = -Math.PI * 0.3;
        const endAngle = Math.PI * 0.3;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, waveRadius + waveX - centerX + i * size * 0.08, startAngle, endAngle);
        ctx.lineWidth = size * 0.04;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
    }
    
    // Guardar
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generado: ${filename} (${size}x${size})`);
}

// Generar iconos
console.log('Generando iconos PWA...\n');

try {
    generateIcon(192, 'icon-192.png');
    generateIcon(512, 'icon-512.png');
    
    console.log('\n✓ Iconos generados exitosamente');
    console.log('\nPuedes personalizar los iconos editando este script o');
    console.log('reemplazando los archivos .png con tus propias imágenes.');
} catch (error) {
    console.error('\n✗ Error:', error.message);
    console.log('\nAsegúrate de tener canvas instalado:');
    console.log('  npm install canvas');
}
