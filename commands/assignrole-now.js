require("dotenv").config();
const Player = require("../models/player");
const kdRoles = require("../roles.json");
const winRoles = require("../win_roles.json");
const API = require("call-of-duty-api")({ debug: 1 });
const Discord = require("discord.js");

module.exports = {
  execute(message, args) {
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
      let savePlayerKDRoleRecord = (query, role) => {
        Player.findOneAndUpdate(
          query,
          {
            $set: {
              currentKDRole: role,
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

      let savePlayerWinRoleRecord = (query, role) => {
        Player.findOneAndUpdate(
          query,
          {
            $set: {
              currentWinRole: role,
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

      Player.find({}, function (err, docs) {
        // Run through each record
        docs.map((player) => {
          API.MWBattleData(player.gamertag, API.platforms[player.platform])
            .then((warzoneData) => {
              let kd = warzoneData.br.kdRatio.toFixed(6).slice(0, -4);
              let kills = warzoneData.br.kills;
              let wins = warzoneData.br.wins;
              // Display player record in console
              console.log(
                `Discord ID: ${player.discordID}\nGamertag: ${player.gamertag}\nPlatform: ${player.platform}\nKD: ${kd}\nKills: ${kills}\nWins: ${wins}`
              );

              // Access discord member data
              message.guild.members
                .fetch(player.discordID)
                .then((memberData) => {
                  if (wins <= winRoles[0]["role_req"]) {
                    memberData.roles.add(
                      getRole(winRoles[0]["role_name"], message)
                    );

                    // Update player db record
                    savePlayerWinRoleRecord(
                      { _id: player._id },
                      // { discordID: player.discordID },
                      winRoles[0]["role_name"]
                    );
                  } else if (
                    wins > winRoles[0]["role_req"] &&
                    wins <= winRoles[1]["role_max_win"]
                  ) {
                    memberData.roles.add(
                      getRole(winRoles[1]["role_name"], message)
                    );
                    // Update player db record
                    savePlayerWinRoleRecord(
                      { _id: player._id },
                      // { discordID: player.discordID },
                      winRoles[1]["role_name"]
                    );
                    /**
                     * 1. Add roles then
                     * 2. Update player record on db
                     */
                  } else {
                    for (let i = 1; i < winRoles.length; i++) {
                      // Identify current equivalent role of kd ratio
                      if (
                        wins >= winRoles[i]["role_min_win"] &&
                        wins <= winRoles[i]["role_max_win"]
                      ) {
                        // If current role and new identified role is same, break loop by returning false
                        if (
                          player.currentWinRole == winRoles[i]["role_name"] &&
                          player.currentWinRole == memberData._roles
                        ) {
                          return false;
                        }

                        // Remove role
                        memberData.roles.remove(getRole(player.currentWinRole));
                        // Update player record on db
                        savePlayerWinRoleRecord(
                          { _id: player._id },
                          // { discordID: player.discordID },
                          winRoles[i]["role_name"]
                        );
                        // Apply new role
                        memberData.roles.add(getRole(winRoles[i]["role_name"]));
                        break;
                      }
                    }
                  }

                  if (kills <= kdRoles[0]["role_reqKills"]) {
                    // Add role
                    memberData.roles.add(
                      getRole(kdRoles[0]["role_name"], message)
                    );

                    // Update player db record
                    savePlayerKDRoleRecord(
                      { _id: player._id },
                      // { discordID: player.discordID },
                      kdRoles[0]["role_name"]
                    );
                    /**
                     * 1. Add roles then
                     * 2. Update player record on db
                     */
                  } else {
                    for (let i = 1; i < kdRoles.length; i++) {
                      // Identify current equivalent role of kd ratio
                      if (
                        kd >= kdRoles[i]["role_min_kd"] &&
                        kd <= kdRoles[i]["role_max_kd"]
                      ) {
                        // If current role and new identified role is same, break loop by returning false
                        if (
                          player.currentKDRole == kdRoles[i]["role_name"] &&
                          player.currentKDRole == memberData._roles
                        ) {
                          return false;
                        }

                        // Remove role
                        memberData.roles.remove(getRole(player.currentKDRole));

                        // Update player record on db
                        savePlayerKDRoleRecord(
                          { _id: player._id },
                          // { discordID: player.discordID },
                          kdRoles[i]["role_name"]
                        );
                        // Apply new role
                        memberData.roles.add(getRole(kdRoles[i]["role_name"]));
                        break;
                      }
                    }
                  }
                });
            })
            .catch((err) => {
              const roleAssignmentError = new Discord.MessageEmbed()
                .setColor("#FF0000")
                .setTitle(err)
                .setDescription("Please contact an administrator.")
                .setThumbnail("https://i.imgur.com/I6hxLXI.png");
              // Add for display error message on API
              if (err != undefined) {
                console.log("API error:", err);
                message.author.send(roleAssignmentError);
              }
            });
        });
      }).catch((err) => console.log(err));
    });
  },
};
