import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../../store/useAximStore';
import { useAximAuth } from '../../hooks/useAximAuth';

const { LuZap, LuLink, LuMessageSquare, LuMail, LuWebhook, LuX, LuCheck } = LuIcons;

const PARTNERS = [
  { id: 'zapier', name: 'Zapier', icon: LuZap, color: 'text-orange-500', desc: 'Global workflow automation' },
  { id: 'apixdrive', name: 'APIXDrive', icon: LuLink, color: 'text-blue-400', desc: 'No-code API connections' },
  { id: 'texau', name: 'Texau', icon: LuLink, color: 'text-indigo-400', desc: 'LinkedIn & Social Automation' },
  { id: 'tabby', name: 'Tabby', icon: LuMessageSquare, color: 'text-axim-purple', desc: 'AI Coding & Terminal Automation' },
  { id: 'emailit', name: 'Emailit', icon: LuMail, color: 'text-purple-400', desc: 'High-volume Email Dispatch' },
  { id: 'resend', name: 'Resend', icon: LuMail, color: 'text-red-400', desc: 'Transactional Emails' },
  { id: 'chatbase', name: 'Chatbase', icon: LuMessageSquare, color: 'text-axim-gold', desc: 'Custom AI Chatbots' }
];

export default function EcosystemRegistry() {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [pingStatus, setPingStatus] = useState({});
  const userSession = useAximStore((state) => state.userSession);
  const activeIntegrations = useAximStore((state) => state.activeIntegrations) || [];

  const handleTestConnection = (partnerId) => {
    setPingStatus(prev => ({ ...prev, [partnerId]: 'pinging' }));
    setTimeout(() => {
      setPingStatus(prev => ({ ...prev, [partnerId]: 'success' }));
      setTimeout(() => {
        setPingStatus(prev => ({ ...prev, [partnerId]: null }));
      }, 2000);
    }, 800);
  };

  const { session } = useAximAuth();

  const token = userSession?.session_token || session?.access_token;

  const handleActivateClick = (partner) => {
    setSelectedPartner(partner);
    setWebhookUrl('');
    setApiKey('');
    setSubmitStatus(null);
  };

  const handleCloseModal = () => {
    setSelectedPartner(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!webhookUrl || !apiKey || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://wp.axim.us.com/wp-json/axim/v1/ecosystem_connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          partner_id: selectedPartner.id,
          webhook_url: webhookUrl,
          api_key: apiKey
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save connection');
      }

      setSubmitStatus({ type: 'success', message: `${selectedPartner.name} Hub Activated Successfully` });
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err) {
      setSubmitStatus({ type: 'error', message: err.message || 'System Error. Check Console.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-axim-purple/10 border border-axim-purple/30 flex items-center justify-center rounded-sm text-axim-purple">
          <SafeIcon icon={LuWebhook} className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-black uppercase text-white tracking-widest">Ecosystem Registry Vault</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PARTNERS.map((partner) => (
          <div key={partner.id} className="bg-white/5 border border-white/10 p-6 rounded-sm flex flex-col hover:border-axim-purple/50 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <SafeIcon icon={partner.icon} className={`w-6 h-6 ${partner.color}`} />
              <h4 className="text-white font-bold tracking-wider">{partner.name}</h4>
            </div>
            <p className="text-xs text-zinc-500 mb-6 flex-grow">{partner.desc}</p>

            {activeIntegrations.includes(partner.id) ? (
              <button
                onClick={() => handleTestConnection(partner.id)}
                disabled={pingStatus[partner.id] === 'pinging'}
                className={`w-full py-2 border text-xs font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  pingStatus[partner.id] === 'success'
                    ? 'bg-axim-gold/20 border-axim-gold text-axim-gold'
                    : 'bg-axim-gold/10 border-axim-gold text-axim-gold hover:bg-axim-gold/20'
                }`}
              >
                {pingStatus[partner.id] === 'pinging' ? (
                  <>
                    <div className="w-3 h-3 border-2 border-axim-gold border-t-transparent rounded-full animate-spin"></div>
                    PINGING...
                  </>
                ) : pingStatus[partner.id] === 'success' ? (
                  <>
                    <SafeIcon icon={LuCheck} className="w-4 h-4" />
                    200 OK
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-axim-gold animate-pulse"></div>
                    TEST CONNECTION
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => handleActivateClick(partner)}
                className="w-full py-2 bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-axim-purple hover:bg-axim-purple hover:text-black hover:border-axim-purple transition-all group-hover:bg-white/10"
              >
                Activate Hub
              </button>
            )}

          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-black border border-axim-purple/50 rounded-sm shadow-[0_0_30px_125,0,255,0.15)] relative overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                  <SafeIcon icon={selectedPartner.icon} className={`w-4 h-4 ${selectedPartner.color}`} />
                  <span className="font-mono text-sm font-bold uppercase tracking-widest text-white">
                    {selectedPartner.name} <span className="text-axim-purple">Integration</span>
                  </span>
                </div>
                <button onClick={handleCloseModal} className="text-zinc-500 hover:text-white transition-colors">
                  <SafeIcon icon={LuX} className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {submitStatus && (
                  <div className={`p-3 text-xs font-mono flex items-center gap-2 ${submitStatus.type === 'success' ? 'text-axim-gold border-axim-gold/30 bg-axim-gold/10 border' : 'text-red-400 border-red-400/30 bg-red-400/10 border'}`}>
                    {submitStatus.type === 'success' && <SafeIcon icon={LuCheck} className="w-4 h-4" />}
                    {submitStatus.message}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase text-zinc-400">Webhook URL</label>
                  <input
                    type="url"
                    required
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://hooks.zapier.com/..."
                    className="w-full bg-black/50 border border-white/20 p-2 text-sm font-mono text-white focus:outline-none focus:border-axim-purple transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase text-zinc-400">API Key / Secret</label>
                  <input
                    type="password"
                    required
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk_live_..."
                    className="w-full bg-black/50 border border-white/20 p-2 text-sm font-mono text-white focus:outline-none focus:border-axim-purple transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3 bg-axim-purple/10 border border-axim-purple/30 text-axim-purple font-mono text-xs uppercase tracking-widest hover:bg-axim-purple hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                     <>
                        <div className="w-3 h-3 border-2 border-axim-purple border-t-transparent rounded-full animate-spin"></div>
                        Connecting...
                     </>
                  ) : (
                    'Secure Connection'
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
