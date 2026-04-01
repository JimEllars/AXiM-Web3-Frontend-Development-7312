import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuVote, LuTrendingUp, LuUsers } = LuIcons;

export default function GovernanceVote({ proposal }) {
  const [voted, setVoted] = useState(false);
  const [isVotingFor, setIsVotingFor] = useState(false);
  const [isVotingAgainst, setIsVotingAgainst] = useState(false);
  const [votes, setVotes] = useState({ for: 68, against: 32 });

  const handleVote = (type) => {
    if (voted) return;

    if (type === 'for') {
      setIsVotingFor(true);
    } else {
      setIsVotingAgainst(true);
    }

    setTimeout(() => {
      setVoted(true);
      setVotes(prev => ({
        ...prev,
        [type]: prev[type] + 1
      }));
    }, 1000);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[0.6rem] font-mono text-axim-purple uppercase tracking-widest">Active Proposal</span>
          <h4 className="text-lg font-bold uppercase mt-1">{proposal?.title}</h4>
        </div>
        <div className="text-right">
          <div className="text-[0.6rem] font-mono text-zinc-500 uppercase">Ends In</div>
          <div className="text-xs font-bold text-white uppercase">14h 22m</div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <div className="flex justify-between text-[0.6rem] uppercase mb-1 font-mono">
            <span className="text-axim-green">Support</span>
            <span>{votes.for}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${votes.for}%` }} 
              className="h-full bg-axim-green" 
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[0.6rem] uppercase mb-1 font-mono">
            <span className="text-red-500">Oppose</span>
            <span>{votes.against}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${votes.against}%` }} 
              className="h-full bg-red-500" 
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => handleVote('for')}
          disabled={voted || isVotingFor || isVotingAgainst}
          className={`flex-1 py-3 border font-mono text-[0.65rem] uppercase tracking-widest transition-all ${voted || isVotingFor || isVotingAgainst ? 'opacity-50 cursor-not-allowed' : ''} ${voted && isVotingFor ? 'bg-axim-green text-black' : 'border-axim-green text-axim-green hover:bg-axim-green hover:text-black'}`}
        >
          {isVotingFor && !voted ? 'Voting...' : (voted && isVotingFor ? 'Voted For' : 'For')}
        </button>
        <button 
          onClick={() => handleVote('against')}
          disabled={voted || isVotingFor || isVotingAgainst}
          className={`flex-1 py-3 border font-mono text-[0.65rem] uppercase tracking-widest transition-all ${voted || isVotingFor || isVotingAgainst ? 'opacity-50 cursor-not-allowed' : ''} ${voted && isVotingAgainst ? 'bg-red-500 text-black border-red-500' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black'}`}
        >
          {isVotingAgainst && !voted ? 'Voting...' : (voted && isVotingAgainst ? 'Voted Against' : 'Against')}
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between opacity-50">
        <div className="flex items-center gap-2 text-[0.6rem] font-mono uppercase">
          <SafeIcon icon={LuUsers} className="w-3 h-3" /> 1,242 Participants
        </div>
        <div className="flex items-center gap-2 text-[0.6rem] font-mono uppercase">
          <SafeIcon icon={LuTrendingUp} className="w-3 h-3" /> Quorum Reached
        </div>
      </div>
    </div>
  );
}