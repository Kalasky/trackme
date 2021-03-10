const Player = require("../models/player");
const Discord = require("discord.js");
const API = require("call-of-duty-api")();
// let assignRoleNow = require("./assignrole-now");
const kdRoles = require("../roles.json");
const winRoles = require("../win_roles.json");

module.exports = {
  name: "trackme",
  description:
    "Tracks users data across various platforms\nIf your platform ID contains spaces wrap it in quotes.",
  syntax: "!trackme",
  include: true,
  args: false,
  execute(message, args) {
    const initialPromptEmbed = new Discord.MessageEmbed()
      .setColor("#00C5CD")
      .setTitle("Enter Your Email and Password")
      .setDescription(
        "Enter your login details from https://profile.callofduty.com/cod/login\n\nYou have three attempts before this session automatically exits."
      )
      .addFields(
        {
          name: "Why Login?",
          value:
            "We require authentication for all users. This is to prevent users from having the ability to track themselves as anyone.",
        },
        { name: "Syntax:", value: "`<email> <password>`" }
      )
      .setThumbnail("https://i.imgur.com/tpbXWeM.png")
      .setFooter("We do not store login credentials.");

    const duplicationErrorEmbed = new Discord.MessageEmbed()
      .setColor("#FF0000")
      .setTitle(
        "Duplication error! Call of Duty User or Discord account already exists in database."
      )

      .setThumbnail("https://i.imgur.com/I6hxLXI.png");

    const loginSuccessEmbed = new Discord.MessageEmbed()
      .setColor("#4BB543")
      .setTitle("Login Successful")
      .setDescription(
        "Enter in your gamertag with the corresponding platform. If you enter invalid credentials you have a maximum of three tries before the bot exits the prompt."
      )
      .addFields(
        {
          name: "Syntax:",
          value: "`<Gamertag> <Platform>`",
          inline: true,
        },

        {
          name: "Syntax if gamertag contains spaces:",
          value: '`<"Gamer tag"> <Platform>`',
          inline: true,
        },
        {
          name: "Platforms:",
          value:
            "Battlenet: `battle`, Playstation: `psn`, Xbox: `xbl`, Activision: `acti`",
          inline: false,
        },
        {
          name: "Not sure about which gamertag and platform to track?",
          value:
            "Login to https://profile.callofduty.com/cod/login then hover over your name on the top right and click **Linked Accounts.** There you will see a list of your gamertags with corresponding platforms.",
          inline: false,
        }
      )
      .setThumbnail("https://i.imgur.com/pfXAuiY.png");

    const dmWarning = new Discord.MessageEmbed()
      .setColor("#FF0000")
      .setTitle("This command must be executed in a server.")

      .setThumbnail("https://i.imgur.com/I6hxLXI.png");

    if (message.channel.type === "dm") {
      message.author.send(dmWarning);
      return;
    }

    message.author
      .send(initialPromptEmbed)
      .then((data) => {
        // console.log(data.channel);
        // data.channel targets the current user's private message channel
        let authorChannel = data.channel;
        const filter = (m) => message.author.id === m.author.id;

        // awaiting response for user to enter in login credentials (email & password)
        authorChannel
          .awaitMessages(filter, {
            time: 120000,
            max: 1,
            errors: ["time"],
          })
          .then((messages) => {
            // console.log(messages.first().content);
            let messageContent = messages.first().content;
            let arrayIndex = messageContent.split(" ");

            API.login(arrayIndex[0], arrayIndex[1])
              .then((data) => {
                // let tagPlatValidation = (query, role) => {
                //   Player.find({}, function (err, data) {
                //     Player.findOneAndUpdate(
                //       query,
                //       {
                //         $set: {
                //           currentWinRole: role,
                //         },
                //       },
                //       function callback(err, doc) {
                //         if (err) {
                //           // Show errors
                //           console.log(err);
                //         }
                //       }
                //     );
                //   });
                // };

                // savePlayerKDRoleRecord(
                //   {
                //     _id: {
                //       $eq: player._id,
                //     },
                //   },
                //   kdRoles[i]["role_name"]
                // );

                // Player.findOneAndUpdate(
                //   message.author.id,
                //   {
                //     $set: {
                //       platform: platform,
                //       gamertag: gamertag,
                //     },
                //   },
                //   function callback(err, doc) {
                //     if (err) {
                //       // Show errors
                //       console.log(err);
                //     }
                //   }
                // );

                // let setPlatAndTag = (query, tag, platformID) => {
                //   Player.find({}, function (err, data) {
                //     Player.findOneAndUpdate(
                //       query,
                //       {
                //         $set: {
                //           gamertag: tag,
                //           platform: platformID,
                //         },
                //       },
                //       function callback(err, doc) {
                //         if (err) {
                //           // Show errors
                //           console.log(err);
                //         }
                //       }
                //     );
                //   });
                // };

                // let setFalse = (query, inPromptValue, loggedInValue) => {
                //   Player.find({}, function (err, data) {
                //     Player.findOneAndUpdate(
                //       query,
                //       {
                //         $set: {
                //           inPrompt: inPromptValue,
                //           loggedIn: loggedInValue,
                //         },
                //       },
                //       function callback(err, doc) {
                //         if (err) {
                //           // Show errors
                //           console.log(err);
                //         }
                //       }
                //     );
                //   });
                // };

                // let userTagPlatList = (query, tags, plats) => {
                //   Player.find({}, function (err, data) {
                //     Player.findOneAndUpdate(
                //       query,
                //       {
                //         $set: {
                //           userAccountGamertags: tags,
                //           userAccountPlatforms: plats,
                //         },
                //       },
                //       function callback(err, doc) {
                //         if (err) {
                //           // Show errors
                //           console.log(err);
                //         }
                //       }
                //     );
                //   });
                // };

                console.log(data);
                // Checking if the login credentials submitted by the user are valid.
                if (API.isLoggedIn() == true) {
                  console.log("isLoggedIn value:", API.isLoggedIn());
                  // if the login is successful - create user modal in db
                  Player.create({
                    discordID: `${message.author.id}`,
                    loggedIn: true,
                    gamertag:
                      Math.random().toString(36).substring(2, 15) +
                      Math.random().toString(36).substring(2, 15),
                    platform: "TBD",
                    currentRole: "TBD",
                    userAccountPlatforms: "TBD",
                    userAccountGamertags: "TBD",
                    currentKDRole: "TBD",
                    currentWinRole: "TBD",
                    inPrompt: true,
                  })
                    .then(function (player) {
                      // log modal data in terminal
                      // console.log(player);
                      message.author.send(loginSuccessEmbed).then((data) => {
                        let authorChannel = data.channel;
                        const filter = (m) => message.author.id === m.author.id;

                        // awaiting response for user to enter in platform and gamertag
                        authorChannel
                          .awaitMessages(filter, {
                            time: 120000,
                            max: 1,
                            errors: ["time"],
                          })
                          .then((messages) => {
                            // console.log(messages.first().content);
                            let messageContent = messages.first().content;
                            let arrayIndex = messageContent.split(" ");

                            let pattern = /".*?"/g;
                            let output = pattern.exec(arrayIndex);
                            let gamertag;
                            let count;
                            let platform;

                            if (output == null) {
                              gamertag = arrayIndex[0];
                              // console.log(`gamertag: ${gamertag}`);

                              platform = arrayIndex[1];
                              // console.log(`platform: ${platform}`);
                            } else {
                              gamertag = output[0]
                                .replace(/,/g, " ")
                                .slice(1, -1);
                              // console.log(`gamertag: ${gamertag}`);
                              count = output[0].split(" ").length;
                              platform = arrayIndex[arrayIndex.length - 1];
                              // console.log(`platform: ${platform}`);
                            }
                            console.log(player.discordID);
                            // console.log(player);
                            Player.find(
                              { discordID: player.discordID },
                              function (err, data) {
                                console.log(err);

                                function checkGamertag(arr, val) {
                                  return arr.some(function (arrVal) {
                                    return val == arrVal;
                                  });
                                }
                                // console.log(player);
                                console.log(player.discordID);
                                const gamertags = data[0].userAccountGamertags;

                                function checkPlatform(arr, val) {
                                  return arr.some(function (arrVal) {
                                    return val == arrVal;
                                  });
                                }
                                const platforms = data[0].userAccountPlatforms;

                                // Checking if gamertag input matches one of the DB values
                                // Gamertags is array of all user's gamertags
                                let checkTag = checkGamertag(
                                  gamertags,
                                  gamertag
                                );
                                console.log("verified gamertag:", checkTag);

                                // Checking if platform input matches one of the DB values
                                // Platforms is array of all user's platforms
                                let checkPlat = checkPlatform(
                                  platforms,
                                  platform
                                );
                                console.log("verified platform", checkPlat);

                                console.log(
                                  "data.discordID:",
                                  message.author.id
                                );

                                if (checkTag == false || checkPlat == false) {
                                  Player.deleteOne(
                                    { discordID: player.discordID },
                                    function (err) {
                                      if (err) {
                                        console.log(err);
                                      }
                                    }
                                  );
                                }

                                if (
                                  // if user submitted data matches the gamertags and platforms listed in-
                                  // their call of duty account, execute assignRoleNow
                                  (loggedIn =
                                    true &&
                                    checkTag == true &&
                                    checkPlat == true)
                                ) {
                                  console.log(player.discordID);
                                  // console.log(player);
                                  Player.findOneAndUpdate(
                                    { discordID: player.discordID },
                                    {
                                      $set: {
                                        platform: platform,
                                        gamertag: gamertag,
                                      },
                                    },
                                    function callback(err, doc) {
                                      if (err) {
                                        // Show errors
                                        console.log(err);
                                      }
                                    }
                                  );

                                  // setPlatAndTag(
                                  //   {
                                  //     _id: {
                                  //       $eq: data._id,
                                  //     },
                                  //   },
                                  //   gamertag,
                                  //   platform
                                  // );

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
                                    let role = message.guild.roles.cache.find(
                                      (data) => {
                                        return data.name == roleString;
                                      }
                                    );
                                    return role;
                                  };
                                  /**
                                   * Function to save current player role to db
                                   *
                                   * @param query
                                   * @param role
                                   * @return none
                                   */
                                  let savePlayerKDRoleRecord = (
                                    query,
                                    role
                                  ) => {
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

                                  let savePlayerWinRoleRecord = (
                                    query,
                                    role
                                  ) => {
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

                                  Player.find(
                                    { discordID: player.discordID },
                                    function (err, docs) {
                                      console.log(err);

                                      // Run through each record
                                      docs.map((player) => {
                                        API.MWBattleData(gamertag, platform)
                                          .then((warzoneData) => {
                                            let kd = warzoneData.br.kdRatio
                                              .toFixed(6)
                                              .slice(0, -4);
                                            let kills = warzoneData.br.kills;
                                            let wins = warzoneData.br.wins;
                                            // Display player record in console
                                            console.log(
                                              `Discord ID: ${player.discordID}\nGamertag: ${gamertag}\nPlatform: ${platform}\nKD: ${kd}\nKills: ${kills}\nWins: ${wins}`
                                            );

                                            // Access discord member data
                                            message.guild.members
                                              .fetch(player.discordID)
                                              .then((memberData) => {
                                                if (
                                                  wins <=
                                                  winRoles[0]["role_req"]
                                                ) {
                                                  memberData.roles.add(
                                                    getRole(
                                                      winRoles[0]["role_name"],
                                                      message
                                                    )
                                                  );

                                                  // Update player db record
                                                  savePlayerWinRoleRecord(
                                                    // { _id: player._id },
                                                    {
                                                      discordID:
                                                        player.discordID,
                                                    },
                                                    winRoles[0]["role_name"]
                                                  );
                                                } else if (
                                                  wins >
                                                    winRoles[0]["role_req"] &&
                                                  wins <=
                                                    winRoles[1]["role_max_win"]
                                                ) {
                                                  memberData.roles.add(
                                                    getRole(
                                                      winRoles[1]["role_name"],
                                                      message
                                                    )
                                                  );
                                                  // Update player db record
                                                  savePlayerWinRoleRecord(
                                                    // { _id: player._id },
                                                    {
                                                      discordID:
                                                        player.discordID,
                                                    },
                                                    winRoles[1]["role_name"]
                                                  );
                                                  /**
                                                   * 1. Add roles then
                                                   * 2. Update player record on db
                                                   */
                                                } else {
                                                  for (
                                                    let i = 1;
                                                    i < winRoles.length;
                                                    i++
                                                  ) {
                                                    // Identify current equivalent role of kd ratio
                                                    if (
                                                      wins >=
                                                        winRoles[i][
                                                          "role_min_win"
                                                        ] &&
                                                      wins <=
                                                        winRoles[i][
                                                          "role_max_win"
                                                        ]
                                                    ) {
                                                      // If current role and new identified role is same, break loop by returning false
                                                      if (
                                                        player.currentWinRole ==
                                                          winRoles[i][
                                                            "role_name"
                                                          ] &&
                                                        player.currentWinRole ==
                                                          memberData._roles
                                                      ) {
                                                        return false;
                                                      }

                                                      // Remove role
                                                      memberData.roles.remove(
                                                        getRole(
                                                          player.currentWinRole
                                                        )
                                                      );
                                                      // Update player record on db
                                                      savePlayerWinRoleRecord(
                                                        // { _id: player._id },
                                                        {
                                                          discordID:
                                                            player.discordID,
                                                        },
                                                        winRoles[i]["role_name"]
                                                      );
                                                      // Apply new role
                                                      memberData.roles.add(
                                                        getRole(
                                                          winRoles[i][
                                                            "role_name"
                                                          ]
                                                        )
                                                      );
                                                      break;
                                                    }
                                                  }
                                                }

                                                if (
                                                  kills <=
                                                  kdRoles[0]["role_reqKills"]
                                                ) {
                                                  // Add role
                                                  memberData.roles.add(
                                                    getRole(
                                                      kdRoles[0]["role_name"],
                                                      message
                                                    )
                                                  );

                                                  // Update player db record
                                                  savePlayerKDRoleRecord(
                                                    // { _id: player._id },
                                                    {
                                                      discordID:
                                                        player.discordID,
                                                    },
                                                    kdRoles[0]["role_name"]
                                                  );
                                                  /**
                                                   * 1. Add roles then
                                                   * 2. Update player record on db
                                                   */
                                                } else {
                                                  for (
                                                    let i = 1;
                                                    i < kdRoles.length;
                                                    i++
                                                  ) {
                                                    // Identify current equivalent role of kd ratio
                                                    if (
                                                      kd >=
                                                        kdRoles[i][
                                                          "role_min_kd"
                                                        ] &&
                                                      kd <=
                                                        kdRoles[i][
                                                          "role_max_kd"
                                                        ]
                                                    ) {
                                                      // If current role and new identified role is same, break loop by returning false
                                                      if (
                                                        player.currentKDRole ==
                                                          kdRoles[i][
                                                            "role_name"
                                                          ] &&
                                                        player.currentKDRole ==
                                                          memberData._roles
                                                      ) {
                                                        return false;
                                                      }

                                                      // Remove role
                                                      memberData.roles.remove(
                                                        getRole(
                                                          player.currentKDRole
                                                        )
                                                      );

                                                      // Update player record on db
                                                      savePlayerKDRoleRecord(
                                                        // { _id: player._id },
                                                        {
                                                          discordID:
                                                            player.discordID,
                                                        },
                                                        kdRoles[i]["role_name"]
                                                      );
                                                      // Apply new role
                                                      memberData.roles.add(
                                                        getRole(
                                                          kdRoles[i][
                                                            "role_name"
                                                          ]
                                                        )
                                                      );
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
                                              .setDescription(
                                                "Please contact an administrator."
                                              )
                                              .setThumbnail(
                                                "https://i.imgur.com/I6hxLXI.png"
                                              );
                                            // Add for display error message on API
                                            if (err != undefined) {
                                              console.log("API error:", err);
                                              message.author.send(
                                                roleAssignmentError
                                              );
                                            }
                                          });
                                      });
                                    }
                                  ).catch((err) => console.log(err));

                                  // assignRoleNow.execute(message); // runs code from assignrole-now imported module
                                  const completedPromptEmbed = new Discord.MessageEmbed()
                                    .setColor("#4BB543")
                                    .setTitle("Prompt Completed!")
                                    .setDescription(
                                      "Your data is now being tracked. Check out your roles in the server!"
                                    )
                                    .setThumbnail(
                                      "https://i.imgur.com/pfXAuiY.png"
                                    );

                                  message.author.send(
                                    completedPromptEmbed // completed prompt message
                                  );

                                  Player.findOneAndUpdate(
                                    { discordID: player.discordID },
                                    {
                                      $set: {
                                        inPrompt: false,
                                        loggedIn: false,
                                      },
                                    },
                                    function callback(err, doc) {
                                      if (err) {
                                        // Show errors
                                        console.log(err);
                                      }
                                    }
                                  );

                                  // setFalse(
                                  //   {
                                  //     _id: {
                                  //       $eq: data._id,
                                  //     },
                                  //   },
                                  //   false,
                                  //   false
                                  // );
                                } else {
                                  const tagPlatformErrorEmbed = new Discord.MessageEmbed()
                                    .setColor("#FF0000")
                                    .setTitle("Invalid Gamertag / Platform")
                                    .setDescription(
                                      "The Gamertag and/or platform submitted is invalid. **Gamertag and platform is case senstive.**"
                                    )
                                    .addFields(
                                      {
                                        name: "Syntax:",
                                        value: "`<Gamertag> <Platform>`",
                                        inline: true,
                                      },
                                      {
                                        name:
                                          "Syntax if gamertag contains spaces:",
                                        value: '`<"Gamer tag"> <Platform>`',
                                        inline: true,
                                      },
                                      {
                                        name: "Platforms:",
                                        value:
                                          "Battlenet: `battle`, Playstation: `psn`, Xbox: `xbl`, Activision: `acti`",
                                        inline: false,
                                      },
                                      {
                                        name:
                                          "Not sure about which gamertag and platform to track?",
                                        value:
                                          "Login to https://profile.callofduty.com/cod/login then hover over your name on the top right and click **Linked Accounts.** There you will see a list of your gamertags with corresponding platforms.",
                                        inline: false,
                                      }
                                    )
                                    .setThumbnail(
                                      "https://i.imgur.com/I6hxLXI.png"
                                    );

                                  message.author.send(tagPlatformErrorEmbed);
                                }
                              }
                            );
                          })
                          .catch(() => {
                            const inputTrackErrorEmbed = new Discord.MessageEmbed()
                              .setColor("#FF0000")
                              .setTitle(
                                "Ran Out of Time! The Prompt Automatically Expired"
                              )
                              .setDescription(
                                "You did not enter any input within 2 minutes when asked to enter your gamertag and corresponding platform! The bot has exited the prompt, you can run `!trackme` in the main server to try again."
                              )
                              .setThumbnail("https://i.imgur.com/I6hxLXI.png");
                            message.author.send(
                              // runs if user does not enter credentials when prompted to enter gamertag and platform
                              inputTrackErrorEmbed
                            );

                            // if the user runs out of time, set inPrompt/loggedIn to false
                            Player.findOneAndUpdate(
                              { discordID: player.discordID },
                              {
                                $set: {
                                  inPrompt: false,
                                  loggedIn: false,
                                },
                              },
                              function callback(err, doc) {
                                if (err) {
                                  // Show errors
                                  console.log(err);
                                }
                              }
                            );
                          });
                      });
                    })
                    // when creating the user modal upon signup, check for duplication errors in db
                    .catch(function (err) {
                      if (err) {
                        if (err.name === "MongoError" && err.code === 11000) {
                          console.log(err);
                          return message.author.send(duplicationErrorEmbed);
                        }
                        // Some other error
                        return message.author.send(err.message);
                      }
                    });

                  // if sign-in 200 grab user's identities
                  API.getLoggedInIdentities()
                    .then((data) => {
                      console.log(data);
                      const identities = data.titleIdentities;
                      // Mapping through all of the current user's corresponding platforms/usernames
                      const platforms = Object.keys(identities).map((data) => {
                        return identities[data].platform;
                      });

                      const usernames = Object.keys(identities).map((data) => {
                        return identities[data].username;
                      });

                      API.ConnectedAccounts(usernames[0], platforms[0]).then(
                        (data) => {
                          console.log(data);
                        }
                      );

                      Player.findOneAndUpdate(
                        { discordID: message.author.id },
                        {
                          $set: {
                            userAccountPlatforms: platforms,
                            userAccountGamertags: usernames,
                          },
                        },
                        function callback(err) {
                          if (err) {
                            // Show errors
                            console.log(err);
                          }
                        }
                      );

                      // userTagPlatList(
                      //   {
                      //     _id: {
                      //       $eq: data._id,
                      //     },
                      //   },
                      //   usernames,
                      //   platforms
                      // );

                      // console.log(data.titleIdentities[0].username);
                    })
                    .catch((err) => console.log(err));
                }
              })
              .catch((err) => {
                console.log(err);
                const loginErrorEmbed = new Discord.MessageEmbed()
                  .setColor("#FF0000")
                  .setTitle("Unauthorized. Incorrect Username or Password")
                  .setDescription(
                    "Login failed, you have two more attempts before this session automatically exits.\n\n**This error message may also be appearing if you have Two Factor Authentication (2FA) enabled for your call of duty account. You can enable it after successfully signing up.**"
                  )
                  .addFields(
                    { name: "Syntax:", value: "`<email> <password>`" },
                    {
                      name: "Forget Password?",
                      value:
                        "Click the following link to reset it: https://profile.callofduty.com/cod/forgotPassword",
                    }
                  )
                  .setThumbnail("https://i.imgur.com/I6hxLXI.png")
                  .setFooter("We do not store login credentials.");

                message.author.send(loginErrorEmbed);
              });
          })
          .catch(() => {
            const inputLoginErrorEmbed = new Discord.MessageEmbed()
              .setColor("#FF0000")
              .setTitle("Ran Out of Time! The Prompt Automatically Expired")
              .setDescription(
                "You did not enter any input within 2 minutes when asked to login! The bot has exited the prompt, you can run `!trackme` in the main server to try again."
              )
              .setThumbnail("https://i.imgur.com/I6hxLXI.png");
            message.author.send(
              // runs if user does not enter credentials when prompted to login
              inputLoginErrorEmbed
            );
          });
      })
      .catch((err) => console.log(err));
  },
};
