import React, { useState } from 'react';
import { StoreProvider, useStore } from './lib/store';
import { AuthPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { TradePage } from './pages/TradePage';
import { WalletPage } from './pages/Wallet';
import { SignalsPage } from './pages/Signals';
import { BotPage } from './pages/Bot';
import { SettingsPage } from './pages/SettingsPage';
import { KYCPage } from './pages/KYC';
import { CopyTradingPage } from './pages/CopyTrading';
import { FundedAccountsPage } from './pages/FundedAccounts';
import { AdminPage } from './pages/Admin';
import { Layout } from './components/Layout';
function AppContent() {
  const { isAuthenticated, user, allUsers } = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // ensure that when authentication state changes we land on dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderPage = () => {
    // Admin route protection
    if (currentPage === 'admin' && !user?.isAdmin) {
      setCurrentPage('dashboard');
      return <Dashboard onNavigate={setCurrentPage} />;
    }

    // Page lock enforcement
    if (user?.lockedPages?.includes(currentPage)) {
      return <Dashboard onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'trade':
        return <TradePage />;
      case 'wallet':
        return <WalletPage />;
      case 'signals':
        return <SignalsPage />;
      case 'bot':
        return <BotPage />;
      case 'kyc':
        return <KYCPage />;
      case 'copy-trading':
        return <CopyTradingPage />;
      case 'funded-accounts':
        return <FundedAccountsPage />;
      case 'admin':
        return <AdminPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };
  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>);

}
export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>);

}