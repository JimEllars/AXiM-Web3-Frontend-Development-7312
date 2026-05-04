const fs = require('fs');
const content = fs.readFileSync('src/store/useAximStore.js', 'utf8');

let newContent = content.replace("import { create } from 'zustand';", "import { create } from 'zustand';\nimport { persist } from 'zustand/middleware';");

newContent = newContent.replace(
  "export const useAximStore = create((set, get) => ({",
  `export const useAximStore = create(
  persist(
    (set, get) => ({
      // --- AUTONOMOUS ACTION QUEUE ---
      pendingActions: [],
      enqueueAction: (action) => {
        const newAction = { id: Date.now(), timestamp: new Date().toISOString(), status: 'QUEUED', ...action };
        set((state) => ({ pendingActions: [...state.pendingActions, newAction] }));
        console.log("[AUTONOMOUS_ENGINE] Action Queued:", action.type);
      },
      removeAction: (id) => {
        set((state) => ({ pendingActions: state.pendingActions.filter(a => a.id !== id) }));
      },
      clearQueue: () => set({ pendingActions: [] }),
`
);

newContent = newContent.replace(
  "}));",
  `    }),
    {
      name: 'axim-autonomous-storage',
      partialize: (state) => ({ pendingActions: state.pendingActions }), // Only persist the queue
    }
  )
);`
);

fs.writeFileSync('src/store/useAximStore.js', newContent);
