/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  index?: number;
  onIndexChange?: (idx: number) => void;
  aspectClassName?: string; // e.g. 'aspect-[4/5]' — omit for 'h-full' fill mode
  rounded?: string; // tailwind rounding class
  onImageClick?: (url: string, idx: number) => void;
  showDots?: boolean;
  showCounter?: boolean;
  showArrows?: boolean;
  className?: string;
  imgClassName?: string;
  alt?: string;
  /** 'cover' crops to fill aspectClassName (default, used by cropper/preview UI).
   *  'contain' never crops — the image keeps its natural aspect ratio and is
   *  letterboxed within a capped height. Use for feed post images. */
  fit?: 'cover' | 'contain';
  /** Max height applied when fit === 'contain'. Defaults to 400px per feed spec. */
  maxHeight?: string;
}

/**
 * A calm, Instagram-style swipeable image carousel.
 * One image visible at a time. The container never causes page scroll —
 * only the internal track slides. Supports touch swipe, mouse drag, and
 * desktop arrow buttons.
 */
export function ImageCarousel({
  images,
  index,
  onIndexChange,
  aspectClassName = 'aspect-[4/5]',
  rounded = 'rounded-2xl',
  onImageClick,
  showDots = true,
  showCounter = false,
  showArrows = true,
  className = '',
  imgClassName = '',
  alt = 'Attachment',
  fit = 'cover',
  maxHeight = '400px'
}: ImageCarouselProps) {
  const isControlled = index !== undefined;
  const [internalIdx, setInternalIdx] = useState(0);
  const activeIdx = isControlled ? (index as number) : internalIdx;

  const setIdx = (i: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, i));
    if (!isControlled) setInternalIdx(clamped);
    onIndexChange?.(clamped);
  };

  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; dragging: boolean; moved: boolean }>({
    startX: 0,
    dragging: false,
    moved: false
  });
  const [dragOffset, setDragOffset] = useState(0);

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className={`relative w-full flex justify-center overflow-hidden ${rounded} ${className}`}>
        <img
          src={images[0]}
          alt={alt}
          className={`w-full h-auto max-h-[500px] object-contain cursor-zoom-in ${rounded} ${imgClassName}`}
          onClick={() => onImageClick?.(images[0], 0)}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  const single = false;

  const onPointerDown = (e: React.PointerEvent) => {
    if (single) return;
    dragState.current = { startX: e.clientX, dragging: true, moved: false };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 4) dragState.current.moved = true;
    setDragOffset(delta);
  };

  const endDrag = () => {
    if (!dragState.current.dragging) return;
    const width = trackRef.current?.clientWidth || 1;
    const threshold = width * 0.18;
    if (dragOffset < -threshold && activeIdx < images.length - 1) {
      setIdx(activeIdx + 1);
    } else if (dragOffset > threshold && activeIdx > 0) {
      setIdx(activeIdx - 1);
    }
    dragState.current.dragging = false;
    setDragOffset(0);
  };

  const handleImgClick = (e: React.MouseEvent, url: string) => {
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }
    onImageClick?.(url, activeIdx);
  };

  return (
    <div className={`relative select-none ${className}`}>
      <div
        ref={trackRef}
        className={`relative w-full overflow-hidden ${rounded} ${fit === 'contain' ? 'border-0 bg-transparent h-auto' : 'border border-[var(--border-color)] bg-[var(--bg-surface-2)] ' + aspectClassName} touch-pan-y`}
        style={fit === 'contain' ? { maxHeight } : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={`flex ${fit === 'contain' ? 'items-center' : 'h-full'}`}
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(calc(${-activeIdx * (100 / images.length)}% + ${dragOffset}px))`,
            transition: dragState.current.dragging ? 'none' : 'transform 280ms cubic-bezier(0.22,1,0.36,1)'
          }}
        >
          {images.map((url, i) => (
            <div
              key={i}
              className={`shrink-0 cursor-zoom-in ${fit === 'contain' ? 'h-auto' : 'h-full'}`}
              style={{ width: `${100 / images.length}%` }}
              onClick={(e) => handleImgClick(e, url)}
            >
              <img
                src={url}
                alt={`${alt} ${i + 1}`}
                className={`w-full ${fit === 'contain' ? 'h-auto object-contain' : 'h-full object-cover'} ${imgClassName}`}
                style={fit === 'contain' ? { maxHeight } : undefined}
                referrerPolicy="no-referrer"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Desktop arrows */}
        {showArrows && !single && (
          <>
            {activeIdx > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(activeIdx - 1);
                }}
                className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white items-center justify-center cursor-pointer transition-all z-10"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
            )}
            {activeIdx < images.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(activeIdx + 1);
                }}
                className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white items-center justify-center cursor-pointer transition-all z-10"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            )}
          </>
        )}

        {/* Counter badge e.g. 1 / 5 */}
        {showCounter && !single && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-full z-10">
            {activeIdx + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Pagination dots */}
      {showDots && !single && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`rounded-full transition-all cursor-pointer ${
                i === activeIdx ? 'w-4 h-1.5 bg-[var(--brand-blue)]' : 'w-1.5 h-1.5 bg-gray-400/50 hover:bg-gray-400/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
