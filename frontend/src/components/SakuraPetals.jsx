import React from 'react';

const FLOATING_ITEMS = [
  { id: 1, type: 'flower', top: '12%', left: '19%', size: 22, delay: '0s', duration: '8s', opacity: 0.72 },
  { id: 2, type: 'flower', top: '26%', left: '33%', size: 26, delay: '1.4s', duration: '9.5s', opacity: 0.65 },
  { id: 3, type: 'petal', top: '20%', left: '58%', size: 16, delay: '0.6s', duration: '7s', opacity: 0.8, rotate: 35 },
  { id: 4, type: 'petal', top: '64%', left: '29%', size: 15, delay: '2.1s', duration: '8.5s', opacity: 0.75, rotate: -25 },
  { id: 5, type: 'petal', top: '76%', left: '40%', size: 13, delay: '1.1s', duration: '6.8s', opacity: 0.7, rotate: 80 },
  { id: 6, type: 'flower', top: '16%', left: '84%', size: 24, delay: '2.6s', duration: '10s', opacity: 0.5 },
  { id: 7, type: 'petal', top: '82%', left: '76%', size: 14, delay: '0.3s', duration: '7.6s', opacity: 0.72, rotate: 45 },
  { id: 8, type: 'petal', top: '86%', left: '94%', size: 18, delay: '1.9s', duration: '9s', opacity: 0.65, rotate: -40 },
  { id: 9, type: 'petal', top: '42%', left: '8%', size: 14, delay: '2.9s', duration: '8.2s', opacity: 0.55, rotate: 20 },
];

export default function SakuraPetals({ density = 'normal' }) {
  const items = density === 'subtle' ? FLOATING_ITEMS.slice(0, 5) : FLOATING_ITEMS;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10" aria-hidden="true">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute animate-petal-float"
          style={{
            top: item.top,
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
            opacity: item.opacity,
          }}
        >
          {item.type === 'flower' ? (
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="#F6E6E2">
                <ellipse cx="16" cy="7" rx="3.4" ry="6.2" />
                <ellipse cx="16" cy="7" rx="3.4" ry="6.2" transform="rotate(72 16 16)" />
                <ellipse cx="16" cy="7" rx="3.4" ry="6.2" transform="rotate(144 16 16)" />
                <ellipse cx="16" cy="7" rx="3.4" ry="6.2" transform="rotate(216 16 16)" />
                <ellipse cx="16" cy="7" rx="3.4" ry="6.2" transform="rotate(288 16 16)" />
              </g>
              <circle cx="16" cy="16" r="2.3" fill="#D9A7A0" />
            </svg>
          ) : (
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 24 24"
              fill="none"
              style={{ transform: `rotate(${item.rotate || 0}deg)` }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C16.5 6.5 18 13.5 12 21C6 13.5 7.5 6.5 12 2Z"
                fill="#F7EAE6"
                fillOpacity="0.92"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
