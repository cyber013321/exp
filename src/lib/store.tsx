import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext } from
'react';
import {
  User,
  Account,
  Trade,
  Asset,
  Signal,
  Transaction,
  TradeType,
  PurchasedBot,
  PurchasedSignal,
  CopyTrade,
  FundedAccountPurchase,
  BotTemplate,
  SignalTemplate,
  Wallet } from
'./types';
import { generateId, randomPriceChange } from './utils';
// Initial Market Data (Extended with 80+ pairs)
const INITIAL_ASSETS: Asset[] = [
  // Forex
  { symbol: 'EURUSD', bid: 1.0850, ask: 1.0852, spread: 2, digits: 5, change: 0.12 },
  { symbol: 'GBPUSD', bid: 1.2640, ask: 1.2643, spread: 3, digits: 5, change: -0.05 },
  { symbol: 'USDJPY', bid: 150.20, ask: 150.22, spread: 2, digits: 3, change: 0.30 },
  { symbol: 'AUDUSD', bid: 0.6520, ask: 0.6522, spread: 2, digits: 5, change: -0.08 },
  { symbol: 'USDCAD', bid: 1.3520, ask: 1.3522, spread: 2, digits: 5, change: 0.05 },
  { symbol: 'USDCHF', bid: 0.8820, ask: 0.8822, spread: 2, digits: 5, change: -0.02 },
  { symbol: 'NZDUSD', bid: 0.6120, ask: 0.6122, spread: 2, digits: 5, change: 0.10 },
  { symbol: 'EURGBP', bid: 0.8580, ask: 0.8582, spread: 2, digits: 5, change: -0.01 },
  { symbol: 'EURJPY', bid: 162.80, ask: 162.83, spread: 3, digits: 3, change: 0.25 },
  { symbol: 'GBPJPY', bid: 189.90, ask: 189.94, spread: 4, digits: 3, change: 0.18 },
  { symbol: 'AUDJPY', bid: 98.20, ask: 98.23, spread: 3, digits: 3, change: 0.08 },
  { symbol: 'EURAUD', bid: 1.6620, ask: 1.6623, spread: 3, digits: 5, change: 0.15 },
  // Crypto
  { symbol: 'BTCUSD', bid: 64200.0, ask: 64250.0, spread: 5000, digits: 2, change: 2.10 },
  { symbol: 'ETHUSD', bid: 3450.0, ask: 3452.5, spread: 250, digits: 2, change: 1.50 },
  { symbol: 'BNBUSD', bid: 580.0, ask: 581.5, spread: 150, digits: 2, change: 0.85 },
  { symbol: 'SOLUSD', bid: 145.20, ask: 145.50, spread: 30, digits: 2, change: 3.20 },
  { symbol: 'ADAUSD', bid: 0.5820, ask: 0.5830, spread: 10, digits: 4, change: -1.20 },
  { symbol: 'XRPUSD', bid: 0.6240, ask: 0.6245, spread: 5, digits: 4, change: 0.45 },
  { symbol: 'DOTUSD', bid: 8.90, ask: 8.95, spread: 5, digits: 2, change: 1.10 },
  { symbol: 'DOGEUSD', bid: 0.1620, ask: 0.1625, spread: 5, digits: 4, change: 5.40 },
  { symbol: 'AVAXUSD', bid: 54.30, ask: 54.45, spread: 15, digits: 2, change: 2.15 },
  { symbol: 'MATICUSD', bid: 1.05, ask: 1.06, spread: 10, digits: 4, change: -0.80 },
  { symbol: 'LINKUSD', bid: 18.20, ask: 18.35, spread: 15, digits: 2, change: 1.40 },
  { symbol: 'UNIUSD', bid: 12.40, ask: 12.50, spread: 10, digits: 2, change: 0.90 },
  { symbol: 'LTCUSD', bid: 88.50, ask: 88.75, spread: 25, digits: 2, change: -0.30 },
  { symbol: 'BCHUSD', bid: 435.0, ask: 437.5, spread: 250, digits: 2, change: 1.80 },
  // Commodities
  { symbol: 'XAUUSD', bid: 2155.50, ask: 2156.10, spread: 60, digits: 2, change: 0.85 },
  { symbol: 'XAGUSD', bid: 24.80, ask: 24.83, spread: 3, digits: 3, change: 0.45 },
  { symbol: 'USOIL', bid: 78.40, ask: 78.44, spread: 4, digits: 2, change: -1.10 },
  { symbol: 'UKOIL', bid: 82.50, ask: 82.55, spread: 5, digits: 2, change: -0.95 },
  { symbol: 'NGAS', bid: 1.850, ask: 1.855, spread: 5, digits: 3, change: 2.30 },
  { symbol: 'COPPER', bid: 3.885, ask: 3.890, spread: 5, digits: 4, change: 0.15 },
  // Indices
  { symbol: 'SPX500', bid: 5120.0, ask: 5121.5, spread: 15, digits: 1, change: 0.45 },
  { symbol: 'NAS100', bid: 18250.0, ask: 18252.5, spread: 25, digits: 1, change: 0.65 },
  { symbol: 'US30', bid: 38900.0, ask: 38905.0, spread: 50, digits: 1, change: 0.25 },
  { symbol: 'GER40', bid: 17850.0, ask: 17853.0, spread: 30, digits: 1, change: 0.15 },
  { symbol: 'UK100', bid: 7650.0, ask: 7652.5, spread: 25, digits: 1, change: -0.10 },
  { symbol: 'JPN225', bid: 39500.0, ask: 39510.0, spread: 100, digits: 0, change: 0.80 },
  // Adding more pairs to reach 80+
  { symbol: 'AUDCAD', bid: 0.8850, ask: 0.8853, spread: 3, digits: 5, change: 0.05 },
  { symbol: 'AUDCHF', bid: 0.5750, ask: 0.5753, spread: 3, digits: 5, change: -0.08 },
  { symbol: 'AUDNZD', bid: 1.0650, ask: 1.0653, spread: 3, digits: 5, change: 0.02 },
  { symbol: 'CADCHF', bid: 0.6520, ask: 0.6523, spread: 3, digits: 5, change: 0.01 },
  { symbol: 'CADJPY', bid: 111.20, ask: 111.23, spread: 3, digits: 3, change: 0.15 },
  { symbol: 'CHFJPY', bid: 170.40, ask: 170.44, spread: 4, digits: 3, change: 0.20 },
  { symbol: 'EURSGD', bid: 1.4550, ask: 1.4554, spread: 4, digits: 5, change: -0.05 },
  { symbol: 'EURCAD', bid: 1.4650, ask: 1.4654, spread: 4, digits: 5, change: 0.03 },
  { symbol: 'EURCHF', bid: 0.9580, ask: 0.9583, spread: 3, digits: 5, change: 0.01 },
  { symbol: 'EURNZD', bid: 1.7720, ask: 1.7725, spread: 5, digits: 5, change: 0.12 },
  { symbol: 'GBPAUD', bid: 1.9380, ask: 1.9385, spread: 5, digits: 5, change: -0.05 },
  { symbol: 'GBPCAD', bid: 1.7080, ask: 1.7085, spread: 5, digits: 5, change: 0.08 },
  { symbol: 'GBPCHF', bid: 1.1150, ask: 1.1155, spread: 5, digits: 5, change: 0.02 },
  { symbol: 'GBPNZD', bid: 2.0650, ask: 2.0658, spread: 8, digits: 5, change: 0.05 },
  { symbol: 'NZDCAD', bid: 0.8280, ask: 0.8284, spread: 4, digits: 5, change: -0.02 },
  { symbol: 'NZDCHF', bid: 0.5420, ask: 0.5424, spread: 4, digits: 5, change: 0.01 },
  { symbol: 'NZDJPY', bid: 92.10, ask: 92.14, spread: 4, digits: 3, change: 0.18 },
  { symbol: 'SGDJPY', bid: 112.50, ask: 112.55, spread: 5, digits: 3, change: 0.05 },
  { symbol: 'USDHKD', bid: 7.8250, ask: 7.8255, spread: 5, digits: 4, change: 0.01 },
  { symbol: 'USDSGD', bid: 1.3420, ask: 1.3424, spread: 4, digits: 4, change: -0.02 },
  { symbol: 'USDMXN', bid: 16.8500, ask: 16.8550, spread: 50, digits: 4, change: 0.25 },
  { symbol: 'USDZAR', bid: 18.9500, ask: 18.9650, spread: 150, digits: 4, change: 0.45 },
  { symbol: 'USDSYS', bid: 2.0500, ask: 2.0520, spread: 20, digits: 4, change: 0.00 },
  { symbol: 'XPTUSD', bid: 925.50, ask: 926.80, spread: 130, digits: 2, change: -0.45 },
  { symbol: 'XPDUSD', bid: 1045.00, ask: 1048.50, spread: 350, digits: 2, change: 1.15 },
  { symbol: 'ATOMUSD', bid: 11.85, ask: 11.92, spread: 7, digits: 2, change: 2.45 },
  { symbol: 'LTCETH', bid: 0.0255, ask: 0.0256, spread: 1, digits: 4, change: -0.15 },
  { symbol: 'BTCEUR', bid: 59200.0, ask: 59250.0, spread: 5000, digits: 1, change: 2.05 },
  { symbol: 'BTCGBP', bid: 50800.0, ask: 50850.0, spread: 5000, digits: 1, change: 1.95 },
  { symbol: 'AAVEUSD', bid: 118.40, ask: 118.65, spread: 25, digits: 2, change: 4.15 },
  { symbol: 'ADAETH', bid: 0.000168, ask: 0.000169, spread: 1, digits: 6, change: -0.50 },
  { symbol: 'ALGOUSD', bid: 0.2450, ask: 0.2458, spread: 8, digits: 4, change: 1.05 },
  { symbol: 'BATUSD', bid: 0.3250, ask: 0.3265, spread: 15, digits: 4, change: -0.85 },
  { symbol: 'EOSUSD', bid: 1.1250, ask: 1.1275, spread: 25, digits: 4, change: 0.45 },
  { symbol: 'ETCUSD', bid: 32.40, ask: 32.55, spread: 15, digits: 2, change: 1.25 },
  { symbol: 'FILUSD', bid: 9.85, ask: 9.92, spread: 7, digits: 2, change: 3.15 },
  { symbol: 'ICPUSD', bid: 14.25, ask: 14.38, spread: 13, digits: 2, change: -2.10 },
  { symbol: 'NEOUSD', bid: 15.40, ask: 15.55, spread: 15, digits: 2, change: 0.85 },
  { symbol: 'VETUSD', bid: 0.04850, ask: 0.04875, spread: 25, digits: 5, change: 1.45 },
  { symbol: 'XLMUSD', bid: 0.1450, ask: 0.1458, spread: 8, digits: 4, change: -0.55 },
  { symbol: 'XMRUSD', bid: 148.50, ask: 149.25, spread: 75, digits: 2, change: 0.25 },
  { symbol: 'ZECUSD', bid: 28.40, ask: 28.65, spread: 25, digits: 2, change: -1.15 }
];

