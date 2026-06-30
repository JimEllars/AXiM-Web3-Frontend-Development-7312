import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { generateHandoffLink } from '../lib/auth-handoff.js';

export default function ProfileMenuButton({ icon, label, danger, onClick, userSession, ...props }) {
  const baseClasses = "w-full flex items-center gap-3 p-3 text-[0.65rem] font-mono uppercase transition-all";
  const colors = danger
    ? "text-red-500 hover:bg-red-500/5"
    : "text-zinc-400 hover:text-white hover:bg-white/5";

  return (
    <>
      <button className={`${baseClasses} ${colors}`} onClick={onClick} {...props}>
        <SafeIcon icon={icon} /> {label}
      </button>

      {label === 'Admin Registry' && (
        <a
          href={generateHandoffLink('agentview', userSession?.access_token)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClasses} text-zinc-400 hover:text-white hover:bg-white/5`}
        >
          <SafeIcon icon={LuIcons.LuExternalLink} /> AgentView Portal
        </a>
      )}
    </>
  );
}
