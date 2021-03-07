let Player = require("../models/player");
const Discord = require("discord.js");
const API = require("call-of-duty-api")();

// command is obsolete due to new sign in flow using direct messaging for user privacy.

module.exports = {
  name: "signin",
  description: "obsolete",
  syntax: "!signin <email> <password>",
  include: false,
  args: true,
  execute(message, args) {
    let email, password;

    email = args[0];
    password = args[1];

    API.login(email, password)
      .then((data) => {
        message.author.send("Please enter more input.").then((data) => {
          console.log(data.channel);
          let authorChannel = data.channel;
          const filter = (m) => message.author.id === m.author.id;

          authorChannel
            .awaitMessages(filter, { time: 45000, max: 1, errors: ["time"] })
            .then((messages) => {
              console.log(messages.first().content);
              let messageContent = messages.first().content;
              let arrayIndex = messageContent.split(" ");

              API.getLoggedInIdentities(arrayIndex[0], arrayIndex[1])
                .then((data) => {
                  for (i = 0; i < data.titleIdentities.length; i++) {
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
        // If status code is 200 OK proceed with getting logged in identities
        // if (200) {
        //   API.getLoggedInIdentities(email, password)
        //     .then((data) => {
        //       for (i = 0; i < data.titleIdentities.length; i++) {
        //         console.log(
        //           `Platform: ${data.titleIdentities[i].platform} | Gamertag: ${data.titleIdentities[i].username}`
        //         );

        //         function userMyCodAccountData(query) {
        //           Player.findOneAndUpdate(
        //             query,
        //             {
        //               $set: {
        //                 userAccountPlatforms: data.titleIdentities[i].platform,
        //                 userAccountGamertags: data.titleIdentities[i].username,
        //               },
        //             },
        //             function callback(err, doc) {
        //               if (err) {
        //                 // Show errors
        //                 console.log(err);
        //               }
        //             }
        //           );
        //         }
        //         userMyCodAccountData();
        //       }
        //       // console.log(data.titleIdentities[0].username);
        //     })
        //     .catch((err) => console.log(err));
        //   console.log(data);
        // }
      })
      .catch((err) => console.log(err));
  },
};
