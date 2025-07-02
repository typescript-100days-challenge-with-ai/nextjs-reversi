"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type GameResult = {
  date: string;
  blackScore: number;
  whiteScore: number;
  winner: 'black' | 'white' | 'draw';
};

const ResultPage: React.FC = () => {
  const [results, setResults] = useState<GameResult[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedResults = JSON.parse(localStorage.getItem('reversiResults') || '[]');
      setResults(storedResults);
    }
  }, []);

  const clearResults = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('reversiResults');
      setResults([]);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">対戦成績</h1>
      {results.length === 0 ? (
        <p className="text-xl">まだ対戦成績がありません。</p>
      ) : (
        <div className="w-full max-w-2xl">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">日付</th>
                <th className="py-2 px-4 border-b text-left">黒スコア</th>
                <th className="py-2 px-4 border-b text-left">白スコア</th>
                <th className="py-2 px-4 border-b text-left">勝者</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2 px-4 border-b">{result.date}</td>
                  <td className="py-2 px-4 border-b">{result.blackScore}</td>
                  <td className="py-2 px-4 border-b">{result.whiteScore}</td>
                  <td className="py-2 px-4 border-b">
                    {result.winner === 'draw' ? '引き分け' : `${result.winner === 'black' ? '黒' : '白'}の勝ち`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={clearResults}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            成績をクリア
          </button>
        </div>
      )}
      <Link href="/reversi">
        <p className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          ゲームに戻る
        </p>
      </Link>
    </div>
  );
};

export default ResultPage;
