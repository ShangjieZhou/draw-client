import { useState, useRef, useEffect } from "react";

export default function SketchPad() {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (event: MouseEvent) => {
    console.log("draw", event);
  };

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
    window.addEventListener("resize", resizeCanvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up drawing style
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    const getMousePos = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const startDrawing = (event: PointerEvent) => {
      console.log("startDrawing", event);
      const pos = getMousePos(event);
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (event: MouseEvent) => {
      console.log(isDrawing);
      //   if (!isDrawing) return;
      const pos = getMousePos(event);
      console.log("drawing", pos);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      ctx.closePath();
    };

    window.addEventListener("mousemove", draw);

    console.log("adding event listeners");

    canvas.addEventListener("pointerdown", startDrawing);
    canvas.addEventListener("pointermove", draw);
    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointerleave", stopDrawing);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("pointerdown", startDrawing);
      canvas.removeEventListener("pointermove", draw);
      canvas.removeEventListener("pointerup", stopDrawing);
      canvas.removeEventListener("pointerleave", stopDrawing);
    };
  }, []);

  return (
    <div className="w-full h-full border-2 border-gray-300 rounded-md">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