interface StoreContextType {
  user: User | null;
  allUsers: User[];
  account: Account;
  assets: Asset[];
  trades: Trade[];
  history: Trade[];
  transactions: Transaction[];
  signals: Signal[];
  purchasedBots: PurchasedBot[];
  purchasedSignals: PurchasedSignal[];
  purchasedCopyTrades: CopyTrade[];
  purchasedFundedAccounts: FundedAccountPurchase[];
  botTemplates: BotTemplate[];
  signalTemplates: SignalTemplate[];
  wallets: Wallet[];
  isAuthenticated: boolean;
  botActive: boolean;
  login: (email: string, password?: string) => { success: boolean; isAdmin?: boolean; error?: string };
  logout: () => void;
  executeTrade: (
    symbol: string,
    type: TradeType,
    lots: number,
    sl?: number,
    tp?: number
  ) => void;
  closeTrade: (tradeId: string) => void;
  modifyTradeSLTP: (
    tradeId: string,
    sl: number | null,
    tp: number | null
  ) => void;
  deposit: (amount: number, method: string) => void;
  withdraw: (amount: number, method: string) => void;
  toggleBot: (active: boolean) => void;
  // Bot/Signal Purchase Methods
  purchaseBot: (botId: string, botName: string, price: number, performance: number) => void;
  purchaseSignal: (signalId: string, providerName: string, price: number, winRate: number) => void;
  approveBotPurchase: (botPurchaseId: string) => void;
  approveSignalSubscription: (signalSubId: string) => void;
  allocateBotCapital: (botPurchaseId: string, amount: number) => void;
  pauseBot: (botPurchaseId: string) => void;
  resumeBot: (botPurchaseId: string) => void;
  terminateBot: (botPurchaseId: string) => void;
  terminateSignal: (signalSubId: string) => void;
  // Copy Trading Methods
  followTrader: (trader: any, allocation: number, durationValue: string, durationType: 'hours' | 'days') => void;
  stopCopyTrading: (copyTradeId: string) => void;
  closeCopyTrade: (copyTradeId: string, profit: number) => void;
  // Copy Trading Methods
  followTrader: (trader: any, allocation: number, durationValue: string, durationType: 'hours' | 'days') => void;
  stopCopyTrading: (copyTradeId: string) => void;
  // Funded Account Methods
  purchaseFundedAccount: (planId: string, planName: string, capital: number, price: number, profitTarget: number, maxDrawdown: number) => void;
  approveFundedAccount: (accountId: string) => void;
  rejectFundedAccount: (accountId: string) => void;
  // Bot Template Methods
  addBotTemplate: (name: string, description: string, price: number, performance: number, winRate: number, trades: number, type: string, risk: 'Low' | 'Medium' | 'High', maxDrawdown: number) => void;
  editBotTemplate: (botId: string, updates: Partial<BotTemplate>) => void;
  deleteBotTemplate: (botId: string) => void;
  // Signal Template Methods
  addSignalTemplate: (providerName: string, description: string, cost: number, winRate: number, trades: number, avgReturn: number) => void;
  editSignalTemplate: (signalId: string, updates: Partial<SignalTemplate>) => void;
  deleteSignalTemplate: (signalId: string) => void;
  // Wallet Methods
  addWallet: (userId: string, address: string, label: string, type: 'DEPOSIT' | 'PURCHASE', currency: string, network?: string) => void;
  removeWallet: (walletId: string) => void;
  // Admin Methods
  addBalance: (userId: string, amount: number) => void;
  removeBalance: (userId: string, amount: number) => void;
  togglePageLock: (userId: string, page: string) => void;
  toggleUserLock: (userId: string) => void;
  approveTransaction: (transactionId: string) => void;
  rejectTransaction: (transactionId: string) => void;
  getUserById: (userId: string) => User | undefined;
  getUserTransactions: (userId: string) => Transaction[];
}
const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [botActive, setBotActive] = useState(false);
  const [purchasedBots, setPurchasedBots] = useState<PurchasedBot[]>([]);
  const [purchasedSignals, setPurchasedSignals] = useState<PurchasedSignal[]>([]);
  const [purchasedCopyTrades, setPurchasedCopyTrades] = useState<CopyTrade[]>([]);
  const [purchasedFundedAccounts, setPurchasedFundedAccounts] = useState<FundedAccountPurchase[]>([]);
  const [botTemplates, setBotTemplates] = useState<BotTemplate[]>([]);
  const [signalTemplates, setSignalTemplates] = useState<SignalTemplate[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  // Account State
  const [account, setAccount] = useState<Account>({
    balance: 10000,
    equity: 10000,
    margin: 0,
    freeMargin: 10000,
    marginLevel: 0,
    leverage: 100,
    type: 'DEMO',
    currency: 'USD'
  });

  // whenever the logged-in user changes, mirror their balance in account
  useEffect(() => {
    if (user) {
      setAccount((prev) => ({
        ...prev,
        balance: user.balance || 0,
        equity: user.balance || 0,
        freeMargin: user.balance || 0
      }));
    }
  }, [user]);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [history, setHistory] = useState<Trade[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Mock Signals
  const [signals] = useState<Signal[]>([
  {
    id: '1',
    symbol: 'EURUSD',
    type: 'BUY',
    entry: 1.084,
    sl: 1.081,
    tp: 1.09,
    confidence: 85,
    time: Date.now()
  },
  {
    id: '2',
    symbol: 'XAUUSD',
    type: 'SELL',
    entry: 2040.0,
    sl: 2050.0,
    tp: 2020.0,
    confidence: 78,
    time: Date.now() - 3600000
  },
  {
    id: '3',
    symbol: 'GBPUSD',
    type: 'BUY',
    entry: 1.263,
    sl: 1.259,
    tp: 1.27,
    confidence: 82,
    time: Date.now() - 7200000
  },
  {
    id: '4',
    symbol: 'USDJPY',
    type: 'SELL',
    entry: 150.5,
    sl: 151.2,
    tp: 149.5,
    confidence: 71,
    time: Date.now() - 10800000
  },
  {
    id: '5',
    symbol: 'BTCUSD',
    type: 'BUY',
    entry: 51000,
    sl: 49500,
    tp: 54000,
    confidence: 88,
    time: Date.now() - 1800000
  },
  {
    id: '6',
    symbol: 'AUDUSD',
    type: 'BUY',
    entry: 0.651,
    sl: 0.647,
    tp: 0.658,
    confidence: 75,
    time: Date.now() - 5400000
  },
  {
    id: '7',
    symbol: 'ETHUSD',
    type: 'SELL',
    entry: 2960,
    sl: 3020,
    tp: 2880,
    confidence: 68,
    time: Date.now() - 9000000
  },
  {
    id: '8',
    symbol: 'XAUUSD',
    type: 'BUY',
    entry: 2030,
    sl: 2015,
    tp: 2060,
    confidence: 91,
    time: Date.now() - 14400000
  }]
  );
  // Simulation Loop (The "Broker Engine")
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Prices
      setAssets((prev) =>
      prev.map((asset) => {
        const newBid = randomPriceChange(asset.bid, 0.00005);
        const spreadVal = asset.spread * Math.pow(10, -asset.digits);
        return {
          ...asset,
          bid: newBid,
          ask: newBid + spreadVal
        };
      })
      );
      // 2. Update Open Trades P/L & Account Equity
      setTrades((currentTrades) => {
        if (currentTrades.length === 0) return [];
        return currentTrades.map((trade) => {
          const currentAsset = assets.find((a) => a.symbol === trade.symbol);
          if (!currentAsset) return trade;
          const currentPrice =
          trade.type === 'BUY' ? currentAsset.bid : currentAsset.ask;
          const multiplier = trade.type === 'BUY' ? 1 : -1;
          // Simplified P/L calculation: (Current - Entry) * Lots * ContractSize (assumed 100000 for forex)
          // For MVP simplicity, we'll just use a standard multiplier based on price diff
          const pipDiff = (currentPrice - trade.entryPrice) * multiplier;
          const profit = pipDiff * trade.lots * 100000; // Standard lot size assumption
          return {
            ...trade,
            currentPrice,
            profit
          };
        });
      });
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, [assets]); // Dependency on assets to get latest prices for trade calc
  // Recalculate Equity/Margin whenever trades or balance changes
  useEffect(() => {
    const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
    const usedMargin = trades.reduce(
      (sum, t) => sum + t.entryPrice * t.lots * 100000 / account.leverage,
      0
    );
    setAccount((prev) => ({
      ...prev,
      equity: prev.balance + totalProfit,
      margin: usedMargin,
      freeMargin: prev.balance + totalProfit - usedMargin,
      marginLevel:
      usedMargin > 0 ? (prev.balance + totalProfit) / usedMargin * 100 : 0
    }));
  }, [trades, account.balance, account.leverage]);
  // Bot Logic Simulation
  useEffect(() => {
    if (!botActive || !user) return;
    const botInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance to trade every 5s
        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        const type: TradeType = Math.random() > 0.5 ? 'BUY' : 'SELL';
        executeTrade(randomAsset.symbol, type, 0.1);
      }
    }, 5000);
    return () => clearInterval(botInterval);
  }, [botActive, user, assets]);

  // Bot Earnings Automation (every 10 seconds for testing, can adjust later)
  useEffect(() => {
    const botEarningsInterval = setInterval(() => {
      setPurchasedBots((prev) =>
        prev.map((bot) => {
          if (bot.status !== 'ACTIVE' || bot.allocatedAmount === 0) return bot;
          
          // Generate random profit/loss based on performance
          const dailyReturn = bot.dailyReturn || 10;
          const hourlyReturn = (dailyReturn / 24) / 100; // Convert to hourly and percentage
          const earning = bot.allocatedAmount * hourlyReturn;
          
          // 70% chance of profit, 30% chance of loss
          const profitOrLoss = Math.random() > 0.3 ? earning : -earning * 0.5;
          
          const newTotalEarned = bot.totalEarned + Math.max(0, profitOrLoss);
          const newTotalLost = bot.totalLost + Math.max(0, -profitOrLoss);
          
          // Update user's balance in allUsers
          setAllUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id === bot.userId
                ? { ...u, balance: (u.balance || 0) + profitOrLoss }
                : u
            )
          );
          
          // Also update current user's account if they own this bot
          if (user && user.id === bot.userId) {
            setAccount((prev) => ({
              ...prev,
              balance: prev.balance + profitOrLoss
            }));
          }
          
          return {
            ...bot,
            totalEarned: newTotalEarned,
            totalLost: newTotalLost,
            allocatedAmount: bot.allocatedAmount + profitOrLoss // Compound earnings
          };
        })
      );
    }, 10000); // Every 10 seconds (for testing/visibility)
    
    return () => clearInterval(botEarningsInterval);
  }, [user]);

  // Signal Earnings Simulation (every 15 seconds)
  useEffect(() => {
    const signalEarningsInterval = setInterval(() => {
      setPurchasedSignals((prev) =>
        prev.map((signal) => {
          if (signal.status !== 'ACTIVE') return signal;
          
          // Simulate signal trades
          const potentialEarning = 25 + Math.random() * 75; // $25-$100 per trade
          const shouldProfit = Math.random() > (100 - signal.winRate) / 100;
          const earning = shouldProfit ? potentialEarning : -potentialEarning * 0.5;
          
          // Update user's balance in allUsers
          setAllUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id === signal.userId
                ? { ...u, balance: (u.balance || 0) + earning }
                : u
            )
          );
          
          // Also update current user's account if they subscribe to this signal
          if (user && user.id === signal.userId) {
            setAccount((prev) => ({
              ...prev,
              balance: prev.balance + earning
            }));
          }
          
          return {
            ...signal,
            earnings: signal.earnings + earning,
            tradesFollowed: signal.tradesFollowed + 1
          };
        })
      );
    }, 15000); // Every 15 seconds (for testing/visibility)
    
    return () => clearInterval(signalEarningsInterval);
  }, [user]);
  const login = (email: string, password?: string) => {
    // Admin authentication
    if (email === 'admin@work.com' && password === 'admin') {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@work.com',
        name: 'Admin',
        country: 'Global',
        isVerified: true,
        isAdmin: true,
        balance: 0,
        lockedPages: []
      };
      setUser(adminUser);
      return { success: true, isAdmin: true };
    }

    // Regular user login - create or update
    if (email) {
      const existingUser = allUsers.find(u => u.email === email);
      let loginUser: User;

      if (existingUser) {
        loginUser = existingUser;
      } else {
        loginUser = {
          id: generateId(),
          email,
          name: email.split('@')[0],
          country: 'Global',
          isVerified: false,
          isAdmin: false,
          balance: 10000,
          lockedPages: []
        };
        setAllUsers((prev) => [...prev, loginUser]);
      }

      setUser(loginUser);
      // initialize account for this user
      setAccount((prev) => ({
        ...prev,
        balance: loginUser.balance || 0,
        equity: loginUser.balance || 0,
        freeMargin: loginUser.balance || 0
      }));
      return { success: true, isAdmin: false };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => setUser(null);

  // Admin Methods
  const addBalance = (userId: string, amount: number) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, balance: (u.balance || 0) + amount } : u
      )
    );
    // update current user/account if matches
    if (user && user.id === userId) {
      const newBal = (user.balance || 0) + amount;
      setUser({ ...user, balance: newBal });
      setAccount((prev) => ({ ...prev, balance: newBal }));
    }
    // also record a transaction so it appears in history and admin dashboard
    const tx: Transaction = {
      id: generateId(),
      userId,
      type: 'DEPOSIT',
      amount,
      method: 'admin',
      status: 'COMPLETED',
      date: Date.now()
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  const removeBalance = (userId: string, amount: number) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, balance: Math.max(0, (u.balance || 0) - amount) } : u
      )
    );
    if (user && user.id === userId) {
      const newBal = Math.max(0, (user.balance || 0) - amount);
      setUser({ ...user, balance: newBal });
      setAccount((prev) => ({ ...prev, balance: newBal }));
    }
    const tx: Transaction = {
      id: generateId(),
      userId,
      type: 'WITHDRAWAL',
      amount,
      method: 'admin',
      status: 'COMPLETED',
      date: Date.now()
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  const togglePageLock = (userId: string, page: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const locked = (u.lockedPages || []).includes(page);
          return {
            ...u,
            lockedPages: locked
              ? (u.lockedPages || []).filter((p) => p !== page)
              : [...(u.lockedPages || []), page]
          };
        }
        return u;
      })
    );
  };

  const toggleUserLock = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, isVerified: !u.isVerified };
        }
        return u;
      })
    );
  };

  const approveTransaction = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId ? { ...t, status: 'COMPLETED' as const } : t
      )
    );
    // Add balance if it's a deposit
    const tx = transactions.find((t) => t.id === transactionId);
    if (tx && tx.type === 'DEPOSIT') {
      setAccount((prev) => ({
        ...prev,
        balance: prev.balance + tx.amount
      }));
      // update user balances
      if (tx.userId) {
        setAllUsers((prev) =>
          prev.map((u) =>
            u.id === tx.userId
              ? { ...u, balance: (u.balance ?? 0) + tx.amount }
              : u
          )
        );
        if (user && user.id === tx.userId) {
          const newBal = (user.balance ?? 0) + tx.amount;
          setUser({ ...user, balance: newBal });
          setAccount((prev) => ({ ...prev, balance: newBal }));
        }
      }
    }
  };

  const rejectTransaction = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId ? { ...t, status: 'REJECTED' as const } : t
      )
    );
  };

  const getUserById = (userId: string): User | undefined => {
    return allUsers.find((u) => u.id === userId);
  };

  // Bot Purchase Methods
  const purchaseBot = (botId: string, botName: string, price: number, performance: number) => {
    if (!user || user.balance === undefined || user.balance < price) {
      alert('Insufficient balance');
      return;
    }
    const newBot: PurchasedBot = {
      id: generateId(),
      userId: user.id,
      botId,
      botName,
      allocatedAmount: 0,
      totalEarned: 0,
      totalLost: 0,
      status: 'PENDING_APPROVAL',
      purchasedAt: Date.now(),
      performance,
      dailyReturn: Math.random() * (15 - 5) + 5 // 5-15% daily
    };
    setPurchasedBots((prev) => [...prev, newBot]);
    // Deduct from balance
    setAccount((prev) => ({
      ...prev,
      balance: prev.balance - price
    }));
    alert('✅ Bot purchase request sent. Awaiting admin approval.');
  };

  const purchaseSignal = (signalId: string, providerName: string, price: number, winRate: number) => {
    if (!user || user.balance === undefined || user.balance < price) {
      alert('Insufficient balance');
      return;
    }
    const newSignal: PurchasedSignal = {
      id: generateId(),
      userId: user.id,
      signalId,
      providerName,
      cost: price,
      status: 'PENDING_APPROVAL',
      subscribedAt: Date.now(),
      tradesFollowed: 0,
      winRate,
      earnings: 0
    };
    setPurchasedSignals((prev) => [...prev, newSignal]);
    // Deduct from balance
    setAccount((prev) => ({
      ...prev,
      balance: prev.balance - price
    }));
    alert('✅ Signal subscription request sent. Awaiting admin approval.');
  };

  const approveBotPurchase = (botPurchaseId: string) => {
    setPurchasedBots((prev) =>
      prev.map((bot) =>
        bot.id === botPurchaseId
          ? { ...bot, status: 'ACTIVE', approvedAt: Date.now() }
          : bot
      )
    );
  };

  const approveSignalSubscription = (signalSubId: string) => {
    setPurchasedSignals((prev) =>
      prev.map((sig) =>
        sig.id === signalSubId
          ? { ...sig, status: 'ACTIVE', approvedAt: Date.now() }
          : sig
      )
    );
  };

  const allocateBotCapital = (botPurchaseId: string, amount: number) => {
    if (!user || user.balance === undefined || user.balance < amount) {
      alert('Insufficient balance');
      return;
    }
    setPurchasedBots((prev) =>
      prev.map((bot) =>
        bot.id === botPurchaseId
          ? { ...bot, allocatedAmount: amount }
          : bot
      )
    );
    setAccount((prev) => ({
      ...prev,
      balance: prev.balance - amount
    }));
  };

  const terminateBot = (botPurchaseId: string) => {
    setPurchasedBots((prev) =>
      prev.map((bot) =>
        bot.id === botPurchaseId
          ? { ...bot, status: 'CLOSED' }
          : bot
      )
    );
  };

  const terminateSignal = (signalSubId: string) => {
    setPurchasedSignals((prev) =>
      prev.map((sig) =>
        sig.id === signalSubId
          ? { ...sig, status: 'TERMINATED' }
          : sig
      )
    );
  };

  const executeTrade = (
  symbol: string,
  type: TradeType,
  lots: number,
  sl?: number,
  tp?: number) =>
  {
    const asset = assets.find((a) => a.symbol === symbol);
    if (!asset) return;
    const entryPrice = type === 'BUY' ? asset.ask : asset.bid;
    const newTrade: Trade = {
      id: generateId(),
      symbol,
      type,
      lots,
      entryPrice,
      currentPrice: entryPrice,
      sl: sl || null,
      tp: tp || null,
      openTime: Date.now(),
      profit: 0,
      status: 'OPEN',
      commission: 0,
      swap: 0
    };
    setTrades((prev) => [newTrade, ...prev]);
  };
  const closeTrade = (tradeId: string) => {
    const trade = trades.find((t) => t.id === tradeId);
    if (!trade) return;
    const closedTrade: Trade = {
      ...trade,
      status: 'CLOSED',
      closeTime: Date.now()
    };
    setHistory((prev) => [closedTrade, ...prev]);
    setTrades((prev) => prev.filter((t) => t.id !== tradeId));
    setAccount((prev) => ({
      ...prev,
      balance: prev.balance + trade.profit
    }));
  };
  const modifyTradeSLTP = (
  tradeId: string,
  sl: number | null,
  tp: number | null) =>
  {
    setTrades((prev) =>
    prev.map((t) => {
      if (t.id === tradeId) {
        return {
          ...t,
          sl,
          tp
        };
      }
      return t;
    })
    );
  };
  // record a deposit request; always pending until admin approval
  const deposit = (amount: number, method: string) => {
    const tx: Transaction = {
      id: generateId(),
      userId: user?.id || '',
      type: 'DEPOSIT',
      amount,
      method,
      status: 'PENDING',
      date: Date.now()
    };
    setTransactions((prev) => [tx, ...prev]);
  };
  const withdraw = (amount: number, method: string) => {
    const tx: Transaction = {
      id: generateId(),
      userId: user?.id || '',
      type: 'WITHDRAWAL',
      amount,
      method,
      status: 'PENDING',
      date: Date.now()
    };
    setTransactions((prev) => [tx, ...prev]);
    // Balance deduction usually happens on approval, but for MVP we can deduct immediately or wait
    // Let's deduct immediately for "Free Margin" impact
    setAccount((prev) => ({
      ...prev,
      balance: prev.balance - amount
    }));
    if (user) {
      const newBal = Math.max(0, (user.balance || 0) - amount);
      setUser({ ...user, balance: newBal });
      setAllUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, balance: newBal } : u))
      );
    }
  };
  const toggleBot = (active: boolean) => setBotActive(active);

  // Funded Account Methods
  const purchaseFundedAccount = (planId: string, planName: string, capital: number, price: number, profitTarget: number, maxDrawdown: number) => {
    if (!user || (user.balance ?? 0) < price) return;
    // deduct cost if applicable
    if (price > 0) {
      setAccount((prev) => ({ ...prev, balance: prev.balance - price }));
    }
    const account: FundedAccountPurchase = {
      id: generateId(),
      userId: user.id,
      planId,
      planName,
      accountCapital: capital,
      platformFee: price,
      profitTarget,
      maxDrawdown,
      status: 'PENDING_APPROVAL',
      createdAt: Date.now(),
      approvedAt: null
    };
    setPurchasedFundedAccounts((prev) => [...prev, account]);
    alert('✅ Funded account purchase request submitted');
  };

  const approveFundedAccount = (accountId: string) => {
    // find account first then update state so we have the data
    let approved: FundedAccountPurchase | undefined;
    setPurchasedFundedAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          approved = { ...acc, status: 'ACTIVE', approvedAt: Date.now() };
          return approved;
        }
        return acc;
      })
    );
    if (approved) {
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === approved!.userId
            ? { ...u, balance: (u.balance ?? 0) + approved!.accountCapital }
            : u
        )
      );
      // update current user/account if applicable
      if (user && user.id === approved.userId) {
        const newBal = (user.balance ?? 0) + approved.accountCapital;
        setUser({ ...user, balance: newBal });
        setAccount((prev) => ({ ...prev, balance: newBal }));
      }
    }
    alert('✅ Funded account approved and capital credited');
  };

  const rejectFundedAccount = (accountId: string) => {
    setPurchasedFundedAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId ? { ...acc, status: 'REJECTED' } : acc
      )
    );
    // Refund the platform fee
    const account = purchasedFundedAccounts.find((a) => a.id === accountId);
    if (account) {
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === account.userId
            ? { ...u, balance: (u.balance ?? 0) + account.platformFee }
            : u
        )
      );
    }
    alert('✅ Funded account rejected and fee refunded');
  };

  // Bot Template Methods
  const addBotTemplate = (name: string, description: string, price: number, performance: number, winRate: number, trades: number, type: string, risk: 'Low' | 'Medium' | 'High', maxDrawdown: number) => {
    if (!user) return;
    const newBot: BotTemplate = {
      id: generateId(),
      name,
      description,
      price,
      performance,
      winRate,
      trades,
      type,
      risk,
      maxDrawdown,
      createdBy: user.id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setBotTemplates((prev) => [...prev, newBot]);
    alert('✅ Bot template created successfully');
  };

  const editBotTemplate = (botId: string, updates: Partial<BotTemplate>) => {
    setBotTemplates((prev) =>
      prev.map((bot) =>
        bot.id === botId
          ? { ...bot, ...updates, updatedAt: Date.now() }
          : bot
      )
    );
    alert('✅ Bot template updated');
  };

  const deleteBotTemplate = (botId: string) => {
    setBotTemplates((prev) => prev.filter((bot) => bot.id !== botId));
    alert('✅ Bot template deleted');
  };

  // Signal Template Methods
  const addSignalTemplate = (providerName: string, description: string, cost: number, winRate: number, trades: number, avgReturn: number) => {
    if (!user) return;
    const newSignal: SignalTemplate = {
      id: generateId(),
      providerName,
      description,
      cost,
      winRate,
      trades,
      avgReturn,
      createdBy: user.id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setSignalTemplates((prev) => [...prev, newSignal]);
    alert('✅ Signal template created successfully');
  };

  const editSignalTemplate = (signalId: string, updates: Partial<SignalTemplate>) => {
    setSignalTemplates((prev) =>
      prev.map((signal) =>
        signal.id === signalId
          ? { ...signal, ...updates, updatedAt: Date.now() }
          : signal
      )
    );
    alert('✅ Signal template updated');
  };

  const deleteSignalTemplate = (signalId: string) => {
    setSignalTemplates((prev) => prev.filter((signal) => signal.id !== signalId));
    alert('✅ Signal template deleted');
  };

  // Wallet Methods
  const addWallet = (userId: string, address: string, label: string, type: 'DEPOSIT' | 'PURCHASE', currency: string, network?: string) => {
    const newWallet: Wallet = {
      id: generateId(),
      userId,
      address,
      label,
      type,
      currency,
      network,
      createdAt: Date.now()
    };
    setWallets((prev) => [...prev, newWallet]);
    alert('✅ Wallet added successfully');
  };

  const removeWallet = (walletId: string) => {
    setWallets((prev) => prev.filter((w) => w.id !== walletId));
    alert('✅ Wallet removed');
  };

  // Copy Trading Methods
  const followTrader = (trader: any, allocation: number, durationValue: string, durationType: 'hours' | 'days') => {
    if (!user) return;
    const newCopy: CopyTrade = {
      id: generateId(),
      userId: user.id,
      tradesId: Date.now(),
      traderName: trader?.name || 'Unknown',
      allocation,
      status: 'ACTIVE',
      copiedTrades: 0,
      profit: 0,
      startDate: Date.now(),
      durationValue,
      durationType,
      winRate: '0%',
      risk: (trader && trader.risk) || 'Medium',
      performance: trader?.performance
    };
    setPurchasedCopyTrades((prev) => [...prev, newCopy]);
    alert('✅ Now copying trader');
  };

  const stopCopyTrading = (copyTradeId: string) => {
    setPurchasedCopyTrades((prev) =>
      prev.map((ct) => (ct.id === copyTradeId ? { ...ct, status: 'CLOSED', endDate: Date.now() } : ct))
    );
    alert('✅ Stopped copy trading');
  };

  const closeCopyTrade = (copyTradeId: string, profit: number) => {
    setPurchasedCopyTrades((prev) =>
      prev.map((ct) => (ct.id === copyTradeId ? { ...ct, status: 'CLOSED', profit, endDate: Date.now() } : ct))
    );
  };

  // Pause/Resume Bot
  const pauseBot = (botPurchaseId: string) => {
    setPurchasedBots((prev) =>
      prev.map((bot) =>
        bot.id === botPurchaseId ? { ...bot, paused: true } : bot
      )
    );
    alert('✅ Bot paused');
  };

  const resumeBot = (botPurchaseId: string) => {
    setPurchasedBots((prev) =>
      prev.map((bot) =>
        bot.id === botPurchaseId ? { ...bot, paused: false } : bot
      )
    );
    alert('✅ Bot resumed');
  };

  // Get user transactions
  const getUserTransactions = (userId: string): Transaction[] => {
    return transactions.filter((t) => t.userId === userId);
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        allUsers,
        account,
        assets,
        trades,
        history,
        transactions,
        signals,
        purchasedBots,
        purchasedSignals,
        purchasedCopyTrades,
        purchasedFundedAccounts,
        botTemplates,
        signalTemplates,
        wallets,
        isAuthenticated: !!user,
        botActive,
        login,
        logout,
        executeTrade,
        closeTrade,
        modifyTradeSLTP,
        deposit,
        withdraw,
        toggleBot,
        purchaseBot,
        purchaseSignal,
        approveBotPurchase,
        approveSignalSubscription,
        allocateBotCapital,
        pauseBot,
        resumeBot,
        terminateBot,
        terminateSignal,
        followTrader,
        stopCopyTrading,
        closeCopyTrade,
        purchaseFundedAccount,
        approveFundedAccount,
        rejectFundedAccount,
        addBotTemplate,
        editBotTemplate,
        deleteBotTemplate,
        addSignalTemplate,
        editSignalTemplate,
        deleteSignalTemplate,
        addWallet,
        removeWallet,
        addBalance,
        removeBalance,
        togglePageLock,
        toggleUserLock,
        approveTransaction,
        rejectTransaction,
        getUserById,
        getUserTransactions
      }}>

      {children}
    </StoreContext.Provider>);

}
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}