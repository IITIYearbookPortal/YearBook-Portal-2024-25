import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from "lucide-react";
import "./ImageLightbox.css";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

function ImageLightbox({
  images = [],
  initialIndex = 0,
  caption = "",
  onClose,
}) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [imgError, setImgError] = useState(false);

  const dragOriginRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const viewportRef = useRef(null);

  const total = images.length;
  const currentSrc = images[index];

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setImgError(false);
    resetView();
    setIndex((i) => (i - 1 + total) % total);
  }, [total, resetView]);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setImgError(false);
    resetView();
    setIndex((i) => (i + 1) % total);
  }, [total, resetView]);

  const adjustZoom = useCallback((delta) => {
    setZoom((prev) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(prev + delta).toFixed(2)));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  useEffect(() => {
    setIndex(initialIndex);
    setImgError(false);
    resetView();
  }, [initialIndex, resetView]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "+" || e.key === "=") {
        adjustZoom(ZOOM_STEP);
      } else if (e.key === "-") {
        adjustZoom(-ZOOM_STEP);
      } else if (e.key === "0") {
        resetView();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onClose, goPrev, goNext, adjustZoom, resetView]);

  const handleWheel = (e) => {
    e.preventDefault();
    if (!e.deltaY) return;
    const step = Math.max(-0.08, Math.min(0.08, -e.deltaY * 0.0008));
    adjustZoom(step);
  };

  const handlePointerDown = (e) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setDragging(true);
    dragOriginRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handlePointerMove = (e) => {
    if (!dragging || zoom <= 1) return;
    const dx = e.clientX - dragOriginRef.current.x;
    const dy = e.clientY - dragOriginRef.current.y;
    const limit = 420 * (zoom - 1);
    setPan({
      x: Math.max(-limit, Math.min(limit, panStartRef.current.x + dx)),
      y: Math.max(-limit, Math.min(limit, panStartRef.current.y + dy)),
    });
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (zoom > 1) {
      resetView();
    } else {
      setZoom(2);
    }
  };

  if (!total) return null;

  return ReactDOM.createPortal(
    <div
      className="ilb-root"
      role="dialog"
      aria-modal="true"
      aria-label="Full memory image viewer"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Toolbar */}
      <div className="ilb-toolbar">
        <div className="ilb-meta">
          {caption && <span className="ilb-caption">{caption}</span>}
          {total > 1 && (
            <span className="ilb-counter">
              {index + 1} / {total}
            </span>
          )}
        </div>

        <div className="ilb-controls">
          {zoom > 1 && (
            <button
              type="button"
              className="ilb-btn"
              onClick={resetView}
              title="Reset zoom (0)"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            className="ilb-btn"
            onClick={() => adjustZoom(-ZOOM_STEP)}
            disabled={zoom <= MIN_ZOOM}
            title="Zoom out (-)"
            aria-label="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="ilb-zoom-readout">{Math.round(zoom * 100)}%</span>

          <button
            type="button"
            className="ilb-btn"
            onClick={() => adjustZoom(ZOOM_STEP)}
            disabled={zoom >= MAX_ZOOM}
            title="Zoom in (+)"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="ilb-divider" />

          <button
            type="button"
            className="ilb-btn ilb-close"
            onClick={onClose}
            title="Close (Esc)"
            aria-label="Close image viewer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div
        ref={viewportRef}
        className={`ilb-stage ${zoom > 1 ? (dragging ? "grabbing" : "grab") : ""}`}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {total > 1 && (
          <button
            type="button"
            className="ilb-nav ilb-prev"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {imgError ? (
          <div className="ilb-error">Image could not be loaded</div>
        ) : (
          <img
            src={currentSrc}
            alt={`Memory ${index + 1}`}
            draggable={false}
            onDoubleClick={handleDoubleClick}
            onError={() => setImgError(true)}
            className="ilb-img"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transition: dragging ? "none" : "transform 160ms ease-out",
            }}
          />
        )}

        {total > 1 && (
          <button
            type="button"
            className="ilb-nav ilb-next"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail Strip + Hint */}
      <div className="ilb-bottom">
        {total > 1 && (
          <div className="ilb-thumbs">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setImgError(false);
                  resetView();
                  setIndex(i);
                }}
                className={`ilb-thumb ${i === index ? "active" : ""}`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}
        <p className="ilb-hint">
          Scroll or double-click to zoom{zoom > 1 ? " · Drag to pan" : ""}
        </p>
      </div>
    </div>,
    document.body,
  );
}

export default ImageLightbox;
