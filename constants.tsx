
import React from 'react';

export const CLUB_NAME = "Invest Club HSE SPB";
export const MASCOT_COLOR = "#1e3a8a";

export const WhaleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 10c-2 0-3.5 1.5-3.5 1.5l-1.5 1.5L14 10l-4 4-3-3L2 16h20v-6z" />
    <path d="M7 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path d="M12 20c4.418 0 8-1.79 8-4 0-1-4-2-8-2s-8 1-8 2c0 2.21 3.582 4 8 4z" />
  </svg>
);

export const WavesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    className={className}
  >
    <path d="M2 12s3-4 5-4 5 4 5 4 5-4 7-4" />
    <path d="M2 16s3-4 5-4 5 4 5 4 5-4 7-4" />
    <path d="M2 20s3-4 5-4 5 4 5 4 5-4 7-4" />
  </svg>
);
