import { useRef } from 'react';
import './App.css';

import { 
  http, 
  createConfig, 
  WagmiProvider, 
  useConnect, 
  useAccount, 
  useBalance, 
  useSendTransaction 
} from 'wagmi'; // Importing wagmi hooks and utilities
import { mainnet } from 'wagmi/chains'; // Mainnet chain configuration
import { injected } from 'wagmi/connectors'; // Connector for injected wallets (e.g., MetaMask)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure React Query client for data fetching
const queryClient = new QueryClient();

// Configure Wagmi for blockchain interaction
export const config = createConfig({
  chains: [mainnet], // Use Ethereum Mainnet
  connectors: [
    injected(), // Allow wallet connections via injected wallets (e.g., MetaMask)
  ],
  transports: {
    [mainnet.id]: http(), // Use HTTP transport for connecting to Mainnet
  },
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <div>
          <WalletConnector /> {/* Component to connect a wallet */}
          <EthSend /> {/* Component to send ETH */}
          <MyAddress /> {/* Component to display wallet address and balance */}
        </div>
      </QueryClientProvider> 
    </WagmiProvider>
  );
}

function MyAddress() {
  // Fetch account address and balance using wagmi hooks
  const { address } = useAccount(); // Get the connected wallet address
  const balance = useBalance({ address }); // Fetch the balance for the connected address

  return (
    <div>
      {/* Display wallet address and balance */}
      Wallet Address: {address || "Not connected"} <br />
      Balance: {balance?.data?.formatted || "Loading..."} ETH
    </div>
  );
}

function EthSend() {
  // Wagmi hook for sending transactions
  const { sendTransaction } = useSendTransaction();
  const addressRef = useRef(null); // Reference to input for recipient address

  // Function to send 0.1 ETH to the entered address
  function sendEth() {
    const address = addressRef.current.value; // Get address from input
    sendTransaction({
      to: address, // Recipient address
      value: "100000000000000000", // Amount in wei (0.1 ETH)
    });
  }

  return (
    <div>
      <input ref={addressRef} type="text" placeholder="Recipient address..." />
      <button onClick={sendEth}>Send 0.1 ETH</button>
    </div>
  );
}

function WalletConnector() {
  // Wagmi hook for connecting wallets
  const { connectors, connect } = useConnect();

  return (
    <div>
      {/* List available wallet connectors */}
      {connectors.map((connector) => (
        <button 
          key={connector.id} 
          onClick={() => connect({ connector })}>
          Connect with {connector.name}
        </button>
      ))}
    </div>
  );
}

export default App;