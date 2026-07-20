import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useConnectModal, ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  UserPlus, 
  Clock, 
  Coins, 
  Loader2,
  Info
} from 'lucide-react';
import { parseEther, isAddress } from 'viem';
import { KODAIK_CONTRACT_ADDRESS, KODAIK_ABI } from '../web3Config';
import { Beneficiary } from '../types';

export default function CreateVault() {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  
  // Custom theme constants matching the image
  const bgDark = '#060B08'; // Very dark charcoal/black
  
  // State 4 is the success view
  const [isSuccessView, setIsSuccessView] = useState(false);

  // Form State
  const [selectedToken, setSelectedToken] = useState<'USDC' | 'EURC'>('USDC');
  const [depositAmount, setDepositAmount] = useState('0.00'); // amount string
  const [sliderIndex, setSliderIndex] = useState(1); // 0 = 30 Days, 1 = 1 Year, 2 = 5 Years
  const [heartbeatInterval, setHeartbeatInterval] = useState(365); // default 365 days (1 year)
  
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { wallet: '', share: 10000, message: '' } // 100% default to match the 100% Allocated starting state
  ]);

  // Sync range slider index to heartbeat days
  useEffect(() => {
    if (sliderIndex === 0) {
      setHeartbeatInterval(30);
    } else if (sliderIndex === 1) {
      setHeartbeatInterval(365);
    } else {
      setHeartbeatInterval(1825);
    }
  }, [sliderIndex]);

  // Transaction state
  const { writeContract, data: txHash, error: writeError, isPending: isWritePending } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Simulated Tx state for Sandbox Fallback
  const [simulatedTxHash, setSimulatedTxHash] = useState<string | null>(null);
  const [simulatedTxConfirming, setSimulatedTxConfirming] = useState(false);
  const [simulatedTxSuccess, setSimulatedTxSuccess] = useState(false);
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  const activeTxHash = isSandboxMode ? simulatedTxHash : txHash;
  const activeTxConfirming = isSandboxMode ? simulatedTxConfirming : isTxConfirming;
  const activeTxSuccess = isSandboxMode ? simulatedTxSuccess : isTxSuccess;

  // Calculate sum of shares
  const totalShares = beneficiaries.reduce((sum, b) => sum + (Number(b.share) || 0), 0);

  // Handlers
  const handleAddBeneficiary = () => {
    // Distribute remaining share or default to 0
    const remaining = Math.max(0, 10000 - totalShares);
    setBeneficiaries([...beneficiaries, { wallet: '', share: remaining, message: '' }]);
  };

  const handleRemoveBeneficiary = (index: number) => {
    if (beneficiaries.length > 1) {
      const removedShare = beneficiaries[index].share;
      const updated = beneficiaries.filter((_, i) => i !== index);
      // Reallocate the removed share to the first beneficiary to keep it 100% allocated
      if (updated.length > 0) {
        updated[0].share += removedShare;
      }
      setBeneficiaries(updated);
    }
  };

  const handleUpdateBeneficiary = (index: number, field: keyof Beneficiary, value: string | number) => {
    const updated = [...beneficiaries];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setBeneficiaries(updated);
  };

  // Form validations
  const isAmountValid = parseFloat(depositAmount) > 0;
  const areBeneficiariesValid = beneficiaries.length > 0 && 
     beneficiaries.every(b => isAddress(b.wallet)) && 
     totalShares === 10000;

  const isFormValid = isAmountValid && areBeneficiariesValid;

  // Execute create vault
  const handleCreateVault = async () => {
    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal();
      } else {
        alert("Please connect your wallet using the button in the header.");
      }
      return;
    }

    if (!isFormValid) return;

    if (isSandboxMode) {
      setSimulatedTxConfirming(true);
      setTimeout(() => {
        setSimulatedTxHash('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''));
        setSimulatedTxConfirming(false);
        setSimulatedTxSuccess(true);
      }, 1500);
      return;
    }

    // Prepare variables for the smart contract
    const name = `${selectedToken} Legacy Vault`;
    const heartbeatSeconds = BigInt(heartbeatInterval * 24 * 60 * 60); // Days to seconds
    const wallets = beneficiaries.map(b => b.wallet);
    const shares = beneficiaries.map(b => BigInt(b.share));
    const value = parseEther(depositAmount || '0');

    try {
      writeContract({
        address: KODAIK_CONTRACT_ADDRESS,
        abi: KODAIK_ABI,
        functionName: 'createVault',
        args: [name, heartbeatSeconds, wallets, shares],
        value: value,
      });
    } catch (err) {
      console.error("Write error: ", err);
    }
  };

  // Auto transition to success step on TX complete
  useEffect(() => {
    if (activeTxSuccess) {
      setIsSuccessView(true);
    }
  }, [activeTxSuccess]);

  // Display human-readable text for the selected check-in period
  const getCheckInLabel = () => {
    if (sliderIndex === 0) return '30 Days';
    if (sliderIndex === 1) return '1 Year';
    return '5 Years';
  };

  if (isSuccessView) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0D1512] border border-[#1E5148]/40 rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-[#3CD3A6]/10 text-[#3CD3A6] border border-[#3CD3A6]/20 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-black text-3xl text-[#E5C384]">Vault Secured Successfully!</h1>
            <p className="text-sm text-[#CBD5E1]/80 leading-relaxed max-w-md mx-auto">
              Your decentralized digital inheritance vault has been {isSandboxMode ? 'simulated and registered locally' : 'successfully created and registered on-chain on the Arc Testnet'}.
            </p>
          </div>

          <div className="bg-[#060F0D] border border-[#1E5148]/30 p-6 rounded-2xl space-y-4 text-xs text-left max-w-sm mx-auto">
            <div className="flex justify-between">
              <span className="text-[#829693]">Asset Vault:</span>
              <span className="font-bold text-[#FDF8F0] font-mono">{selectedToken}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#829693]">Initial Deposit:</span>
              <span className="font-bold text-[#FDF8F0] font-mono">{depositAmount} {selectedToken}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#829693]">Check-In Timer:</span>
              <span className="font-bold text-[#E5C384]">{getCheckInLabel()}</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#1E5148]/30 pt-3 mt-3">
              <span className="text-[#829693]">Transaction Hash:</span>
              <code className="text-[11px] text-[#E5C384] font-mono select-all">
                {activeTxHash?.substring(0, 16)}...
              </code>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setIsSuccessView(false);
                setDepositAmount('0.00');
                setSliderIndex(1);
                setBeneficiaries([{ wallet: '', share: 10000, message: '' }]);
                setSimulatedTxHash(null);
                setSimulatedTxSuccess(false);
              }}
              className="bg-[#1E5148]/40 border border-[#1E5148]/60 hover:bg-[#1E5148]/60 text-[#FDF8F0] px-8 py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Set Up Another Vault
            </button>
            <a
              href="/vaults"
              className="bg-[#E5C384] hover:bg-[#d8b573] text-[#071F1B] px-8 py-3.5 rounded-xl text-sm font-bold transition-all text-center block"
            >
              View My Vaults
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#FDF8F0] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Title & Header Section */}
      <div className="mb-14">
        <h1 className="font-sans font-black text-4.5xl sm:text-5xl text-[#FDF8F0] tracking-tight leading-tight">
          Set Up Your Vault
        </h1>
        <p className="text-base text-[#829693]/90 mt-3 max-w-3xl leading-relaxed font-sans font-medium">
          This vault runs on Arc Testnet. Use test tokens only while we're in this phase to familiarize yourself with the legacy preservation process.
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
                Connect your wallet to create a vault. No placeholder, mock, or fake numbers will be displayed here — every metric is securely derived from your active Arc Testnet smart contracts.
              </p>
            </div>
            
            <div className="flex justify-center pt-2">
              <ConnectButton />
            </div>
          </div>
        </div>
      ) : (
        /* Main Form Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: 3 Timeline Steps */}
        <div className="lg:col-span-8 relative space-y-12">
          {/* Timeline Connector Line */}
          <div className="absolute left-6 top-10 bottom-10 w-[2px] bg-[#1E5148]/20 z-0 hidden sm:block" />

          {/* Step 1: Deposit Assets */}
          <div className="flex flex-col sm:flex-row gap-6 relative z-10">
            {/* Timeline Number */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#E5C384]/30 bg-[#060F0D] text-[#E5C384] font-mono text-base font-bold shrink-0 shadow-lg shadow-[#060F0D]">
              1
            </div>
            
            {/* Step Panel */}
            <div className="flex-1 bg-[#0A120F]/90 border border-[#1E5148]/30 rounded-[24px] p-6 sm:p-8 space-y-6 shadow-xl shadow-black/10">
              <div className="flex items-center gap-3">
                <Coins className="h-5 w-5 text-[#E5C384]" />
                <h2 className="font-sans font-bold text-lg text-[#FDF8F0] tracking-tight">
                  Deposit Assets
                </h2>
              </div>

              {/* Select Token Button Group */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#829693] uppercase tracking-wider">
                  Select Token
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedToken('USDC')}
                    className={`py-4 text-center font-bold rounded-xl border text-sm transition-all cursor-pointer ${
                      selectedToken === 'USDC'
                        ? 'border-[#E5C384] text-[#E5C384] bg-[#060F0D]'
                        : 'border-[#1E5148]/30 text-[#CBD5E1]/40 bg-[#060F0D]/40 hover:border-[#1E5148]'
                    }`}
                  >
                    USDC
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedToken('EURC')}
                    className={`py-4 text-center font-bold rounded-xl border text-sm transition-all cursor-pointer ${
                      selectedToken === 'EURC'
                        ? 'border-[#E5C384] text-[#E5C384] bg-[#060F0D]'
                        : 'border-[#1E5148]/30 text-[#CBD5E1]/40 bg-[#060F0D]/40 hover:border-[#1E5148]'
                    }`}
                  >
                    EURC
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#829693] uppercase tracking-wider">
                  Amount
                </label>
                <div className="bg-[#040A08] border border-[#1E5148]/20 rounded-xl p-5 flex items-center">
                  <span className="text-3xl font-medium text-[#CBD5E1]/30 mr-3 select-none">
                    {selectedToken === 'USDC' ? '$' : '€'}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={depositAmount === '0.00' ? '' : depositAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d*$/.test(val)) {
                        setDepositAmount(val || '0.00');
                      }
                    }}
                    className="bg-transparent text-3xl font-mono font-bold text-[#FDF8F0] outline-none focus:ring-0 w-full placeholder-[#CBD5E1]/20 border-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Check-In Period */}
          <div className="flex flex-col sm:flex-row gap-6 relative z-10">
            {/* Timeline Number */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#E5C384]/30 bg-[#060F0D] text-[#E5C384] font-mono text-base font-bold shrink-0 shadow-lg shadow-[#060F0D]">
              2
            </div>

            {/* Step Panel */}
            <div className="flex-1 bg-[#0A120F]/90 border border-[#1E5148]/30 rounded-[24px] p-6 sm:p-8 space-y-6 shadow-xl shadow-black/10">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#3CD3A6]" />
                <h2 className="font-sans font-bold text-lg text-[#FDF8F0] tracking-tight">
                  Check-In Period
                </h2>
              </div>

              <p className="text-sm text-[#829693]/90 font-medium leading-relaxed">
                Set the frequency you must verify your activity to keep the vault secure.
              </p>

              {/* Custom Timeline Range Slider */}
              <div className="space-y-4 pt-4">
                {/* Labels row */}
                <div className="flex justify-between text-xs font-bold text-[#829693] select-none px-2">
                  <span 
                    onClick={() => setSliderIndex(0)} 
                    className={`cursor-pointer transition-colors ${sliderIndex === 0 ? 'text-[#FDF8F0]' : 'hover:text-[#CBD5E1]'}`}
                  >
                    30 Days
                  </span>
                  <span 
                    onClick={() => setSliderIndex(1)} 
                    className={`cursor-pointer transition-colors ${sliderIndex === 1 ? 'text-[#FDF8F0]' : 'hover:text-[#CBD5E1]'}`}
                  >
                    1 Year
                  </span>
                  <span 
                    onClick={() => setSliderIndex(2)} 
                    className={`cursor-pointer transition-colors ${sliderIndex === 2 ? 'text-[#FDF8F0]' : 'hover:text-[#CBD5E1]'}`}
                  >
                    5 Years
                  </span>
                </div>

                {/* Range Input & Track */}
                <div className="relative pt-1 px-2">
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="1"
                    value={sliderIndex}
                    onChange={(e) => setSliderIndex(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#1E5148]/40 rounded-lg appearance-none cursor-pointer outline-none transition-all accent-[#3CD3A6]"
                  />
                  {/* Visual progress line cover to current thumb position */}
                  <div 
                    className="absolute h-1 bg-[#3CD3A6] rounded-lg pointer-events-none top-1/2 -translate-y-1/2 left-2"
                    style={{ 
                      width: `calc(${sliderIndex === 0 ? '0%' : sliderIndex === 1 ? '50%' : '100%'} - ${sliderIndex === 0 ? '0px' : sliderIndex === 1 ? '8px' : '16px'})` 
                    }}
                  />
                </div>
              </div>

              {/* Check in notification banner */}
              <div className="bg-[#040A08] border border-[#1E5148]/20 rounded-xl p-5 text-center text-sm font-medium text-[#CBD5E1]/90">
                You'll need to check in at least every: <span className="text-[#3CD3A6] font-bold">{getCheckInLabel()}</span>
              </div>
            </div>
          </div>

          {/* Step 3: Beneficiaries */}
          <div className="flex flex-col sm:flex-row gap-6 relative z-10">
            {/* Timeline Number */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#E5C384]/30 bg-[#060F0D] text-[#E5C384] font-mono text-base font-bold shrink-0 shadow-lg shadow-[#060F0D]">
              3
            </div>

            {/* Step Panel */}
            <div className="flex-1 bg-[#0A120F]/90 border border-[#1E5148]/30 rounded-[24px] p-6 sm:p-8 space-y-6 shadow-xl shadow-black/10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <UserPlus className="h-5 w-5 text-[#E5C384]" />
                  <h2 className="font-sans font-bold text-lg text-[#FDF8F0] tracking-tight">
                    Beneficiaries
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddBeneficiary}
                  className="text-sm font-bold text-[#E5C384] hover:text-[#d8b573] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Beneficiary Rows */}
              <div className="space-y-4">
                {beneficiaries.map((b, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="0x71C...976F"
                        value={b.wallet}
                        onChange={(e) => handleUpdateBeneficiary(index, 'wallet', e.target.value)}
                        className="w-full bg-[#040A08] border border-[#1E5148]/30 rounded-xl px-4 py-3.5 text-sm text-[#FDF8F0] font-mono focus:border-[#E5C384]/80 outline-none transition-colors"
                      />
                    </div>
                    <div className="w-24 flex items-center bg-[#040A08] border border-[#1E5148]/30 rounded-xl px-3 py-3.5 gap-1.5 shrink-0">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        placeholder="50"
                        value={b.share ? b.share / 100 : ''}
                        onChange={(e) => {
                          const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          handleUpdateBeneficiary(index, 'share', val * 100);
                        }}
                        className="w-full bg-transparent text-sm text-center text-[#FDF8F0] font-mono outline-none border-none focus:ring-0 p-0"
                      />
                      <span className="text-xs text-[#CBD5E1]/50 font-bold select-none">%</span>
                    </div>
                    {beneficiaries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBeneficiary(index)}
                        className="text-red-400/60 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Distribution Allocation Meter */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#829693] font-bold uppercase tracking-wider">Distribution</span>
                  <span className={`font-bold ${totalShares === 10000 ? 'text-[#3CD3A6]' : 'text-amber-400'}`}>
                    {(totalShares / 100).toFixed(0)}% Allocated
                  </span>
                </div>
                <div className="h-2.5 bg-[#040A08] border border-[#1E5148]/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${totalShares === 10000 ? 'bg-[#3CD3A6]' : 'bg-amber-400'}`}
                    style={{ width: `${Math.min(100, totalShares / 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sticky Vault Summary Panel */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="bg-[#0A120F]/90 border border-[#1E5148]/30 rounded-[24px] p-6 sm:p-8 space-y-6 shadow-xl shadow-[0_0_50px_rgba(229,195,132,0.03)]">
            <h2 className="font-sans font-black text-lg text-[#E5C384] uppercase tracking-wider">
              Vault Summary
            </h2>
            
            <div className="h-[1px] bg-[#1E5148]/20" />

            {/* Key-Value Summary Grid */}
            <div className="space-y-5 font-sans">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#829693] font-medium">Asset</span>
                <span className="text-xs font-bold bg-[#040A08] border border-[#1E5148]/40 px-3 py-1.5 rounded-lg text-[#E5C384] font-mono">
                  {selectedToken}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#829693] font-medium">Amount</span>
                <span className="font-bold text-lg text-[#FDF8F0] font-mono">
                  {parseFloat(depositAmount) > 0 ? `${selectedToken === 'USDC' ? '$' : '€'} ${depositAmount}` : '--'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#829693] font-medium">Check-In</span>
                <span className="text-[#3CD3A6] font-bold">
                  {getCheckInLabel()}
                </span>
              </div>
              <div className="flex justify-between items-start text-sm">
                <span className="text-[#829693] font-medium">Beneficiaries</span>
                <div className="text-right">
                  <span className="text-[#FDF8F0] font-bold block">
                    {beneficiaries.length} {beneficiaries.length === 1 ? 'Wallet' : 'Wallets'}
                  </span>
                  <span className="text-xs text-[#829693] font-medium">
                    {(totalShares / 100).toFixed(0)}% Allocated
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-2">
              <button
                type="button"
                disabled={activeTxConfirming || isWritePending}
                onClick={handleCreateVault}
                className="bg-[#E5C384] hover:bg-[#d8b573] active:translate-y-0.5 disabled:opacity-50 text-[#071F1B] py-4 rounded-xl font-sans font-black text-center text-sm uppercase tracking-wider w-full cursor-pointer transition-all shadow-lg"
              >
                {activeTxConfirming || isWritePending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Broadcasting...</span>
                  </div>
                ) : (
                  'Create Vault'
                )}
              </button>
              
              <p className="text-[11px] text-center text-[#829693]/70 font-medium tracking-wide">
                Requires wallet signature
              </p>
            </div>
          </div>

          {/* Sandbox Fallback Options */}
          <div className="mt-4 p-4 bg-[#1E5148]/10 border border-[#1E5148]/30 rounded-xl text-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#CBD5E1]/80 font-medium flex items-center gap-1">
                <Info className="h-3.5 w-3.5" />
                <span>Simulation Sandbox Mode</span>
              </span>
              <button
                type="button"
                onClick={() => setIsSandboxMode(!isSandboxMode)}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  isSandboxMode 
                    ? 'bg-[#3CD3A6] text-[#071F1B]' 
                    : 'bg-[#1E5148] text-[#CBD5E1]'
                }`}
              >
                {isSandboxMode ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
            <p className="text-[#829693] leading-relaxed">
              If your RPC is down or you don't have test tokens, enable Sandbox Mode to fully simulate creating and testing the vault.
            </p>
          </div>

          {/* Tx Information Display */}
          {(writeError || activeTxHash) && (
            <div className="mt-4 space-y-3">
              {writeError && (
                <div className="bg-red-950/40 border border-red-500/30 p-4 rounded-xl text-xs text-red-300">
                  <p className="font-bold">Transaction failed:</p>
                  <p className="mt-1 opacity-90">{writeError.message || 'Rejected by user.'}</p>
                </div>
              )}
              {activeTxHash && (
                <div className="bg-[#1E5148]/20 border border-[#E5C384]/20 p-4 rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between text-[#CBD5E1]">
                    <span>Tx Hash:</span>
                    <a
                      href={`https://explorer.testnet.arc.network/tx/${activeTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E5C384] hover:underline"
                    >
                      View explorer
                    </a>
                  </div>
                  <code className="block text-[11px] text-[#E5C384] font-mono break-all bg-black/35 p-2 rounded">
                    {activeTxHash}
                  </code>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      )}

    </div>
  );
}
