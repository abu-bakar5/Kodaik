import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@rainbow-me/rainbowkit/styles.css';

// Web3 Config
import { config } from './web3Config';

// Layout & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateVault from './pages/CreateVault';
import MyVaults from './pages/MyVaults';
import Claim from './pages/Claim';
import HowItWorks from './pages/HowItWorks';

// Initialize React Query Client for Wagmi
const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#E98B4B',
            accentColorForeground: '#071F1B',
            borderRadius: 'large',
            fontStack: 'system',
          })}
        >
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-[#0B2B26] text-[#FDF8F0] selection:bg-[#E98B4B]/30 selection:text-[#E98B4B]">
              <Navbar />
              
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create" element={<CreateVault />} />
                  <Route path="/vaults" element={<MyVaults />} />
                  <Route path="/claim" element={<Claim />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
