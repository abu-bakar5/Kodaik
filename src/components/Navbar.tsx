import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink } from 'react-router-dom';
import { Sparkles, Menu, X, LayoutDashboard, PlusCircle, FolderHeart, Gift, HelpCircle } from 'lucide-react';
// @ts-expect-error - local image asset
import logoIcon from '../assets/images/kodaik_logo_icon_1784554236635.jpg';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/create', label: 'Create Vault', icon: PlusCircle },
    { to: '/vaults', label: 'My Vaults', icon: FolderHeart },
    { to: '/claim', label: 'Claim Portal', icon: Gift },
    { to: '/how-it-works', label: 'How it Works', icon: HelpCircle },
  ];

  return (
    <header className="bg-transparent absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Logo & Brand */}
          <NavLink to="/" className="flex items-center group" onClick={() => setMenuOpen(false)}>
            <img
              src={logoIcon}
              alt="Kodaik Logo"
              className="h-10 w-10 object-contain rounded-xl shadow-md transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </NavLink>

          {/* Actions & Hamburger */}
          <div className="flex items-center space-x-4">
            
            {/* RainbowKit Custom Styled Connect Wallet Button */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus || authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="bg-gradient-to-r from-[#E5C384] to-[#E98B4B] hover:brightness-110 active:translate-y-0.5 text-[#071F1B] px-6 py-2.5 rounded-full font-sans font-bold text-sm tracking-wide transition-all shadow-lg cursor-pointer"
                          >
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-[#FDF8F0] px-4 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md cursor-pointer"
                          >
                            Wrong Network
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={openChainModal}
                            style={{ display: 'flex', alignItems: 'center' }}
                            type="button"
                            className="bg-[#1E5148]/80 hover:bg-[#153F39] text-[#E5C384] px-4 py-2.5 rounded-full text-xs font-semibold border border-[#E5C384]/20 transition-all cursor-pointer"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 14,
                                  height: 14,
                                  borderRadius: 999,
                                  overflow: 'hidden',
                                  marginRight: 6,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: '100%', height: '100%' }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </button>

                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="bg-gradient-to-r from-[#1E5148] to-[#153F39] border border-[#E5C384]/30 text-[#FDF8F0] px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:border-[#E5C384]/60 flex items-center space-x-2 cursor-pointer"
                          >
                            <span>{account.displayName}</span>
                            {account.displayBalance ? (
                              <span className="text-xs text-[#E5C384] border-l border-[#E5C384]/30 pl-2">
                                {account.displayBalance}
                              </span>
                            ) : null}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>

            {/* Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="text-[#E5C384] hover:text-[#E98B4B] p-2 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Over Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#071F1B]/90 backdrop-blur-md transition-opacity" 
            onClick={() => setMenuOpen(false)}
          />
          
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md">
              <div className="h-full flex flex-col bg-[#071F1B] border-l border-[#1E5148]/50 shadow-2xl overflow-y-scroll">
                
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-8 border-b border-[#1E5148]/30">
                  <div className="flex items-center">
                    <img
                      src={logoIcon}
                      alt="Kodaik Logo"
                      className="h-10 w-10 object-contain rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-[#E5C384] hover:text-[#E98B4B] p-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Drawer Navigation Links */}
                <div className="flex-1 px-6 py-8 space-y-4">
                  <p className="text-xs font-bold text-[#E5C384] uppercase tracking-widest mb-6">
                    Navigation Menu
                  </p>
                  
                  <nav className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-4 px-5 py-4 rounded-2xl font-sans font-medium text-base transition-all ${
                              isActive
                                ? 'bg-[#1E5148] text-[#FDF8F0] shadow-inner border border-[#E5C384]/20'
                                : 'text-[#CBD5E1] hover:text-[#FDF8F0] hover:bg-[#1E5148]/30'
                            }`
                          }
                        >
                          <Icon className="h-5 w-5 text-[#E5C384]" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </nav>
                </div>

                {/* Drawer Footer info */}
                <div className="p-6 border-t border-[#1E5148]/30 bg-[#041512] text-center text-xs text-[#CBD5E1]/60">
                  <p className="mb-2">Connected to Arc Testnet</p>
                  <div className="inline-flex items-center space-x-1.5 bg-[#1E5148]/60 border border-[#E5C384]/30 px-3 py-1 rounded-full text-[10px] font-medium text-[#E5C384]">
                    <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                    <span>Testnet Phase • Active</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
