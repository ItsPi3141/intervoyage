const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes, Client, Collection, GatewayIntentBits, Partials, ActivityType, Events, PresenceUpdateStatus } = require("discord.js");
const { token, id } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel] });

// Load slash commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("an art competition", { type: ActivityType.Competing });
	client.user.setStatus(PresenceUpdateStatus.Idle);
});

// Handle chat slash command
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
		} else {
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	}
});

// Register slash commands
(() => {
	const commands = [];

	const commandsPath = path.join(__dirname, "commands");
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}

	// Construct and prepare an instance of the REST module
	const rest = new REST().setToken(token);
	// and deploy your commands!
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
			const data = await rest.put(Routes.applicationCommands(id), { body: commands });
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	})();
})();

client.login(token);


// please do not crash my bot
process.on("unhandledRejection", (reason, p) => {
	// console.log(" [Error_Handling] :: Unhandled Rejection/Catch");
	// console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
	// console.log(" [Error_Handling] :: Uncaught Exception/Catch");
	// console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
	// console.log(" [Error_Handling] :: Uncaught Exception/Catch (MONITOR)");
	// console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
	// console.log(" [Error_Handling] :: Multiple Resolves");
	// console.log(type, promise, reason);
});
