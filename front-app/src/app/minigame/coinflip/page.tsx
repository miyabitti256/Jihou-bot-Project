import { auth } from "@/lib/auth";
import CoinflipGame from "./components/game";

export default async function CoinflipPage() {
  const session = await auth();

  if (!session) {
    return (
      <div>
        <h1>ログインしてください</h1>
      </div>
    );
  }

  return (
    <div>
      <CoinflipGame />
    </div>
  );
}
