import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TelemetryBar({ label, color, initialValue }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => {
        const diff = Math.floor(Math.random() * 5) - 2;
        const next = prev + diff;
        return Math.min(100, Math.max(0, next));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const colorClass = color === 'axim-teal' ? 'text-axim-teal bg-axim-teal shadow-[0_0_10px_#00E5FF]' :
                     color === 'axim-gold' ? 'text-axim-gold bg-axim-gold shadow-[0_0_10px_#FFEA00]' :
                     'text-axim-green bg-axim-green shadow-[0_0_10px_#00FF88]';

  const textColor = color === 'axim-teal' ? 'text-axim-teal' :
                    color === 'axim-gold' ? 'text-axim-gold' :
                    'text-axim-green';

  return (
    <div>
      <div className="flex justify-between text-[0.6rem] mb-2 uppercase">
        <span>{label}</span>
        <span className={textColor}>{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: `${initialValue}%` }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`h-full ${colorClass.split(' ')[1]} ${colorClass.split(' ')[2]}`}
        />
      </div>
    </div>
  );
}
