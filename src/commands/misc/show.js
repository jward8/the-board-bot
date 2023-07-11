const Game = require('../../models/Game');
const { Client, Interaction}  = require('discord.js');

module.exports = {
    name: 'show',
    description: 'Shows the current state of the board.',
    //devOnly : Boolean,
    // testOnly: Boolean,
    options: [],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        let response = '';
        let scoreArray = [];
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }
        await interaction.deferReply();

        const guild = client.guilds.cache.get(process.env.GUILD_ID);

        const members = await guild.members.fetch();

        for (const member of members) {
            if (member[1].user.bot) continue;

            const fetchedScores = await Game.find({
                userId: member[1].user.id,
                guildId: interaction.guild.id,
            });

            scoreArray.push({
                score: fetchedScores.length,
                response: `${member[1].nickname} has ${fetchedScores.length} ${fetchedScores.length > 1  || fetchedScores.length === 0 ? 'wins' : 'win'}.`
            });
        }

        scoreArray.sort( (a,b) => b.score - a.score);

        for (const scoreObject of scoreArray) {
            response += scoreObject.response + "\n";
        }

        interaction.editReply(response);
    }
}