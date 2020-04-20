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

                let obj = [
                  {
                    role_name: "PLEB",
                    role_color: "BROWN",
                    role_min_kd: 0,
                    role_max_kd: 0,
                    role_reqKills: 399,
                  },
                  {
                    role_name: "NOOB",
                    role_color: "BLUE",
                    role_min_kd: 0,
                    role_max_kd: 0.99,
                    role_reqKills: 400,
                  },
                  {
                    role_name: "1KD",
                    role_color: "GREEN",
                    role_min_kd: 1.0,
                    role_max_kd: 1.99,
                    role_reqKills: 400,
                  },
                  {
                    role_name: "2KD",
                    role_color: "ORANGE",
                    role_min_kd: 2.0,
                    role_max_kd: 2.99,
                    role_reqKills: 400,
                  },
                  {
                    role_name: "3KD",
                    role_color: "RED",
                    role_min_kd: 3.0,
                    role_max_kd: 3.99,
                    role_reqKills: 400,
                  },
                  {
                    role_name: "4KD",
                    role_color: "PURPLE",
                    role_min_kd: 4.0,
                    role_max_kd: 4.99,
                    role_reqKills: 400,
                  },
                  {
                    role_name: "5KD",
                    role_color: "YELLOW",
                    role_min_kd: 5.0,
                    role_max_kd: 5.99,
                    role_reqKills: 400,
                  },
                  {
                    role_name: "6KD",
                    role_color: "PINK",
                    role_min_kd: 6.0,
                    role_max_kd: 6.99,
                    role_reqKills: 400,
                  },
                ];

                function getRole(role_input, message) {
                  // start adding roles
                  let role = message.guild.roles.cache.find((x) => {
                    return x.name == role_input;
                  });

                  return role;
                }

                message.guild.members.fetch(x.discordID).then((member_data) => {
                  if (data.br.kills <= obj[0]["role_reqKills"]) {
                    member_data.roles.add(
                      getRole(obj[0]["role_name"], message)
                    );
                  } else {
                    for (let i = 1; i < obj.length; i++) {
                      if (
                        data.br.kdRatio >= obj[i]["role_min_kd"] &&
                        data.br.kdRatio <= obj[i]["role_max_kd"]
                      ) {
                        member_data.roles.add(
                          getRole(obj[i]["role_name"], message)
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
