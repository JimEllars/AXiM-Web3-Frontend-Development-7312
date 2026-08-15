# 🚀 AXiM Web3 Frontend - Production Update Sprint

**System Status:** PRODUCTION MODE
**Objective:** Finalize Micro-SaaS "Tools" scaffolding, implement the universal Paywall component, and reinforce system telemetry while maintaining 100% uptime for all user-facing features (login, dashboards, Web3 auth, and AI).

## 📊 Sprint Review: What We Accomplished
In the previous update, we successfully laid the critical architectural foundation:
- **SEO Routing Fix:** Replaced `<HashRouter>` with `<BrowserRouter>` in `src/main.jsx` to enable proper search engine indexing across the Cloudflare deployment.
- **State & Meta Optimization:** Successfully integrated `@tanstack/react-query` for headless WP caching and `react-helmet-async` for dynamic OpenGraph tags.
- **Theme Abstraction:** Extracted core brand configurations into `src/config/theme.js`, centralizing our colors and API endpoints.
- **Chatbase Integration:** Scaffolded `src/components/Chatbot.jsx` to offload public chat to Chatbase, freeing up Onyx for internal DevOps.

## 🚨 Pending Action Items (What We Missed)
While the `/tools` routing and basic grid structure were updated in `src/pages/Tools.jsx`, the critical revenue-generating component was overlooked:
- **Missing File:** `src/components/Paywall.jsx` was not created.
- **Missing Integration:** The tools hub is not yet gate-keeping our Micro-SaaS offerings (Demand Letter Generator, NDA Generator) using the requested Paywall logic.

---

## 🛠️ Execution Plan: Current Sprint Directives
We are moving in small, strategic increments to ensure system stability. 95% of this sprint is focused on activating the current Micro-SaaS tools safely and reinforcing telemetry. Do not modify global `.env` configurations or routing topologies that could break live user sessions.

### Task 1: Construct `src/components/Paywall.jsx`
Create a reusable, highly-stylized React component that gates content.
- **Props:** It must accept `price`, `productId`, `web3Gate` (boolean), and `children`.
- **Aesthetic:** Adhere to the "Onyx Phase 1" cyber/Web3 aesthetic (e.g., deep void background `bg-[#050505]`, glowing borders `border-axim-gold/30`, monospaced uppercase typography).
- **Functionality (Simulation Mode):** For this sprint, scaffold the UI buttons for "Pay with Stripe" and "Connect Wallet to Bypass". Do not hardwire the actual Stripe logic yet; instead, have the buttons log telemetry events and cleanly unlock the `children` content via local state so we can test the UX.
- **Telemetry:** Ensure `logTelemetry('paywall_viewed', { product: productId })` and `logTelemetry('paywall_bypassed_test', { method: 'stripe/web3' })` fire correctly.

### Task 2: Refactor `src/pages/Tools.jsx` to use the Paywall
- Import the new `Paywall` component.
- Wrap the specific tool access points (e.g., the entry route to the Demand Letter Generator) in the `<Paywall>` component.
- Ensure the structural grid layout of the Tools Hub remains responsive and polished.
- Verify that the existing "Request Partner Access" modal and forms remain fully functional and that no user data is lost.

### Task 3: Telemetry & Safety Audits
- **Do No Harm:** Ensure that the existing Thirdweb `<ThirdwebProvider>`, user session persistence via `useAximStore`, and global `ErrorBoundary` remain fully intact.
- **Click Tracking:** Verify that any outbound partner links in the Tools Hub implement the required `e.preventDefault()`, log a 'PARTNER_FUNNEL_REDIRECT', use `setTimeout` for 150ms, and then execute `window.open()`.

## 🛑 Agent Rules of Engagement
- **Small Increments:** Stick strictly to building and implementing the `Paywall.jsx` component. Do not attempt to wire the Supabase backend or AXiM Core API in this sprint.
- **Zero Downtime:** Ensure no changes cause memory leaks or infinite re-renders. Use `isMounted` flags in any `useEffect` hooks you modify.
- **Pre-commit:** You must run all programmatic checks, run tests locally (`npm run test`), and verify UI components before submitting your branch.

Please review the codebase, plan your approach, and confirm when you have successfully deployed the Paywall architecture.
