import React from 'react';
import { useAximAuth } from '../hooks/useAximAuth';
import { useAximStore } from '../store/useAximStore';
import { useShallow } from 'zustand/react/shallow';
import * as LuIcons from 'react-icons/lu';
const { LuUser } = LuIcons;
import SafeIcon from '../common/SafeIcon';
import VaultedRecords from '../components/VaultedRecords';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';



export default function Profile() {
  const { session, profile, loading } = useAximAuth();
  const { userSession, isSessionLoading: passportLoading } = useAximStore(
    useShallow((state) => ({
      userSession: state.userSession,
      isSessionLoading: state.isSessionLoading
    }))
  );

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

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

    const user = session?.user || userSession;

  if (loading || passportLoading) return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center font-mono text-axim-gold">
      <SafeIcon icon={LuUser} className="w-8 h-8 animate-pulse" />
      <span>INITIALIZING_PROFILE...</span>
    </div>
  );

  if (!session && !userSession) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-24 h-24 bg-axim-gold/10 border border-axim-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={LuUser} className="w-10 h-10 text-axim-gold opacity-50" />
        </div>
        <h2 className="text-2xl font-black uppercase mb-4 text-white">Identity Required</h2>
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
    <div className="w-full relative z-10 bg-bg-void min-h-screen pb-32">
      <SEO title="Operator Vault | AXiM Systems" description="Secure dashboard and generated digital byproducts." noindex={true} />

      <section className="pt-32 pb-16 relative overflow-hidden border-b border-white/10 bg-black">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-axim-purple/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-axim-green/10 border border-axim-green/20 text-[0.65rem] font-mono uppercase tracking-widest text-axim-green mb-4 rounded-sm">
              <SafeIcon icon={LuIcons.LuShieldCheck} className="w-3 h-3" />
              <span>Connection Secure</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight">
              Operator <span className="text-axim-purple">Vault.</span>
            </h1>
            <p className="text-zinc-400 text-sm font-mono tracking-widest mt-2 uppercase">ID: {user?.id?.substring(0, 12) || 'ANONYMOUS_NODE'}...</p>
          </div>

          {user && (
             <button onClick={signOut} className="inline-flex items-center px-6 py-3 border border-white/10 bg-white/5 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm cursor-pointer">
               Sever Connection <SafeIcon icon={LuIcons.LuLogOut} className="ml-2 w-4 h-4" />
             </button>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Identity & Status Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="bg-[#0F172A] border border-axim-purple/30 p-8 rounded-sm shadow-[0_0_30px_rgba(147,51,234,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-axim-purple" />
                <h3 className="text-white font-black uppercase tracking-widest mb-6 text-sm flex items-center gap-2">
                  <SafeIcon icon={LuIcons.LuUser} className="w-4 h-4 text-axim-purple" /> Active Identity
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Email Address</label>
                    <div className="text-sm text-white font-medium break-all">{user?.email || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Clearance Level</label>
                    <div className="text-sm text-white font-medium">Standard Operator</div>
                  </div>
                </div>
             </div>

             <div className="bg-black border border-white/10 p-8 rounded-sm">
               <h3 className="text-white font-black uppercase tracking-widest mb-4 text-sm">Need Infrastructure?</h3>
               <p className="text-xs text-zinc-400 leading-relaxed mb-6">If you require enterprise-grade system integrations, initialize a consultation protocol with our engineering team.</p>
               <Link to="/consultation" className="w-full inline-flex justify-center items-center px-4 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[0.65rem] hover:bg-axim-purple hover:border-axim-purple transition-colors">
                  Request Consult
               </Link>
             </div>
          </div>

          {/* The Vault (Action Queue) */}
          <div className="lg:col-span-8">
             <div className="bg-black border border-white/10 rounded-sm overflow-hidden min-h-[400px]">
               <div className="bg-white/5 border-b border-white/10 p-6 flex items-center justify-between">
                 <h2 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
                    <SafeIcon icon={LuIcons.LuArchive} className="w-5 h-5 text-axim-purple" /> Digital Byproducts
                 </h2>
                 <span className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Encrypted Storage</span>
               </div>

               <div className="p-6">
                 <VaultedRecords />
               </div>
             </div>
          </div>

        </div>
      </section>
    </div>
  );
}
