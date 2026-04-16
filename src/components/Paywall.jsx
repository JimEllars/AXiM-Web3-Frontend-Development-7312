import React from 'react';

export default function Paywall({ price, productId, web3Gate, children }) {
  // Temporary: remove the "Encrypted Protocol" lock on the tools section
  // to make these tools accessible to visitors and build out revenue pipelines
  return (
    <div className="relative group w-full h-full">
      {children}
    </div>
  );
}
