'use client';

import React from 'react';

export default function AnimatedLightningLogo({ className = "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" }: { className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transition-transform duration-300 group-hover:scale-110"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="lightningGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef2f2" />
            <stop offset="50%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#lightningGradient)"
          className="animate-pulse"
          opacity="0.8"
        />
        
        {/* Main lightning bolt with animation */}
        <path
          d="M35 25 L65 25 L55 45 L75 45 L45 75 L55 55 L35 55 Z"
          fill="url(#lightningGradient2)"
          filter="url(#glow)"
          className="animate-lightning-bolt"
        />
        
        {/* Secondary lightning effect */}
        <path
          d="M40 30 L60 30 L52 45 L68 45 L48 70 L55 55 L40 55 Z"
          fill="white"
          opacity="0.6"
          className="animate-lightning-bolt"
          style={{
            animationDelay: '0.5s'
          }}
        />
        
        {/* Electric sparks */}
        <circle
          cx="30"
          cy="35"
          r="2"
          fill="white"
          opacity="0.8"
          className="animate-sparkle"
        />
        <circle
          cx="70"
          cy="40"
          r="1.5"
          fill="white"
          opacity="0.6"
          className="animate-sparkle"
          style={{
            animationDelay: '0.3s'
          }}
        />
        <circle
          cx="25"
          cy="60"
          r="1"
          fill="white"
          opacity="0.7"
          className="animate-sparkle"
          style={{
            animationDelay: '0.7s'
          }}
        />
        <circle
          cx="75"
          cy="65"
          r="1.5"
          fill="white"
          opacity="0.5"
          className="animate-sparkle"
          style={{
            animationDelay: '0.9s'
          }}
        />
      </svg>
    </div>
  );
}
