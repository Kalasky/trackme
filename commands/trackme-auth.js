let Player = require("../models/player");
const Discord = require("discord.js");
const API = require("call-of-duty-api")();
let assignRoleNow = require("./assignrole-now");

module.exports = {
  name: "test",
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
            "We require authentication for all users. This is to prevent users from having the ability to track themselves as anyone. ",
        },
        { name: "Syntax:", value: "`<email> <password>`" }
      )
      .setThumbnail("https://i.imgur.com/tpbXWeM.png")
      .setFooter("We do not store login credentials.");

    message.author
      .send(initialPromptEmbed)
      .then((data) => {
        // console.log(data.channel);
        // data.channel targets the current user's private message channel
        let authorChannel = data.channel;
        const filter = (m) => message.author.id === m.author.id;

        authorChannel
          .awaitMessages(filter, { time: 120000, max: 1, errors: ["time"] })
          .then((messages) => {
            console.log(messages.first().content);
            let messageContent = messages.first().content;
            let arrayIndex = messageContent.split(" ");

            API.login(arrayIndex[0], arrayIndex[1])
              .then((data) => {
                console.log(data);
                // Checking if the login credentials submitted by the user are valid.
                if (API.isLoggedIn() == true) {
                  console.log(API.isLoggedIn());
                  Player.create({
                    discordID: `${message.author.id}`,
                    loggedIn: true,
                    gamertag: "TBD",
                    platform: "TBD",
                    currentRole: "TBD",
                    userAccountPlatforms: "TBD",
                    userAccountGamertags: "TBD",
                    inPrompt: true,
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

                      function userMyCodAccountData(query) {
                        Player.findOneAndUpdate(
                          query,
                          {
                            $set: {
                              userAccountPlatforms: platforms,
                              userAccountGamertags: usernames,
                            },
                          },
                          function callback(err, doc) {
                            if (err) {
                              // Show errors
                              console.log(err);
                            }
                          }
                        );
                      }
                      userMyCodAccountData();

                      // console.log(data.titleIdentities[0].username);
                    })
                    .catch((err) => console.log(err));

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
                        name:
                          "Not sure about which gamertag and platform to track?",
                        value:
                          "Login to https://profile.callofduty.com/cod/login then hover over your name on the top right and click **Linked Accounts.** There you will see a list of your gamertags with corresponding platforms.",
                        inline: false,
                      }
                    )
                    .setThumbnail("https://i.imgur.com/pfXAuiY.png");

                  message.author.send(loginSuccessEmbed).then((data) => {
                    let authorChannel = data.channel;
                    const filter = (m) => message.author.id === m.author.id;

                    authorChannel
                      .awaitMessages(filter, {
                        time: 120000,
                        max: 1,
                        errors: ["time"],
                      })
                      .then((messages) => {
                        console.log(messages.first().content);
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
                          gamertag = output[0].replace(/,/g, " ").slice(1, -1);
                          // console.log(`gamertag: ${gamertag}`);
                          count = output[0].split(" ").length;
                          platform = arrayIndex[arrayIndex.length - 1];
                          // console.log(`platform: ${platform}`);
                        }

                        Player.find({}, function (err, data) {
                          console.log(err);

                          function checkGamertag(arr, val) {
                            return arr.some(function (arrVal) {
                              return val == arrVal;
                            });
                          }
                          const gamertags = data[0].userAccountGamertags;

                          function checkPlatform(arr, val) {
                            return arr.some(function (arrVal) {
                              return val == arrVal;
                            });
                          }
                          const platforms = data[0].userAccountPlatforms;

                          // Checking if gamertag input matches one of the DB values
                          // gamertags is array of all user's gamertags
                          let checkTag = checkGamertag(gamertags, gamertag);
                          console.log(checkTag);

                          // Checking if platform input matches one of the DB values
                          // platforms is array of all user's gamertags
                          let checkPlat = checkPlatform(platforms, platform);
                          console.log(checkPlat);

                          if (
                            (loggedIn =
                              true && checkTag == true && checkPlat == true)
                          ) {
                            function trackmeData(query) {
                              Player.findOneAndUpdate(
                                query,
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
                            }
                            trackmeData();
                            assignRoleNow.execute(message); // runs code from assignrole-now imported module
                            const completedPromptEmbed = new Discord.MessageEmbed()
                              .setColor("#4BB543")
                              .setTitle("Prompt Completed!")
                              .setDescription(
                                "Your data is now being tracked. Check out your roles in the server!"
                              )
                              .setThumbnail("https://i.imgur.com/pfXAuiY.png");

                            message.author.send(
                              completedPromptEmbed // completed prompt message
                            );

                            function endOfPrompt(query) {
                              Player.findOneAndUpdate(
                                query,
                                {
                                  $set: {
                                    inPrompt: false,
                                  },
                                },
                                function callback(err, doc) {
                                  if (err) {
                                    // Show errors
                                    console.log(err);
                                  }
                                }
                              );
                            }
                            endOfPrompt();
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
                                  name:
                                    "Not sure about which gamertag and platform to track?",
                                  value:
                                    "Login to https://profile.callofduty.com/cod/login then hover over your name on the top right and click **Linked Accounts.** There you will see a list of your gamertags with corresponding platforms.",
                                  inline: false,
                                }
                              )
                              .setThumbnail("https://i.imgur.com/I6hxLXI.png");

                            message.author.send(tagPlatformErrorEmbed);
                          }
                        });
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
                      });
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                const loginErrorEmbed = new Discord.MessageEmbed()
                  .setColor("#FF0000")
                  .setTitle("Unauthorized. Incorrect Username or Password")
                  .setDescription(
                    "Login failed, you have two more attempts before this session automatically exits."
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
