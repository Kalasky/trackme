let Player = require("../models/player");
var objRoles = require("../roles.json");
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

                function getRole(role_input, message) {
                  // start adding roles
                  let role = message.guild.roles.cache.find((x) => {
                    return x.name == role_input;
                  });

                  return role;
                }

                message.guild.members.fetch(x.discordID).then((member_data) => {
                  if (data.br.kills <= objRoles.objRoles[0]["role_reqKills"]) {
                    member_data.roles.add(
                      getRole(objRoles.objRoles[0]["role_name"], message)
                    );
                  } else {
                    for (let i = 1; i < objRoles.objRoles.length; i++) {
                      if (
                        data.br.kdRatio >=
                          objRoles.objRoles[i]["role_min_kd"] &&
                        data.br.kdRatio <= objRoles.objRoles[i]["role_max_kd"]
                      ) {
                        member_data.roles.add(
                          getRole(objRoles.objRoles[i]["role_name"], message)
                        );
                        break;
                      }
                    }
                  }
                });
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
