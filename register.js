const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = require("./config.json");
const commands = [
	{
		name: "ping",
		description: "Pong!"
	},
	{
		name: "info",
		description: "I'm better than that freemium image generation AI bot"
	},
	{
		name: "imagine",
		description: "Create an image from your wildest dreams...",
		options: [
			{
				name: "prompt",
				description: "The prompt to imagine",
				type: 3, // STRING
				required: true
			},
			{
				name: "private",
				description: "Whether to show generatedd image to everyone or just you",
				type: 5, // BOOL
				required: false
			}
		]
	}
];

const rest = new REST({ version: "9" }).setToken(config.token);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(Routes.applicationCommands(config.id), {
			body: commands
		});

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();
