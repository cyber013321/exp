import { useState, useEffect, useCallback } from 'react';
import { Clock, Wallet, Zap, X, Check, AlertCircle, Copy } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  itemName: string;
  currentBalance: number;
  onPaymentComplete: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  itemName,
  currentBalance,
  onPaymentComplete
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'crypto' | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [countdown, setCountdown] = useState(1200); // 20 minutes
  const [isPaid, setIsPaid] = useState(false);
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: 64200, address: '3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy' },
    { symbol: 'ETH', name: 'Ethereum', price: 3450, address: '0x1234567890123456789012345678901234567890' },
    { symbol: 'USDT', name: 'Tether', price: 1, address: 'TG3X9LaYRP67VQ1sNqAJCHryvUL4ZoxZ9q' },
    { symbol: 'USDC', name: 'USD Coin', price: 1, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCountdown(1200);
      setIsPaid(false);
      setPaymentMethod(null);
      setCryptoAmount('');
      setCopied(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-close on timeout
          setTimeout(() => onClose(), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayWithBalance = () => {
    if (currentBalance >= amount) {
      setIsPaid(true);
      setTimeout(() => {
        onPaymentComplete();
        onClose();
      }, 1500);
    }
  };

  const handlePayWithCrypto = () => {
    if (cryptoAmount && parseFloat(cryptoAmount) > 0) {
      setIsPaid(true);
      setTimeout(() => {
        onPaymentComplete();
        onClose();
      }, 1500);
    }
  };

  const handleCopyAddress = () => {
    const selectedCryptoData = cryptos.find((c) => c.symbol === selectedCrypto);
    if (selectedCryptoData) {
      navigator.clipboard.writeText(selectedCryptoData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  const selectedCryptoData = cryptos.find((c) => c.symbol === selectedCrypto);
  const cryptoEquivalent = selectedCryptoData ? (amount / selectedCryptoData.price).toFixed(8) : '0';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg max-w-lg w-full space-y-6 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Payment Required</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#21262d] rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-[#8b949e]" />
          </button>
        </div>

        {/* Item Details */}
        <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 space-y-3">
          <p className="text-sm text-[#8b949e]">Item</p>
          <p className="text-white font-bold text-lg">{itemName}</p>
          <div className="flex items-baseline justify-between pt-3 border-t border-[#21262d]">
            <span className="text-[#8b949e]">Amount Due</span>
            <span className="text-3xl font-bold text-[#26a69a]">${amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Countdown Timer */}
        {!isPaid && countdown > 0 && (
          <div className="flex items-center justify-center gap-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <Clock className="h-5 w-5 text-[#2962ff] animate-spin" />
            <div className="text-center">
              <p className="text-xs text-[#8b949e] uppercase">Time to complete payment</p>
              <p className="text-2xl font-bold text-white font-mono">
                {formatTime(countdown)}
              </p>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {!isPaid && paymentMethod === null && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-[#8b949e] uppercase">Select Payment Method</p>
            
            {/* Pay with Balance */}
            <button
              onClick={() => setPaymentMethod('balance')}
              className="w-full border-2 border-[#21262d] hover:border-[#2962ff] rounded-lg p-4 transition-all hover:bg-[#2962ff]/10 text-left"
            >
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-[#2962ff]" />
                <div>
                  <p className="font-bold text-white">Pay with Account Balance</p>
                  <p className="text-xs text-[#8b949e]">Use your available balance</p>
                </div>
              </div>
            </button>

            {/* Pay with Crypto */}
            <button
              onClick={() => setPaymentMethod('crypto')}
              className="w-full border-2 border-[#21262d] hover:border-[#2962ff] rounded-lg p-4 transition-all hover:bg-[#2962ff]/10 text-left"
            >
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-bold text-white">Pay with Cryptocurrency</p>
                  <p className="text-xs text-[#8b949e]">BTC, ETH, USDT, USDC accepted</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Balance Payment Method */}
        {!isPaid && paymentMethod === 'balance' && (
          <div className="space-y-4">
            <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-[#8b949e]">Current Balance</span>
                <span className="font-bold text-white">${currentBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b949e]">Amount</span>
                <span className="font-bold text-white">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#21262d]">
                <span className="text-[#8b949e]">Remaining</span>
                <span
                  className={`font-bold ${
                    currentBalance - amount >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'
                  }`}
                >
                  ${(currentBalance - amount).toFixed(2)}
                </span>
              </div>
            </div>

            {currentBalance >= amount ? (
              <button
                onClick={handlePayWithBalance}
                className="w-full py-2.5 bg-[#26a69a] hover:bg-teal-600 text-white font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-teal-500/30"
              >
                Pay ${amount.toFixed(2)}
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full p-2.5 bg-[#ef5350]/10 border border-[#ef5350] rounded-lg">
                <AlertCircle className="h-4 w-4 text-[#ef5350]" />
                <span className="text-xs text-[#ef5350]">Insufficient balance. Please deposit funds.</span>
              </div>
            )}

            <button
              onClick={() => setPaymentMethod(null)}
              className="w-full py-2 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] font-medium rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        )}

        {/* Crypto Payment Method */}
        {!isPaid && paymentMethod === 'crypto' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#8b949e] uppercase font-bold block mb-2">Select Cryptocurrency</label>
              <select
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff]"
              >
                {cryptos.map((crypto) => (
                  <option key={crypto.symbol} value={crypto.symbol}>
                    {crypto.name} ({crypto.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8b949e]">Price per {selectedCrypto}</span>
                <span className="font-mono font-bold text-white">${selectedCryptoData?.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b949e]">Amount to Send</span>
                <span className="font-mono font-bold text-white">{cryptoEquivalent} {selectedCrypto}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#21262d]">
                <span className="text-[#8b949e]">USD Value</span>
                <span className="font-bold text-[#26a69a]">${amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 space-y-2">
              <p className="text-xs text-[#8b949e] uppercase font-bold">Send to this address</p>
              <div className="font-mono text-xs text-white break-all bg-[#161b22] p-3 rounded border border-[#21262d] min-h-[60px] flex items-center">
                {selectedCryptoData?.address}
              </div>
              <button
                onClick={handleCopyAddress}
                className={`w-full py-1.5 text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-[#26a69a]/20 text-[#26a69a]'
                    : 'bg-[#21262d] hover:bg-[#30363d] text-[#8b949e]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy Address
                  </>
                )}
              </button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-300">
                ✓ Send exactly <span className="font-bold">{cryptoEquivalent} {selectedCrypto}</span> to complete payment
              </p>
            </div>

            <input
              type="number"
              value={cryptoAmount}
              onChange={(e) => setCryptoAmount(e.target.value)}
              placeholder="Enter amount you sent"
              className="w-full px-3 py-2.5 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff]"
            />

            {cryptoAmount && parseFloat(cryptoAmount) > 0 ? (
              <button
                onClick={handlePayWithCrypto}
                className="w-full py-2.5 bg-[#26a69a] hover:bg-teal-600 text-white font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-teal-500/30"
              >
                I've Sent the Payment
              </button>
            ) : (
              <button className="w-full py-2.5 bg-[#21262d] text-[#8b949e] font-bold rounded-lg cursor-not-allowed">
                Enter amount to continue
              </button>
            )}

            <button
              onClick={() => setPaymentMethod(null)}
              className="w-full py-2 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] font-medium rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        )}

        {/* Paid Confirmation */}
        {isPaid && (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#26a69a]/20 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-[#26a69a] animate-bounce" />
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-white">Payment Received!</p>
              <p className="text-sm text-[#8b949e] mt-2">Your transaction has been processed successfully</p>
            </div>
          </div>
        )}

        {/* Footer Note */}
        {!isPaid && paymentMethod !== null && (
          <p className="text-xs text-[#8b949e] text-center">
            This payment window will close in {formatTime(countdown)}
          </p>
        )}
      </div>
    </div>
  );
}
