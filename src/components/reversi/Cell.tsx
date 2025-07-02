import React from 'react';

interface CellProps {
  value: 'empty' | 'black' | 'white';
  onClick: () => void;
  isClickable?: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, isClickable = false }) => {
  const cellClasses = `
    w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
    border border-gray-400 flex items-center justify-center
    ${value === 'empty' ? 'bg-green-600' : 'bg-green-600'}
    ${isClickable ? 'cursor-pointer hover:bg-green-700' : 'cursor-not-allowed'}
  `;

  const pieceClasses = `
    w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14
    rounded-full
    ${value === 'black' ? 'bg-black' : value === 'white' ? 'bg-white' : ''}
  `;

  return (
    <div className={cellClasses} onClick={onClick}>
      {value !== 'empty' && <div className={pieceClasses}></div>}
    </div>
  );
};

export default Cell;
