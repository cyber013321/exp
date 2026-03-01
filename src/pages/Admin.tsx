import { useState } from 'react';
import {
  BarChart3,
  Users,
  Wallet,
  Lock,
  X,
  Plus,
  DollarSign,
  Send,
  Settings,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useStore } from '../lib/store';

const AVAILABLE_PAGES = ['dashboard', 'trade', 'wallet', 'signals', 'bot', 'copy-trading', 'funded-accounts', 'kyc'];
const WALLET_TYPES = ['DEPOSIT', 'PURCHASE'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'BTC', 'ETH'];
const NETWORKS = ['', 'ERC20', 'TRC20', 'BEP20', 'Polygon'];

export function AdminPage() {
  const { 
    allUsers, 
    addBalance, 
    removeBalance, 
    togglePageLock, 
    toggleUserLock, 
    transactions, 
    approveTransaction, 
    rejectTransaction,
    purchasedBots,
    purchasedSignals,
    approveBotPurchase,
    approveSignalSubscription,
    terminateBot,
    terminateSignal,
    purchasedFundedAccounts,
    approveFundedAccount,
    rejectFundedAccount,
    wallets,
    addWallet,
    removeWallet,
    getUserTransactions
  } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [forms, setForms] = useState({
    addBalance: { userId: '', amount: '' },
  });
  // Wallet Management State
  const [walletUserId, setWalletUserId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletLabel, setWalletLabel] = useState('');
  const [walletType, setWalletType] = useState('DEPOSIT');
  const [walletCurrency, setWalletCurrency] = useState('USD');
  const [walletNetwork, setWalletNetwork] = useState('');

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Get current selected user from allUsers to ensure always fresh data
  const selectedUser = selectedUserId ? allUsers.find(u => u.id === selectedUserId) : null;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'balance', label: 'Balance Control', icon: Wallet },
    { id: 'pages', label: 'Page Access', icon: Lock },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
    { id: 'funded', label: 'Funded Accounts', icon: Zap },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
  ];

  const handleAddBalance = () => {
    if (forms.addBalance.userId && forms.addBalance.amount) {
      const amount = parseFloat(forms.addBalance.amount);
      if (amount > 0) {
        addBalance(forms.addBalance.userId, amount);
        setForms({ ...forms, addBalance: { userId: '', amount: '' } });
        // Show success message
        setTimeout(() => {
          alert('✅ Balance of $' + amount + ' added successfully');
        }, 100);
      }
    }
  };

  const handleRemoveBalance = (userId: string, amount: number) => {
    if (amount > 0) {
      removeBalance(userId, amount);
      alert('✅ Balance removed successfully');
    }
  };

  const handleTogglePageLock = (userId: string, page: string) => {
    togglePageLock(userId, page);
  };

  const handleToggleUserLock = (userId: string) => {
    toggleUserLock(userId);
  };

  // Dashboard Tab
  const DashboardTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Total Users</span>
            <Users className="h-4 w-4 text-[#2962ff]" />
          </div>
          <p className="text-3xl font-bold text-white">{allUsers.length}</p>
          <p className="text-xs text-[#8b949e]">Active: <span className="text-[#26a69a]">{allUsers.filter(u => u.isVerified).length}</span></p>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Total Balance</span>
            <Wallet className="h-4 w-4 text-[#26a69a]" />
          </div>
          <p className="text-3xl font-bold text-white">${allUsers.reduce((sum, u) => sum + (u.balance || 0), 0).toLocaleString()}</p>
          <p className="text-xs text-[#8b949e]">Across all users</p>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Pending Deposits</span>
            <Send className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-white">{transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'PENDING').length}</p>
          <p className="text-xs text-yellow-500">Awaiting approval</p>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Pending Withdrawals</span>
            <Send className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-white">{transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'PENDING').length}</p>
          <p className="text-xs text-orange-500">Needs action</p>
        </div>
      </div>

      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">System Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#2962ff]" />
              <span className="text-sm text-[#8b949e]">{allUsers.length} users registered in system</span>
            </div>
            <span className="text-xs text-[#26a69a]">Updated now</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-[#26a69a]" />
              <span className="text-sm text-[#8b949e]">{transactions.filter(t => t.status === 'PENDING').length} pending transactions</span>
          <span className="text-sm text-[#8b949e]">{purchasedFundedAccounts.filter(a => a.status === 'PENDING_APPROVAL').length} pending funded requests</span>
            </div>
            <span className="text-xs text-yellow-500">Action required</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-[#8b949e]">{allUsers.filter(u => !u.isVerified).length} locked users</span>
            </div>
            <span className="text-xs text-orange-500">Restricted</span>
          </div>
        </div>
      </div>
    </div>
  );

  // User Management Tab
  const UserManagementTab = () => (
    <div className="space-y-6">
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">All Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#21262d]">
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Email</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Name</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Balance</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Status</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#21262d] hover:bg-[#0d1117]/50">
                  <td className="py-3 px-4 text-white">{user.email}</td>
                  <td className="py-3 px-4 text-white">{user.name}</td>
                  <td className="py-3 px-4 text-white font-bold">${(user.balance || 0).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {user.isVerified ? (
                      <span className="px-2 py-1 bg-[#26a69a]/20 text-[#26a69a] rounded text-xs font-medium">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-[#ef5350]/20 text-[#ef5350] rounded text-xs font-medium">Locked</span>
                    )}
                  </td>
                  <td className="py-3 px-4 space-x-2 flex">
                    <button
                      onClick={() => setSelectedUserId(selectedUserId === user.id ? null : user.id)}
                      className="px-3 py-1 bg-[#2962ff] hover:bg-[#1e47a0] text-white rounded text-xs transition-colors"
                    >
                      {selectedUserId === user.id ? 'Close' : 'View'}
                    </button>
                    <button
                      onClick={() => handleToggleUserLock(user.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        user.isVerified
                          ? 'bg-[#ef5350]/20 text-[#ef5350] hover:bg-[#ef5350]/30'
                          : 'bg-[#26a69a]/20 text-[#26a69a] hover:bg-[#26a69a]/30'
                      }`}
                    >
                      {user.isVerified ? 'Lock' : 'Unlock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">User Details: {selectedUser.name}</h3>
            <button onClick={() => setSelectedUserId(null)} className="text-[#8b949e] hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#8b949e] uppercase mb-1">Email</p>
              <p className="text-white">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-xs text-[#8b949e] uppercase mb-1">Current Balance</p>
              <p className="text-white font-bold">${(selectedUser.balance || 0).toLocaleString()}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-[#8b949e] uppercase mb-2">Locked Pages</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_PAGES.map(page => (
                <button
                  key={page}
                  onClick={() => handleTogglePageLock(selectedUser.id, page)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    (selectedUser.lockedPages || []).includes(page)
                      ? 'bg-[#ef5350]/30 text-[#ef5350]'
                      : 'bg-[#26a69a]/20 text-[#26a69a] hover:bg-[#26a69a]/30'
                  }`}
                >
                  {(selectedUser.lockedPages || []).includes(page) ? (
                    <>
                      <Lock className="h-3 w-3 inline mr-1" />
                      {page}
                    </>
                  ) : (
                    <>{page}</>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Balance Control Tab
  const BalanceControlTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Add Balance</h3>
          <div>
            <label className="text-xs text-[#8b949e] uppercase mb-2 block">Search User (Name or Email)</label>
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => {
                setUserSearchQuery(e.target.value);
                setForms({ ...forms, addBalance: { ...forms.addBalance, userId: '' } });
              }}
              placeholder="Type user name or email..."
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] mb-2"
            />
            <select
              value={forms.addBalance.userId}
              onChange={(e) => setForms({ ...forms, addBalance: { ...forms.addBalance, userId: e.target.value } })}
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] mb-2"
            >
              <option value="">-- pick user --</option>
              {filteredUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            {forms.addBalance.userId && (
              <div className="mt-2 p-2 bg-[#26a69a]/10 border border-[#26a69a]/20 rounded text-sm text-[#26a69a]">
                Selected: {allUsers.find(u => u.id === forms.addBalance.userId)?.name}
              </div>
            )}
          </div>
          <div>
            <label className="text-xs text-[#8b949e] uppercase mb-2 block">Amount ($)</label>
            <input
              type="number"
              value={forms.addBalance.amount}
              onChange={(e) => setForms({ ...forms, addBalance: { ...forms.addBalance, amount: e.target.value } })}
              placeholder="1000"
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff]"
            />
          </div>
          <button
            onClick={handleAddBalance}
            className="w-full py-2.5 bg-[#26a69a] hover:bg-teal-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Balance
          </button>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-3">
          <h3 className="text-lg font-bold text-white">Quick Actions</h3>
          <div className="space-y-2">
            {allUsers.slice(0, 3).map(u => (
              <button
                key={u.id}
                onClick={() => handleRemoveBalance(u.id, 100)}
                className="w-full p-3 bg-[#0d1117] border border-[#21262d] rounded-lg hover:border-[#ef5350] transition-colors text-left"
              >
                <p className="text-white text-sm font-medium">{u.name}</p>
                <p className="text-xs text-[#8b949e]">Balance: ${(u.balance || 0).toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">User Balances</h3>
        <div className="space-y-2">
          {allUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg">
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-xs text-[#8b949e]">{user.email}</p>
              </div>
              <p className="text-lg font-bold text-[#26a69a]">${(user.balance || 0).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Page Access Control Tab
  const PageAccessTab = () => (
    <div className="space-y-6">
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">User-Specific Page Access</h3>
        <div className="space-y-4">
          {allUsers.map(user => (
            <div key={user.id} className="p-4 bg-[#0d1117] rounded-lg border border-[#21262d]">
              <p className="text-white font-medium mb-3">{user.name}</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_PAGES.map(page => (
                  <button
                    key={page}
                    onClick={() => handleTogglePageLock(user.id, page)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      (user.lockedPages || []).includes(page)
                        ? 'bg-[#ef5350] text-white'
                        : 'bg-[#26a69a] text-white'
                    }`}
                  >
                    {(user.lockedPages || []).includes(page) ? (
                      <>
                        <Lock className="h-3 w-3 inline mr-1" />
                        {page}
                      </>
                    ) : (
                      <>{page}</>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Bot & Signal Approvals Tab
  const ApprovalTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <p className="text-xs text-[#8b949e] uppercase">Pending Bot Purchases</p>
          <p className="text-3xl font-bold text-white">{purchasedBots.filter(b => b.status === 'PENDING_APPROVAL').length}</p>
          <p className="text-sm text-[#2962ff]">Awaiting approval</p>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <p className="text-xs text-[#8b949e] uppercase">Pending Signal Subscriptions</p>
          <p className="text-3xl font-bold text-white">{purchasedSignals.filter(s => s.status === 'PENDING_APPROVAL').length}</p>
          <p className="text-sm text-yellow-500">Awaiting approval</p>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <p className="text-xs text-[#8b949e] uppercase">Total Pending</p>
          <p className="text-3xl font-bold text-white">{purchasedBots.filter(b => b.status === 'PENDING_APPROVAL').length + purchasedSignals.filter(s => s.status === 'PENDING_APPROVAL').length}</p>
          <p className="text-sm text-[#8b949e]">All pending items</p>
        </div>
      </div>

      {/* Pending Bot Purchases */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Pending Bot Purchases</h3>
        {purchasedBots.filter(b => b.status === 'PENDING_APPROVAL').length > 0 ? (
          <div className="space-y-3">
            {purchasedBots.filter(b => b.status === 'PENDING_APPROVAL').map((bot) => {
              const user = allUsers.find(u => u.id === bot.userId);
              return (
                <div key={bot.id} className="flex items-center justify-between p-4 bg-[#0d1117] rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">{bot.botName}</p>
                    <p className="text-xs text-[#8b949e]">User: {user?.email}</p>
                    <p className="text-xs text-[#8b949e]">Performance: {bot.performance}%</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveBotPurchase(bot.id)}
                      className="px-4 py-2 bg-[#26a69a]/20 text-[#26a69a] rounded-lg text-sm font-bold hover:bg-[#26a69a]/30 flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" /> Approve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-8 text-[#8b949e]">No pending bot purchases</p>
        )}
      </div>

      {/* Pending Signal Subscriptions */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Pending Signal Subscriptions</h3>
        {purchasedSignals.filter(s => s.status === 'PENDING_APPROVAL').length > 0 ? (
          <div className="space-y-3">
            {purchasedSignals.filter(s => s.status === 'PENDING_APPROVAL').map((signal) => {
              const user = allUsers.find(u => u.id === signal.userId);
              return (
                <div key={signal.id} className="flex items-center justify-between p-4 bg-[#0d1117] rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">{signal.providerName}</p>
                    <p className="text-xs text-[#8b949e]">User: {user?.email}</p>
                    <p className="text-xs text-[#8b949e]">Win Rate: {signal.winRate}%</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveSignalSubscription(signal.id)}
                      className="px-4 py-2 bg-[#26a69a]/20 text-[#26a69a] rounded-lg text-sm font-bold hover:bg-[#26a69a]/30 flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" /> Approve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-8 text-[#8b949e]">No pending signal subscriptions</p>
        )}
      </div>

      {/* Active Bots History */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Active Bots Running</h3>
        {purchasedBots.filter(b => b.status === 'ACTIVE').length > 0 ? (
          <div className="space-y-3">
            {purchasedBots.filter(b => b.status === 'ACTIVE').map((bot) => {
              const user = allUsers.find(u => u.id === bot.userId);
              const runningTime = Date.now() - bot.approvedAt!;
              const days = Math.floor(runningTime / (1000 * 60 * 60 * 24));
              const hours = Math.floor((runningTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              return (
                <div key={bot.id} className="flex items-center justify-between p-4 bg-[#0d1117] rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">{bot.botName}</p>
                    <p className="text-xs text-[#8b949e]">User: {user?.email}</p>
                    <p className="text-xs text-[#8b949e]">Allocated: ${bot.allocatedAmount.toFixed(2)} | Earned: ${bot.totalEarned.toFixed(2)}</p>
                    <p className="text-xs text-[#26a69a] mt-1">Running: {days}d {hours}h</p>
                  </div>
                  <button
                    onClick={() => terminateBot(bot.id)}
                    className="px-4 py-2 bg-[#ef5350]/20 text-[#ef5350] rounded-lg text-sm font-bold hover:bg-[#ef5350]/30"
                  >
                    Terminate
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-8 text-[#8b949e]">No active bots running</p>
        )}
      </div>

      {/* Active Signals History */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Active Signal Subscriptions</h3>
        {purchasedSignals.filter(s => s.status === 'ACTIVE').length > 0 ? (
          <div className="space-y-3">
            {purchasedSignals.filter(s => s.status === 'ACTIVE').map((signal) => {
              const user = allUsers.find(u => u.id === signal.userId);
              const runningTime = Date.now() - signal.approvedAt!;
              const days = Math.floor(runningTime / (1000 * 60 * 60 * 24));
              const hours = Math.floor((runningTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              return (
                <div key={signal.id} className="flex items-center justify-between p-4 bg-[#0d1117] rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">{signal.providerName}</p>
                    <p className="text-xs text-[#8b949e]">User: {user?.email}</p>
                    <p className="text-xs text-[#8b949e]">Win Rate: {signal.winRate}% | Trades Followed: {signal.tradesFollowed}</p>
                    <p className="text-xs text-[#26a69a] mt-1">Earnings: ${signal.earnings.toFixed(2)} | Running: {days}d {hours}h</p>
                  </div>
                  <button
                    onClick={() => terminateSignal(signal.id)}
                    className="px-4 py-2 bg-[#ef5350]/20 text-[#ef5350] rounded-lg text-sm font-bold hover:bg-[#ef5350]/30"
                  >
                    Terminate
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-8 text-[#8b949e]">No active signals</p>
        )}
      </div>
    </div>
  );

  // Transaction Management Tab
  const TransactionTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <p className="text-xs text-[#8b949e] uppercase">Pending Deposits</p>
          <p className="text-3xl font-bold text-white">{transactions.filter(t => t.type === 'DEPOSIT').length}</p>
          <p className="text-sm text-yellow-500">${transactions.filter(t => t.type === 'DEPOSIT').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <p className="text-xs text-[#8b949e] uppercase">Pending Withdrawals</p>
          <p className="text-3xl font-bold text-white">{transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'PENDING').length}</p>
          <p className="text-sm text-orange-500">${transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'PENDING').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <p className="text-xs text-[#8b949e] uppercase">Total Transactions</p>
          <p className="text-3xl font-bold text-white">{transactions.length}</p>
          <p className="text-sm text-[#26a69a]">${transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Pending Transactions</h3>
        <div className="space-y-2">
          {transactions.filter(t => t.status === 'PENDING').length > 0 ? (
            transactions.filter(t => t.status === 'PENDING').map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-[#0d1117] rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Send className={`h-4 w-4 ${tx.type === 'DEPOSIT' ? 'text-[#26a69a]' : 'text-orange-500'}`} />
                    <div>
                      <p className="text-white font-medium">${tx.amount.toLocaleString()} {tx.type}</p>
                      <p className="text-xs text-[#8b949e]">Method: {tx.method}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveTransaction(tx.id)}
                    className="px-3 py-1 bg-[#26a69a]/20 text-[#26a69a] rounded text-xs hover:bg-[#26a69a]/30"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectTransaction(tx.id)}
                    className="px-3 py-1 bg-[#ef5350]/20 text-[#ef5350] rounded text-xs hover:bg-[#ef5350]/30"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[#8b949e] py-4">No pending transactions</p>
          )}
        </div>
      </div>

      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">All Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#21262d]">
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">User</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Type</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Method</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((tx) => (
                <tr key={tx.id} className="border-b border-[#21262d]">
                  <td className="py-3 px-4 text-white font-medium">{allUsers.find(u => u.id === tx.userId)?.email || 'N/A'}</td>
                  <td className="py-3 px-4 text-white font-medium">{tx.type}</td>
                  <td className="py-3 px-4 text-white">${tx.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-[#8b949e]">{tx.method}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.status === 'COMPLETED' ? 'bg-[#26a69a]/20 text-[#26a69a]' :
                      tx.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-[#ef5350]/20 text-[#ef5350]'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // funded accounts management tab
  const FundedAccountsTab = () => (
    <div className="space-y-6">
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Funded Account Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#21262d]">
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">User</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Plan</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Status</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Requested</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchasedFundedAccounts.map(acc => (
                <tr key={acc.id} className="border-b border-[#21262d] hover:bg-[#0d1117]/50">
                  <td className="py-3 px-4 text-white">{allUsers.find(u => u.id === acc.userId)?.email || 'N/A'}</td>
                  <td className="py-3 px-4 text-white">{acc.planName}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      acc.status === 'APPROVED' ? 'bg-[#26a69a]/20 text-[#26a69a]' :
                      acc.status === 'REJECTED' ? 'bg-[#ef5350]/20 text-[#ef5350]' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {acc.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#8b949e]">{new Date(acc.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 space-x-2 flex">
                    {acc.status === 'PENDING_APPROVAL' && (
                      <>
                        <button
                          onClick={() => approveFundedAccount(acc.id)}
                          className="px-3 py-1 bg-[#26a69a]/20 text-[#26a69a] rounded text-xs hover:bg-[#26a69a]/30"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectFundedAccount(acc.id)}
                          className="px-3 py-1 bg-[#ef5350]/20 text-[#ef5350] rounded text-xs hover:bg-[#ef5350]/30"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'users':
        return <UserManagementTab />;
      case 'balance':
        return <BalanceControlTab />;
      case 'pages':
        return <PageAccessTab />;
      case 'approvals':
        return <ApprovalTab />;
      case 'funded':
        return <FundedAccountsTab />;
      case 'transactions':
        return <TransactionTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#0d1117] border border-[#21262d] rounded-lg p-8 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-6 w-6 text-[#2962ff]" />
          <span className="text-[#2962ff] font-bold text-sm">ADMIN CONTROL PANEL</span>
        </div>
        <h1 className="text-4xl font-bold text-white">Platform Administration</h1>
        <p className="text-[#8b949e]">Manage all users, balances, transactions, and system access</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 bg-[#161b22] border border-[#21262d] rounded-lg p-4 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#2962ff] text-white shadow-lg shadow-blue-500/20'
                  : 'bg-[#0d1117] text-[#8b949e] border border-[#21262d] hover:border-[#2962ff] hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {renderTab()}
      </div>
    </div>
  );
}
