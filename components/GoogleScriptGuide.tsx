import React from 'react';

const codeString = `
const SHEET_NAME = 'Transactions'; // Definisikan nama sheet sebagai konstanta

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

// --- FUNGSI UTAMA PENGAMBILAN DATA ---
function fetchAllTransactions() {
  const sheet = getSheet();
  if (!sheet) {
    throw new Error(\`Sheet "\${SHEET_NAME}" tidak ditemukan.\`);
  }
  
  const lastRow = sheet.getLastRow();
  let transactions = [];
  
  if (lastRow > 1) { // Hanya proses jika ada data selain header
    const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
    transactions = data.map(row => ({
      tanggal: new Date(row[0]).toISOString().split('T')[0],
      kategori: row[1],
      deskripsi: row[2],
      jumlah: Number(row[3]),
      jenis: row[4],
      saldo: Number(row[5])
    }));
  }
  
  return { success: true, transactions };
}


// Menangani GET request (misalnya saat membuka URL di browser untuk tes)
function doGet(e) {
  try {
    const response = fetchAllTransactions();
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');

  } catch (error) {
    const errorResponse = { success: false, message: error.message };
    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

// Menangani SEMUA request dari aplikasi (baik mengambil atau menambah data)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    let response;

    // Rute: Mengambil semua data
    if (data.action === 'get') {
      response = fetchAllTransactions();
    
    // Rute: Menambah transaksi baru
    } else if (data.action === 'add') {
      const sheet = getSheet();
      if (!sheet) {
        throw new Error(\`Sheet "\${SHEET_NAME}" tidak ditemukan.\`);
      }

      const lastRow = sheet.getLastRow();
      const lastBalance = lastRow > 1 ? Number(sheet.getRange(lastRow, 6).getValue()) : 0;
      
      const newBalance = data.jenis === 'Pemasukan'
        ? lastBalance + Number(data.jumlah)
        : lastBalance - Number(data.jumlah);

      sheet.appendRow([
        new Date(data.tanggal),
        data.kategori,
        data.deskripsi,
        data.jumlah,
        data.jenis,
        newBalance
      ]);
      
      response = { success: true, message: 'Transaksi berhasil ditambahkan' };

    } else {
      throw new Error("Aksi tidak diketahui.");
    }
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');

  } catch (error) {
    const errorResponse = { success: false, message: error.message };
    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

// Menangani OPTIONS request untuk pre-flight CORS
function doOptions(e) {
  return ContentService.createTextOutput()
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
`;

const GoogleScriptGuide: React.FC<{onClose: () => void}> = ({onClose}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-red-600">Penting: Perbaikan Sisi Server Diperlukan</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        
        <p className="mb-4 text-gray-700">
          Error <code className="bg-red-100 text-red-700 p-1 rounded">Failed to fetch</code> biasanya terjadi karena masalah <strong>CORS (Cross-Origin Resource Sharing)</strong>. Ini adalah kebijakan keamanan browser yang mengharuskan server Google Apps Script Anda secara eksplisit mengizinkan permintaan dari aplikasi ini.
        </p>
        <p className="mb-6 text-gray-700">
          Untuk memperbaikinya, Anda perlu memperbarui kode di <strong>Google Apps Script</strong> Anda.
        </p>

        <div className="space-y-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Langkah 1: Perbarui Kode Google Apps Script Anda</h3>
            <p>Buka editor skrip Anda dan ganti <strong>semua</strong> isinya dengan kode di bawah ini. Kode ini sudah dikonfigurasi untuk menangani CORS dengan benar.</p>
            <div className="bg-gray-900 text-white p-4 rounded-md relative">
                <button 
                    onClick={() => navigator.clipboard.writeText(codeString)}
                    className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-1 px-2 rounded"
                >
                    Salin Kode
                </button>
                <pre className="whitespace-pre-wrap break-all text-sm overflow-x-auto">
                    <code>
                        {codeString}
                    </code>
                </pre>
            </div>
        </div>

        <div className="space-y-4">
             <h3 className="text-xl font-semibold text-gray-800">Langkah 2: Deploy Ulang sebagai Web App</h3>
             <p>Setelah menempelkan kode baru, Anda <strong>harus mendeploy ulang</strong> skrip Anda:</p>
             <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Di editor Apps Script, klik tombol <strong>Deploy</strong> &gt; <strong>New deployment</strong>.</li>
                <li>Pilih jenis "Web app".</li>
                <li>Di bagian "Execute as", pilih <strong>Me</strong>.</li>
                <li>Di bagian "Who has access", pilih <strong>Anyone</strong>.</li>
                <li>Klik <strong>Deploy</strong>.</li>
                <li>Salin <strong>URL Web app</strong> yang baru dan perbarui di file <code className="bg-gray-100 p-1 rounded">constants.ts</code> Anda jika URL-nya berubah.</li>
             </ol>
             <p className="mt-4 font-semibold text-gray-800">Setelah menyelesaikan langkah-langkah ini, segarkan halaman aplikasi ini.</p>
        </div>

        <div className="mt-8 text-center">
            <button onClick={onClose} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800">
                Saya Mengerti
            </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleScriptGuide;