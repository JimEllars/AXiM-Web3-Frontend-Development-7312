import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import * as LuIcons from 'react-icons/lu';
import { logTelemetry } from '../lib/telemetry';
import SafeIcon from '../common/SafeIcon';

const { LuChevronRight } = LuIcons;

export default function SystemBreadcrumb() {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isExternalTrackingActive = queryParams.has('via') || queryParams.has('utm_source');

  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || isExternalTrackingActive) return null;


  const breadcrumbs = [
    { name: 'AXM_CORE', path: '/dashboard' },
    ...pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      return { name: (value || 'UNKNOWN').toUpperCase(), path: to };
    }).filter(crumb => crumb.name !== 'UNKNOWN' && crumb.name.trim() !== '')
  ];

  return (
    <div className="w-full bg-black/60 backdrop-blur-md border-b border-white/10 px-6 md:px-12 py-2 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-widest text-zinc-500 z-40 relative mt-20">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <React.Fragment key={crumb.path}>
            {isLast ? (
              <span className="text-axim-purple drop-shadow-[0_0_8px_#7D00FF]">{crumb.name}</span>
            ) : (
              <>
                <Link to={crumb.path} className="hover:text-white transition-colors" onClick={() => {
                  logTelemetry('breadcrumb_nav_click', { path: crumb.path, name: crumb.name });
                }}>{crumb.name}</Link>
                <SafeIcon icon={LuChevronRight} className="w-3 h-3 text-zinc-700" />
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
