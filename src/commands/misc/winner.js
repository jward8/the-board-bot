const { ApplicationCommandOptionType } = require("discord.js");
const Game = require("../../models/Game");

module.exports = {
    name: 'winner',
    description: 'Awards win to specified member.',
    options: [
        {
            name: 'target-user',
            description: 'The winner of the last game.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        }
    ],

    callback: async (client, interaction) => {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const members = await guild.members.fetch();

        const targetUserId = interaction.options.get('target-user').value;
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (targetUser.user.bot) {
            interaction.reply(`${targetUser.nickname} is a bot and can't win a game.`);
            return;
        }

        try {
            const game = new Game({
                userId: targetUserId,
                guildId: interaction.guild.id,
                date: Date.now()
            });

            await game.save();
        } catch (error) {
            console.error(`Error pushing result to DB: ${error}`);
        }

        interaction.reply(`Congrats ${targetUser.nickname} on your win!`);
    }
}