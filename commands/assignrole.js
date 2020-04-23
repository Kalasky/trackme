require("dotenv").config();
let Player = require("../models/player");
var objRoles = require("../roles.json");
const API = require("call-of-duty-api")();

module.exports = {
  name: "assignrole",
  cooldown: 5,
  description: "Add role for Warzone data",
  execute(message, args) {
    API.login(process.env.COD_EMAIL, process.env.COD_PASSWORD)
      .then((data) => {
        Player.find({}, function (err, docs) {
          // docs = acessing player model fields in db
          docs.map((x) => {
            API.MWwz(x.platformID, x.platform)
              .then((data) => {
                console.log(
                  `Discord ID: ${x.discordID}     Platform ID: ${x.platformID}     Platform: ${x.platform}      KD: ${data.br.kdRatio}    Kills: ${data.br.kills}`
                );

                function getRole(role_input, message) {
                  // start adding roles
                  let role = message.guild.roles.cache.find((x) => {
                    return x.name == role_input;
                  });

                  return role;
                }

                message.guild.members.fetch(x.discordID).then((member_data) => {
                  if (data.br.kills <= objRoles[0]["role_reqKills"]) {
                    member_data.roles.add(
                      getRole(objRoles[0]["role_name"], message)
                    );
                  } else {
                    for (let i = 1; i < objRoles.length; i++) {
                      if (
                        data.br.kdRatio >= objRoles[i]["role_min_kd"] &&
                        data.br.kdRatio <= objRoles[i]["role_max_kd"]
                      ) {
                        let query = {
                          currentRole: {
                            $ne: `${objRoles[i]["role_name"]}`,
                          },
                        };

                        Player.find(
                          { query },
                          {
                            $set: {
                              currentRole: `${objRoles[i]["role_name"]}`,
                            },
                          },
                          function callback(err, doc) {
                            if (err) {
                              console.log(err);
                            }
                            // doc.save(callback);
                            console.log("updated");
                            console.log(docs);
                          }
                        );
                        member_data.roles.add(
                          getRole(objRoles[i]["role_name"], message)
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
