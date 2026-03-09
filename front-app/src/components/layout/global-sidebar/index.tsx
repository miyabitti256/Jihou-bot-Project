import {
  type ServerIconItem,
  ServerSidebar,
} from "@/components/layout/server-sidebar";
import { getGuildMembers } from "@/lib/api/guilds";
import { auth } from "@/lib/auth";
import SessionMenu from "./session-menu";
import ToggleTheme from "./toggle-theme";

export default async function GlobalSidebar() {
  const session = await auth();

  let guildItems: ServerIconItem[] = [];

  if (session?.user?.id) {
    try {
      const guildsData = await getGuildMembers(session.user.id);

      if (guildsData) {
        guildItems = guildsData.data.map((member) => ({
          id: member.guild.id,
          name: member.guild.name,
          href: `/channels/${member.guild.id}`,
          iconUrl: member.guild.iconUrl ?? undefined,
        }));
      }
    } catch {
      // APIコールの失敗時は空配列（デフォルト）とする
    }
  }

  const items: ServerIconItem[] = [
    {
      id: "home",
      name: "ホーム",
      href: "/",
      iconUrl: "/images/clock-2.png",
    },
    { id: "sep1", name: "sep", href: "", isSeparator: true },
  ];

  if (guildItems.length > 0) {
    items.push(...guildItems);
    items.push({ id: "sep2", name: "sep", href: "", isSeparator: true });
  }

  items.push({
    id: "add-bot",
    name: "時報Botをサーバーに追加",
    href: "https://discord.com/oauth2/authorize?client_id=1293583305794392084&permissions=2415930432&integration_type=0&scope=bot",
    icon: (
      <div className="text-2xl font-light text-green-500 group-hover:text-white transition-colors">
        +
      </div>
    ),
  });

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
