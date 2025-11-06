
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
  const borderColor = isIncome ? 'border-green-500' : 'border-red-500';
  const sign = isIncome ? '+' : '-';

  return (
    <li className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${borderColor} flex items-center justify-between space-x-4`}>
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{transaction.category}</p>
        <p className="text-sm text-gray-500">{transaction.description || 'Tidak ada deskripsi'}</p>
        <p className="text-xs text-gray-400 mt-1">{new Date(transaction.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      <div className={`text-right font-bold text-lg ${amountColor}`}>
        {sign} {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.amount)}
      </div>
    </li>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, isLoading }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Transaksi</h2>
      {isLoading ? (
        <div className="text-center text-gray-500 py-8">Memuat data...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            <p>Belum ada transaksi.</p>
            <p className="text-sm">Silakan tambahkan transaksi baru melalui form.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {transactions.map(tx => <TransactionItem key={tx.id} transaction={tx} />)}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
