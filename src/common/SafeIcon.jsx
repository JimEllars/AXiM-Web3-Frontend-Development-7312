import React from 'react';
import * as LuIcons from 'react-icons/lu';
import * as FiIcons from 'react-icons/fi';
import { FiAlertTriangle } from 'react-icons/fi';

const SafeIcon = ({ icon: IconComponent, name, ...props }) => {
  // If an icon component is passed directly, use it
  if (IconComponent) {
    return <IconComponent {...props} />;
  }

  // If a name is passed, try to find it in supported libraries
  if (name) {
    try {
      const Icon = LuIcons[name] || FiIcons[name];
      if (Icon) return <Icon {...props} />;
    } catch (e) { /* ignore */ }
  }

  // Fallback to alert icon
  return <FiAlertTriangle {...props} />;
};

export default SafeIcon;