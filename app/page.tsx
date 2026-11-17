"use client";

import { useMemo, useState } from "react";

type Player = "dinosaur" | "unicorn";
type Mark = Player | null;
type GameResult = Player | "draw" | null;

const players: Record<
  Player,
  { emoji: string; name: string; color: string; softColor: string }
> = {
  dinosaur: {
    emoji: "🦖",
    name: "Dino",
    color: "text-violet-700",
    softColor: "bg-violet-100",
  },
  unicorn: {
    emoji: "🦄",
    name: "Uni",
    color: "text-pink-600",
    softColor: "bg-pink-100",
  },
};

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getGameResult(board: Mark[]): {
  result: GameResult;
  winningLine: number[];
} {
  for (const line of winningLines) {
    const [first, second, third] = line;
    if (board[first] && board[first] === board[second] && board[first] === board[third]) {
      return { result: board[first], winningLine: line };
    }
  }

  return {
    result: board.every(Boolean) ? "draw" : null,
    winningLine: [],
  };
}

export default function Home() {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("dinosaur");
  const [scores, setScores] = useState<Record<Player, number>>({
    dinosaur: 0,
    unicorn: 0,
  });

  const { result, winningLine } = useMemo(() => getGameResult(board), [board]);
  const gameOver = result !== null;

  function playTurn(index: number) {
    if (board[index] || gameOver) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    const nextResult = getGameResult(nextBoard).result;

    setBoard(nextBoard);
    if (nextResult && nextResult !== "draw") {
      setScores((currentScores) => ({
        ...currentScores,
        [nextResult]: currentScores[nextResult] + 1,
      }));
    } else if (!nextResult) {
      setCurrentPlayer((player) => (player === "dinosaur" ? "unicorn" : "dinosaur"));
    }
  }

  function startNewGame() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("dinosaur");
    setScores({ dinosaur: 0, unicorn: 0 });
  }

  const message = result
    ? result === "draw"
      ? "It’s a tie! Great teamwork!"
      : `${players[result].name} wins the round!`
    : `${players[currentPlayer].name}'s turn`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-300 via-purple-300 to-pink-300 px-4 py-8 text-slate-900 sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute -left-16 top-20 h-40 w-40 rounded-full bg-yellow-300/70 blur-sm" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-pink-300/60" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center">
        <header className="mb-8 text-center sm:mb-10">
          <div className="mb-3 inline-flex rotate-[-2deg] items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-violet-700 shadow-lg shadow-violet-400/20">
            <span aria-hidden="true">✨</span> Tiny champions club
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_0_rgba(109,40,217,0.35)] sm:text-7xl">
            Tic-Tac-Toe
          </h1>
          <p className="mt-3 text-lg font-bold text-violet-950/75 sm:text-xl">
            Dino vs. Uni — who will rule the playground?
          </p>
        </header>

        <section className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="rounded-[2rem] border-4 border-white/80 bg-white/80 p-4 shadow-2xl shadow-violet-900/20 backdrop-blur sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-widest text-violet-500">
                  Round time
                </p>
                <p className="text-2xl font-black text-violet-950">
                  {gameOver ? "Round complete!" : "Make your move!"}
                </p>
              </div>
              <span className="rounded-2xl bg-yellow-200 px-3 py-2 text-2xl shadow-inner" aria-hidden="true">
                🌈
              </span>
            </div>

            <div
              className="grid aspect-square w-full grid-cols-3 gap-3 rounded-3xl bg-violet-200 p-3 sm:gap-4 sm:p-4"
              aria-label="Tic-Tac-Toe board"
              role="grid"
            >
              {board.map((mark, index) => {
                const isWinningCell = winningLine.includes(index);
                return (
                  <button
                    key={index}
                    type="button"
                    role="gridcell"
                    aria-label={mark ? `${players[mark].name}'s mark` : `Empty square ${index + 1}`}
                    disabled={Boolean(mark) || gameOver}
                    onClick={() => playTurn(index)}
                    className={`flex aspect-square items-center justify-center rounded-2xl border-4 text-5xl shadow-[0_5px_0_rgba(109,40,217,0.2)] transition duration-150 ease-out sm:text-7xl ${
                      isWinningCell
                        ? "border-yellow-300 bg-yellow-100 animate-bounce"
                        : "border-white bg-white hover:-translate-y-1 hover:scale-[1.03] hover:bg-yellow-50 active:translate-y-1 active:scale-95"
                    } disabled:cursor-default`}
                  >
                    {mark ? (
                      <span className="drop-shadow-md" aria-hidden="true">
                        {players[mark].emoji}
                      </span>
                    ) : (
                      <span className="text-3xl font-black text-violet-200" aria-hidden="true">
                        +
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div
              className={`mt-6 rounded-2xl px-4 py-3 text-center text-lg font-black ${
                gameOver ? "bg-yellow-200 text-yellow-950" : "bg-sky-100 text-sky-900"
              }`}
              role="status"
              aria-live="polite"
            >
              {gameOver && <span aria-hidden="true">🎉 </span>}
              {message}
              {gameOver && <span aria-hidden="true"> 🎉</span>}
            </div>

            <button
              type="button"
              onClick={startNewGame}
              className="mt-4 w-full rounded-2xl bg-violet-600 px-6 py-4 text-lg font-black text-white shadow-[0_5px_0_#4c1d95] transition hover:scale-[1.02] hover:bg-violet-500 active:translate-y-1 active:shadow-none"
            >
              {gameOver ? "Play again!" : "New game"}
            </button>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[2rem] border-4 border-white/80 bg-white/80 p-5 shadow-xl shadow-violet-900/15 backdrop-blur">
              <h2 className="mb-4 text-center text-xl font-black text-violet-950">Scoreboard</h2>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(players) as Player[]).map((player) => (
                  <div
                    key={player}
                    className={`rounded-2xl p-4 text-center ${players[player].softColor} ${
                      currentPlayer === player && !gameOver ? "ring-4 ring-yellow-300" : ""
                    }`}
                  >
                    <div className="text-4xl" aria-hidden="true">
                      {players[player].emoji}
                    </div>
                    <p className={`mt-1 font-black ${players[player].color}`}>{players[player].name}</p>
                    <p className="text-4xl font-black text-violet-950">{scores[player]}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-violet-500">wins</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-violet-950 p-5 text-center text-white shadow-xl shadow-violet-900/20">
              <p className="text-3xl" aria-hidden="true">💡</p>
              <h2 className="mt-2 font-black">How to play</h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-violet-200">
                Take turns and get three of your friends in a row. Across, down, or diagonal!
              </p>
            </div>
          </aside>
        </section>

        <p className="mt-8 text-sm font-bold text-violet-950/70">
          Made for giggles, high-fives, and friendly competition <span aria-hidden="true">💜</span>
        </p>
      </div>
    </main>
  );
}
