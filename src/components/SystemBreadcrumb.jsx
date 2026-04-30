import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuChevronRight } = LuIcons;

export default function SystemBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  const breadcrumbs = [
    { name: 'AXM_CORE', path: '/dashboard' },
    ...pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      return { name: value.toUpperCase(), path: to };
    })
  ];

  return (
    <div className="w-full bg-black/60 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-2 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-widest text-zinc-500 z-40 relative mt-20">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <React.Fragment key={crumb.path}>
            {isLast ? (
              <span className="text-axim-teal drop-shadow-[0_0_8px_#2dd4bf]">{crumb.name}</span>
            ) : (
              <>
                <Link to={crumb.path} className="hover:text-white transition-colors">{crumb.name}</Link>
                <SafeIcon icon={LuChevronRight} className="w-3 h-3 text-zinc-700" />
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
