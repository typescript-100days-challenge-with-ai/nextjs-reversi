import Game from "@/components/reversi/Game";

export default function ReversiPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">リバーシ</h1>
      <Game />
    </div>
  );
}
