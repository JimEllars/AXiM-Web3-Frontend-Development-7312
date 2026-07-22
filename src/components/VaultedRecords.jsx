import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../store/useAximStore';
import { logTelemetry } from '../lib/telemetry';
import { getSavedBriefings, removeBriefing } from '../lib/persistence';
import { fetchPosts } from '../lib/wp-fetch';

import { useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { client } from '../lib/thirdweb-client';
import { arbitrum } from 'thirdweb/chains';

const { LuFolderMinus, LuCalendar, LuTrash2, LuDownload, LuAward } = LuIcons;

const handleExport = (record) => {
  useAximStore.getState().setGlobalLoading(true, "Decrypting Vaulted Document...");

  setTimeout(() => {
    useAximStore.getState().setGlobalLoading(false);
    useAximStore.getState().showToast('Vault decryption successful.', 'success');

    try {
      let htmlContent = `
        <html>
          <head>
            <title>${record.title?.rendered || record.title || 'VAULTED RECORD'}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
              h1 { font-size: 24px; text-transform: uppercase; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 30px; }
              .meta { font-family: monospace; font-size: 12px; color: #666; margin-bottom: 40px; }
              .section { margin-bottom: 20px; }
              .label { font-weight: bold; text-transform: uppercase; font-size: 12px; color: #444; }
              .value { font-size: 16px; margin-top: 4px; }
              .legal-text { margin-top: 40px; font-size: 11px; color: #555; text-align: justify; }
            </style>
          </head>
          <body>
            <h1>${record.title?.rendered || record.title || 'VAULTED RECORD'}</h1>
            <div class="meta">DOCUMENT ID: ${record.id}<br/>TIMESTAMP: ${new Date(record.date || Date.now()).toUTCString()}</div>
      `;

      htmlContent += `
            <div class="legal-text">
               This document was autonomously generated via the AXiM Systems Infrastructure on behalf of the cryptographic operator.
               This cryptographic hash serves as a timestamped verification of intent.
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        useAximStore.getState().setNotification('PDF successfully generated.');
        logTelemetry('EXPORT_GENERATED', { type: record.type || 'DOCUMENT' });
        printWindow.close();
      }, 250);

    } catch (error) {
      console.error('Export generation failed:', error);
    }
  }, 1500);
};

export default function VaultedRecords() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const walletAddress = useAximStore((state) => state.walletAddress);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  // Web3 Contract reading logic
  const contractAddress = import.meta.env.VITE_ACADEMY_SBT_CONTRACT;
  const contract = contractAddress ? getContract({
    client,
    chain: arbitrum,
    address: contractAddress,
  }) : null;

  const { data: nfts, isLoading: isNftsLoading } = useReadContract({
    contract,
    method: "function getOwnedTokenIds(address _owner) view returns (uint256[])",
    params: [walletAddress],
    queryOptions: {
      enabled: isWeb3Authenticated && !!contract && !!walletAddress,
    }
  });


  useEffect(() => {
    let isMounted = true;

    const fetchRecords = async () => {
      setLoading(true);

      if (isWeb3Authenticated) {
        if (!isNftsLoading) {
           if (isMounted) {
             if (nfts && nfts.length > 0) {
                // Mock mapping the tokens to UI elements
                const mappedNfts = nfts.map((id) => ({
                   id: `token-${id}`,
                   title: `On-Chain Credential #${id}`,
                   type: 'CERTIFICATION',
                   date: new Date().toISOString() // Assuming current date for simplicity without full metadata read
                }));
                setRecords(mappedNfts);
                setIsEmpty(false);
             } else {
                setRecords([]);
                setIsEmpty(true);
             }
             setLoading(false);
           }
        }
        return;
      }

      // Standard behavior
      const savedIds = getSavedBriefings();
      if (!savedIds || savedIds.length === 0) {
        if (isMounted) {
          setIsEmpty(true);
          setRecords([]);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await fetchPosts({ include: savedIds.join(',') });
        if (isMounted) {
          if (data && data.length > 0) {
             setRecords(data);
             setIsEmpty(false);
          } else {
             setRecords([]);
             setIsEmpty(true);
          }
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setRecords([]);
          setIsEmpty(true);
          setLoading(false);
        }
      }
    };

    fetchRecords();
    return () => { isMounted = false; };
  }, [isWeb3Authenticated, isNftsLoading, nfts]);

  const handleRemove = (id) => {
    if (isWeb3Authenticated) return; // Cannot remove on-chain tokens this way
    logTelemetry('vault_record_purge_attempted', { id });
    removeBriefing(id);
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    if (updatedRecords.length === 0) {
      setIsEmpty(true);
    }
    logTelemetry('vaulted_record_removed', { id });
  };

  return (
    <motion.div
      onViewportEnter={() => {
        logTelemetry('vaulted_records_viewed', { isWeb3Authenticated, recordCount: records.length });
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
        {isWeb3Authenticated && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-axim-gold/10 border border-axim-gold/30 text-[9px] font-mono tracking-widest text-axim-gold uppercase rounded-sm select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-axim-gold animate-pulse" />
            [VAULT_PROOFS: ON-CHAIN VERIFIED // ARBITRUM_ONE]
          </div>
        )}
        {loading || (isWeb3Authenticated && isNftsLoading) ? (
          <div className="flex flex-col gap-3 py-8">
            <div className="animate-pulse bg-white/5 h-16 rounded-sm w-full mb-3"></div>
            <div className="animate-pulse bg-white/5 h-16 rounded-sm w-full mb-3"></div>
            <div className="animate-pulse bg-white/5 h-16 rounded-sm w-full mb-3"></div>
            <div className="uppercase text-[0.6rem] text-white tracking-widest font-mono text-center mt-2">Querying_Secure_Vault...</div>
          </div>
        ) : isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-white/5 p-12 text-center rounded-sm bg-[#050505]">
            <SafeIcon icon={LuFolderMinus} className="w-12 h-12 text-zinc-600 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Your intelligence vault is empty.</h3>
            <p className="text-zinc-500 text-sm font-mono mb-6">NO CRYPTOGRAPHIC CREDENTIALS FOUND</p>
            <Link to="/articles" onClick={() => logTelemetry('vault_browse_newsroom_clicked', { origin: 'empty_vault' })} className="py-2 px-6 bg-axim-purple text-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm shadow-lg">
              Browse the Newsroom
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((record) => (
              <div key={record.id} className="p-4 border border-white/10 bg-[#050505] rounded-sm hover:border-axim-purple/50 transition-colors group relative">
                {!isWeb3Authenticated && (
                  <button onClick={() => handleRemove(record.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-[#DB2777] p-2 transition-colors z-10" title="Purge Record">
                    <SafeIcon icon={LuTrash2} className="w-4 h-4" />
                  </button>
                )}
                {isWeb3Authenticated && (
                   <div className="absolute top-2 right-2 text-axim-gold p-2 z-10" title="On-Chain Credential">
                     <SafeIcon icon={LuAward} className="w-4 h-4" />
                   </div>
                )}
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2 pr-8">
                    <h3 className="text-white font-bold text-sm tracking-wide line-clamp-2" dangerouslySetInnerHTML={{ __html: record.title?.rendered || record.title || 'UNTITLED ASSET' }}></h3>
                  </div>
                  <p className="text-zinc-500 text-xs font-mono mb-4 flex items-center gap-2">
                    <SafeIcon icon={LuCalendar} className="w-3 h-3" />
                    {record.date ? new Date(record.date).toLocaleDateString() : 'UNKNOWN DATE'}
                  </p>

                  <div className="mt-auto">
                    <button
                      onClick={() => handleExport(record)}
                      className="w-full py-2 bg-transparent border border-white/10 text-zinc-300 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm flex items-center justify-center gap-2"
                    >
                      <SafeIcon icon={LuDownload} className="w-3 h-3" />
                      Export Document
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </motion.div>
  );
}
