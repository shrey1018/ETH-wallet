import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';

const projectId = '<WALLETCONNECT_PROJECT_ID>';

export const config = createConfig({
  autoConnect: true, // Optional: Automatically reconnects to last used wallet
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  provider: http({ chainId: mainnet.id }), // Correct usage of the provider
});