#!/bin/bash
sed -i "s/logTelemetry('profile_tab_view', { tab: 'vault' });/logTelemetry('profile_tab_switch', { activeTab: 'vault' });/g" src/pages/Profile.jsx
sed -i "s/logTelemetry('profile_tab_view', { tab: 'tickets' });/logTelemetry('profile_tab_switch', { activeTab: 'tickets' });/g" src/pages/Profile.jsx
sed -i "s/logTelemetry('profile_tab_view', { tab: 'activity' });/logTelemetry('profile_tab_switch', { activeTab: 'activity' });/g" src/pages/Profile.jsx

sed -i "s/<button className=\"px-6 py-3 bg-white\/5 border border-white\/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm\">/<button onClick={() => { logTelemetry('profile_settings_clicked', { userId: user?.id || walletAddress }); useAximStore.getState().showToast('Settings configuration panel coming soon.', 'info'); }} className=\"px-6 py-3 bg-white\/5 border border-white\/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm\">/g" src/pages/Profile.jsx
