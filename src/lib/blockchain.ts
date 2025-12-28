// Blockchain and Cryptocurrency Payment System

export interface CryptoPayment {
  id: string;
  orderId: string;
  cryptocurrency: "BTC" | "ETH" | "USDT" | "BNB" | "USDC" | "MATIC";
  amount: number; // in crypto
  amountBRL: number;
  exchangeRate: number;
  walletAddress: string;
  transactionHash?: string;
  confirmations: number;
  requiredConfirmations: number;
  status: "pending" | "confirming" | "confirmed" | "failed" | "expired";
  createdAt: Date;
  expiresAt: Date;
  confirmedAt?: Date;
  network: string;
  fees: {
    networkFee: number;
    platformFee: number;
    total: number;
  };
}

export interface CryptoWallet {
  cryptocurrency: CryptoPayment["cryptocurrency"];
  address: string;
  network: string;
  qrCode: string;
  balance?: number;
}

export interface CryptoExchangeRate {
  cryptocurrency: string;
  brl: number;
  usd: number;
  lastUpdated: Date;
  change24h: number; // percentage
  marketCap: number;
}

export interface NFTProduct {
  id: string;
  productId: string;
  tokenId: string;
  contractAddress: string;
  blockchain: "ethereum" | "polygon" | "binance";
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
  };
  owner: string;
  mintedAt: Date;
  transferable: boolean;
  royalties: number; // percentage
}

export interface BlockchainTransaction {
  id: string;
  type: "payment" | "nft_mint" | "nft_transfer" | "token_reward";
  blockchain: string;
  transactionHash: string;
  from: string;
  to: string;
  value: number;
  status: "pending" | "confirmed" | "failed";
  confirmations: number;
  blockNumber?: number;
  gasUsed?: number;
  gasFee?: number;
  timestamp: Date;
}

export interface LoyaltyToken {
  id: string;
  userId: string;
  tokenSymbol: string; // e.g., "MPET" for MundoPet Token
  balance: number;
  earned: number;
  spent: number;
  value: number; // in BRL
  transactions: {
    id: string;
    type: "earn" | "spend" | "transfer";
    amount: number;
    description: string;
    timestamp: Date;
  }[];
}

export interface SmartContract {
  id: string;
  name: string;
  type: "payment" | "nft" | "loyalty" | "escrow";
  blockchain: string;
  address: string;
  abi: any[];
  deployedAt: Date;
  verified: boolean;
}

// Supported cryptocurrencies
export const supportedCryptocurrencies = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    network: "Bitcoin",
    decimals: 8,
    minAmount: 0.0001,
    confirmations: 3,
    icon: "/crypto/btc.svg",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    network: "Ethereum",
    decimals: 18,
    minAmount: 0.001,
    confirmations: 12,
    icon: "/crypto/eth.svg",
  },
  {
    symbol: "USDT",
    name: "Tether",
    network: "Ethereum",
    decimals: 6,
    minAmount: 10,
    confirmations: 12,
    icon: "/crypto/usdt.svg",
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    network: "Binance Smart Chain",
    decimals: 18,
    minAmount: 0.01,
    confirmations: 15,
    icon: "/crypto/bnb.svg",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    network: "Ethereum",
    decimals: 6,
    minAmount: 10,
    confirmations: 12,
    icon: "/crypto/usdc.svg",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    network: "Polygon",
    decimals: 18,
    minAmount: 1,
    confirmations: 128,
    icon: "/crypto/matic.svg",
  },
];

// Get current exchange rates
export async function getCryptoExchangeRates(): Promise<CryptoExchangeRate[]> {
  // Mock implementation - in production, use CoinGecko, CoinMarketCap, or Binance API
  return [
    {
      cryptocurrency: "BTC",
      brl: 350000.0,
      usd: 70000.0,
      lastUpdated: new Date(),
      change24h: 2.5,
      marketCap: 1350000000000,
    },
    {
      cryptocurrency: "ETH",
      brl: 15000.0,
      usd: 3000.0,
      lastUpdated: new Date(),
      change24h: 1.8,
      marketCap: 360000000000,
    },
    {
      cryptocurrency: "USDT",
      brl: 5.0,
      usd: 1.0,
      lastUpdated: new Date(),
      change24h: 0.1,
      marketCap: 95000000000,
    },
    {
      cryptocurrency: "BNB",
      brl: 1500.0,
      usd: 300.0,
      lastUpdated: new Date(),
      change24h: 3.2,
      marketCap: 45000000000,
    },
    {
      cryptocurrency: "USDC",
      brl: 5.0,
      usd: 1.0,
      lastUpdated: new Date(),
      change24h: 0.0,
      marketCap: 32000000000,
    },
    {
      cryptocurrency: "MATIC",
      brl: 4.5,
      usd: 0.9,
      lastUpdated: new Date(),
      change24h: 5.1,
      marketCap: 8500000000,
    },
  ];
}

