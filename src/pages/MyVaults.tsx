import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Plus, 
  AlertCircle, 
  Check, 
  Lock,
  Loader2,
  Wallet,
  ExternalLink
} from 'lucide-react';
import { KODAIK_CONTRACT_ADDRESS, KODAIK_ABI } from '../web3Config';
import { Link } from 'react-router-dom';
import { formatEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Render Currency Icons nicely matching USDC / EURC / WBTC / ARC
const renderCoinIcon = (symbol: string) => {
  if (symbol === 'USDC') {
    return (
      <div className="w-11 h-11 rounded-full bg-[#1A2E3B] border border-[#2D668F]/20 flex items-center justify-center shrink-0">
        <span className="text-[#3AA5EC] font-sans font-black text-lg select-none">$</span>
      </div>
    );
  }
  if (symbol === 'EURC') {
    return (
      <div className="w-11 h-11 rounded-full bg-[#122A25] border border-[#235F53]/20 flex items-center justify-center shrink-0">
        <span className="text-[#35DCA5] font-sans font-black text-lg select-none">€</span>
      </div>
    );
  }
  if (symbol === 'WBTC') {
    return (
      <div className="w-11 h-11 rounded-full bg-[#2C2112] border border-amber-600/20 flex items-center justify-center shrink-0">
        <span className="text-amber-500 font-sans font-black text-lg select-none">₿</span>
      </div>
    );
  }
  // Default to native ARC
  return (
    <div className="w-11 h-11 rounded-full bg-[#1E3B2E] border border-[#E5C384]/20 flex items-center justify-center shrink-0">
      <span className="text-[#E5C384] font-sans font-black text-sm select-none">ARC</span>
    </div>
  );
};

// Render Circular Gauge
const renderCircularGauge = (num: string, unit: string, percent: number, status: string) => {
  const radius = 48;
  const strokeWidth = 5.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  const isCritical = status === 'Critical';
  const progressColor = isCritical ? '#F87171' : '#E5C384';

  return (
    <div className="flex justify-center my-8">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90">
          {/* Background Circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="transparent"
            stroke="#212421"
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="transparent"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="text-center z-10 px-2">
          <div className="text-4xl font-sans font-black text-[#FDF8F0] tracking-tight leading-none">
            {num}
          </div>
          <div className="text-[10px] font-sans font-extrabold tracking-widest text-[#829693] uppercase mt-2 truncate max-w-[100px]">
            {unit}
          </div>
        </div>
      </div>
    </div>
  );
};

// VaultCard reads individual vault status directly on-chain
function VaultCard({ 
  vaultId, 
  onRefetch,
  onNotify
}: { 
  key?: string;
  vaultId: bigint; 
  onRefetch: any;
  onNotify: (msg: string, type: 'success' | 'error') => void;
}) {
  // Read basic properties
  const { data: vaultData, isLoading: isVaultLoading, refetch: refetchVault } = useReadContract({
    address: KODAIK_CONTRACT_ADDRESS,
    abi: KODAIK_ABI,
    functionName: 'getVault',
    args: [vaultId],
  });

  // Read beneficiaries
  const { data: beneficiariesData, isLoading: isBeneficiariesLoading, refetch: refetchBeneficiaries } = useReadContract({
    address: KODAIK_CONTRACT_ADDRESS,
    abi: KODAIK_ABI,
    functionName: 'getVaultBeneficiaries',
    args: [vaultId],
  });

  // Reset heartbeat action
  const { writeContract, data: txHash, error: writeError, isPending: isWritePending } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isTxSuccess) {
      refetchVault();
      refetchBeneficiaries();
      onRefetch();
      onNotify(`Keep-alive heartbeat reset verified for Vault #${vaultId.toString()}!`, 'success');
    }
  }, [isTxSuccess]);

  useEffect(() => {
    if (writeError) {
      onNotify(writeError.message || "Keep-alive transaction failed.", 'error');
    }
  }, [writeError]);

  if (isVaultLoading || isBeneficiariesLoading) {
    return (
      <div className="bg-[#121412] border border-[#222421] rounded-[24px] p-8 shadow-xl flex flex-col items-center justify-center min-h-[350px] space-y-4">
        <Loader2 className="h-8 w-8 text-[#E5C384] animate-spin" />
        <p className="text-xs text-[#829693]">Loading Vault details...</p>
      </div>
    );
  }

  if (!vaultData) return null;

  // Extract variables with type safety for tuple or object formats
  const name = (vaultData as any).name ?? (vaultData as any)[1] ?? `Vault #${vaultId.toString()}`;
  const heartbeatInterval = (vaultData as any).heartbeatInterval ?? (vaultData as any)[2] ?? 0n;
  const lastActive = (vaultData as any).lastActive ?? (vaultData as any)[3] ?? 0n;
  const claimed = (vaultData as any).claimed ?? (vaultData as any)[4] ?? false;
  const totalAssets = (vaultData as any).totalAssets ?? (vaultData as any)[5] ?? 0n;

  const wallets = (beneficiariesData as any)?.wallets ?? (beneficiariesData as any)?.[0] ?? [];
  const shares = (beneficiariesData as any)?.shares ?? (beneficiariesData as any)?.[1] ?? [];

  const heartbeatIntervalNum = Number(heartbeatInterval);
  const lastActiveNum = Number(lastActive);
  const totalAssetsBigInt = BigInt(totalAssets);
  const isClaimed = !!claimed;

  const expirationTime = lastActiveNum + heartbeatIntervalNum;
  const now = Math.floor(Date.now() / 1000);
  const remainingSeconds = expirationTime - now;

  let status: 'Active' | 'Attention' | 'Critical' | 'Executed' = 'Active';
  let countdownNum = '0';
  let countdownUnit = 'DAYS';
  let progressPercent = 0;

  if (isClaimed) {
    status = 'Executed';
    countdownNum = '0';
    countdownUnit = 'CLAIMED';
    progressPercent = 0;
  } else if (remainingSeconds <= 0) {
    status = 'Executed';
    countdownNum = '0';
    countdownUnit = 'EXPIRED';
    progressPercent = 0;
  } else {
    progressPercent = heartbeatIntervalNum > 0 
      ? Math.max(1, Math.min(100, Math.ceil((remainingSeconds / heartbeatIntervalNum) * 100))) 
      : 0;

    if (remainingSeconds > 30 * 24 * 3600) {
      const months = Math.ceil(remainingSeconds / (30 * 24 * 3600));
      countdownNum = months.toString();
      countdownUnit = months === 1 ? 'MONTH' : 'MONTHS';
    } else if (remainingSeconds > 24 * 3600) {
      const days = Math.ceil(remainingSeconds / (24 * 3600));
      countdownNum = days.toString();
      countdownUnit = days === 1 ? 'DAY' : 'DAYS';
      if (days <= 7) {
        status = 'Attention';
      }
    } else {
      const hours = Math.ceil(remainingSeconds / 3600);
      countdownNum = hours.toString();
      countdownUnit = hours === 1 ? 'HOUR' : 'HOURS';
      status = 'Critical';
    }
  }

  const assetSymbol = name.includes('USDC') ? 'USDC' : name.includes('EURC') ? 'EURC' : name.includes('WBTC') ? 'WBTC' : 'ARC';

  const formattedAssets = parseFloat(formatEther(totalAssetsBigInt)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });

  const isActiveStatus = status === 'Active';
  const isAttentionStatus = status === 'Attention';
  const isCriticalStatus = status === 'Critical';
  const isExecutedStatus = status === 'Executed';

  let badgeStyles = 'text-[#A1A5A0] bg-[#1E201E] border border-[#3E423D]/25'; 
  if (isActiveStatus) badgeStyles = 'text-[#A7B39E] bg-[#1F221B] border border-[#3A4532]/30';
  if (isAttentionStatus) badgeStyles = 'text-[#E5C384] bg-[#2E2A1C] border border-[#524B31]/30';
  if (isCriticalStatus) badgeStyles = 'text-[#FCA5A5] bg-[#3B1A1A] border border-[#6B2D2D]/30';

  const handlePing = () => {
    try {
      writeContract({
        address: KODAIK_CONTRACT_ADDRESS,
        abi: KODAIK_ABI,
        functionName: 'ping',
        args: [vaultId],
      });
    } catch (err) {
      console.error("Ping error: ", err);
    }
  };

  const isPending = isWritePending || isTxConfirming;

  return (
    <div className="bg-[#121412] border border-[#222421] rounded-[24px] p-8 shadow-xl transition-all hover:border-[#E5C384]/20 flex flex-col justify-between">
      <div>
        {/* Card Header Line */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-3">
            {renderCoinIcon(assetSymbol)}
            <div>
              <div className="text-xs font-bold text-[#829693] tracking-wider uppercase font-sans">
                {name}
              </div>
              <div className="text-2xl font-sans font-extrabold text-[#FDF8F0] tracking-tight mt-0.5">
                {formattedAssets} <span className="text-xs text-[#829693] font-medium">{assetSymbol}</span>
              </div>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-extrabold font-sans select-none tracking-wide ${badgeStyles}`}>
            {status}
          </div>
        </div>

        {/* Progress Circular Gauge or Expired Box */}
        {isExecutedStatus ? (
          <div className="flex justify-center my-8">
            <div className="w-36 h-36 rounded-2xl border border-dashed border-[#212421] flex flex-col items-center justify-center gap-3 bg-[#0B0C0B]/40 select-none">
              <div className="w-10 h-10 rounded-full bg-[#1A1C1A] border border-[#2D302D] flex items-center justify-center text-[#829693]">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-sans font-black tracking-wider text-[#829693] text-center max-w-[90px] leading-tight uppercase">
                {isClaimed ? 'Fully Claimed' : 'Deadline Passed'}
              </div>
            </div>
          </div>
        ) : (
          renderCircularGauge(countdownNum, countdownUnit, progressPercent, status)
        )}

        {/* Beneficiaries row */}
        <div className="flex items-center justify-between pb-6 border-b border-[#212421]/60">
          <span className="text-xs font-bold text-[#829693] font-sans select-none">
            Beneficiaries ({wallets.length})
          </span>
          <div className="flex -space-x-2 overflow-hidden">
            {wallets.map((wallet: string, i: number) => {
              const sharePercent = shares[i] ? Number(shares[i]) : 0;
              const displayShare = sharePercent / 100;
              return (
                <div
                  key={i}
                  title={`${wallet}: ${displayShare}% share`}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-[#121412] bg-[#1E5148] text-[#E5C384] text-[10px] font-mono font-bold select-none border border-[#E5C384]/20 cursor-help"
                >
                  {wallet.slice(2, 4).toUpperCase()}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Keep Alive Action Button */}
      <div className="pt-6">
        {isExecutedStatus ? (
          <a
            href="https://explorer.testnet.arc.network"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#1C1D1B] text-[#829693] hover:bg-[#252723] hover:text-[#CBD5E1] py-3.5 rounded-xl font-sans font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#2D302C] transition-all"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span>View on ArcScan</span>
          </a>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={handlePing}
            className={`w-full py-3.5 rounded-xl font-sans font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg select-none flex items-center justify-center gap-2 ${
              isCriticalStatus 
                ? 'bg-[#FCA5A5] hover:bg-[#fca5a5]/95 text-[#071F1B]' 
                : 'bg-[#E5C384] hover:bg-[#d8b573] text-[#071F1B]'
            } disabled:opacity-50`}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#071F1B]" />
                <span>Resetting Heartbeat...</span>
              </>
            ) : (
              <span>{isCriticalStatus ? 'Check In Immediately' : 'Check In Now'}</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MyVaults() {
  const { address, isConnected } = useAccount();

  // Get user's actual on-chain vault IDs from the contract
  const { data: userVaultIds, isLoading: isIdsLoading, isError: isIdsError, refetch: refetchVaultIds } = useReadContract({
    address: KODAIK_CONTRACT_ADDRESS,
    abi: KODAIK_ABI,
    functionName: 'getUserVaults',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  // Global Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    show: boolean;
  }>({
    type: 'success',
    message: '',
    show: false
  });

  const triggerNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      type,
      message,
      show: true
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  return (
    <div className="min-h-screen text-[#FDF8F0] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {!isConnected ? (
        <div className="py-16 flex flex-col justify-center items-center">
          <div className="bg-[#121412] border border-[#222421] rounded-3xl p-12 text-center max-w-xl w-full shadow-2xl space-y-8">
            <div className="w-20 h-20 bg-[#1E5148]/30 border border-[#E5C384]/20 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="h-10 w-10 text-[#E5C384]" />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-sans font-black text-2xl text-[#E5C384] tracking-tight">Connect Your Wallet</h3>
              <p className="text-sm text-[#829693] max-w-md mx-auto leading-relaxed">
                Connect your wallet to view your vaults. No placeholder, mock, or fake numbers will be displayed here — every metric is securely derived from your active Arc Testnet smart contracts.
              </p>
            </div>
            
            <div className="flex justify-center pt-2">
              <ConnectButton />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div className="space-y-4">
              <h1 className="font-sans font-black text-4.5xl sm:text-5xl text-[#E5C384] tracking-tight leading-none">
                Your Vaults
              </h1>
              
              {/* Wallet address pill */}
              <div className="inline-flex items-center gap-2 bg-[#121412] border border-[#222421] rounded-xl px-4 py-2.5">
                <Wallet className="h-4 w-4 text-[#829693]" />
                <span className="text-xs font-mono font-bold text-[#FDF8F0] select-all">
                  {address}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/create"
                className="border border-[#E5C384]/30 hover:border-[#E5C384] text-[#E5C384] px-5 py-3 rounded-xl font-sans font-black text-xs transition-all flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Vault</span>
              </Link>
            </div>
          </div>

          {isIdsLoading ? (
            <div className="text-center py-24 space-y-4 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-[#E5C384] animate-spin" />
              <p className="text-sm text-[#829693]">Loading your on-chain vaults from Arc Testnet...</p>
            </div>
          ) : isIdsError ? (
            <div className="bg-[#121412] border border-[#222421] rounded-3xl p-12 text-center max-w-lg mx-auto">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="font-sans font-black text-lg text-[#FDF8F0] mb-2">Error Querying Vaults</h3>
              <p className="text-xs text-[#829693] mb-6 leading-relaxed">
                Could not read from the Arc Testnet smart contract. Please check your network connection and RPC availability.
              </p>
              <button
                onClick={() => refetchVaultIds()}
                className="inline-flex bg-[#E5C384] hover:bg-[#d8b573] text-[#071F1B] px-8 py-3.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all"
              >
                Retry Request
              </button>
            </div>
          ) : !userVaultIds || userVaultIds.length === 0 ? (
            <div className="bg-[#121412] border border-[#222421] rounded-3xl p-12 text-center max-w-lg mx-auto">
              <AlertCircle className="h-12 w-12 text-[#E5C384] mx-auto mb-4" />
              <h3 className="font-sans font-black text-lg text-[#FDF8F0] mb-2">No Vaults Found</h3>
              <p className="text-xs text-[#829693] mb-6 leading-relaxed">
                You haven't created any vaults yet.
              </p>
              <Link
                to="/create"
                className="inline-flex bg-[#E5C384] hover:bg-[#d8b573] text-[#071F1B] px-8 py-3.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all"
              >
                Create Your First Vault
              </Link>
            </div>
          ) : (
            /* The Vault Grid rendering real on-chain vaults */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userVaultIds.map((id) => (
                <VaultCard 
                  key={id.toString()} 
                  vaultId={id} 
                  onRefetch={refetchVaultIds} 
                  onNotify={triggerNotification}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Notifications / Toast overlays */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 bg-[#0E1512] border border-[#1E5148]/60 text-[#FDF8F0] px-5 py-4 rounded-xl shadow-2xl flex items-center space-x-3 z-50 max-w-sm"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              notification.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-[#3CD3A6]/10 text-[#3CD3A6]'
            }`}>
              <Check className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold leading-relaxed">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
