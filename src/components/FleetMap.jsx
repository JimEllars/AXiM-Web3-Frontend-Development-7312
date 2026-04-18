import React, { useEffect, useRef, useState } from 'react';

export default function FleetMap() {
  const canvasRef = useRef(null);
  const [nodeStatuses, setNodeStatuses] = useState({
    nda: 'ok',
    demand: 'error',
    stub: 'ok',
    core: 'ok'
  });

  // Simulate telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setNodeStatuses(prev => ({
        ...prev,
        demand: Math.random() > 0.8 ? 'error' : 'ok',
        nda: Math.random() > 0.9 ? 'error' : 'ok',
        stub: Math.random() > 0.95 ? 'error' : 'ok',
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
        const status = nodeStatusesRef.current[node.id];
        const pulseColor = status === 'ok' ? 'rgba(0, 229, 255, 0.8)' : 'rgba(255, 50, 50, 0.8)'; // Teal or Red

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
        } else {
          const status = nodeStatusesRef.current[node.id];
          ctx.fillStyle = status === 'ok' ? '#00E5FF' : '#FF3232';
          ctx.shadowColor = status === 'ok' ? '#00E5FF' : '#FF3232';
        }

        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

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
