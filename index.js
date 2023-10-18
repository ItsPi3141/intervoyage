const { Client, GatewayIntentBits, ActivityType, Partials, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages], partials: [Partials.Channel] });
const config = require("./config.json");
const fetch = require("node-fetch");
const huggingface_api_keys = config.huggingface_api_keys;

const API_URL = "https://api-inference.huggingface.co/models/prompthero/openjourney-v4";
var api_rotation = 0;

function randomString(length) {
	var result = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("an art competition", { type: ActivityType.Competing });
	client.user.setStatus("online");
	setInterval(async () => {
		console.log(`Logged in as ${client.user.tag}!`);

		// KEEP HUGGINGFACE MODEL ALIVE
		var headers = {
			Authorization: "Bearer " + huggingface_api_keys[api_rotation]
		};

		var data = await (
			await fetch(API_URL, {
				method: "POST",
				body: JSON.stringify({
					inputs: randomString(5)
				}),
				headers: headers
			})
		).blob();
		console.log("Openjourney: " + data);
		api_rotation = (api_rotation + 1) % config.huggingface_api_keys.length;
	}, 20000);
});

// HANDLE SLASH COMMANDS
client.on("interactionCreate", async (interaction) => {
	if (interaction.isCommand()) {
		switch (interaction.commandName) {
			case "ping":
				await interaction.reply({
					embeds: [
						{
							title: "Ping",
							description: `Pong! ${Math.round(client.ws.ping)}ms.`,
							timestamp: new Date().toISOString()
						}
					]
				});
				break;

			case "info":
				await interaction.client.application.fetch();
				const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Invite to your server!").setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${config.id}&permissions=0&scope=bot%20applications.commands`));
				await interaction.reply({
					embeds: [
						{
							title: "About the bot",
							description:
								"Intervoyage is an image generation AI bot with no image generation limit, unlike the other popular bot that gives you a free trial of 25 generations. Though it is not as good, it still creates images with good quality. \n\nThis bot uses [Openjourney](https://huggingface.co/prompthero/openjourney), which is running on the Huggingface interference API, to create images.\n\nGenerate images with </imagine:1077042061263519835>",
							thumbnail: {
								url: "attachment://intervoyage.png"
							},
							footer: {
								text: `Made by ${interaction.client.application.owner.username}#${interaction.client.application.owner.discriminator}`
							},
							timestamp: new Date().toISOString()
						}
					],
					files: [
						{
							attachment: "assets/logo.png",
							name: "intervoyage.png"
						}
					],
					components: [row]
				});

			case "imagine":
				await interaction.deferReply({ ephemeral: interaction.options.getBoolean("private") });
				var headers = {
					Authorization: "Bearer " + config.huggingface_api_keys[api_rotation]
				};
				const response = await fetch(API_URL, {
					headers: headers,
					body: JSON.stringify({
						inputs: "mdjrny-v4 style " + interaction.options.getString("prompt")
					}),
					method: "POST",
					responseType: "arraybuffer"
				});
				const data = await response.arrayBuffer();
				const img = new AttachmentBuilder(Buffer.from(data), { name: "imagine.jpeg" });
				console.log(img);
				await interaction.editReply({
					content: `**${interaction.options.getString("prompt")}** - <@${interaction.user.id}>`,
					files: [img]
				});
				api_rotation = (api_rotation + 1) % config.huggingface_api_keys.length;
				break;
		}
	}
});

client.login(config.token);

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
