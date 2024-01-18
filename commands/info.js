const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const config = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder().setName("info").setDescription("I'm better than that freemium image generation AI bot fr"),
	async execute(/** @type {import("discord.js").Interaction} */ interaction) {
		await interaction.client.application.fetch();
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel("Invite to your server!")
				.setStyle(ButtonStyle.Link)
				.setURL(`https://discord.com/api/oauth2/authorize?client_id=${config.id}&permissions=0&scope=bot%20applications.commands`)
		);
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("About the bot")
					.setDescription(
						"Intervoyage is an image generation AI bot with no image generation limit, unlike the other popular bot that gives you a free trial of 25 generations.\n\nGenerate images with </imagine:1077042061263519835>"
					)
					.setThumbnail("attachment://intervoyage.png")
					.setFooter({
						text: `Made by ${interaction.client.application.owner.username}`
					})
					.setTimestamp()
			],
			files: [
				{
					attachment: "assets/logo.png",
					name: "intervoyage.png"
				}
			],
			components: [row]
		});
	}
};
