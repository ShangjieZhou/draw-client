import { useState, useRef, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

/**
 * Draw a line between two points using Bresenham's algorithm with variable line width
 * @param ctx Canvas rendering context
 * @param x1 Starting point x coordinate
 * @param y1 Starting point y coordinate
 * @param x2 Ending point x coordinate
 * @param y2 Ending point y coordinate
 * @param lineWidth Width of the line to draw
 */
function drawLineBresenham(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  lineWidth: number = 1
) {
  // Ensure we're working with integers
  x1 = Math.round(x1);
  y1 = Math.round(y1);
  x2 = Math.round(x2);
  y2 = Math.round(y2);

  // Calculate deltas
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);

  // Determine direction of movement
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;

  // Initialize error
  let err = dx - dy;

  // Calculate half the line width for offset
  const halfWidth = Math.floor(lineWidth / 2);

  // Continue until we reach the end point
  while (x1 !== x2 || y1 !== y2) {
    // Draw a circle or rectangle at the current point to create width
    if (lineWidth === 1) {
      ctx.fillRect(x1, y1, 1, 1);
    } else {
      ctx.beginPath();
      ctx.arc(x1, y1, halfWidth, 0, Math.PI * 2);
      ctx.fill();
    }

    // Calculate next point
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }

  // Add the end point
  if (lineWidth === 1) {
    ctx.fillRect(x2, y2, 1, 1);
  } else {
    ctx.beginPath();
    ctx.arc(x2, y2, halfWidth, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function SketchPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevCoords = useRef<{ x: number; y: number } | null>(null);
  const { emitEvent } = useSocket();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up drawing style
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    const getMousePos = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const startDrawing = (event: PointerEvent) => {
      const currentCoords = getMousePos(event);
      prevCoords.current = currentCoords;
    };

    const draw = (event: MouseEvent) => {
      if (!prevCoords.current) return;
      const pos = getMousePos(event);
      drawLineBresenham(ctx, prevCoords.current.x, prevCoords.current.y, pos.x, pos.y, 2);
      prevCoords.current = pos;
      emitEvent({
        eventName: 'draw',
        data: {
          x: pos.x,
          y: pos.y,
        },
      });
    };

    const stopDrawing = () => {
      prevCoords.current = null;
      ctx.closePath();
    };

    window.addEventListener('mousemove', draw);

    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointerleave', stopDrawing);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('pointerdown', startDrawing);
      canvas.removeEventListener('pointermove', draw);
      canvas.removeEventListener('pointerup', stopDrawing);
      canvas.removeEventListener('pointerleave', stopDrawing);
    };
  }, []);

  return (
    <div className="w-full h-full border-2 border-gray-300 rounded-md">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
