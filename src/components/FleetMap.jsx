import React, { useEffect, useRef } from 'react';
import { useFleetTelemetry } from '../hooks/useFleetTelemetry';

export default function FleetMap() {
  const canvasRef = useRef(null);
  const { nodeStatuses } = useFleetTelemetry();

  const nodeStatusesRef = useRef(nodeStatuses);
  useEffect(() => {
    nodeStatusesRef.current = nodeStatuses;
  }, [nodeStatuses]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let time = 0;

    const render = () => {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const nodes = [
        { id: 'core', x: cx, y: cy, label: 'AXiM Core' },
        { id: 'nda', x: cx - 120, y: cy - 80, label: 'NDA Gen' },
        { id: 'demand', x: cx + 120, y: cy - 80, label: 'Demand Gen' },
        { id: 'stub', x: cx, y: cy + 120, label: 'Pay Stub Gen' },
      ];

      // Draw connections
      nodes.forEach(node => {
        if (node.id === 'core') return;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw pulses
        const status = nodeStatusesRef.current[node.id] || 'offline';
        let pulseColor = 'rgba(0, 229, 255, 0.8)'; // default operational

        if (status === 'degraded') {
          pulseColor = 'rgba(255, 165, 0, 0.8)'; // Orange
        } else if (status === 'offline') {
          pulseColor = 'rgba(255, 50, 50, 0.4)'; // Red, reduced opacity
        }

        const pulsePos = (Math.sin(time + node.x) + 1) / 2; // 0 to 1
        const px = cx + (node.x - cx) * pulsePos;
        const py = cy + (node.y - cy) * pulsePos;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = pulseColor;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = pulseColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.id === 'core' ? 8 : 5, 0, Math.PI * 2);

        if (node.id === 'core') {
          ctx.fillStyle = '#FFEA00'; // Gold
          ctx.shadowColor = '#FFEA00';
          ctx.globalAlpha = 1;
        } else {
          const status = nodeStatusesRef.current[node.id] || 'offline';
          if (status === 'operational') {
            ctx.fillStyle = '#00E5FF';
            ctx.shadowColor = '#00E5FF';
            ctx.globalAlpha = 1;
          } else if (status === 'degraded') {
            ctx.fillStyle = '#FFA500'; // Orange
            ctx.shadowColor = '#FFA500';
            ctx.globalAlpha = 1;
          } else {
            // offline
            ctx.fillStyle = '#FF3232';
            ctx.shadowColor = '#FF3232';
            // Node is offline, pulse Red with reduced opacity
            ctx.globalAlpha = 0.5 + (Math.sin(time * 2) * 0.2);
          }
        }

        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1; // reset alpha for labels

        // Draw Labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + (node.id === 'core' ? 20 : 15));
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full flex justify-center p-4">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border border-white/10 bg-[#050505]/50 rounded-sm"
      />
    </div>
  );
}
