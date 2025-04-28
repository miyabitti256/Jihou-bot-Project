"use server";

export const messageDelete = async (messageId: string, guildId: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/guilds/scheduledmessage`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": process.env.API_KEY as string,
			},
			body: JSON.stringify({ id: messageId, guildId }),
		},
	);

	return await response.json();
};
