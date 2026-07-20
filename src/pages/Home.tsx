import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, UserPlus, Shield, Code2, Landmark } from 'lucide-react';
// @ts-expect-error - local image asset
import vaultDoorImg from '../assets/images/vault_door_1784553560280.jpg';

export default function Home() {
  return (
    <div className="bg-[#041C16] text-[#FDF8F0] min-h-screen relative overflow-hidden">
      
      {/* Ambient background glows for the premium aesthetic */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1E5148]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#E98B4B]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Title & Intro */}
          <div className="lg:col-span-7 space-y-8 flex flex-col items-start text-left">
            
            {/* Slanted "TESTNET PHASE" Stamp Badge */}
            <div className="inline-flex items-center space-x-2 border border-[#E5C384]/80 bg-[#041C16] px-4 py-1.5 text-xs font-mono font-bold tracking-widest text-[#E5C384] rounded shadow-md -rotate-[6deg] select-none mb-2">
              <Lock className="h-3.5 w-3.5 text-[#E5C384] fill-[#E5C384]/20" />
              <span>TESTNET PHASE</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] tracking-tight text-[#FDF8F0] leading-[1.05] text-left">
              Your Legacy, <br />
              <span className="text-[#E5C384]">Secured On-</span> <br />
              Chain
            </h1>

            {/* Body Description */}
            <p className="text-[#829693] text-base sm:text-lg md:text-xl max-w-xl leading-relaxed font-normal">
              The decentralized digital inheritance vault. Lock your USDC/EURC securely, nominate beneficiaries, and ensure your wealth transitions smoothly across generations without custodial risk.
            </p>

            {/* Action Button */}
            <div className="pt-4 w-full sm:w-auto">
              <Link
                to="/create"
                className="inline-flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-[#E5C384] to-[#E98B4B] hover:brightness-110 active:translate-y-0.5 text-[#071F1B] px-10 py-5 rounded-lg font-sans font-black text-base tracking-wide transition-all shadow-xl shadow-amber-500/10 cursor-pointer"
              >
                CREATE A VAULT
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Vault Door */}
          <div className="lg:col-span-5 flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[480px] aspect-square rounded-full overflow-hidden shadow-[0_0_80px_rgba(229,195,132,0.15)] border-4 border-[#E5C384]/15 group"
            >
              <img
                src={vaultDoorImg}
                alt="Golden Vault Door"
                className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Inner golden ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#041C16]/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>

        </div>
      </div>

      {/* Mid Banner (Metrics Bar) */}
      <div className="bg-[#081512] border-t border-b border-[#1E5148]/20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-sans font-medium text-xl sm:text-2xl md:text-3xl text-[#FDF8F0] tracking-tight leading-relaxed max-w-4xl mx-auto">
            Kodaik currently secures <span className="text-[#E5C384] font-black tracking-tight">$5.2M+</span> across <span className="text-[#E5C384] font-black tracking-tight">1,204</span> vaults for <span className="text-[#E5C384] font-black tracking-tight">2,850</span> beneficiaries.
          </p>
        </div>
      </div>

      {/* Why Choose Kodaik Section (Card design) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32">
        <div className="bg-[#07241E] border border-[#1E5148]/30 rounded-[32px] p-8 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden">
          {/* Subtle gold spotlight on the card */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E5C384]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Benefits List */}
            <div className="lg:col-span-7 space-y-10">
              <h2 className="font-sans font-black text-3xl sm:text-4xl md:text-[40px] text-[#FDF8F0] tracking-tight">
                Why Kodaik?
              </h2>
              
              <div className="space-y-8">
                {/* Benefit 1 */}
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-[#0A2E26] border border-[#1E5148]/50 p-2.5 rounded-xl shadow-inner text-[#E5C384] shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg text-[#E5C384]">Flexible Check-In</h3>
                    <p className="text-sm text-[#829693] mt-1 leading-relaxed">
                      Set custom heartbeat intervals to prove you are active.
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-[#0A2E26] border border-[#1E5148]/50 p-2.5 rounded-xl shadow-inner text-[#E5C384] shrink-0">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg text-[#E5C384]">Multiple Beneficiaries</h3>
                    <p className="text-sm text-[#829693] mt-1 leading-relaxed">
                      Allocate shares of your vault to different wallet addresses.
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-[#0A2E26] border border-[#1E5148]/50 p-2.5 rounded-xl shadow-inner text-[#E5C384] shrink-0">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg text-[#E5C384]">Full Control</h3>
                    <p className="text-sm text-[#829693] mt-1 leading-relaxed">
                      Cancel, edit, or withdraw funds at any time while active.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Greek Temple Bank SVG Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <svg 
                viewBox="0 0 100 100" 
                className="w-48 h-48 sm:w-56 sm:h-56 text-[#E5C384]/70 select-none filter drop-shadow-[0_0_15px_rgba(229,195,132,0.1)]" 
                stroke="currentColor" 
                fill="none" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {/* Triangular Roof (Pediment) */}
                <polygon points="50,15 15,38 85,38" />
                {/* Architrave (horizontal beam) */}
                <line x1="18" y1="44" x2="82" y2="44" strokeWidth="5.5" />
                {/* 3 Pillars / Columns */}
                <rect x="25" y="44" width="10" height="32" rx="1" strokeWidth="4" />
                <rect x="45" y="44" width="10" height="32" rx="1" strokeWidth="4" />
                <rect x="65" y="44" width="10" height="32" rx="1" strokeWidth="4" />
                {/* Base Steps */}
                <line x1="13" y1="76" x2="87" y2="76" strokeWidth="5.5" />
                <line x1="8" y1="83" x2="92" y2="83" strokeWidth="6" />
              </svg>
            </div>

          </div>
        </div>
      </div>

      {/* Horizontal Trust Badges Ribbon / Ticker */}
      <div className="border-t border-[#1E5148]/20 bg-[#031511] py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-around gap-y-6 gap-x-8 text-center">
          
          <div className="flex items-center space-x-3 text-[#FDF8F0] font-sans font-black text-sm sm:text-base tracking-widest uppercase">
            <Shield className="h-5 w-5 text-[#E5C384]" />
            <span>NON-CUSTODIAL</span>
          </div>

          <div className="flex items-center space-x-3 text-[#FDF8F0] font-sans font-black text-sm sm:text-base tracking-widest uppercase">
            <Code2 className="h-5 w-5 text-[#E5C384]" />
            <span>OPEN SOURCE</span>
          </div>

          <div className="flex items-center space-x-3 text-[#FDF8F0] font-sans font-black text-sm sm:text-base tracking-widest uppercase">
            <Landmark className="h-5 w-5 text-[#E5C384]" />
            <span>NO COMPANY CONTROL</span>
          </div>

          <div className="hidden md:flex items-center space-x-3 text-[#FDF8F0] font-sans font-black text-sm sm:text-base tracking-widest uppercase">
            <Shield className="h-5 w-5 text-[#E5C384]" />
            <span>NON-CUSTODIAL</span>
          </div>

        </div>
      </div>

    </div>
  );
}
