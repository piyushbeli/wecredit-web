/**
 * Floating Toggle Button Component
 * Draggable button to open feature flag panel
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useDevPanel } from '@/hooks/use-feature-flag';
import { useFeatureFlagStore } from '@/stores/feature-flag-store';

/**
 * Floating toggle button for feature flags panel
 * Only visible in development mode
 */
export function FloatingToggleButton() {
  const { togglePanel, isDevMode } = useDevPanel();
  const flags = useFeatureFlagStore((state) => state.flags);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Count active flags
  const activeFlagsCount = Object.values(flags).filter(Boolean).length;

  // Initialize position (bottom-right corner)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPosition({
        x: window.innerWidth - 80,
        y: window.innerHeight - 80,
      });
    }
  }, []);

  // Handle mouse down (start drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  };

  // Handle mouse move (dragging)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Keep button within viewport
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;

      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart]);

  // Don't render in production
  if (!isDevMode) {
    return null;
  }

  return (
    <button
      ref={buttonRef}
      onClick={(e) => {
        // Only toggle if not dragging
        if (!isDragging) {
          togglePanel();
        }
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className="fixed z-9999 w-14 h-14 bg-linear-to-br from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-white font-bold text-lg cursor-move active:scale-95"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
      }}
      title="Feature Flags (Ctrl+Shift+F)"
    >
      <span className="relative">
        🚩
        {activeFlagsCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {activeFlagsCount}
          </span>
        )}
      </span>
    </button>
  );
}
