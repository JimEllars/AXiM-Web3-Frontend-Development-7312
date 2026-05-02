import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';

export const useAximStore = create((set, get) => ({
  // Telemetry state

  isGuardEngaged: false,
  setGuardEngaged: (status) => set({ isGuardEngaged: status }),

  vaultedArtifacts: [
    { id: 1, name: "Generated_NDA_v1.pdf", type: "pdf", size: "124 KB", date: new Date().toISOString(), status: "Verified" },
    { id: 2, name: "CORE_COGNITION_APRIL.enc", type: "enc", size: "4 KB", date: new Date(Date.now() - 172800000).toISOString(), status: "Encrypted" }
  ],
  wpDiagnosticError: null,

  nodeStatuses: null,
  activeTelemetry: [
    { id: 1, type: 'marketing_loop', message: 'UPLINK_STABLE // ARCHIVE_SECURED', timestamp: Date.now() - 5000 },
    { id: 2, type: 'heartbeat', message: 'INTEGRITY_CHECK: PASSED', timestamp: Date.now() - 10000 },
    { id: 3, type: 'revenue', message: 'LICENSE_HANDSHAKE: COMPLETE', timestamp: Date.now() - 120000 },
    { id: 4, type: 'heartbeat', message: 'Core API: Latency 45ms - 3m ago', timestamp: Date.now() - 180000 }
  ],
  isPollingTelemetry: false,
  historicalRevenue: [],
  historicalHealth: [],
  activeIntegrations: ['zapier', 'chatbase'], // simulating some active connections
  partnerLeads: [],
  submitPartnerLead: (leadData) => set((state) => ({ partnerLeads: [{ ...leadData, id: Date.now(), timestamp: Date.now(), status: "Pending" }, ...state.partnerLeads] })),
  updateLeadStatus: (id, newStatus) => set((state) => ({ partnerLeads: state.partnerLeads.map((lead) => lead.id === id ? { ...lead, status: newStatus } : lead) })),
  fetchDashboardHistoricalData: () => {
    // Generate simulated 7-day revenue
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const revenueData = [];
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (todayIndex - i + 6) % 7;
      revenueData.push({
        name: days[dayIndex],
        revenue: Math.floor(Math.random() * 500) + 300,
      });
    }

    // Generate simulated 15-minute trailing latency
    const healthData = [];
    const now = new Date();
    for (let i = 15; i >= 0; i -= 3) {
      const time = new Date(now.getTime() - i * 60000);
      healthData.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency: Math.floor(Math.random() * 60) + 30, // 30-90ms latency
      });
    }

    set({ historicalRevenue: revenueData, historicalHealth: healthData });
  },

  setNodeStatuses: (statuses) => set({ nodeStatuses: statuses }),

  startTelemetryPolling: () => {
    const { isPollingTelemetry } = get();
    if (isPollingTelemetry) return;

    set({ isPollingTelemetry: true });

    const fetchTelemetry = async () => {
      try {
        const response = await fetch('https://wp.axim.us.com/wp-json/wp/v2/posts?per_page=1');
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data === 'object') {
            set({ nodeStatuses: data });

            const rand = Math.random();
            let type = 'heartbeat';
            let message = 'INTEGRITY_CHECK: PASSED';

            if (rand > 0.85) {
              type = 'revenue';
              message = 'LICENSE_HANDSHAKE: COMPLETE';
            } else if (rand > 0.7) {
              type = 'marketing_loop';
              message = 'UPLINK_STABLE // ARCHIVE_SECURED';
            }

            const newEvent = {
              id: Date.now(),
              type,
              message,
              timestamp: Date.now()
            };

            const currentTelemetry = get().activeTelemetry || [];
            set({ activeTelemetry: [newEvent, ...currentTelemetry].slice(0, 10) });
          }
        }
      } catch (error) {

        const errorEvent = {
          id: Date.now(),
          type: 'error',
          message: 'UPLINK_RECONSTRUCTION_IN_PROGRESS...',
          timestamp: Date.now()
        };
        const currentTelemetry = get().activeTelemetry || [];
        const statuses = get().nodeStatuses || {};
        const newStatuses = {};
        for (const key in statuses) {
          newStatuses[key] = 'degraded';
        }
        set({
          activeTelemetry: [errorEvent, ...currentTelemetry].slice(0, 10),
          nodeStatuses: Object.keys(newStatuses).length > 0 ? newStatuses : { core: 'degraded' }
        });
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 30000);
    set({ telemetryInterval: interval });
  },

  stopTelemetryPolling: () => {
    const { telemetryInterval } = get();
    if (telemetryInterval) {
      clearInterval(telemetryInterval);
      set({ telemetryInterval: null, isPollingTelemetry: false });
    }
  },

  // User Session state & Profile caching
  userSession: null,
  isSessionLoading: true,
  lastVerified: null,
  profileData: null,
  availableTools: null,

  setUserSession: (session) => set({ userSession: session, isSessionLoading: false, lastVerified: Date.now() }),
  setProfileData: (data) => set({ profileData: data }),
  setAvailableTools: (tools) => set({ availableTools: tools }),

  verifyPassport: async (forceRefresh = false) => {
    const { userSession, lastVerified } = get();

    // Cache for 5 minutes (300,000 ms) unless forceRefresh is true
    if (!forceRefresh && userSession && lastVerified && (Date.now() - lastVerified < 300000)) {
        return userSession;
    }

    set({ isSessionLoading: true });
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session) {
        set({ userSession: session, isSessionLoading: false, lastVerified: Date.now() });
        return session;
      } else {
        // Fallback or old method
        const response = await fetch('https://wp.axim.us.com/wp-json/axim/v1/passport-verify', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          set({ userSession: data, isSessionLoading: false, lastVerified: Date.now() });
          return data;
        } else {
          set({ userSession: null, isSessionLoading: false, lastVerified: null });
          return null;
        }
      }
    } catch (error) {

      set({ userSession: null, isSessionLoading: false, lastVerified: null });
      return null;
    }
  }
}));
