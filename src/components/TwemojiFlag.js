import twemoji from 'twemoji';
import React, { useEffect, useRef } from 'react';

export default function TwemojiFlag({ emoji, size = 24, className = "" }) {
    // We need to parse the emoji to get the image URL
    // twemoji.parse returns a string of HTML, we need to extract the src
    const parsed = twemoji.parse(emoji, {
        folder: 'svg',
        ext: '.svg',
        base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/'
    });

    // Extract the img src from parsed HTML
    // The output is typically <img class="emoji" draggable="false" alt="🇫🇷" src="...">
    const srcMatch = parsed.match(/src="([^"]+)"/);
    const src = srcMatch ? srcMatch[1] : null;

    if (!src) return <span style={{ fontSize: size }}>{emoji}</span>;

    return (
        <img
            src={src}
            alt={emoji}
            width={size}
            height={size}
            className={`inline-block ${className}`}
            style={{ width: size, height: size }}
        />
    );
}
