import React from 'react';
import { logTelemetry } from '../lib/telemetry';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { Link } from 'react-router-dom';

export default function MicroAppBanner({
  title = "Free NDA Generator",
  description = "Protect your intellectual property instantly. Generate a secure, legally-formatted mutual NDA in seconds.",
  buttonText = "Start Generator",
  appUrl = "/tools/nda-generator"
}) {
  const isExternal = appUrl.startsWith('http');

  const handleClick = () => {
    logTelemetry('micro_app_cross_promo_click', { target: appUrl });
  };

  const ButtonContent = (
    <>
      {buttonText} <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-2 w-4 h-4" />
    </>
  );

  const buttonClasses = "shrink-0 inline-flex items-center justify-center py-3 px-6 bg-axim-purple text-white hover:bg-white hover:text-black text-xs font-black uppercase tracking-widest transition-all rounded-sm shadow-[0_0_15px_rgba(147,51,234,0.3)]";

  return (
    <div className="w-full my-12 bg-gradient-to-r from-axim-purple/10 to-transparent border border-white/10 rounded-sm p-6 relative overflow-hidden group hover:border-axim-purple/30 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-axim-purple/5 blur-[50px] pointer-events-none group-hover:bg-axim-purple/10 transition-all duration-500" />

      <div className="relative z-10 flex items-start gap-4 flex-grow">
        <div className="w-12 h-12 shrink-0 bg-axim-purple/20 border border-axim-purple flex items-center justify-center rounded-sm">
          <SafeIcon icon={LuIcons.LuFileText} className="w-6 h-6 text-axim-purple" />
        </div>
        <div>
          <h4 className="text-lg font-black text-white uppercase tracking-widest mb-1">{title}</h4>
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">{description}</p>
        </div>
      </div>

      <div className="relative z-10 w-full md:w-auto flex justify-start md:justify-end">
        {isExternal ? (
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={buttonClasses}
          >
            {ButtonContent}
          </a>
        ) : (
          <Link
            to={appUrl}
            onClick={handleClick}
            className={buttonClasses}
          >
            {ButtonContent}
          </Link>
        )}
      </div>
    </div>
  );
}
