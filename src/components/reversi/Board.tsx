import React from 'react';
import Cell from './Cell';

interface BoardProps {
  board: ('empty' | 'black' | 'white')[][];
  onCellClick: (row: number, col: number) => void;
  validMoves: { row: number; col: number }[];
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, validMoves }) => {
  const isValidMove = (row: number, col: number) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  return (
    <div className="grid grid-cols-8 gap-0 border-2 border-gray-600">
      {board.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              onClick={() => onCellClick(rowIndex, colIndex)}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Board;
