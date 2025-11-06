
import React from 'react';
import { BanknotesIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <BanknotesIcon />
            <h1 className="text-2xl font-bold text-white tracking-tight">Pencatat Keuangan</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
