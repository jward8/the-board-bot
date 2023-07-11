const game = require('../../models/Game');
const { Client, Interaction}  = require('discord.js');

module.exports = {
    name: 'clear-board',
    description: 'Clear the board.',
    //devOnly : Boolean,
    // testOnly: Boolean,

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        await interaction.deferReply();

        game.deleteMany({ isWin: true }).then(
            interaction.editReply('Data has been cleared')
        )
    }
}