// Create crypto payment
export async function createCryptoPayment(
  orderId: string,
  amountBRL: number,
  cryptocurrency: CryptoPayment["cryptocurrency"]
): Promise<CryptoPayment> {
  const rates = await getCryptoExchangeRates();
  const rate = rates.find((r) => r.cryptocurrency === cryptocurrency);

  if (!rate) {
    throw new Error("Cryptocurrency not supported");
  }

  const cryptoAmount = amountBRL / rate.brl;

  // Generate wallet address (mock - in production, use payment gateway)
  const walletAddress = `0x${Math.random().toString(16).substring(2, 42)}`;

  const payment: CryptoPayment = {
    id: `crypto-${Date.now()}`,
    orderId,
    cryptocurrency,
    amount: cryptoAmount,
    amountBRL,
    exchangeRate: rate.brl,
    walletAddress,
    confirmations: 0,
    requiredConfirmations:
      supportedCryptocurrencies.find((c) => c.symbol === cryptocurrency)
        ?.confirmations || 12,
    status: "pending",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    network:
      supportedCryptocurrencies.find((c) => c.symbol === cryptocurrency)
        ?.network || "Ethereum",
    fees: {
      networkFee: cryptoAmount * 0.001, // 0.1%
      platformFee: cryptoAmount * 0.005, // 0.5%
      total: cryptoAmount * 0.006,
    },
  };

  return payment;
}

// Check payment status
export async function checkCryptoPaymentStatus(
  paymentId: string
): Promise<CryptoPayment> {
  // Mock implementation - in production, check blockchain
  // This would query the blockchain for the transaction
  throw new Error("Not implemented - requires blockchain integration");
}

// Generate QR code for payment
export function generatePaymentQRCode(
  walletAddress: string,
  amount: number,
  cryptocurrency: string
): string {
  // Mock implementation - in production, use QR code library
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
}

// NFT Product features
export async function mintProductNFT(
  productId: string,
  ownerId: string
): Promise<NFTProduct> {
  // Mock implementation - in production, interact with smart contract
  const nft: NFTProduct = {
    id: `nft-${Date.now()}`,
    productId,
    tokenId: `${Date.now()}`,
    contractAddress: "0x1234567890123456789012345678901234567890",
    blockchain: "polygon",
    metadata: {
      name: "Difusor Aromático NFT",
      description: "NFT exclusivo do Difusor Aromático Zen",
      image: "/products/difusor-nft.png",
      attributes: [
        { trait_type: "Rarity", value: "Limited Edition" },
        { trait_type: "Serial Number", value: "001/100" },
        { trait_type: "Year", value: "2024" },
      ],
    },
    owner: ownerId,
    mintedAt: new Date(),
    transferable: true,
    royalties: 5, // 5% royalties on resale
  };

  return nft;
}

// Transfer NFT
export async function transferNFT(
  nftId: string,
  fromAddress: string,
  toAddress: string
): Promise<BlockchainTransaction> {
  // Mock implementation
  const transaction: BlockchainTransaction = {
    id: `tx-${Date.now()}`,
    type: "nft_transfer",
    blockchain: "polygon",
    transactionHash: `0x${Math.random().toString(16).substring(2)}`,
    from: fromAddress,
    to: toAddress,
    value: 0,
    status: "pending",
    confirmations: 0,
    timestamp: new Date(),
  };

  return transaction;
}

// Loyalty token system
export function createLoyaltyToken(userId: string): LoyaltyToken {
  return {
    id: `token-${userId}`,
    userId,
    tokenSymbol: "MPET",
    balance: 0,
    earned: 0,
    spent: 0,
    value: 0,
    transactions: [],
  };
}

export function earnLoyaltyTokens(
  userId: string,
  amount: number,
  description: string
): LoyaltyToken {
  // Mock implementation - in production, interact with blockchain
  const token = createLoyaltyToken(userId);
  token.balance += amount;
  token.earned += amount;
  token.value = amount * 0.1; // Each token = R$ 0.10

  token.transactions.push({
    id: `tx-${Date.now()}`,
    type: "earn",
    amount,
    description,
    timestamp: new Date(),
  });

  return token;
}

export function spendLoyaltyTokens(
  userId: string,
  amount: number,
  description: string
): LoyaltyToken {
  const token = createLoyaltyToken(userId);

  if (token.balance < amount) {
    throw new Error("Insufficient token balance");
  }

  token.balance -= amount;
  token.spent += amount;
  token.value = token.balance * 0.1;

  token.transactions.push({
    id: `tx-${Date.now()}`,
    type: "spend",
    amount: -amount,
    description,
    timestamp: new Date(),
  });

  return token;
}

// Blockchain analytics
export interface BlockchainAnalytics {
  totalCryptoPayments: number;
  totalCryptoRevenue: number; // BRL
  cryptoPaymentPercentage: number;
  topCryptocurrency: string;
  nftsMinted: number;
  nftsTraded: number;
  loyaltyTokensIssued: number;
  loyaltyTokensRedeemed: number;
  averageTransactionTime: number; // seconds
  blockchainFees: number; // BRL
}

