import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define the Arc Testnet chain
export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'Arc Token',
    symbol: 'ARC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://explorer.testnet.arc.network',
    },
  },
  testnet: true,
});

// Kodaik Smart Contract Configuration
export const KODAIK_CONTRACT_ADDRESS = '0x81233718880581F68bF931bf957159db12c2F6aB' as const;

// USDC and EURC known contract addresses on Arc Testnet
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000' as const;
export const EURC_ADDRESS = '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a' as const;

// Mapping helper to resolve token address to hardcoded symbol
export function getTokenSymbol(address?: string): string {
  if (!address) return '';
  const addr = address.toLowerCase();
  if (addr === USDC_ADDRESS.toLowerCase()) {
    return 'USDC';
  }
  if (addr === EURC_ADDRESS.toLowerCase()) {
    return 'EURC';
  }
  return '';
}

// ERC20 ABI for querying balanceOf, decimals, and symbol
export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;


// ABI representing the decentralized digital inheritance vault smart contract on Arc Testnet
export const KODAIK_ABI = [
  {
    name: 'createVault',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_heartbeatInterval', type: 'uint256' },
      { name: '_beneficiaries', type: 'address[]' },
      { name: '_shares', type: 'uint256[]' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'ping',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_vaultId', type: 'uint256' }],
    outputs: []
  },
  {
    name: 'claim',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_vaultId', type: 'uint256' }],
    outputs: []
  },
  {
    name: 'getVault',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_vaultId', type: 'uint256' }],
    outputs: [
      { name: 'owner', type: 'address' },
      { name: 'name', type: 'string' },
      { name: 'heartbeatInterval', type: 'uint256' },
      { name: 'lastActive', type: 'uint256' },
      { name: 'claimed', type: 'bool' },
      { name: 'totalAssets', type: 'uint256' }
    ]
  },
  {
    name: 'getUserVaults',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }]
  },
  {
    name: 'getVaultBeneficiaries',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_vaultId', type: 'uint256' }],
    outputs: [
      { name: 'wallets', type: 'address[]' },
      { name: 'shares', type: 'uint256[]' }
    ]
  },
  {
    name: 'vaultCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const;

// Generate the configuration using RainbowKit
export const config = getDefaultConfig({
  appName: 'Kodaik',
  projectId: 'a0761eca9eddb2ca81e0b1fc5efac1d5', // WalletConnect Project ID
  chains: [arcTestnet],
  ssr: false, // Pure client-side SPA
});
