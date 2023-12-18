const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, Colors, escapeMarkdown } = require("discord.js");
const { createImage } = require("../modules/sdxl");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("imagine")
		.setDescription("Create an image from your wildest dreams...")
		.addStringOption((option) => option.setName("prompt").setDescription("Description of the image").setRequired(true))
		.addStringOption((option) => option.setName("negative_prompt").setDescription("Description of what the AI should avoid generating").setRequired(false))
		.addStringOption((option) =>
			option.setName("style").setDescription("Choose a preset for the look and feel of your image").setRequired(false).setChoices(
				{
					name: "Default",
					value: "(No style)"
				},
				{
					name: "Cinematic",
					value: "Cinematic"
				},
				{
					name: "Photographic",
					value: "Photographic"
				},
				{
					name: "Anime",
					value: "Anime"
				},
				{
					name: "Manga",
					value: "Manga"
				},
				{
					name: "Digital Art",
					value: "Digital Art"
				},
				{
					name: "Pixel art",
					value: "Pixel art"
				},
				{
					name: "Fantasy art",
					value: "Fantasy art"
				},
				{
					name: "Neonpunk",
					value: "Neonpunk"
				},
				{
					name: "3D Model",
					value: "3D Model"
				}
			)
		),
	async execute(/** @type {import("discord.js").Interaction} */ interaction) {
		await interaction.deferReply();
		var images = await createImage(
			interaction.options.getString("prompt", true),
			interaction.options.getString("style", false) || "(No style)",
			interaction.options.getString("negative_prompt", false) || ""
		);
		if (images.error) {
			return interaction.editReply({
				embeds: [new EmbedBuilder().setTitle("⚠️ Error").setDescription(images.error).setColor(Colors.Gold).setTimestamp()]
			});
		}
		var attachments = [];
		images.forEach((img, index) => {
			attachments.push(new AttachmentBuilder(Buffer.from(img.toString().split(",").slice(1).join(","), "base64"), { name: `image${index}.png` }));
		});
		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setFields(
						{
							name: "Prompt",
							value: escapeMarkdown(interaction.options.getString("prompt")),
							inline: false
						},
						{
							name: "Negative prompt",
							value: escapeMarkdown(interaction.options.getString("negative_prompt") || "") || "`None`",
							inline: false
						},
						{
							name: "Style",
							value: interaction.options.getString("style") || "(No style)",
							inline: false
						},
						{
							name: "Author",
							value: `<@${interaction.user.id}>`,
							inline: false
						}
					)
					.setTimestamp()
			],
			files: attachments
		});
	}
};
