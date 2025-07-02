"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';

type Player = 'black' | 'white';
type CellValue = Player | 'empty';
type BoardState = CellValue[][];

const initialBoard: BoardState = Array(8).fill(null).map(() => Array(8).fill('empty'));
initialBoard[3][3] = 'white';
initialBoard[3][4] = 'black';
initialBoard[4][3] = 'black';
initialBoard[4][4] = 'white';

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const Game: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [blackScore, setBlackScore] = useState(2);
  const [whiteScore, setWhiteScore] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>([]);

  const getOpponent = (player: Player): Player => (player === 'black' ? 'white' : 'black');

  const isValidPosition = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const getFlippableStones = useCallback((r: number, c: number, player: Player, currentBoard: BoardState): { row: number; col: number }[] => {
    if (currentBoard[r][c] !== 'empty') return [];

    const opponent = getOpponent(player);
    const flippable: { row: number; col: number }[] = [];

    for (const [dr, dc] of directions) {
      let tempFlippable: { row: number; col: number }[] = [];
      let row = r + dr;
      let col = c + dc;

      while (isValidPosition(row, col) && currentBoard[row][col] === opponent) {
        tempFlippable.push({ row, col });
        row += dr;
        col += dc;
      }

      if (isValidPosition(row, col) && currentBoard[row][col] === player && tempFlippable.length > 0) {
        flippable.push(...tempFlippable);
      }
    }
    return flippable;
  }, []);

  const calculateValidMoves = useCallback((player: Player, currentBoard: BoardState): { row: number; col: number }[] => {
    const moves: { row: number; col: number }[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (getFlippableStones(r, c, player, currentBoard).length > 0) {
          moves.push({ row: r, col: c });
        }
      }
    }
    return moves;
  }, [getFlippableStones]);

  const updateScores = useCallback((currentBoard: BoardState) => {
    let black = 0;
    let white = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (currentBoard[r][c] === 'black') black++;
        else if (currentBoard[r][c] === 'white') white++;
      }
    }
    setBlackScore(black);
    setWhiteScore(white);
  }, []);

  const checkGameOver = useCallback((currentBoard: BoardState) => {
    const blackMoves = calculateValidMoves('black', currentBoard);
    const whiteMoves = calculateValidMoves('white', currentBoard);

    if (blackMoves.length === 0 && whiteMoves.length === 0) {
      setGameOver(true);
      if (blackScore > whiteScore) {
        setWinner('black');
      } else if (whiteScore > blackScore) {
        setWinner('white');
      } else {
        setWinner('draw');
      }
      return true;
    }
    return false;
  }, [calculateValidMoves, blackScore, whiteScore]);

  useEffect(() => {
    const moves = calculateValidMoves(currentPlayer, board);
    setValidMoves(moves);

    if (moves.length === 0) {
      const opponent = getOpponent(currentPlayer);
      const opponentMoves = calculateValidMoves(opponent, board);
      if (opponentMoves.length === 0) {
        checkGameOver(board);
      } else {
        alert(`${currentPlayer === 'black' ? '黒' : '白'}は置ける場所がないため、パスします。`);
        setCurrentPlayer(opponent);
      }
    }
  }, [board, currentPlayer, calculateValidMoves, checkGameOver]);

  const handleCellClick = (row: number, col: number) => {
    if (gameOver) return;

    const flippable = getFlippableStones(row, col, currentPlayer, board);

    if (flippable.length > 0) {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = currentPlayer;
      flippable.forEach(({ row, col }) => {
        newBoard[row][col] = currentPlayer;
      });
      setBoard(newBoard);
      updateScores(newBoard);
      setCurrentPlayer(getOpponent(currentPlayer));
    } else {
      alert('そこには置けません。');
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer('black');
    setBlackScore(2);
    setWhiteScore(2);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-xl">
        <p>現在のプレイヤー: {currentPlayer === 'black' ? '黒' : '白'}</p>
        <p>黒: {blackScore} 白: {whiteScore}</p>
      </div>
      <Board board={board} onCellClick={handleCellClick} validMoves={validMoves} />
      {gameOver && (
        <div className="mt-4 text-2xl font-bold">
          {winner === 'draw' ? '引き分け！' : `${winner === 'black' ? '黒' : '白'}の勝ち！`}
          <button
            onClick={resetGame}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            もう一度プレイ
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
