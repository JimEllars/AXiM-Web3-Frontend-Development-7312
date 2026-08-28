import React from 'react';
import { logTelemetry } from '../lib/telemetry';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function AffiliateTable({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product, index) => {
        const isTop = product.isTopChoice;
        return (
          <div
            key={index}
            className={`relative flex flex-col p-6 rounded-sm bg-[#050505] shadow-xl ${isTop ? 'border border-axim-gold shadow-[0_0_20px_rgba(240,255,0,0.15)]' : 'border border-white/10'}`}
          >
            {isTop && (
              <div className="absolute -top-3 left-6 px-3 py-1 bg-axim-gold text-black text-[10px] font-black uppercase tracking-widest rounded-sm shadow-md flex items-center gap-2">
                <SafeIcon icon={LuIcons.LuStar} className="w-3 h-3" />
                Top Choice
              </div>
            )}

            <div className={`mt-${isTop ? '4' : '0'} flex-grow`}>
              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">{product.name}</h3>
              <p className="text-sm text-zinc-400 mb-6">{product.description}</p>

              {product.features && product.features.length > 0 && (
                <ul className="space-y-2 mb-8">
                  {product.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-xs text-zinc-300">
                      <SafeIcon icon={LuIcons.LuCheck} className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-auto">
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logTelemetry('affiliate_outbound_click', { product: product.name })}
                className={`flex items-center justify-center w-full py-3 px-4 text-xs font-black uppercase tracking-widest transition-all rounded-sm shadow-lg ${isTop ? 'bg-axim-gold text-black hover:bg-white hover:text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                Get Started <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
