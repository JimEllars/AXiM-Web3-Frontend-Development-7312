import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../../store/useAximStore';
import { useAximAuth } from '../../hooks/useAximAuth';

const { LuWebhook } = LuIcons;

const mockNodes = [
  { integration: 'Make.com Webhooks', status: 'Active', type: 'Lead Routing', protocol: 'REST/POST' },
  { integration: 'Chatbase Edge AI', status: 'Active', type: 'LLM Service', protocol: 'Widget Injection' },
  { integration: 'SellDone Marketplace', status: 'Pending', type: 'E-Commerce', protocol: 'OAuth/SSO' },
  { integration: 'Nexus CRM', status: 'Active', type: 'Pipeline', protocol: 'Internal JWT' },
  { integration: 'Thirdweb RPC', status: 'Active', type: 'Web3 Auth', protocol: 'Arbitrum One' }
];

export default function EcosystemRegistry() {
  const userSession = useAximStore((state) => state.userSession);
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const walletAddress = useAximStore((state) => state.walletAddress);
  const isTelemetryPolling = useAximStore((state) => state.isTelemetryPolling);
  const showToast = useAximStore((state) => state.showToast);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-axim-purple/10 border border-axim-purple/30 flex items-center justify-center rounded-sm text-axim-purple">
          <SafeIcon icon={LuWebhook} className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-black uppercase text-white tracking-widest">Ecosystem Registry Vault</h3>
      </div>

      {/* Node Observability Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 font-mono text-xs">
        <div className="bg-[#050505] border border-white/10 p-4 rounded-sm flex flex-col items-center justify-center text-center group hover:border-white/30 transition-colors">
          <span className="text-zinc-500 mb-1">WP-PROXY</span>
          <span className="text-emerald-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> ONLINE
          </span>
        </div>
        <div className="bg-[#050505] border border-white/10 p-4 rounded-sm flex flex-col items-center justify-center text-center group hover:border-white/30 transition-colors">
          <span className="text-zinc-500 mb-1">TELEMETRY</span>
          <span className={isTelemetryPolling ? "text-emerald-400 flex items-center gap-2" : "text-amber-400 flex items-center gap-2"}>
            <span className={`w-1.5 h-1.5 rounded-full ${isTelemetryPolling ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            {isTelemetryPolling ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>
        <div className="bg-[#050505] border border-white/10 p-4 rounded-sm flex flex-col items-center justify-center text-center group hover:border-white/30 transition-colors">
          <span className="text-zinc-500 mb-1">RPC (WEB3)</span>
          <span className={isWeb3Authenticated ? "text-emerald-400 flex items-center gap-2" : "text-zinc-400 flex items-center gap-2"}>
            <span className={`w-1.5 h-1.5 rounded-full ${isWeb3Authenticated ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-400'}`}></span>
            {isWeb3Authenticated ? 'CONNECTED' : 'STANDBY'}
          </span>
        </div>
        <div className="bg-[#050505] border border-white/10 p-4 rounded-sm flex flex-col items-center justify-center text-center group hover:border-white/30 transition-colors">
          <span className="text-zinc-500 mb-1">SEO</span>
          <span className="text-emerald-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> ONLINE
          </span>
        </div>
        <div className="bg-[#050505] border border-white/10 p-4 rounded-sm flex flex-col items-center justify-center text-center group hover:border-white/30 transition-colors">
          <span className="text-zinc-500 mb-1">SESSION</span>
          <span className="text-axim-purple flex items-center gap-2">
            {isWeb3Authenticated && walletAddress ? `0x...${walletAddress.slice(-4)}` : (userSession?.email || 'GUEST')}
          </span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
        <table className="w-full text-left font-mono text-sm text-zinc-300">
          <thead className="bg-[#050505] border-b border-white/10 text-xs text-zinc-500 uppercase">
            <tr>
              <th className="py-4 px-6 font-semibold">Integration</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold">Type</th>
              <th className="py-4 px-6 font-semibold">Protocol</th>
            </tr>
          </thead>
          <tbody>
            {mockNodes.map((node, index) => (
              <tr
                key={index}
                className={`border-b border-white/5 transition-colors ${isWeb3Authenticated ? 'cursor-pointer hover:bg-white/5' : 'hover:bg-white/5'}`}
                onClick={() => {
                  if (isWeb3Authenticated) {
                    showToast(`[PING_SENT] Verifying ${node.integration} response matrix.`, 'success');
                  }
                }}
              >
                <td className="py-4 px-6 font-bold text-white">{node.integration}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-2 ${node.status === 'Active' ? 'text-emerald-400' : 'text-axim-gold'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${node.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-axim-gold'}`}></span>
                    {node.status}
                  </span>
                </td>
                <td className="py-4 px-6">{node.type}</td>
                <td className="py-4 px-6 text-zinc-500">{node.protocol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
