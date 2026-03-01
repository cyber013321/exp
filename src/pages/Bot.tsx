import React, { useState } from 'react';
import { useStore } from '../lib/store';
import {
  Bot,
  Zap,
  Shield,
  BarChart2,
  PlayCircle,
  StopCircle,
  TrendingUp,
  Award,
  Clock,
  Lock,
  X,
  Plus
} from 'lucide-react';
import { PaymentModal } from '../components/PaymentModal';

export function BotPage() {
  const { 
    botActive, 
    toggleBot, 
    trades, 
    account, 
    purchasedBots, 
    purchaseBot,
    allocateBotCapital,
    pauseBot,
    resumeBot,
    user 
  } = useStore();
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    bot: null as any,
    price: 0
  });
  const [allocationModal, setAllocationModal] = useState({
    isOpen: false,
    botId: '',
    amount: ''
  });

  const bots = [
    {
      name: 'Scalper Pro',
      type: 'High Frequency',
      risk: 'High',
      return: 124,
      price: 149.99,
      color: 'from-purple-500 to-pink-500',
      description: 'Fast-paced trading bot optimized for quick profits',
      trades: 324,
      winRate: 64,
      maxDrawdown: 15
    },
    {
      name: 'Trend Hunter V2',
      type: 'Swing Trading',
      risk: 'Medium',
      return: 45,
      price: 99.99,
      color: 'from-blue-500 to-cyan-500',
      description: 'Captures medium-term market trends',
      trades: 156,
      winRate: 72,
      maxDrawdown: 8
    },
    {
      name: 'Gold Rush AI',
      type: 'Commodities',
      risk: 'Medium',
      return: 68,
      price: 199.99,
      color: 'from-yellow-500 to-orange-500',
      description: 'Specialized in precious metals trading',
      trades: 89,
      winRate: 68,
      maxDrawdown: 12
    },
    {
      name: 'Smart Grid',
      type: 'Arbitrage',
      risk: 'Low',
      return: 12,
      price: 49.99,
      color: 'from-green-500 to-emerald-500',
      description: 'Safe arbitrage strategy with consistent returns',
      trades: 204,
      winRate: 85,
      maxDrawdown: 3
    },
    {
      name: 'Neural Trader',
      type: 'AI Prediction',
      risk: 'High',
      return: 156,
      price: 299.99,
      color: 'from-red-500 to-rose-500',
      description: 'Advanced AI-powered prediction engine',
      trades: 421,
      winRate: 71,
      maxDrawdown: 18
    },
    {
      name: 'Crypto Momentum',
      type: 'Crypto Only',
      risk: 'High',
      return: 89,
      price: 0,
      color: 'from-indigo-500 to-violet-500',
      description: 'Free trial - Specialized in cryptocurrency markets',
      trades: 267,
      winRate: 66,
      maxDrawdown: 16
    }
  ];

  const handleBuyBot = (bot: any) => {
    setPaymentModal({
      isOpen: true,
      bot,
      price: typeof bot.price === 'number' ? bot.price : 0
    });
  };

  const handlePaymentComplete = () => {
    if (paymentModal.bot) {
      const botData = paymentModal.bot;
      purchaseBot(
        `bot_${Date.now()}`,
        botData.name,
        botData.price,
        botData.return
      );
      setPaymentModal({ isOpen: false, bot: null, price: 0 });
    }
  };

  const handleAllocateCapital = () => {
    if (allocationModal.botId && allocationModal.amount) {
      const amount = parseFloat(allocationModal.amount);
      if (amount > 0 && (user?.balance ?? 0) >= amount) {
        allocateBotCapital(allocationModal.botId, amount);
        setAllocationModal({ isOpen: false, botId: '', amount: '' });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-10 pb-20 md:pb-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#0d1117] border border-[#21262d] rounded-lg overflow-hidden p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#2962ff] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bot className="h-6 w-6 text-[#2962ff]" />
            <span className="text-[#2962ff] font-bold text-sm">AI-Powered Trading</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Automate Your Trading Strategy</h1>
          <p className="text-[#8b949e] max-w-2xl mx-auto">
            Deploy professional trading algorithms to execute trades 24/7 with precision
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Available Bots</span>
            <Bot className="h-4 w-4 text-[#2962ff]" />
          </div>
          <span className="block text-2xl font-bold text-white">6</span>
          <span className="text-xs text-[#8b949e]">Premium & Free</span>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Avg Win Rate</span>
            <Award className="h-4 w-4 text-[#26a69a]" />
          </div>
          <span className="block text-2xl font-bold text-[#26a69a]">71%</span>
          <span className="text-xs text-[#8b949e]">Across all bots</span>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Total Trades</span>
            <BarChart2 className="h-4 w-4 text-yellow-500" />
          </div>
          <span className="block text-2xl font-bold text-white">1,561</span>
          <span className="text-xs text-[#8b949e]">Successfully executed</span>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Users Benefiting</span>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <span className="block text-2xl font-bold text-white">3,247</span>
          <span className="text-xs text-[#8b949e]">Active traders</span>
        </div>
      </div>

      {/* Active Bot Section */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#2962ff]/20 rounded-lg">
              <Bot className="h-6 w-6 text-[#2962ff]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">My Active Bot</h2>
              <p className="text-sm text-[#8b949e]">
                {botActive ? 'Running: Scalper Pro' : 'No bot currently running'}
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleBot(!botActive)}
            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold transition-all w-full md:w-auto ${
              botActive
                ? 'bg-[#ef5350]/20 text-[#ef5350] hover:bg-[#ef5350]/30'
                : 'bg-[#26a69a] text-white hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/30'
            }`}
          >
            {botActive ? (
              <>
                <StopCircle className="h-4 w-4" /> Stop Bot
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" /> Start Bot
              </>
            )}
          </button>
        </div>

        {botActive && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] space-y-2">
              <span className="text-xs text-[#8b949e]">Total Trades Today</span>
              <span className="block text-2xl font-bold text-white">24</span>
              <span className="text-xs text-[#26a69a]">+2 pending</span>
            </div>
            <div className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] space-y-2">
              <span className="text-xs text-[#8b949e]">Win Rate</span>
              <span className="block text-2xl font-bold text-[#26a69a]">68%</span>
              <span className="text-xs text-[#8b949e]">16/24 won</span>
            </div>
            <div className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] space-y-2">
              <span className="text-xs text-[#8b949e]">Daily Profit</span>
              <span className="block text-2xl font-bold text-[#26a69a]">+$1,240.50</span>
              <span className="text-xs text-[#8b949e]">+12.4%</span>
            </div>
            <div className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] space-y-2">
              <span className="text-xs text-[#8b949e]">Status</span>
              <span className="block text-2xl font-bold text-[#2962ff] animate-pulse">Active</span>
              <span className="text-xs text-[#8b949e]">Running smoothly</span>
            </div>
          </div>
        )}
      </div>

      {/* My Purchased Bots Section */}
      {purchasedBots.length > 0 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">My Purchased Bots</h3>
            <p className="text-[#8b949e]">Bots you own and can allocate capital to</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedBots.map((purchase) => (
              <div
                key={purchase.id}
                className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden hover:border-[#26a69a] transition-all"
              >
                <div className="h-2 bg-gradient-to-r from-[#26a69a] to-cyan-500" />
                
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white">{purchase.botName}</h4>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          purchase.status === 'ACTIVE'
                            ? 'bg-[#26a69a]/20 text-[#26a69a]'
                            : purchase.status === 'PENDING_APPROVAL'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-[#8b949e]/20 text-[#8b949e]'
                        }`}
                      >
                        {purchase.status === 'PENDING_APPROVAL' ? 'Pending Approval' : purchase.status}
                      </span>
                    </div>
                  </div>

                  {purchase.status === 'ACTIVE' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d]">
                          <span className="text-xs text-[#8b949e]">Allocated</span>
                          <span className="block text-base font-bold text-white">
                            ${purchase.allocatedAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d]">
                          <span className="text-xs text-[#8b949e]">Earned</span>
                          <span className="block text-base font-bold text-[#26a69a]">
                            ${purchase.totalEarned.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {purchase.allocatedAmount === 0 ? (
                        <button
                          onClick={() => setAllocationModal({ isOpen: true, botId: purchase.id, amount: '' })}
                          className="w-full py-2 bg-[#2962ff] hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                        >
                          <Plus className="h-4 w-4" /> Allocate Capital
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs text-[#8b949e] text-center">
                            Bot is actively trading with ${purchase.allocatedAmount.toFixed(2)}
                          </div>
                          <button
                            onClick={() => pauseBot(purchase.id)}
                            className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 rounded-lg font-bold text-sm transition-all border border-yellow-500/30"
                          >
                            ⏸ Pause Bot
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {purchase.status === 'PAUSED' && (
                    <>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center mb-3">
                        <p className="text-yellow-500 text-sm font-bold">⏸ Bot is paused</p>
                      </div>
                      <button
                        onClick={() => resumeBot(purchase.id)}
                        className="w-full py-2 bg-[#26a69a] hover:bg-teal-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        ▶ Resume Bot
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marketplace Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Available Bots</h3>
          <p className="text-[#8b949e]">Choose from our collection of high-performance trading algorithms</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <div
              key={bot.name}
              className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden hover:border-[#2962ff] transition-all group hover:shadow-lg hover:shadow-blue-500/10"
            >
              {/* Top Gradient Bar */}
              <div className={`h-2 bg-gradient-to-r ${bot.color}`} />

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-[#2962ff] transition-colors mb-1">
                      {bot.name}
                    </h4>
                    <p className="text-sm text-[#8b949e]">{bot.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                      bot.risk === 'High'
                        ? 'bg-[#ef5350]/20 text-[#ef5350]'
                        : bot.risk === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-[#26a69a]/20 text-[#26a69a]'
                    }`}
                  >
                    {bot.risk} Risk
                  </span>
                </div>

                {/* Type */}
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 bg-[#2962ff]/20 text-[#2962ff] rounded-full font-medium">
                    {bot.type}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#0d1117] p-3 rounded border border-[#21262d] space-y-1">
                    <span className="text-xs text-[#8b949e] flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Return
                    </span>
                    <span className="text-lg font-bold text-[#26a69a]">+{bot.return}%</span>
                  </div>
                  <div className="bg-[#0d1117] p-3 rounded border border-[#21262d] space-y-1">
                    <span className="text-xs text-[#8b949e] flex items-center gap-1">
                      <Award className="h-3 w-3" /> Win Rate
                    </span>
                    <span className="text-lg font-bold text-white">{bot.winRate}%</span>
                  </div>
                  <div className="bg-[#0d1117] p-3 rounded border border-[#21262d] space-y-1">
                    <span className="text-xs text-[#8b949e] flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Drawdown
                    </span>
                    <span className="text-lg font-bold text-white">{bot.maxDrawdown}%</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center text-xs text-[#8b949e]">
                  <span>Trades executed: {bot.trades}</span>
                </div>

                {/* Footer */}
                <div className="border-t border-[#21262d] pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white">
                      {bot.price === 0 ? 'FREE' : `$${bot.price}`}
                    </span>
                    {bot.price > 0 && <p className="text-xs text-[#8b949e]">Monthly subscription</p>}
                    {bot.price === 0 && <p className="text-xs text-[#26a69a]">14-day free trial</p>}
                  </div>
                  <button
                    onClick={() => handleBuyBot(bot)}
                    className="px-4 py-2 bg-[#2962ff] hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    {bot.price === 0 ? 'Try Bot' : 'Buy Bot'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, bot: null, price: 0 })}
        amount={paymentModal.price}
        itemName={paymentModal.bot ? `${paymentModal.bot.name} Bot License` : ''}
        currentBalance={account.balance}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Capital Allocation Modal */}
      {allocationModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#161b22] border border-[#21262d] rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Allocate Capital to Bot</h3>
              <button
                onClick={() => setAllocationModal({ isOpen: false, botId: '', amount: '' })}
                className="text-[#8b949e] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] space-y-2">
              <p className="text-sm text-[#8b949e]">Available Balance</p>
              <p className="text-2xl font-bold text-white">${(user?.balance ?? 0).toFixed(2)}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">Amount to Allocate ($)</label>
              <input
                type="number"
                value={allocationModal.amount}
                onChange={(e) => setAllocationModal({ ...allocationModal, amount: e.target.value })}
                placeholder="Enter amount"
                className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-4 py-2 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#2962ff]"
              />
              <p className="text-xs text-[#8b949e]">The bot will trade with this amount and keep earnings</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setAllocationModal({ isOpen: false, botId: '', amount: '' })}
                className="flex-1 py-2 border border-[#21262d] text-white rounded-lg hover:bg-[#0d1117] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAllocateCapital}
                disabled={!allocationModal.amount || parseFloat(allocationModal.amount) <= 0 || parseFloat(allocationModal.amount) > (user?.balance ?? 0)}
                className="flex-1 py-2 bg-[#26a69a] text-white font-bold rounded-lg hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Allocate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}