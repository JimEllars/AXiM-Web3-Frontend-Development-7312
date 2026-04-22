import React, { useEffect, useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { supabase } from '../lib/supabase';
import { useAximAuth } from '../hooks/useAximAuth';

const { LuClock, LuExternalLink, LuLock, LuDownload, LuFileText } = LuIcons;

export default function VaultedRecords() {
  const { session } = useAximAuth();
  const [fetching, setFetching] = useState(true);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchRecords() {
      if (!session?.user?.id) {
          if (isMounted) setFetching(false);
          return;
      }

      try {
        const { data, error } = await supabase
          .from('secure_artifacts')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching records:", error);
        } else if (isMounted) {
            setRecords(data || []);
        }
      } catch (err) {
          console.error("Failed to fetch vaulted records", err);
      } finally {
        if (isMounted) setFetching(false);
      }
    }

    fetchRecords();

    return () => { isMounted = false; };
  }, [session]);

  const handleDownload = async (path) => {
      try {
          const { data, error } = await supabase.storage.from('artifacts').createSignedUrl(path, 60);
          if (data?.signedUrl) {
              window.open(data.signedUrl, '_blank');
          } else {
              console.error("Download error", error);
          }
      } catch (e) {
          console.error("Error generating signed URL", e);
      }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl saturate-150 border border-white/10 p-8 overflow-hidden relative font-mono">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black uppercase flex items-center gap-3 text-white">
          Vaulted Records
        </h3>
        <button className="text-[0.6rem] text-axim-gold hover:text-white uppercase tracking-widest flex items-center gap-2">
          Export Registry <SafeIcon icon={LuExternalLink} className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="text-[0.6rem] text-zinc-600 flex justify-between uppercase mb-4 pb-2 border-b border-white/5">
          <span className="w-1/3">Document_Type</span>
          <span className="w-1/3 text-center">Generated_Date</span>
          <span className="w-1/3 text-right">Action</span>
        </div>
        {fetching ? (
          <div className="text-center py-12 opacity-20 animate-pulse uppercase text-[0.6rem] text-white">Querying_Secure_Vault...</div>
        ) : records.length > 0 ? (
          records.map((record) => (
            <div key={record.id} className="group flex justify-between items-center text-[0.7rem] py-4 px-4 bg-white/5 border border-white/5 hover:border-axim-teal/50 transition-all">
              <div className="flex items-center gap-3 w-1/3">
                <SafeIcon icon={LuFileText} className="text-zinc-600 group-hover:text-axim-teal transition-colors" />
                <span className="text-white font-bold">{record.document_type || 'Unknown'}</span>
              </div>
              <span className="text-zinc-400 capitalize w-1/3 text-center">{new Date(record.created_at).toLocaleDateString()}</span>
              <div className="w-1/3 text-right flex justify-end">
                {record.status === 'Vaulted' || record.status === 'Encrypted' || record.file_path ? (
                    <button onClick={() => handleDownload(record.file_path)} className="flex items-center gap-2 font-black text-axim-teal hover:text-white transition-colors">
                        DOWNLOAD <SafeIcon icon={LuDownload} />
                    </button>
                ) : (
                    <span className="flex items-center gap-2 font-black text-axim-gold">
                        PROCESSING
                    </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 border border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-600">
            <SafeIcon icon={LuLock} className="w-10 h-10 mb-4 opacity-30" />
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-zinc-500">Registry_Empty // No_Records</span>
          </div>
        )}
        <div className="pt-8 text-center text-zinc-600 text-[0.6rem] uppercase tracking-widest border-t border-white/5 mt-4">
          SECURE_END_OF_FILE
        </div>
      </div>
    </div>
  );
}
