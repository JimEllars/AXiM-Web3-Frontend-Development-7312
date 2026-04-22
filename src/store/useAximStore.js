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
  isPollingTelemetry: false,
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
          }
        }
      } catch (error) {
        console.error("Fleet Telemetry Error:", error);
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
  subscriptionTier: null,
  availableTools: null,

  setUserSession: (session) => set({ userSession: session, isSessionLoading: false, lastVerified: Date.now() }),
  setProfileData: (data) => set({ profileData: data }),
  setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),
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
