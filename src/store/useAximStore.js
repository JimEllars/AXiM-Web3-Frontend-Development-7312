import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';

export const useAximStore = create((set, get) => ({
  // Telemetry state
  nodeStatuses: {
    nda: 'operational',
    demand: 'operational',
    stub: 'operational',
    core: 'operational'
  },
  activeTelemetry: [
    { id: 1, type: 'marketing_loop', message: 'Roundups AI: Campaign Dispatched successfully - Just now', timestamp: Date.now() - 5000 },
    { id: 2, type: 'heartbeat', message: 'Onyx: Healthy - 10s ago', timestamp: Date.now() - 10000 },
    { id: 3, type: 'revenue', message: 'Pay Stub Generated (USD 4.00) - 2m ago', timestamp: Date.now() - 120000 },
    { id: 4, type: 'heartbeat', message: 'Core API: Latency 45ms - 3m ago', timestamp: Date.now() - 180000 }
  ],
  isPollingTelemetry: false,
  historicalRevenue: [],
  historicalHealth: [],
  activeIntegrations: ['zapier', 'chatbase'], // simulating some active connections
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
        const response = await fetch('https://api.axim.us.com/v1/functions/device-status');
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data === 'object') {
            set({ nodeStatuses: data });

            const rand = Math.random();
            let type = 'heartbeat';
            let message = 'Onyx: Healthy - Just now';

            if (rand > 0.85) {
              type = 'revenue';
              message = 'Demand Letter Generated (USD 4.00) - Just now';
            } else if (rand > 0.7) {
              type = 'marketing_loop';
              message = 'Roundups AI: Campaign Dispatched successfully - Just now';
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
        console.error("Fleet Telemetry Error:", error);
        const errorEvent = {
          id: Date.now(),
          type: 'error',
          message: 'Fleet Telemetry Link Degraded - Just now',
          timestamp: Date.now()
        };
        const currentTelemetry = get().activeTelemetry || [];
        set({ activeTelemetry: [errorEvent, ...currentTelemetry].slice(0, 10) });
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
        const response = await fetch('https://api.axim.us.com/v1/functions/passport-verify', {
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
      console.error("Passport Verification Error:", error);
      set({ userSession: null, isSessionLoading: false, lastVerified: null });
      return null;
    }
  }
}));
