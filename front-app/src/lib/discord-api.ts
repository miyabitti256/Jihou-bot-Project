import { getJWTToken } from "./auth-api";

export async function getGuild(guildId: string) {
  const token = await getJWTToken();
  if (!token) {
    console.error("Failed to get JWT token");
    return null;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/guilds/${guildId}/discord`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  
  if (!response.ok) {
    console.error(`Failed to fetch guild ${guildId}: ${response.status}`);
    return null;
  }
  
  const result = await response.json();
  return result.status === "success" ? result.data : null;
}

export async function getGuildChannels(guildId: string) {
  const token = await getJWTToken();
  if (!token) {
    console.error("Failed to get JWT token");
    return [];
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/guilds/${guildId}/channels`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    console.error(`Failed to fetch guild channels ${guildId}: ${response.status}`);
    return [];
  }

  const result = await response.json();
  return result.status === "success" ? result.data : [];
}

export async function getChannel(channelId: string) {
  const token = await getJWTToken();
  if (!token) {
    console.error("Failed to get JWT token");
    return null;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/channels/${channelId}/discord`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error(`Failed to fetch channel ${channelId}: ${response.status}`);
    return null;
  }

  const result = await response.json();
  return result.status === "success" ? result.data : null;
}

export async function getUser(userId: string) {
  const token = await getJWTToken();
  if (!token) {
    console.error("Failed to get JWT token");
    return null;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/discord`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  
  if (!response.ok) {
    console.error(`Failed to fetch user ${userId}: ${response.status}`);
    return null;
  }

  const result = await response.json();
  return result.status === "success" ? result.data : null;
}
