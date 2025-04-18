'use client';

import { useEffect, useRef } from 'react';

interface StatusChartProps {
  unsuitable: number;
  interviewed: number;
}

export default function StatusChart({
  unsuitable,
  interviewed,
}: StatusChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Calculate total and angles
    const total = unsuitable + interviewed;
    const interviewedAngle = (interviewed / total) * 2 * Math.PI;

    // Center and radius
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const innerRadius = radius * 0.7;

    // Draw background track
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#EEF2FF'; // Light indigo color
    ctx.fill();

    // Draw inner circle (empty space)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draw interviewed segment
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX,
      centerY,
      radius,
      -Math.PI / 2,
      -Math.PI / 2 + interviewedAngle,
    );
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = '#4F46E5'; // Indigo color
    ctx.fill();

    // Draw legend
    const legendX = centerX + radius + 20;
    const legendY = centerY - 20;

    // Unsuitable legend
    ctx.fillStyle = '#EEF2FF';
    ctx.fillRect(legendX, legendY - 15, 12, 12);
    ctx.fillStyle = '#6B7280';
    ctx.font = '14px sans-serif';
    ctx.fillText(`${unsuitable}%`, legendX + 20, legendY - 5);
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px sans-serif';
    ctx.fillText('Unsuitable', legendX + 20, legendY + 10);

    // Interviewed legend
    ctx.fillStyle = '#4F46E5';
    ctx.fillRect(legendX, legendY + 25, 12, 12);
    ctx.fillStyle = '#6B7280';
    ctx.font = '14px sans-serif';
    ctx.fillText(`${interviewed}%`, legendX + 20, legendY + 35);
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px sans-serif';
    ctx.fillText('Interviewed', legendX + 20, legendY + 50);
  }, [unsuitable, interviewed]);

  return (
    <div className="relative h-48 w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
