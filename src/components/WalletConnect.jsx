import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('🦊 MetaMask not detected. Please install it.');
      return;
    }

    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await _provider.send('eth_requestAccounts', []);
      const userAddress = accounts[0];

      setProvider(_provider);
      setWalletAddress(userAddress);
      toast.success('✅ Wallet connected!');
    } catch (error) {
      if (error.code === 4001) {
        toast.warning('❌ Connection request was rejected by user');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const fetchBalance = async (addr, _provider) => {
    try {
      const balanceWei = await _provider.getBalance(addr);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
    } catch (err) {
      toast.error("⚠️ Couldn't fetch balance");
    }
  };

  useEffect(() => {
    if (!provider || !walletAddress) return;
    fetchBalance(walletAddress, provider);
  }, [provider, walletAddress]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setWalletAddress(null);
        setBalance(null);
        toast.info('🔌 Wallet disconnected');
      } else {
        setWalletAddress(accounts[0]);
        fetchBalance(accounts[0], provider);
        toast.info('🔄 Account changed');
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [provider]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-indigo-400">
          🦊 Ethereum Wallet Connector
        </h2>

        <button
          onClick={connectWallet}
          className="w-full px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition mb-4"
        >
          {walletAddress ? 'Connected' : 'Connect Wallet'}
        </button>

        {walletAddress ? (
          <div className="text-left space-y-2 text-sm">
            <div className="text-green-400 font-mono break-words">
              <strong>Address:</strong><br /> {walletAddress}
            </div>
            <div className="text-blue-300 font-semibold">
              <strong>Balance:</strong> Ξ {balance}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No wallet connected</p>
        )}
      </div>
    </div>
  );
}

export default WalletConnect;
