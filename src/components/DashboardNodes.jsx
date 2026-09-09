import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { generateSsoLaunchUrl } from '../lib/auth-handoff';

const { LuZap, LuGlobe, LuCpu, LuFileText, LuPhone, LuShieldCheck, LuBriefcase } = LuIcons;

export default function DashboardNodes({ nodeStatuses, selectedNode, setSelectedNode }) {
  const [liveMetrics, setLiveMetrics] = useState({ latency: null, uptime: null, isReconnecting: false });

  useEffect(() => {
    let isMounted = true;
    const fetchHealth = async () => {
      if (!isMounted) return;
      setLiveMetrics(prev => ({ ...prev, isReconnecting: true }));
      const start = Date.now();
      try {
        const rawEndpoint = import.meta.env?.VITE_TELEMETRY_ENDPOINT || import.meta.env?.VITE_TELEMETRY_WORKER_URL;
        const isValidRemote = Boolean(rawEndpoint) && !rawEndpoint.includes('your-edge-worker-url') && !rawEndpoint.includes('workers.dev');
        const endpoint = isValidRemote ? new URL('/health', rawEndpoint).toString() : '/api/telemetry/health';

        // We might not have this endpoint locally mapped, so handle 404 gracefully
        const res = await fetch(endpoint, { method: 'GET', signal: AbortSignal.timeout(5000) });
        const latency = Date.now() - start;
        if (res.ok) {
          if (isMounted) setLiveMetrics({ latency: `${latency}ms`, uptime: '99.9%', isReconnecting: false });
        } else {
          throw new Error('Non-200 response');
        }
      } catch (err) {
        if (isMounted) setLiveMetrics({ latency: null, uptime: null, isReconnecting: true });
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  const nodes = [
    {
      id: 'Support',
      type: 'Satellite App',
      url: 'https://support.axim.us.com',
      status: liveMetrics.isReconnecting ? 'RECONNECTING...' : (!nodeStatuses ? 'WAITING_FOR_UPLINK...' : nodeStatuses?.support === 'operational' ? 'Operational' : 'Degraded'),
      metrics: [['Latency', liveMetrics.latency || '--'], ['Uptime', liveMetrics.uptime || '--']],
      icon: LuGlobe,
      color: liveMetrics.isReconnecting ? 'zinc-500' : (!nodeStatuses ? 'zinc-500' : nodeStatuses?.support === 'operational' ? 'axim-gold' : 'red-500'),
      pulse: liveMetrics.isReconnecting || !nodeStatuses || nodeStatuses?.support !== 'operational'
    },
    {
      id: 'Voice',
      type: 'Satellite App',
      url: 'https://voice.axim.us.com',
      status: liveMetrics.isReconnecting ? 'RECONNECTING...' : (!nodeStatuses ? 'WAITING_FOR_UPLINK...' : nodeStatuses?.voice === 'operational' ? 'Operational' : 'Degraded'),
      metrics: [['Latency', liveMetrics.latency || '--'], ['Uptime', liveMetrics.uptime || '--']],
      icon: LuPhone,
      color: liveMetrics.isReconnecting ? 'zinc-500' : (!nodeStatuses ? 'zinc-500' : nodeStatuses?.voice === 'operational' ? 'axim-gold' : 'red-500'),
      pulse: liveMetrics.isReconnecting || !nodeStatuses || nodeStatuses?.voice !== 'operational'
    },
    {
      id: 'Asguard',
      type: 'Satellite App',
      url: 'https://asguard.axim.us.com',
      status: liveMetrics.isReconnecting ? 'RECONNECTING...' : (!nodeStatuses ? 'WAITING_FOR_UPLINK...' : nodeStatuses?.asguard === 'operational' ? 'Operational' : 'Degraded'),
      metrics: [['Latency', liveMetrics.latency || '--'], ['Uptime', liveMetrics.uptime || '--']],
      icon: LuShieldCheck,
      color: liveMetrics.isReconnecting ? 'zinc-500' : (!nodeStatuses ? 'zinc-500' : nodeStatuses?.asguard === 'operational' ? 'axim-gold' : 'red-500'),
      pulse: liveMetrics.isReconnecting || !nodeStatuses || nodeStatuses?.asguard !== 'operational'
    },
    {
      id: 'Green Machine',
      type: 'Satellite App',
      url: 'https://greenmachine.axim.us.com',
      status: liveMetrics.isReconnecting ? 'RECONNECTING...' : (!nodeStatuses ? 'WAITING_FOR_UPLINK...' : nodeStatuses?.greenmachine === 'operational' ? 'Operational' : 'Degraded'),
      metrics: [['Latency', liveMetrics.latency || '--'], ['Uptime', liveMetrics.uptime || '--']],
      icon: LuCpu,
      color: liveMetrics.isReconnecting ? 'zinc-500' : (!nodeStatuses ? 'zinc-500' : nodeStatuses?.greenmachine === 'operational' ? 'axim-gold' : 'red-500'),
      pulse: liveMetrics.isReconnecting || !nodeStatuses || nodeStatuses?.greenmachine !== 'operational'
    },
    {
      id: 'Ground Game',
      type: 'Satellite App',
      url: 'https://groundgame.axim.us.com',
      status: liveMetrics.isReconnecting ? 'RECONNECTING...' : (!nodeStatuses ? 'WAITING_FOR_UPLINK...' : nodeStatuses?.groundgame === 'operational' ? 'Operational' : 'Degraded'),
      metrics: [['Latency', liveMetrics.latency || '--'], ['Uptime', liveMetrics.uptime || '--']],
      icon: LuGlobe,
      color: liveMetrics.isReconnecting ? 'zinc-500' : (!nodeStatuses ? 'zinc-500' : nodeStatuses?.groundgame === 'operational' ? 'axim-gold' : 'red-500'),
      pulse: liveMetrics.isReconnecting || !nodeStatuses || nodeStatuses?.groundgame !== 'operational'
    },
    {
      id: 'CEO Dept',
      type: 'Satellite App',
      url: 'https://ceodept.axim.us.com',
      status: liveMetrics.isReconnecting ? 'RECONNECTING...' : (!nodeStatuses ? 'WAITING_FOR_UPLINK...' : nodeStatuses?.ceodept === 'operational' ? 'Operational' : 'Degraded'),
      metrics: [['Latency', liveMetrics.latency || '--'], ['Uptime', liveMetrics.uptime || '--']],
      icon: LuBriefcase,
      color: liveMetrics.isReconnecting ? 'zinc-500' : (!nodeStatuses ? 'zinc-500' : nodeStatuses?.ceodept === 'operational' ? 'axim-gold' : 'red-500'),
      pulse: liveMetrics.isReconnecting || !nodeStatuses || nodeStatuses?.ceodept !== 'operational'
    }
  ];

  const handleLaunch = async (url) => {
    const launchUrl = await generateSsoLaunchUrl(url);
    window.location.href = launchUrl;
  };

  return (
    <div className="grid grid-cols-1 gap-4 min-h-[500px]">
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          whileHover={{ y: -5 }}
          onClick={() => {
             if (setSelectedNode) setSelectedNode(node);
             handleLaunch(node.url);
          }}
          className={`cursor-pointer p-4 border transition-all duration-300 ${selectedNode?.id === node.id ? 'bg-axim-gold/10 border-axim-gold shadow-[0_0_30px_rgba(255,234,0,0.1)]' : 'bg-glass backdrop-blur-xl saturate-150 border-subtle hover:border-white/30'}`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-sm ${selectedNode?.id === node.id ? 'bg-axim-gold text-black' : 'bg-white/5 text-white'}`}>
              <SafeIcon icon={node.icon} className="w-6 h-6" />
            </div>
            <span className={`font-mono text-[0.6rem] flex items-center gap-2 text-${node.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full bg-${node.color} ${node.pulse ? 'animate-pulse' : 'shadow-[0_0_8px_currentColor]'}`} /> {node.status.toUpperCase()}
            </span>
          </div>
          <h3 className="text-xl font-bold uppercase mb-1">{node.id}</h3>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">{node.type}</p>
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            {node.metrics.map(([key, val]) => (
              <div key={key}>
                <div className="text-[0.6rem] text-zinc-600 uppercase mb-1">{key}</div>
                <div className="text-sm font-bold font-mono text-white">{val}</div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
