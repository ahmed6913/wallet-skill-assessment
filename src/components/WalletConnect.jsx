import React, { useState, useEffect } from 'react';
import { Wallet, Zap, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

function FloatingParticle({ delay = 0, duration = 4 }) {
  return (
    <div
      className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );
}

function EthereumIcon() {
  return (
    <div className="w-16 h-16 mx-auto mb-6 relative">
      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
        <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
        </svg>
      </div>
    </div>
  );
}

export default function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const formatAddress = (address) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const connectWallet = async () => {
    if (!window.ethereum) return toast.error("🦊 MetaMask not detected.");
    setIsLoading(true);
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await _provider.send("eth_requestAccounts", []);
      const userAddress = accounts[0];
      setProvider(_provider);
      setWalletAddress(userAddress);
      setIsConnected(true);
      toast.success("✅ Wallet connected!");
    } catch (error) {
      if (error.code === 4001) toast.warning("❌ Connection rejected.");
      else toast.error(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(null);
    setProvider(null);
    setIsConnected(false);
    toast.info("👋 Wallet disconnected");
  };

  const fetchBalance = async (addr, _provider) => {
    try {
      const balanceWei = await _provider.getBalance(addr);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
    } catch {
      toast.error("⚠️ Couldn't fetch balance");
    }
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success("📋 Address copied!");
    }
  };

  useEffect(() => {
    if (provider && walletAddress) fetchBalance(walletAddress, provider);
  }, [provider, walletAddress]);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) disconnectWallet();
      else {
        setWalletAddress(accounts[0]);
        if (provider) fetchBalance(accounts[0], provider);
        toast.info("🔄 Account changed");
      }
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () =>
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  }, [provider]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} duration={5 + Math.random() * 5} />
        ))}
      </div>

      {/* Responsive Card */}
      <div className="relative z-10 w-[90%] max-w-2xl mx-auto">
        <div className="bg-slate-800/60 backdrop-blur-lg rounded-3xl border border-slate-700 shadow-2xl p-8 md:p-10 hover:scale-[1.01] transition-transform duration-300">
          <EthereumIcon />
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              Web3 Wallet
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Connect to the decentralized future
            </p>
          </div>

          {!isConnected ? (
            <>
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition disabled:opacity-50"
              >
                <div className="flex justify-center items-center space-x-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-t-white border-white/30 rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      <span>Connect Wallet</span>
                      <Sparkles className="w-4 h-4 opacity-70" />
                    </>
                  )}
                </div>
              </button>
              <div className="grid grid-cols-2 gap-4 text-center mt-6">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-300">Lightning Fast</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <svg className="w-6 h-6 text-green-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs text-slate-300">Secure</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <span className="inline-flex items-center bg-green-800/30 text-green-400 px-4 py-1 rounded-full text-sm border border-green-700">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2" /> Connected
                </span>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-3 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">Wallet Address</p>
                  <p className="font-mono text-sm text-white">{formatAddress(walletAddress)}</p>
                </div>
                <button onClick={copyAddress} className="hover:text-cyan-400 transition">
                  <Copy className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 p-4 rounded-xl border border-purple-500/20 mb-4">
                <p className="text-xs text-slate-400">ETH Balance</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Ξ {balance || '0.0000'}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <button
                onClick={disconnectWallet}
                className="w-full py-3 px-6 bg-red-900/30 hover:bg-red-900/50 border border-red-800 hover:border-red-700 rounded-xl text-red-400 font-medium transition hover:scale-105"
              >
                Disconnect Wallet
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
