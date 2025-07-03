import { BoardState, Player, Coordinate, BOARD_SIZE } from '../components/reversi/Game';

const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
};

export const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1], [1, 0], [1, 1],
];

export const getOpponent = (player: Player): Player => (player === 'black' ? 'white' : 'black');

export const getFlippableStonesAI = (r: number, c: number, player: Player, currentBoard: BoardState): Coordinate[] => {
  if (currentBoard[r][c] !== 'empty') return [];

  const opponent = getOpponent(player);
  const flippable: Coordinate[] = [];

  for (const [dr, dc] of directions) {
    const tempFlippable: Coordinate[] = [];
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
};

export const calculateValidMovesAI = (player: Player, currentBoard: BoardState): Coordinate[] => {
  const moves: Coordinate[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (getFlippableStonesAI(r, c, player, currentBoard).length > 0) {
        moves.push({ row: r, col: c });
      }
    }
  }
  return moves;
};

export const chooseBestMove = (player: Player, currentBoard: BoardState): Coordinate | null => {
  const moves = calculateValidMovesAI(player, currentBoard);
  if (moves.length === 0) {
    return null;
  }

  let bestMove: Coordinate | null = null;
  let maxFlippable = -1;

  for (const move of moves) {
    const flippable = getFlippableStonesAI(move.row, move.col, player, currentBoard);
    if (flippable.length > maxFlippable) {
      maxFlippable = flippable.length;
      bestMove = move;
    }
  }
  return bestMove;
};
