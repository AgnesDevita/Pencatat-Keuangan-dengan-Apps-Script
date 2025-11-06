import { NewTransaction, Transaction, TransactionType } from '../types';
import { GOOGLE_SCRIPT_URL } from '../constants';

// --- MOCK IMPLEMENTATION ---
// This is a mock service to simulate API calls.
// The user should replace this with actual calls to their Google Apps Script Web App.

const MOCK_DB: Transaction[] = [
    { id: '1', date: '2023-10-26', category: 'Gaji', description: 'Gaji bulanan', amount: 5000000, type: TransactionType.INCOME, balance: 5000000 },
    { id: '2', date: '2023-10-27', category: 'Makanan & Minuman', description: 'Makan siang', amount: 50000, type: TransactionType.EXPENSE, balance: 4950000 },
    { id: '3', date: '2023-10-28', category: 'Transportasi', description: 'Bensin motor', amount: 75000, type: TransactionType.EXPENSE, balance: 4875000 },
];

let nextId = 4;

const isApiConfigured = () => GOOGLE_SCRIPT_URL.startsWith('https://');

// Fetches all transactions and maps them from Sheet format to App format
export const getTransactions = async (): Promise<Transaction[]> => {
  if (!isApiConfigured()) {
    console.warn("Mock API is in use. Configure your Google Apps Script URL in constants.ts");
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_DB].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())), 500));
  }
  
  // Use POST for fetching data, as it's more reliable with Google Apps Script CORS
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'get' }),
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data dari Google Sheet.');
  }
  const result = await response.json();
  
  // The Google Sheet data might have different field names. We map them here.
  // Assuming the response is { success: true, transactions: [...] }
  if (!result.success) {
      throw new Error(result.message || 'Terjadi kesalahan di server Google Script.');
  }

  const transactionsFromSheet: any[] = result.transactions || [];

  const mappedTransactions: Transaction[] = transactionsFromSheet.map((tx, index) => ({
    // The sheet should ideally provide a unique ID. Using row number as a fallback.
    id: tx.id || `sheet-row-${index}`, 
    date: tx.tanggal,
    category: tx.kategori,
    description: tx.deskripsi,
    amount: Number(tx.jumlah),
    type: tx.jenis as TransactionType,
    balance: tx.saldo !== undefined ? Number(tx.saldo) : undefined,
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return mappedTransactions;
};

// Adds a new transaction by mapping App format to Sheet format
export const addTransaction = async (transaction: NewTransaction): Promise<{ success: boolean; message: string }> => {
   if (!isApiConfigured()) {
    console.warn("Mock API is in use. Configure your Google Apps Script URL in constants.ts");
    return new Promise(resolve => {
        setTimeout(() => {
            const lastBalance = MOCK_DB.length > 0 ? (MOCK_DB[0].balance ?? 0) : 0;
            const newBalance = transaction.type === TransactionType.INCOME ? lastBalance + transaction.amount : lastBalance - transaction.amount;
            const newTx: Transaction = { ...transaction, id: String(nextId++), balance: newBalance };
            MOCK_DB.unshift(newTx);
            resolve({ success: true, message: 'Transaksi mock berhasil ditambahkan' });
        }, 500);
    });
  }

  // Map our app's transaction object to the format expected by the Google Sheet
  const payload = {
    action: 'add',
    tanggal: transaction.date,
    kategori: transaction.category,
    deskripsi: transaction.description,
    jumlah: transaction.amount,
    jenis: transaction.type
  };

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Gagal menyimpan transaksi di Google Sheet. Server merespon dengan status: ${response.status}`);
  }

  // **PERBAIKAN UTAMA: Baca dan periksa respons JSON**
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Gagal menyimpan transaksi di server Google Script.');
  }

  // Kirim pesan sukses dari server
  return { success: true, message: result.message || 'Transaksi berhasil ditambahkan' };
};