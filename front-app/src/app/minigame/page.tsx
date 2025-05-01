import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

const games = [
  {
    id: 1,
    title: "じゃんけんゲーム",
    description: "コンピュータとじゃんけん勝負！",
    path: "/minigame/bot-janken",
    imageUrl: "/images/bot-janken.png",
    requiresAuth: false,
  },
  {
    id: 2,
    title: "対戦じゃんけん",
    description:
      "対戦相手を募集してじゃんけんで対戦しよう！賭けモードもあるよ！",
    path: "/minigame/janken",
    imageUrl: "/images/janken.png",
    requiresAuth: true,
  },
  {
    id: 3,
    title: "コイントスゲーム",
    description: "コインを投げて裏表を当てよう！あたったら賭け金が倍になるよ！",
    path: "/minigame/coinflip",
    imageUrl: "/images/coinflip.png",
    requiresAuth: true,
  },
  {
    id: 4,
    title: "おみくじ",
    description: "おみくじを引いて運勢を占おう！",
    path: "/minigame/omikuji",
    imageUrl: "/images/omikuji-box.png",
    requiresAuth: true,
  },
];

export default async function Minigame() {
  const session = await auth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ミニゲーム一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id}>
            {!game.requiresAuth || session ? (
              <Link href={game.path}>
                <Card className="h-full hover:shadow-lg dark:hover:shadow-slate-600 transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{game.title}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <Image
                        src={game.imageUrl}
                        width={300}
                        height={100}
                        alt={game.title}
                        className="object-cover rounded-md  w-64 h-48"
                        priority
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card className="h-full opacity-75">
                <CardHeader>
                  <CardTitle>{game.title}</CardTitle>
                  <CardDescription>
                    プレイするにはログインが必要です
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src={game.imageUrl}
                    width={300}
                    height={300}
                    alt={game.title}
                    className="w-full h-48 object-cover rounded-md opacity-50"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
