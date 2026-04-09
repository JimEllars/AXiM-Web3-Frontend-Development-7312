import React from 'react';
import SafeIcon from '../common/SafeIcon';

export default function InfoPanel({ icon, iconColor, title, children }) {
  return (
    <div className="bg-glass border border-subtle p-10">
      <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
        <SafeIcon icon={icon} className={iconColor} /> {title}
      </h3>
      {children}
    </div>
  );
}