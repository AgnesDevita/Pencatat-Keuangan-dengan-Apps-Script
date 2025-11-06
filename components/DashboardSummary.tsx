
import React from 'react';

interface DashboardSummaryProps {
  income: number;
  expense: number;
  balance: number;
}

const SummaryCard: React.FC<{ title: string; amount: number; colorClass: string }> = ({ title, amount, colorClass }) => (
  <div className={`p-6 rounded-xl shadow-lg ${colorClass}`}>
    <h3 className="text-lg font-semibold text-white/90">{title}</h3>
    <p className="text-3xl font-bold text-white mt-2">
      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)}
    </p>
  </div>
);

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ income, expense, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard title="Total Pemasukan" amount={income} colorClass="bg-gradient-to-br from-green-500 to-emerald-600" />
      <SummaryCard title="Total Pengeluaran" amount={expense} colorClass="bg-gradient-to-br from-red-500 to-rose-600" />
      <SummaryCard title="Saldo Saat Ini" amount={balance} colorClass="bg-gradient-to-br from-blue-600 to-primary" />
    </div>
  );
};

export default DashboardSummary;
