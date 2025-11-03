import React from 'react';
import { WordSearchSolutionEntry } from '../../types';

interface WordSearchGridProps {
  grid: string[][];
  solution?: WordSearchSolutionEntry[];
}

export const WordSearchGrid: React.FC<WordSearchGridProps> = ({ grid, solution }) => {
  const highlightedCells = new Set<string>();
  if (solution) {
    solution.forEach(word => {
      const len = word.word.length;
      if (len === 0) return;

      const dr = Math.sign(word.end.row - word.start.row);
      const dc = Math.sign(word.end.col - word.start.col);

      let r = word.start.row;
      let c = word.start.col;

      for (let i = 0; i < len; i++) {
        highlightedCells.add(`${r}-${c}`);
        r += dr;
        c += dc;
      }
    });
  }

  if (!grid || grid.length === 0) {
    return null;
  }

  const gridSize = grid.length;

  return (
    <div
      className="grid bg-white border border-gray-300 rounded-xl shadow-sm p-2"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
    >
      {grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => {
          const isHighlighted = highlightedCells.has(`${rowIndex}-${colIndex}`);
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`flex items-center justify-center aspect-square text-sm md:text-base font-bold uppercase rounded-md transition-colors duration-300
                ${isHighlighted
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-50 text-gray-700'
                }`}
            >
              {letter}
            </div>
          );
        })
      )}
    </div>
  );
};