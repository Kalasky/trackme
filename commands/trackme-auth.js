let Player = require("../models/player");
const Discord = require("discord.js");
const API = require("call-of-duty-api")();

module.exports = {
  name: "test",
  description:
    "Tracks users data across various platforms\nIf your platform ID contains spaces wrap it in quotes.",
  syntax: "!trackme",
  include: true,
  args: false,
  execute(message, args) {
    let platform, platformID;

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
                  message.author
                    .send("Please enter more input.")
                    .then((data) => {
                      //   console.log(data.channel);
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

                          API.getLoggedInIdentities(
                            arrayIndex[0],
                            arrayIndex[1]
                          )
                            .then((data) => {
                              // Looping through all of the current user's corresponding platforms/usernames
                              for (
                                i = 0;
                                i < data.titleIdentities.length;
                                i++
                              ) {
                                console.log(
                                  `Platform: ${data.titleIdentities[i].platform} | Gamertag: ${data.titleIdentities[i].username}`
                                );

                                function userMyCodAccountData(query) {
                                  Player.findOneAndUpdate(
                                    query,
                                    {
                                      $set: {
                                        userAccountPlatforms:
                                          data.titleIdentities[i].platform,
                                        userAccountGamertags:
                                          data.titleIdentities[i].username,
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
                              }
                              // console.log(data.titleIdentities[0].username);
                            })
                            .catch((err) => console.log(err));

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
