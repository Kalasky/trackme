const { prefix } = require("../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  syntax: "!help",
  include: true,
  aliases: ["commands"],
  usage: "[command name]",
  cooldown: 5,
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if(args.length <= 0) {
      const filterCommands = commands.filter(val => {
        if(val && val.include) {
          return val;
        }
      }).map(val => {
        return {
          name: val.syntax,
          value: val.description,
        };
      });

      console.log(filterCommands)
      
      const embedDisabledDM = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Uh Oh!")
      .setDescription(
        "Looks like you have direct messages disabled!"
      )
      .setFooter('This message will automatically delete in 10 seconds');

      const embed = new Discord.MessageEmbed()
      .setTitle('Warzone Tracker')
      .setColor(0xff0000)
      .addFields(
        filterCommands
      );
      message.author.send(embed).catch(() => message.reply(embedDisabledDM).then(msg => {
        msg.delete({ timeout: 10000 })
      }).catch((err) => {
        console.log(err);
      }))
      return;
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) return;
      data.push(`**Name:** ${command.name}`);

      if (command.aliases)
        data.push(`**Aliases:** ${command.aliases.join(", ")}`);
      if (command.description)
        data.push(`**Description:** ${command.description}`);
      if (command.usage)
        data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

      message.channel.send(data, { split: true });
  },
};
