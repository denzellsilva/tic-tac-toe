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
    if (
      board[first] &&
      board[first] === board[second] &&
      board[first] === board[third]
    ) {
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
  const [draws, setDraws] = useState(0);

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
    } else if (nextResult === "draw") {
      setDraws((currentDraws) => currentDraws + 1);
    } else if (!nextResult) {
      setCurrentPlayer((player) =>
        player === "dinosaur" ? "unicorn" : "dinosaur",
      );
    }
  }

  function startNewGame() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("dinosaur");
  }

  const message = result
    ? result === "draw"
      ? "It’s a tie! Great teamwork!"
      : `${players[result].name} wins the round!`
    : `${players[currentPlayer].name}'s turn`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-300 via-purple-300 to-pink-300 px-4 py-4 text-slate-900 sm:px-8 sm:py-6">
      <div className="pointer-events-none absolute -left-16 top-20 h-40 w-40 rounded-full bg-yellow-300/70 blur-sm" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-pink-300/60" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center">
        <header className="mb-2 text-center lg:mb-6">
          <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-[0_4px_0_rgba(109,40,217,0.35)] lg:text-6xl">
            Tic-Tac-Toe
          </h1>
          <p className="mt-1 hidden text-base font-bold text-violet-950/75 text-lg lg:block">
            Dino vs. Uni — who will rule the playground?
          </p>
        </header>

        <section className="grid w-full gap-2 lg:gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="order-2 rounded-[2rem] border-4 border-white/80 bg-white/80 p-3 shadow-2xl shadow-violet-900/20 backdrop-blur sm:p-5 lg:order-1">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-widest text-violet-500">
                  Round time
                </p>
                <p className="text-2xl font-black text-violet-950">
                  {gameOver ? "Round complete!" : "Make your move!"}
                </p>
              </div>
              <span
                className="rounded-2xl bg-yellow-200 px-2 py-1 text-xl shadow-inner"
                aria-hidden="true"
              >
                🌈
              </span>
            </div>

            <div
              className="mx-auto grid aspect-square w-4/5 max-w-[18rem] grid-cols-3 gap-1 rounded-xl bg-violet-200 p-1 sm:gap-1.5 sm:p-1.5"
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
                    aria-label={
                      mark
                        ? `${players[mark].name}'s mark`
                        : `Empty square ${index + 1}`
                    }
                    disabled={Boolean(mark) || gameOver}
                    onClick={() => playTurn(index)}
                    className={`flex aspect-square items-center justify-center rounded-lg border-2 text-2xl shadow-[0_3px_0_rgba(109,40,217,0.2)] transition duration-150 ease-out sm:text-4xl ${
                      isWinningCell
                        ? "border-yellow-300 bg-yellow-100 animate-bounce"
                        : "border-white bg-white hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-yellow-50 active:translate-y-1 active:scale-95"
                    } disabled:cursor-default`}
                  >
                    {mark ? (
                      <span className="drop-shadow-md" aria-hidden="true">
                        {players[mark].emoji}
                      </span>
                    ) : (
                      <span
                        className="text-xl font-black text-violet-200"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div
              className={`mt-4 rounded-2xl px-3 py-2 text-center text-base font-black ${
                gameOver
                  ? "bg-yellow-200 text-yellow-950"
                  : "bg-sky-100 text-sky-900"
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
              className="mt-3 w-full rounded-2xl bg-violet-600 px-5 py-3 text-base font-black text-white shadow-[0_5px_0_#4c1d95] transition hover:scale-[1.02] hover:bg-violet-500 active:translate-y-1 active:shadow-none"
            >
              {gameOver ? "Play again!" : "New game"}
            </button>
          </div>

          <aside className="order-1 lg:order-2">
            <div className="rounded-2xl border-2 border-white/80 bg-white/80 p-2 shadow-xl shadow-violet-900/15 backdrop-blur lg:rounded-[2rem] lg:border-4 lg:p-4">
              <h2 className=" hidden mb-2 text-center text-lg font-black text-violet-950 lg:block lg:mb-3 lg:text-xl">
                Scoreboard
              </h2>
              <div className="grid grid-cols-3 gap-1 lg:gap-3">
                {(Object.keys(players) as Player[]).map((player) => (
                  <div
                    key={player}
                    className={`rounded-xl p-1 text-center lg:rounded-2xl lg:p-2 ${players[player].softColor} ${
                      currentPlayer === player && !gameOver
                        ? "ring-2 ring-yellow-300 lg:ring-4"
                        : ""
                    }`}
                  >
                    <div className="text-2xl lg:text-3xl" aria-hidden="true">
                      {players[player].emoji}
                    </div>
                    <p className={`mt-1 font-black ${players[player].color}`}>
                      {players[player].name}
                    </p>
                    <p className="text-2xl font-black text-violet-950 lg:text-3xl">
                      {scores[player]}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-violet-500">
                      wins
                    </p>
                  </div>
                ))}
                <div className="rounded-xl bg-slate-100 p-1 text-center lg:rounded-2xl lg:p-2">
                  <div className="text-2xl lg:text-3xl" aria-hidden="true">
                    🤝
                  </div>
                  <p className="mt-1 font-black text-slate-600">Draws</p>
                  <p className="text-2xl font-black text-violet-950 lg:text-3xl">
                    {draws}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    games
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
