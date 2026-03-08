import { Clock, Gamepad2, Info, Mail, Users } from "lucide-react";
import SessionMenu from "@/components/layout/header/session-menu";
import ToggleTheme from "@/components/layout/header/toggle-theme";
import {
  type ServerIconItem,
  ServerSidebar,
} from "@/components/layout/server-sidebar";
import { auth } from "@/lib/auth";
import { createApiClient } from "@/lib/rpc-client";

export default async function GlobalSidebar() {
  const session = await auth();

  let items: ServerIconItem[] = [];

  if (session?.user?.id) {
    let guildItems: ServerIconItem[] = [];
    try {
      const client = await createApiClient();
      const guildsResponse = await client.api.guilds.members[":userId"].$get({
        param: { userId: session.user.id },
      });

      if (guildsResponse.ok) {
        const data = await guildsResponse.json();
        guildItems = data.data.map((member) => ({
          id: member.guild.id,
          name: member.guild.name,
          href: `/dashboard`,
          iconUrl: member.guild.iconUrl ?? undefined,
        }));
      }
    } catch {
      // APIコールの失敗時は空配列（デフォルト）とする
    }

    items = [
      {
        id: "home",
        name: "ホーム",
        href: "/",
        iconUrl: "/images/clock-2.png",
      },
      { id: "sep1", name: "sep", href: "", isSeparator: true },
      ...guildItems,
      { id: "sep2", name: "sep", href: "", isSeparator: true },
      {
        id: "add-bot",
        name: "時報Botをサーバーに追加",
        href: "https://discord.com/oauth2/authorize?client_id=1293583305794392084&permissions=2415930432&integration_type=0&scope=bot",
        icon: (
          <div className="text-2xl font-light text-green-500 group-hover:text-white transition-colors">
            +
          </div>
        ),
      },
    ];
  } else {
    items = [
      {
        id: "home",
        name: "ホーム",
        href: "/",
        iconUrl: "/images/clock-2.png",
      },
      { id: "sep1", name: "sep", href: "", isSeparator: true },
      {
        id: "about",
        name: "時報について",
        href: "/about",
        icon: <Info className="w-6 h-6" />,
      },
      {
        id: "schedule",
        name: "時報設定",
        href: "/schedule",
        icon: <Clock className="w-6 h-6" />,
      },
      {
        id: "minigame",
        name: "ミニゲーム",
        href: "/minigame",
        icon: <Gamepad2 className="w-6 h-6" />,
      },
      {
        id: "users",
        name: "ユーザー",
        href: "/users",
        icon: <Users className="w-6 h-6" />,
      },
      {
        id: "contact",
        name: "お問い合わせ",
        href: "/contact",
        icon: <Mail className="w-6 h-6" />,
      },
    ];
  }

  return (
    <ServerSidebar
      items={items}
      bottomContent={
        <>
          <ToggleTheme />
          <div className="w-12 h-12 flex items-center justify-center">
            <SessionMenu />
          </div>
        </>
      }
    />
  );
}
