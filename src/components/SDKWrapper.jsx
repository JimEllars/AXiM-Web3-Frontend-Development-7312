import React from 'react';
import { GetStarted } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';

const QUEST_THEME = {
  Form: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    padding: '40px'
  },
  Topbar: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  Heading: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em'
  },
  Description: {
    color: '#a1a1aa',
    fontSize: '14px'
  },
  PrimaryButton: {
    backgroundColor: '#FFEA00',
    color: '#000000',
    fontWeight: 'bold',
    borderRadius: '2px',
    textTransform: 'uppercase'
  },
  Input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  Card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  ProgressBar: {
    barColor: '#FFEA00',
    barParentColor: 'rgba(255, 255, 255, 0.1)',
    ProgressText: {
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: 'bold'
    }
  },
  SingleChoice: {
    style: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#ffffff'
    },
    selectedStyle: {
      backgroundColor: '#FFEA00',
      color: '#000000',
      border: '1px solid #FFEA00'
    },
    hoverBackground: 'rgba(255, 255, 255, 0.08)'
  }
};

export default function SDKWrapper() {
  // Use import.meta.env in Vite, fallback to process.env for Node.js tests
  const token = import.meta.env ? import.meta.env.VITE_QUEST_TOKEN : process.env.VITE_QUEST_TOKEN;

  return (
    <div className="max-w-[600px] mx-auto">
      <GetStarted
        questId="axim-early-access"
        userId="user_123" // In production, pass actual user ID
        token={token || ''}
        styleConfig={QUEST_THEME}
      />
    </div>
  );
}