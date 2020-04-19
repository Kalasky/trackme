let Player = require("../models/player");
const API = require("call-of-duty-api")();

module.exports = {
  name: "assignrole",
  cooldown: 5,
  description: "Add role for Warzone data",
  execute(message, args) {
    API.login("kalaskyr@gmail.com", "776655ygt")
      .then((data) => {
        Player.find({}, function (err, docs) {
          docs.map((x) => {
            API.MWwz(x.battlenetID, API.platforms.battle)
              .then((data) => {
                console.log(
                  `Discord ID: ${x.discordID}     battlenet ID: ${x.battlenetID}      KD: ${data.br.kdRatio}`
                );

                

                // start adding roles
                let role = message.guild.roles.cache.find((x) => {
                  return x.name == "noob";
                });

                message.guild.members.fetch(x.discordID).then((member_data) => {
                  if (data.br.kdRatio > 1) {
                    member_data.roles.add(role);
                  }
                });
                // end
              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
