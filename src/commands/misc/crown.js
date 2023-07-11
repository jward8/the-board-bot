const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js');
const Game = require('../../models/Game');

module.exports = {
    name: 'crown',
    description: 'Crowns the winner of the last game.',
    //devOnly : Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'target-user',
            description: 'The user to crown.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const members = await guild.members.fetch();

        const targetUserId = interaction.options.get('target-user').value;
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (targetUser.user.bot) {
            interaction.reply(`${targetUser.nickname} is a bot and can't win a game.`)
            return;
        }

        const role = await interaction.member.guild.roles.cache.find(role => role.name === "The Crown");
        
        const oldKing = members.find(member => member.nickname.includes("👑"));
        if (oldKing) {
            oldKing.setNickname(oldKing.nickname.split("👑")[0].trim());
        } else if (guild.ownerId !== targetUser.id) {
            targetUser.setNickname(targetUser.nickname + " 👑");
        }

        const newRole = await interaction.guild.roles.create({
            name: role ? role.name : "The Crown",
            color: role ? role.color : 16562691,
            hoist: role ? role.hoist : true,
            position: role ? role.position : 1,
            mentionable: role ? role.mentionable : true,
        });

        if (role) {
            role.delete('New king has been crowned');
        }

        targetUser.roles.add(newRole);

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


        interaction.reply(`Congrats ${targetUser.nickname}, you now have the crown!`);
    }
}