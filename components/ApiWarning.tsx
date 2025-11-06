
import React from 'react';
import { GOOGLE_SCRIPT_URL } from '../constants';

const ApiWarning: React.FC = () => {
    if (GOOGLE_SCRIPT_URL.startsWith('https://')) {
        return null;
    }

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded-md shadow-md" role="alert">
            <p className="font-bold">Mode Demo Aktif</p>
            <p>Aplikasi ini berjalan dengan data tiruan. Untuk menghubungkan ke Google Spreadsheet Anda:</p>
            <ol className="list-decimal list-inside mt-2 text-sm">
                <li>Buat Web App di Google Apps Script.</li>
                <li>Salin URL Web App Anda.</li>
                <li>Tempelkan URL tersebut ke dalam konstanta <code className="bg-yellow-200 p-1 rounded">GOOGLE_SCRIPT_URL</code> di file <code className="bg-yellow-200 p-1 rounded">constants.ts</code>.</li>
            </ol>
        </div>
    );
};

export default ApiWarning;
