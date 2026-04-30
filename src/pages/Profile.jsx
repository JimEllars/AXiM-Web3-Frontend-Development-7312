import React from 'react';
import { motion } from 'framer-motion';
import { useAximAuth } from '../hooks/useAximAuth';
import { useAximStore } from '../store/useAximStore';
import { useShallow } from 'zustand/react/shallow';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import ProfileCard from '../components/ProfileCard';
import ProfileMenuButton from '../components/ProfileMenuButton';
import InfoPanel from '../components/InfoPanel';
import VaultedRecords from '../components/VaultedRecords';
import { generators } from '../data/companyOfferings';
import { ensureSafeProtocol } from '../lib/sanitize';

const { LuUser, LuKey, LuShieldAlert, LuShieldCheck, LuLock, LuCopy, LuCheck, LuDatabase, LuHardDrive, LuSettings, LuArrowRight, LuUnlock, LuFileText, LuRefreshCw } = LuIcons;

export default function Profile() {
  const { session, profile, loading } = useAximAuth();
  const { userSession, isSessionLoading: passportLoading } = useAximStore(
    useShallow((state) => ({
      userSession: state.userSession,
      isSessionLoading: state.isSessionLoading,
    }))
  );

  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncMessage, setSyncMessage] = React.useState('');

  const handleSyncLicenses = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage('LICENSES_SYNCHRONIZED');
      setTimeout(() => setSyncMessage(''), 3000);
    }, 1000);
  };

  const hasAccess = true;

  if (loading) return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center font-mono text-axim-gold">
      <SafeIcon icon={LuUser} className="w-8 h-8 animate-pulse" />
      <span>INITIALIZING_PROFILE...</span>
    </div>
  );

  if (!session) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-24 h-24 bg-axim-gold/10 border border-axim-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={LuUser} className="w-10 h-10 text-axim-gold opacity-50" />
        </div>
        <h2 className="text-2xl font-black uppercase mb-4">Identity Required</h2>
        <p className="text-zinc-500 max-w-md mb-8 font-mono text-xs">Sign in to access secure profile data.</p>
        <div className="flex justify-center scale-110 origin-center mb-8">

        </div>
        <div className="p-4 bg-white/5 border border-white/10 font-mono text-[10px] text-zinc-600 uppercase">
          Status: Await_Handshake // Error: 0xAUTH_REQ
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 z-[-1] pointer-events-none" />
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '0% 100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-axim-teal/5 to-transparent h-[200%] w-full z-[-1] pointer-events-none opacity-50 mix-blend-screen"
        />
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-md relative z-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">

      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Operator Console // Secure Vault</h1>
        <p className="text-zinc-500 text-sm">Manage your decentralized identity and infrastructure access.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-80 space-y-6">
          <ProfileCard address={session?.user?.email || userSession?.email || 'Guest Operator'} clearanceLevel={profile?.clearance_level || 'Standard'} />

          <div className="bg-glass backdrop-blur-xl saturate-150 border border-subtle p-6 space-y-4">
            <ProfileMenuButton icon={LuSettings} label="System Settings" />
            <ProfileMenuButton icon={LuShieldCheck} label="Asset Management" />
            <ProfileMenuButton icon={LuShieldAlert} label="Terminate Session" danger={true} />
          </div>
        </div>

        <div className="flex-grow space-y-8">
          <VaultedRecords />

          <InfoPanel icon={LuUnlock} iconColor="text-axim-teal" title="Unlocked Infrastructure">
            {!hasAccess ? (
               <div className="p-6 border border-axim-gold/20 bg-axim-gold/5 text-center flex flex-col items-center">
                 <p className="text-sm text-zinc-400 mb-4">You do not currently have access to these tools. Please upgrade your account.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                 {generators.map((doc) => {
                    let destUrl = doc.externalUrl ? `${doc.externalUrl}?source=axim_hub` : "#";
                    if (doc.externalUrl && userSession && userSession.session_token) {
                      destUrl += `&auth_handoff=${userSession.session_token}`;
                    }
                    return (
                    <a key={doc.id} href={ensureSafeProtocol(destUrl)}  className="p-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-axim-teal/50 transition-colors group flex flex-col gap-2 rounded-sm cursor-pointer block">
                       <div className="flex items-center gap-3">
                         <SafeIcon icon={LuIcons[doc.iconName] || LuIcons.LuFileText} className="text-axim-teal w-5 h-5" />
                         <span className="font-bold text-sm text-white group-hover:text-axim-teal transition-colors uppercase tracking-wider">{doc.title}</span>
                       </div>
                       <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{doc.desc}</p>
                    </a>
                    );
                 })}
               </div>
            )}
          </InfoPanel>

          <InfoPanel icon={LuLock} iconColor="text-axim-teal" title="Product Licenses">
            <div className="space-y-4">
              <div className="p-6 border border-white/10 bg-white/5 text-left flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <div className="text-[0.6rem] font-mono text-zinc-500 uppercase mb-1 flex items-center gap-1"><SafeIcon icon={LuShieldCheck} className="w-3 h-3 text-axim-teal"/> Active License</div>
                    <div className="font-mono text-lg text-white tracking-widest">AXM-BYPR-0982-X</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={handleSyncLicenses}
                        disabled={isSyncing}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 text-white font-mono text-[0.65rem] uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <SafeIcon icon={LuRefreshCw} className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} /> Sync Licenses
                      </button>
                      {syncMessage && <span className="text-axim-teal text-[0.55rem] font-mono tracking-widest uppercase">{syncMessage}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-zinc-400 mt-2">
                  Use this license key to validate your asset access. Internal use only.
                </div>
              </div>
            </div>
          </InfoPanel>
        </div>
      </div>
      </div>
      </motion.div>
    </div>
  );
}
