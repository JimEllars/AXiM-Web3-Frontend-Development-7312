1. **Phase 1: Footer and Trust Signals**
   - Extract `<footer>` from `src/App.jsx` to `src/components/Footer.jsx`.
   - Add explicit links for Privacy Policy, Terms of Service, and Security Architecture.
   - Create `src/components/Reviews.jsx` with 3-4 testimonials and add it to `src/pages/Home.jsx`.
2. **Phase 2: JSON-LD Structured Data**
   - Update `src/components/SEO.jsx` to include a JSON-LD `<script>` tag describing AXiM Systems as an Organization with Software Applications.
3. **Phase 3: Fleet Uptime Visualization**
   - Update `src/pages/Dashboard.jsx` to change the top grid to 3 columns.
   - Add a `Fleet Health` widget that queries `telemetry_logs` for `uptime_failure` over the last 15 minutes.
   - Display micro-apps (Demand Letter, NDA Generator, etc.) with glowing green or pulsing red indicators.
4. **Phase 4: Onyx Self-Healing Trigger**
   - Update `src/components/admin/OnyxTerminal.jsx` to include an "Emergency Actions" button group.
   - Add a "Purge Edge Cache" button that auto-submits the required prompt.
5. **Pre-commit Checks**
   - Run verification and checks.
