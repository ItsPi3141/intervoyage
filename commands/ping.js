const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
	async execute(/** @type {import("discord.js").Interaction} */ interaction, /** @type {import("discord.js").Client} */ client) {
		await interaction.reply(`Pong! ${Math.round(client.ws.ping)}ms.`);
	}
};
