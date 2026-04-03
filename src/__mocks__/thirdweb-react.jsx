import React from 'react';
let activeAccountMock = null;

export function setActiveAccountMock(account) {
  activeAccountMock = account;
}

export function useActiveAccount() {
  return activeAccountMock;
}

export function ThirdwebProvider({ children }) {
  return <>{children}</>;
}

export function ConnectButton() {
  return <button className="tw-connect-wallet">Connect Wallet</button>;
}
