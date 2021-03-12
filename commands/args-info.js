require("dotenv").config();
const API = require("call-of-duty-api")();
const Discord = require("discord.js");

module.exports = {
  name: "trackuser",
  syntax: "!trackuser <username> <platform>",
  description:
    "If a user isn't being tracked under the bot you can track them yourself!",
  include: true,
  args: false,
  execute(message, args) {
    let pattern = /".*?"/g;
    let output = pattern.exec(message.content);
    let id;
    let count;
    let platform;

    if (output == null) {
      id = args[0];
      platform = args[1];
    } else {
      id = output[0].slice(1, -1);
      console.log(id);
      count = output[0].split(" ").length;
      platform = args[count];
    }

    console.log(message.content);

    API.login(process.env.COD_EMAIL, process.env.COD_PASSWORD).then((data) => {
      API.MWBattleData(id, platform)
        .then((warzoneData) => {
          let kd = warzoneData.br.kdRatio.toFixed(6).slice(0, -4);
          let kills = warzoneData.br.kills;
          let wins = warzoneData.br.wins;
          let topTen = warzoneData.br.topTen;
          let topFive = warzoneData.br.topFive;
          // console.log(kd, kills, wins);
          // console.log(data.lifetime.itemData.weapon_smg);

          const trackedUserEmbed = new Discord.MessageEmbed()
            .setColor("#4BB543")
            .setTitle(`${id}'s Warzone Stats`)
            // .setDescription(
            //   "Enter in your gamertag with the corresponding platform. If you enter invalid credentials you have a maximum of three tries before the bot exits the prompt."
            // )
            .addFields(
              {
                name: "KDR",
                value: kd,
                inline: true,
              },

              {
                name: "Kills",
                value: kills,
                inline: true,
              },
              {
                name: "Wins",
                value: wins,
                inline: true,
              },
              {
                name: "Top 10",
                value: topTen,
                inline: true,
              },
              {
                name: "Top 5",
                value: topFive,
                inline: true,
              }
            )
            .setThumbnail("https://i.imgur.com/pfXAuiY.png");

          message.channel.send(trackedUserEmbed);
        })
        .catch((err) => {
          const trackUserError = new Discord.MessageEmbed()
            .setColor("#FF0000")
            .setTitle("Error")
            .setDescription(
              '- Syntax: `!trackuser <username> <platform>` \n- Run `!platforms` to view a list of trackable platforms.\n- If the username contains spaces wrap it in quotes.\n- Example for a name with spaces: `!trackuser "TT Cudi" xbl`\n- Make sure the username and platform are corresponding. \n- You may also have provided an incorrect username or platform. '
            )
            .setThumbnail("https://i.imgur.com/I6hxLXI.png");

          message.channel.send(trackUserError);
        });
    });
  },
};