export function getBlockchainAnalytics(): BlockchainAnalytics {
  return {
    totalCryptoPayments: 234,
    totalCryptoRevenue: 125000.0,
    cryptoPaymentPercentage: 8.5,
    topCryptocurrency: "USDT",
    nftsMinted: 45,
    nftsTraded: 12,
    loyaltyTokensIssued: 125000,
    loyaltyTokensRedeemed: 45000,
    averageTransactionTime: 180,
    blockchainFees: 2500.0,
  };
}

// Smart contract escrow
export interface EscrowContract {
  id: string;
  orderId: string;
  buyer: string;
  seller: string;
  amount: number;
  cryptocurrency: string;
  contractAddress: string;
  status: "created" | "funded" | "released" | "refunded" | "disputed";
  conditions: {
    type: "delivery_confirmed" | "time_elapsed" | "manual_release";
    value: any;
    met: boolean;
  }[];
  createdAt: Date;
  fundedAt?: Date;
  releasedAt?: Date;
  disputeReason?: string;
}

export function createEscrowContract(
  orderId: string,
  buyer: string,
  seller: string,
  amount: number,
  cryptocurrency: string
): EscrowContract {
  return {
    id: `escrow-${Date.now()}`,
    orderId,
    buyer,
    seller,
    amount,
    cryptocurrency,
    contractAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
    status: "created",
    conditions: [
      {
        type: "delivery_confirmed",
        value: false,
        met: false,
      },
      {
        type: "time_elapsed",
        value: 14, // days
        met: false,
      },
    ],
    createdAt: new Date(),
  };
}

// Crypto payment gateway integration
export interface CryptoGateway {
  name: string;
  supported: boolean;
  cryptocurrencies: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
  settlementTime: number; // hours
  features: string[];
}

export const cryptoGateways: CryptoGateway[] = [
  {
    name: "Coinbase Commerce",
    supported: true,
    cryptocurrencies: ["BTC", "ETH", "USDC", "USDT"],
    fees: {
      percentage: 1.0,
      fixed: 0,
    },
    settlementTime: 24,
    features: [
      "Instant conversion to BRL",
      "No chargebacks",
      "Global payments",
      "API integration",
    ],
  },
  {
    name: "BitPay",
    supported: true,
    cryptocurrencies: ["BTC", "ETH", "BNB", "USDC"],
    fees: {
      percentage: 1.0,
      fixed: 0,
    },
    settlementTime: 24,
    features: [
      "Settlement in BRL or crypto",
      "Refund support",
      "Invoice system",
      "Multi-currency",
    ],
  },
  {
    name: "CoinPayments",
    supported: true,
    cryptocurrencies: ["BTC", "ETH", "USDT", "BNB", "MATIC", "100+ more"],
    fees: {
      percentage: 0.5,
      fixed: 0,
    },
    settlementTime: 48,
    features: [
      "2000+ cryptocurrencies",
      "Auto-conversion",
      "Shopping cart plugins",
      "Coin forwarding",
    ],
  },
];

// Web3 wallet connection
export interface Web3Wallet {
  address: string;
  type: "metamask" | "trust_wallet" | "coinbase_wallet" | "wallet_connect";
  connected: boolean;
  chainId: number;
  balance: {
    [cryptocurrency: string]: number;
  };
}

export async function connectWeb3Wallet(
  walletType: Web3Wallet["type"]
): Promise<Web3Wallet> {
  // Mock implementation - in production, use Web3.js or Ethers.js
  return {
    address: `0x${Math.random().toString(16).substring(2, 42)}`,
    type: walletType,
    connected: true,
    chainId: 1, // Ethereum mainnet
    balance: {
      ETH: 1.5,
      USDT: 1000.0,
      USDC: 500.0,
    },
  };
}

// Blockchain verification
export interface BlockchainVerification {
  productId: string;
  verified: boolean;
  blockchain: string;
  transactionHash: string;
  timestamp: Date;
  authenticity: {
    genuine: boolean;
    manufacturer: string;
    batchNumber: string;
    productionDate: Date;
  };
  ownership: {
    currentOwner: string;
    previousOwners: string[];
    transferHistory: {
      from: string;
      to: string;
      date: Date;
      transactionHash: string;
    }[];
  };
}

export function verifyProductOnBlockchain(
  productId: string
): BlockchainVerification {
  return {
    productId,
    verified: true,
    blockchain: "Ethereum",
    transactionHash: `0x${Math.random().toString(16).substring(2)}`,
    timestamp: new Date(),
    authenticity: {
      genuine: true,
      manufacturer: "MundoPetZen",
      batchNumber: "BATCH-2024-001",
      productionDate: new Date("2024-01-15"),
    },
    ownership: {
      currentOwner: "0x1234...5678",
      previousOwners: [],
      transferHistory: [],
    },
  };
}
