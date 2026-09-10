'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AVATAR_URL } from '@/lib/data';

interface AsciiArtProps {
  width?: number;
  className?: string;
}

// Character ramp from dark to light
const CHAR_RAMP = '@%#*+=-:. ';

export default function AsciiPortrait({
  width = 40,
  className = '',
}: AsciiArtProps) {
  const [asciiLines, setAsciiLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const generateAscii = useCallback(async () => {
    setLoading(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = AVATAR_URL;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Portrait aspect ratio ~3:4, multiply height by 0.55 to compensate for character aspect ratio
    const aspectRatio = 4 / 3;
    const height = Math.floor(width * aspectRatio * 0.55);

    canvas.width = width;
    canvas.height = height;

    // Draw image
    ctx.drawImage(img, 0, 0, width, height);

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    // Convert to ASCII
    const lines: string[] = [];
    for (let y = 0; y < height; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Calculate luminance
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        // Map luminance to character (inverted: dark pixels get dense chars)
        const charIndex = Math.floor(
          (luminance / 255) * (CHAR_RAMP.length - 1)
        );
        line += CHAR_RAMP[CHAR_RAMP.length - 1 - charIndex];
      }
      lines.push(line);
    }

    setAsciiLines(lines);
    setLoading(false);
  }, [width]);

  useEffect(() => {
    generateAscii();
  }, [generateAscii]);

  if (loading) {
    return (
      <div
        className={`font-mono text-[8px] leading-[10px] text-gray-400 select-none ${className}`}
      >
        loading...
      </div>
    );
  }

  return (
    <div
      className={`font-mono leading-none whitespace-pre select-none ${className}`}
      style={{ fontSize: '6px', lineHeight: '6px', letterSpacing: '0.5px' }}
    >
      {asciiLines.map((line, i) => (
        <div key={i} className="text-ink dark:text-ink">
          {line}
        </div>
      ))}
    </div>
  );
}
