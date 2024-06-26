const { ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
	data: new ButtonBuilder().setCustomId("delete").setLabel("🗑️").setStyle(ButtonStyle.Danger),
	async execute(/** @type {import("discord.js").Interaction} */ interaction) {
		await interaction.client.application.fetch();
		if (![interaction.message.interaction.user.id, interaction.client.application.owner.id].includes(interaction.user.id)) {
			return;
		}
		return interaction.message.delete();
	}
};
