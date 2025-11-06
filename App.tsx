import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, NewTransaction, TransactionType, NotificationState } from './types';
import { getTransactions, addTransaction } from './services/googleSheetService';
import Header from './components/Header';
import DashboardSummary from './components/DashboardSummary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Notification from './components/Notification';
import ApiWarning from './components/ApiWarning';
import GoogleScriptGuide from './components/GoogleScriptGuide';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [showScriptGuide, setShowScriptGuide] = useState<boolean>(false);

  const handleError = useCallback((error: unknown) => {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui.';

    if (errorMessage.includes('Failed to fetch')) {
        setNotification({
            message: 'Koneksi ke Google Sheet gagal. Cek konfigurasi server Anda.',
            type: 'error',
        });
        setShowScriptGuide(true);
    } else {
        setNotification({ message: errorMessage, type: 'error' });
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddTransaction = async (newTransaction: NewTransaction) => {
    setIsSubmitting(true);
    try {
      const result = await addTransaction(newTransaction);
      if (result.success) {
        setNotification({ message: 'Transaksi berhasil! Menyinkronkan data...', type: 'success' });
        await fetchTransactions();
      } else {
        throw new Error('Gagal menambahkan transaksi');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.type === TransactionType.INCOME) {
          acc.income += tx.amount;
        } else {
          acc.expense += tx.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  // The most accurate balance is the one from the latest transaction,
  // calculated by the Google Sheet.
  const balance = transactions.length > 0 ? (transactions[0].balance ?? 0) : 0;

  return (
    <div className="min-h-screen bg-background text-gray-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {showScriptGuide && <GoogleScriptGuide onClose={() => setShowScriptGuide(false)} />}
        <ApiWarning />
        <div className="space-y-8">
          <DashboardSummary income={summary.income} expense={summary.expense} balance={balance} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TransactionForm onSubmit={handleAddTransaction} isLoading={isSubmitting} />
            </div>
            <div className="lg:col-span-2">
              <TransactionList transactions={transactions} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>
      <Notification notification={notification} onClose={() => setNotification(null)} />
    </div>
  );
};

export default App;