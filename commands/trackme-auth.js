let Player = require("../models/player");
const Discord = require("discord.js");
const API = require("call-of-duty-api")();
const fs = require("fs");

module.exports = {
  name: "test",
  description:
    "Tracks users data across various platforms\nIf your platform ID contains spaces wrap it in quotes.",
  syntax: "!trackme",
  include: true,
  args: false,
  execute(message, args) {
    message.author
      .send("Please enter more input.")
      .then((data) => {
        // console.log(data.channel);
        // data.channel targets the current user's private message channel
        let authorChannel = data.channel;
        const filter = (m) => message.author.id === m.author.id;

        authorChannel
          .awaitMessages(filter, { time: 45000, max: 1, errors: ["time"] })
          .then((messages) => {
            console.log(messages.first().content);
            let messageContent = messages.first().content;
            let arrayIndex = messageContent.split(" ");

            API.login(arrayIndex[0], arrayIndex[1])
              .then((data) => {
                console.log(data);
                // Checking if the login credentials submitted by the user are valid.
                if (200) {
                  Player.create({
                    discordID: `${message.author.id}`,
                    loggedIn: true,
                    platformID: "TBD",
                    platform: "TBD",
                    currentRole: "TBD",
                    userAccountPlatforms: "TBD",
                    userAccountGamertags: "TBD",
                  });
                  // if sign-in 200 grab user's identities
                  API.getLoggedInIdentities()
                    .then((data) => {
                      const identities = data.titleIdentities;
                      // Mapping through all of the current user's corresponding platforms/usernames
                      const platforms = Object.keys(identities).map((data) => {
                        return identities[data].platform;
                      });
                      console.log(platforms);

                      const usernames = Object.keys(identities).map((data) => {
                        return identities[data].username;
                      });
                      console.log(usernames);

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

                  function checkmarkImage() {
                    fs.readFile("../images/check.png", (err, checkmark) => {
                      const loginSuccessEmbed = new Discord.MessageEmbed()
                        .setColor("#4BB543")
                        .setTitle("Login Successful")
                        .addField("Inline field title", "Some value here", true)
                        .setDescription("Some description here")
                        .setThumbnail(checkmark)
                        .setTimestamp()
                        .setFooter(
                          "Some footer text here",
                          "https://i.imgur.com/wSTFkRM.png"
                        );
                      message.author.send(loginSuccessEmbed);
                    });
                  }

                  checkmarkImage().then((data) => {
                    let authorChannel = data.channel;
                    const filter = (m) => message.author.id === m.author.id;

                    authorChannel
                      .awaitMessages(filter, {
                        time: 45000,
                        max: 1,
                        errors: ["time"],
                      })
                      .then((messages) => {
                        console.log(messages.first().content);
                        let messageContent = messages.first().content;
                        let arrayIndex = messageContent.split(" ");

                        let pattern = /".*?"/g;
                        let output = pattern.exec(arrayIndex);
                        let platformID;
                        let count;
                        let platform;

                        if (output == null) {
                          platformID = arrayIndex[0];
                          // console.log(`platformID: ${platformID}`);

                          platform = arrayIndex[1];
                          // console.log(`platform: ${platform}`);
                        } else {
                          platformID = output[0]
                            .replace(/,/g, " ")
                            .slice(1, -1);
                          // console.log(`platformID: ${platformID}`);
                          count = output[0].split(" ").length;
                          platform = arrayIndex[arrayIndex.length - 1];
                          // console.log(`platform: ${platform}`);
                        }

                        Player.find({}, function (err, data) {
                          console.log(err);
                          // console.log(data);
                          // const gamertags = Object.keys(data).map((res) => {
                          //   return data[res].userAccountGamertags;
                          // });
                          // console.log(gamertags);

                          // checking if platformID argument is equal to database gamertag values
                          // let check = gamertags.some((values) => {
                          //   // removing quotes from mapped values
                          //   values = values.toString().replace(/"/g, "");
                          //   // setting values equal to platformID
                          //   console.log(`values: ${values}`);
                          //   return values == platformID;
                          // });
                          // console.log(check);
                          //   arrayIndex.length == 2

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

                          let checkTag = checkGamertag(gamertags, platformID);
                          console.log(checkTag);

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
                                    platformID: platformID,
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
                          }
                        });

                        message.author.send(
                          `You've entered: ${messages.first().content}`
                        );
                      })
                      .catch(() => {
                        message.author.send(
                          "You did not enter any input! The bot has exited the prompt, you can run `!trackme` in the main server to try again."
                        );
                      });
                  });
                } else {
                  message.author.send(
                    "Unauthorized. Incorrect username or password."
                  );
                }
                // console.log(data.titleIdentities[0].username);
              })
              .catch((err) => console.log(err));

            message.author.send(`You've entered: ${messages.first().content}`);
          })
          .catch(() => {
            message.author.send(
              "You did not enter any input! The bot has exited the prompt, you can run `!trackme` in the main server to try again."
            );
          });
      })
      .catch((err) => console.log(err));
  },
};
