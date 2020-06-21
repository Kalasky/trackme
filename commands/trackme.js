let Player = require("../models/player");
const Discord = require("discord.js");

module.exports = {
  name: "trackme",
  description: "Tracks users data across various platforms\nIf your platform ID contains spaces wrap it in quotes.",
  syntax: "!trackme <platform ID> <platform>",
  include: true,
  args: true,
  execute(message, args) {
    let pattern = /".*?"/g;
    let output = pattern.exec(message.content);
    let platformID;
    let count;
    let platform;

    if (output == null) {
      platformID = args[0];
      platform = args[1];
    } else {
      platformID = output[0].slice(1, -1);
      count = output[0].split(" ").length;
      platform = args[count];
    }

    // message.channel.send(
    //   `Your platformID ${platformID}\nis now being tracked from platform ${platform}`
    // );

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Incorrect Command Usage")
      .setDescription(
        "Syntax: !trackme <platform ID> <platform>\n\nIf your platform ID contains spaces wrap it in quotes.\n\n**List of Trackable Platforms**\n\nXbox: `xbl`\nPlayStation: `psn`\nBattle.net: `battle`\nActivision: `acti`"
      )
      .setFooter('This message will automatically delete in 20 seconds');

    if (args.length == 2) {
      
      Player.create({
        discordID: `${message.author.id}`,
        platformID: platformID,
        platform: platform,
        currentRole: "TBD",
      }) // storing users discord ID, platform ID, and platform in db
        .then(function (dbPlayer) {
          // If saved successfully, print the new Player document to the console
          // message.member.setNickname(platformID); // setting nickname of the message author to platformID
          console.log(dbPlayer);
          message.channel.send(
            `Your platformID \`${platformID}\` is now being tracked from platform \`${platform}\``
          );
        })
        .catch(function (err) {
          if (err) {
            if (err.name === "MongoError" && err.code === 11000) {
              // Duplicate username
              return message.channel.send("User already exists!").then(msg => {
                msg.delete({ timeout: 10000 })
              }).catch((err) => {
                console.log(err);
              });
              // return message.channel.send(err.message);
            }

            // Some other error
            return message.channel.send(err.message);
          }
        });
    } else {
      return message.channel.send(embed).then(msg => {
        msg.delete({ timeout: 20000 })
      }).catch((err) => {
        console.log(err);
      });
    }
  },
};
