import React, { useState } from 'react';
import { NewTransaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';

interface TransactionFormProps {
  onSubmit: (transaction: NewTransaction) => void;
  isLoading: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, isLoading }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) {
      setError('Harap isi semua kolom yang wajib diisi.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Jumlah harus berupa angka positif.');
      return;
    }
    setError('');
    onSubmit({
      date,
      category,
      description,
      amount: numericAmount,
      type,
    });
    // Reset form
    setAmount('');
    setDescription('');
    setType(TransactionType.EXPENSE);
    setCategory(CATEGORIES[1]);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Transaksi Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 px-4 py-3 text-sm font-semibold rounded-l-md transition-colors duration-200 ${type === TransactionType.EXPENSE ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 px-4 py-3 text-sm font-semibold rounded-r-md transition-colors duration-200 ${type === TransactionType.INCOME ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Pemasukan
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Jumlah (Rp)</label>
          <div className="mt-1">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white text-gray-900"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
          <div className="mt-1">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white text-gray-900"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
          <div className="mt-1">
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Makan siang di warung"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white text-gray-900"
            />
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Tanggal</label>
          <div className="mt-1">
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white text-gray-900"
            />
          </div>
        </div>
        
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;