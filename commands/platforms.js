const Discord = require("discord.js");

module.exports = {
  name: "platforms",
  syntax: "!platforms",
  cooldown: 5,
  description: "Displays list of all trackable platforms.",
  include: true,
  execute(message, args) {
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Platforms")
      .setDescription(
        "Xbox: `xbl`\nPlayStation: `psn`\nBattle.net: `battle`\nActivision: `acti`"
      )
      .setFooter("This message will automatically delete in 30 seconds");

    message.channel
      .send(embed)
      .then((msg) => {
        msg.delete({ timeout: 30000 });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
