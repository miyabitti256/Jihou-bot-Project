export async function getGuild(guildId: string) {
  const response = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    },
  );
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export async function getGuildChannels(guildId: string) {
  const response = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/channels`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function getChannel(channelId: string) {
  const response = await fetch(
    `https://discord.com/api/v10/channels/${channelId}`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error(`Failed to fetch channel ${channelId}`);
    return null;
  }

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    type: data.type,
  };
}

export async function getUser(userId: string) {
  const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });
  if (!response.ok) {
    return null;
  }

  return response.json();
}
