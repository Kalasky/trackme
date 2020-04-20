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

                /**
                 * PSEUDOCODE FOR ROLE IDENTIFICATION?
                 *
                 * if kills <= 400 -> PLEB
                 * elseif kills > 400
                 * comment: in this if, we put the whole condition of trying to find kd
                 *    let kd;
                 *    comment: round of kd to nearest two?
                 *    if kd < 1 -> NOOBMASTER
                 *    if kd >= 1 && kd <= 1.99 -> 1KD
                 *    if kd >= 2 && kd <= 2.99 -> 2KD
                 *    if kd >= 3 && kd <= 3.99 -> 3KD
                 *    if kd >= 4 && kd <= 4.99 -> 4KD
                 *    if kd >= 5 && kd <= 5.99 -> 5KD
                 *    if kd >= 6 -> HACKER
                 */

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
                  // if (data.br.kdRatio > 1) {
                  //   member_data.roles.add(getRole(object[x]['role_name'], message));
                  // }

                  if (data.br.kills <= obj[0]["role_reqKills"]) {
                    message.member_data.roles.add(
                      getRole(obj[0]["role_name"], message)
                    );
                  } else {
                    for (let i = 1; i < obj.length; i++) {
                      if (
                        data.br.kdRatio >= obj[1]["role_min_kd"] &&
                        data.br.kdRatio <= obj[1]["role_max_kd"]
                      ) {
                        message.member_data.roles.add(
                          getRole(obj[1]["role_name"], message)
                        );
                      } else if (
                        data.br.kdRatio >= obj[2]["role_min_kd"] &&
                        data.br.kdRatio <= obj[2]["role_max_kd"]
                      ) {
                        message.member_data.roles.add(
                          getRole(obj[2]["role_name"], message)
                        );
                      }
                    }
                  }
                });

                // assignRole = () => {
                //   // start adding roles
                //   let role = message.guild.roles.cache.find((x) => {
                //     return x.name == obj[x].role_name;
                //   });
                // };

                // message.guild.members.fetch(x.discordID).then((member_data) => {
                //   if (data.br.kdRatio > 1) {
                //     member_data.roles.add(role);
                //   }
                // });
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
