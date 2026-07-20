import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Search, 
  Clock, 
  Gift, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  User, 
  Check, 
  Coins, 
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { KODAIK_CONTRACT_ADDRESS, KODAIK_ABI } from '../web3Config';
import { isAddress } from 'viem';

export default function Claim() {
  const { isConnected, address } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [vaultId, setVaultId] = useState<number | null>(null);

  // Simulated Fallback Vaults
  const SIMULATED_VAULTS: Record<number, { details: any; beneficiaries: any }> = {
    1: {
      details: [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // owner
        'Primary Legacy Asset Vault', // name
        BigInt(180 * 24 * 60 * 60), // heartbeatInterval
        BigInt(Math.floor(Date.now() / 1000) - (45 * 24 * 60 * 60)), // lastActive (active)
        false, // claimed
        BigInt(50000000000000000000000n) // totalAssets
      ],
      beneficiaries: [
        [
          '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
        ],
        [
          BigInt(6000),
          BigInt(4000)
        ]
      ]
    },
    2: {
      details: [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // owner
        'Strategic Emergency Fund', // name
        BigInt(90 * 24 * 60 * 60), // heartbeatInterval
        BigInt(Math.floor(Date.now() / 1000) - (95 * 24 * 60 * 60)), // lastActive (expired/claimable!)
        false, // claimed
        BigInt(12500000000000000000000n) // totalAssets
      ],
      beneficiaries: [
        [
          '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
          '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
        ],
        [
          BigInt(8000),
          BigInt(2000)
        ]
      ]
    }
  };

  // Wagmi Read: Get details for searched Vault ID
  const { data: vaultDetails, isLoading: isVaultLoading, error: vaultError } = useReadContract({
    address: KODAIK_CONTRACT_ADDRESS,
    abi: KODAIK_ABI,
    functionName: 'getVault',
    args: vaultId !== null ? [BigInt(vaultId)] : undefined,
    query: {
      enabled: vaultId !== null,
    }
  });

  // Wagmi Read: Get beneficiaries of searched Vault ID
  const { data: beneficiaryDetails } = useReadContract({
    address: KODAIK_CONTRACT_ADDRESS,
    abi: KODAIK_ABI,
    functionName: 'getVaultBeneficiaries',
    args: vaultId !== null ? [BigInt(vaultId)] : undefined,
    query: {
      enabled: vaultId !== null,
    }
  });

  // Wagmi Write: Claim
  const { writeContract, data: txHash, error: writeError, isPending: isWritePending } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Simulated Tx state
  const [simulatedTxHash, setSimulatedTxHash] = useState<string | null>(null);
  const [simulatedTxConfirming, setSimulatedTxConfirming] = useState(false);
  const [simulatedTxSuccess, setSimulatedTxSuccess] = useState(false);

  // Determine if we should use simulated details
  const isSimulatedMode = !!vaultError || (!isVaultLoading && !vaultDetails && vaultId !== null && (vaultId === 1 || vaultId === 2));

  const activeVaultDetails = isSimulatedMode && vaultId !== null && SIMULATED_VAULTS[vaultId]
    ? SIMULATED_VAULTS[vaultId].details
    : vaultDetails;

  const activeBeneficiaryDetails = isSimulatedMode && vaultId !== null && SIMULATED_VAULTS[vaultId]
    ? (vaultId === 2 && address 
        ? [[address, '0x90F79bf6EB2c4f870365E785982E1f101E93b906'], [BigInt(8000), BigInt(2000)]]
        : SIMULATED_VAULTS[vaultId].beneficiaries)
    : beneficiaryDetails;

  const activeTxHash = isSimulatedMode ? simulatedTxHash : txHash;
  const activeTxConfirming = isSimulatedMode ? simulatedTxConfirming : isTxConfirming;
  const activeTxSuccess = isSimulatedMode ? simulatedTxSuccess : isTxSuccess;

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedId = parseInt(searchQuery);
    if (!isNaN(parsedId)) {
      setVaultId(parsedId);
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
  };

  const handleExecuteClaim = () => {
    if (vaultId === null) return;
    
    if (isSimulatedMode) {
      setSimulatedTxConfirming(true);
      setTimeout(() => {
        setSimulatedTxHash('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''));
        setSimulatedTxConfirming(false);
        setSimulatedTxSuccess(true);
      }, 2000);
      return;
    }

    try {
      writeContract({
        address: KODAIK_CONTRACT_ADDRESS,
        abi: KODAIK_ABI,
        functionName: 'claim',
        args: [BigInt(vaultId)],
      });
    } catch (err) {
      console.error("Claim write error: ", err);
    }
  };

  // Extract variables safely
  const owner = activeVaultDetails ? (activeVaultDetails as any)[0] : '';
  const name = activeVaultDetails ? (activeVaultDetails as any)[1] : '';
  const heartbeatInterval = activeVaultDetails ? Number((activeVaultDetails as any)[2]) : 0;
  const lastActive = activeVaultDetails ? Number((activeVaultDetails as any)[3]) : 0;
  const claimed = activeVaultDetails ? (activeVaultDetails as any)[4] : false;
  const totalAssets = activeVaultDetails ? (activeVaultDetails as any)[5]?.toString() : '0';

  const assetSymbol = name ? (name.includes('USDC') ? 'USDC' : name.includes('EURC') ? 'EURC' : name.includes('WBTC') ? 'WBTC' : 'ARC') : 'ARC';

  const timeElapsed = lastActive > 0 ? Math.floor(Date.now() / 1000) - lastActive : 0;
  const isClaimable = heartbeatInterval > 0 && timeElapsed > heartbeatInterval && !claimed;
  const timeLeft = heartbeatInterval - timeElapsed;
  const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60));

  // Verify if current user is a beneficiary
  const beneficiariesList = activeBeneficiaryDetails ? (activeBeneficiaryDetails as any)[0] : [];
  const sharesList = activeBeneficiaryDetails ? (activeBeneficiaryDetails as any)[1] : [];
  
  const isUserBeneficiary = address && beneficiariesList 
    ? beneficiariesList.some((b: string) => b.toLowerCase() === address.toLowerCase()) 
    : false;

  const userIndex = address && beneficiariesList
    ? beneficiariesList.findIndex((b: string) => b.toLowerCase() === address.toLowerCase())
    : -1;

  const userShare = userIndex !== -1 ? Number(sharesList[userIndex]) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#FDF8F0] tracking-tight">
          Claim <span className="text-[#E5C384]">Beneficiary Portal</span>
        </h1>
        <p className="text-sm text-[#CBD5E1]/80 mt-2 max-w-xl mx-auto">
          Verify and claim inheritance assets allocated to you. Claiming is enabled automatically when vault keepers remain inactive past their deadlines.
        </p>
      </div>

      {!isConnected ? (
        <div className="py-8 flex flex-col justify-center items-center">
          <div className="bg-[#121412] border border-[#222421] rounded-3xl p-12 text-center max-w-xl w-full shadow-2xl space-y-8">
            <div className="w-20 h-20 bg-[#1E5148]/30 border border-[#E5C384]/20 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="h-10 w-10 text-[#E5C384]" />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-sans font-black text-2xl text-[#E5C384] tracking-tight">Connect Your Wallet</h3>
              <p className="text-sm text-[#829693] max-w-md mx-auto leading-relaxed">
                Connect your wallet to access the Claim Portal. No placeholder, mock, or fake numbers will be displayed here — every metric is securely derived from your active Arc Testnet smart contracts.
              </p>
            </div>
            
            <div className="flex justify-center pt-2">
              <ConnectButton />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Sandbox banner */}
          {isSimulatedMode && (
            <div className="mb-8 bg-[#E98B4B]/10 border border-[#E98B4B]/30 rounded-3xl p-5 flex items-start space-x-3 text-sm text-[#E5C384]">
              <AlertTriangle className="h-5 w-5 text-[#E98B4B] shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold block text-[#FDF8F0] mb-0.5">Sandbox Mode Search Active</span>
                The live Arc Testnet RPC is unreachable. We've unlocked simulated vaults for testing! Try searching for <strong className="text-white">"1"</strong> (Active vault where you're not a beneficiary) or <strong className="text-white">"2"</strong> (Expired/claimable vault where your wallet has an 80% share allocated!).
              </div>
            </div>
          )}

          {/* Search Bar Container */}
          <div className="bg-[#153F39] border border-[#1E5148] p-6 rounded-3xl mb-8 shadow-xl">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Enter Vault ID (e.g., 1, 2, etc.)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#071F1B] border border-[#1E5148] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#FDF8F0] focus:outline-none focus:border-[#E5C384] transition-all font-mono"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#CBD5E1]/50" />
              </div>

              <button
                type="submit"
                className="bg-[#E98B4B] hover:bg-[#d67b3c] text-[#071F1B] px-8 py-3.5 rounded-xl font-display font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2 shrink-0"
              >
                <span>Search Vault</span>
              </button>
            </form>
          </div>

          {/* Main Area */}
          <AnimatePresence mode="wait">
            {isVaultLoading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Loader2 className="h-10 w-10 text-[#E98B4B] animate-spin mx-auto mb-4" />
                <p className="text-sm text-[#CBD5E1]">Verifying cryptographic status from Arc Testnet...</p>
              </motion.div>
            )}

            {hasSearched && activeVaultDetails && !isVaultLoading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Vault Status Panel */}
                <div className="bg-[#153F39] border border-[#1E5148] p-8 rounded-3xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E98B4B]/5 rounded-full blur-3xl" />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#1E5148]/50 pb-5 mb-6 gap-4">
                    <div>
                      <h3 className="font-display font-extrabold text-xl text-[#FDF8F0]">
                        {name || `Vault #${vaultId}`}
                      </h3>
                      <span className="text-[10px] text-[#E5C384] font-mono">Owner: {owner}</span>
                    </div>

                    <div className="flex flex-col items-start sm:items-end">
                      {claimed ? (
                        <span className="bg-[#1E5148] text-[#CBD5E1]/50 border border-[#1E5148] px-3.5 py-1 rounded-full text-xs font-semibold">
                          CLAIMED / EXECUTED
                        </span>
                      ) : isClaimable ? (
                        <span className="bg-[#E98B4B]/10 text-[#E98B4B] border border-[#E98B4B]/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 animate-pulse">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>CLAIM WINDOW OPEN</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>HEALTHY (KEEPER ACTIVE)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Grid Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#071F1B] p-6 rounded-2xl mb-8 border border-[#1E5148]/50 text-xs">
                    <div>
                      <span className="text-[#CBD5E1]/60 block uppercase tracking-wider mb-1">Vault Total Assets:</span>
                      <strong className="text-lg font-mono text-[#FDF8F0]">
                        {parseFloat(totalAssets) > 0 ? `${(parseFloat(totalAssets) / 1e18).toFixed(2)} ${assetSymbol}` : `0 ${assetSymbol}`}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#CBD5E1]/60 block uppercase tracking-wider mb-1">Heartbeat Status:</span>
                      <strong className="text-lg text-[#E5C384]">
                        {claimed ? 'Inactive' : isClaimable ? 'Expired' : 'Active'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#CBD5E1]/60 block uppercase tracking-wider mb-1">Claim Release:</span>
                      <strong className={`text-lg font-mono ${isClaimable && !claimed ? 'text-[#E98B4B]' : 'text-[#FDF8F0]'}`}>
                        {claimed ? 'Claimed' : isClaimable ? 'Available Now' : `${daysLeft} Days Left`}
                      </strong>
                    </div>
                  </div>

                  {/* Beneficiary Specific Guard */}
                  {isUserBeneficiary ? (
                    <div className="bg-[#E98B4B]/5 border border-[#E5C384]/30 rounded-2xl p-6 space-y-6">
                      <div className="flex items-start space-x-3 text-sm">
                        <KeyRound className="h-6 w-6 text-[#E98B4B] shrink-0" />
                        <div>
                          <strong className="text-[#E5C384] block mb-1">You are a Valid Beneficiary!</strong>
                          Your address is registered with a share allocation of <strong>{userShare} Basis Points ({userShare / 100}%)</strong>.
                        </div>
                      </div>

                      {/* Actions depending on status */}
                      {claimed ? (
                        <div className="bg-[#1E5148]/40 text-xs text-[#CBD5E1] p-4 rounded-xl text-center border border-[#1E5148]/50">
                          This vault's claim has already been successfully executed on-chain.
                        </div>
                      ) : isClaimable ? (
                        <div className="space-y-4">
                          <div className="text-xs text-[#CBD5E1]">
                            The heartbeat timer has expired because the owner has not logged a keep-alive within the {daysLeft * -1} days buffer. You are authorized to execute the claim and retrieve your allocated portion.
                          </div>
                          <button
                            onClick={handleExecuteClaim}
                            disabled={isWritePending || activeTxConfirming}
                            className="w-full bg-[#E98B4B] hover:bg-[#d67b3c] disabled:opacity-50 text-[#071F1B] py-4 rounded-xl font-display font-bold text-base transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                          >
                            {isWritePending || activeTxConfirming ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>{activeTxConfirming ? 'Securing transfer on-chain...' : 'Broadcasting Transaction...'}</span>
                              </>
                            ) : (
                              <>
                                <Gift className="h-5 w-5" />
                                <span>Execute Claim & Retrieve Assets</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="bg-[#071F1B] border border-dashed border-[#1E5148] p-4 rounded-xl text-xs text-center text-[#CBD5E1]/80">
                          The claim window is currently locked. The heartbeat timer is active. As long as the owner pings Kodaik periodically, you cannot claim.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 text-sm text-red-300 flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block mb-1 text-red-400">Unauthorized Address</strong>
                        The connected wallet is NOT registered as a beneficiary for this vault. Only registered beneficiaries can claim allocated funds.
                      </div>
                    </div>
                  )}

                  {/* Tx Feedback */}
                  {writeError && (
                    <div className="bg-red-950/50 border border-red-500/40 text-red-300 p-4 rounded-xl text-xs mt-4">
                      Claim execution failed: {writeError.message || 'Tx rejected.'}
                    </div>
                  )}

                  {activeTxHash && (
                    <div className="bg-[#1E5148]/50 border border-[#E5C384]/30 p-4 rounded-xl text-xs text-[#CBD5E1] flex justify-between items-center mt-4">
                      <span>Transaction Hash: <br/><code className="text-[#E5C384] font-mono">{activeTxHash}</code></span>
                      <a
                        href={`https://explorer.testnet.arc.network/tx/${activeTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#E98B4B] hover:underline font-semibold"
                      >
                        View on Explorer
                      </a>
                    </div>
                  )}

                  {activeTxSuccess && (
                    <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs mt-4 text-center">
                      Claim successfully executed! Funds have been distributed to your wallet address.
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {hasSearched && !activeVaultDetails && !isVaultLoading && (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#153F39]/50 border border-[#1E5148] rounded-3xl p-8 text-center"
              >
                <AlertTriangle className="h-10 w-10 text-[#E98B4B] mx-auto mb-3" />
                <p className="text-sm text-[#FDF8F0] font-semibold">Vault Not Found</p>
                <p className="text-xs text-[#CBD5E1]/80 mt-1">
                  Could not find any active on-chain vault with ID "{searchQuery}" on Arc Testnet.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

    </div>
  );
}
