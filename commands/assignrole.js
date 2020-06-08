require("dotenv").config();
let Player = require("../models/player");
var objRoles = require("../roles.json");
const API = require("call-of-duty-api")();
var cron = require('node-cron');


module.exports = {
  name: "assignrole",
  cooldown: 5,
  description: "Assign role for Warzone data",
  syntax: "!assignrole",
  include: true,
  execute(message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send("You must be an admin to execute this command.");
      return false;
    }
    API.login(process.env.COD_EMAIL, process.env.COD_PASSWORD).then((data) => {
      // Common functions
      //--------------------------------------------//
      /**
       * Function to return discord role object based on input string
       *
       * @param roleString
       * @return discord object role
       */
      let getRole = (roleString) => {
        // Find discord role object
        let role = message.guild.roles.cache.find((data) => {
          return data.name == roleString;
        });
        return role;
      };
      /**
       * Function to save current player role to db
       *
       * @param query
       * @param role
       * @return none
       */
      let savePlayerRoleRecord = (query, role) => {
        Player.findOneAndUpdate(
          query,
          {
            $set: {
              currentRole: role,
            },
          },
          function callback(err, doc) {
            if (err) {
              // Show errors
              console.log(err);
            }
          }
        );
      };
      //--------------------------------------------//

      Player.find({}, function (err, docs) {
        // Run through each record
        docs.map((player) => {
          // FIX: update platforms because its not using API.platforms
          API.MWwz(player.platformID, API.platforms[player.platform])
            .then((warzoneData) => {
              let kd = warzoneData.br.kdRatio.toFixed(6).slice(0, -4);
              let kills = warzoneData.br.kills;
              // Display player record in console
              console.log(
                `Discord ID: ${player.discordID}     Platform ID: ${player.platformID}     Platform: ${player.platform}      KD: ${kd}    Kills: ${kills}`
              );

              // Access discord member data
              cron.schedule('0 */8 * * *', () => {
              message.guild.members
                .fetch(player.discordID)
                .then((memberData) => {
                  console.log('fetch');
                  // console.log(memberData._roles);
                  if (kills <= objRoles[0]["role_reqKills"]) {
                    // Add role
                    memberData.roles.add(
                      getRole(objRoles[0]["role_name"], message)
                    );

                    // Update player db record
                    savePlayerRoleRecord(
                      {
                        _id: {
                          $eq: player._id,
                        },
                      },
                      objRoles[0]["role_name"]
                    );
                    /**
                     * 1. Add roles then
                     * 2. Update player record on db
                     */
                  } else {
                    for (let i = 1; i < objRoles.length; i++) {
                      // Identify current equivalent role of kd ratio
                      if (
                        kd >= objRoles[i]["role_min_kd"] &&
                        kd <= objRoles[i]["role_max_kd"]
                      ) {
                        // If current role and new identified role is same, break loop by returning false
                        if (
                          player.currentRole == objRoles[i]["role_name"] &&
                          player.currentRole == memberData._roles
                        ) {
                          return false;
                        }

                        // Remove role
                        memberData.roles.remove(getRole(player.currentRole));
                        // Update player record on db
                        savePlayerRoleRecord(
                          {
                            _id: {
                              $eq: player._id,
                            },
                          },
                          objRoles[i]["role_name"]
                        );
                        // Apply new role
                        memberData.roles.add(getRole(objRoles[i]["role_name"]));
                        break;
                      }
                    }
                  }
                });
              });
            })
            .then((err) => {
              // Add for display error message on API
              if (err != undefined) {
                console.log("API error:", err);
              }
            });
        });
      });
    });
  },
};
