export interface Beneficiary {
  wallet: string;
  share: number; // Basis points: 5000 = 50%
  message?: string; // Encrypted key/custom message
}

export interface Vault {
  id: number;
  owner: string;
  name: string;
  heartbeatInterval: number; // in seconds or days (contract is likely in seconds, displayed in days)
  lastActive: number; // Unix timestamp in seconds
  claimed: boolean;
  totalAssets: string; // Balance in tokens (6 decimals)
  beneficiaries: Beneficiary[];
}

export interface VaultFormInput {
  name: string;
  heartbeatIntervalDays: number;
  assets: {
    type: 'native' | 'erc20';
    address?: string;
    amount: string;
  }[];
  beneficiaries: Beneficiary[];
}
