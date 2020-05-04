let Player = require("../models/player");

module.exports = {
  name: "trackme",
  description: "Track users battlenet ID",
  args: true,
  execute(message, args) {
    let pattern = /".*?"/g;
    let output = pattern.exec(message.content);
    let platformID;
    let count;
    let platform;

    if (output == null) {
      platformID = args[0];
      platform = args[1];
    } else {
      platformID = output[0].slice(1, -1);
      count = output[0].split(" ").length;
      platform = args[count];
    }

    // message.channel.send(
    //   `Your platformID ${platformID}\nis now being tracked from platform ${platform}`
    // );

    Player.create({
      discordID: `${message.author.id}`,
      platformID: platformID,
      platform: platform,
      currentRole: "TBD",
    }) // storing users discord ID, platform ID, and platform in db
      .then(function (dbPlayer) {
        // If saved successfully, print the new Player document to the console
        console.log(dbPlayer);
        message.channel.send(
          `Your platformID \`${platformID}\` is now being tracked from platform \`${platform}\``
        );
      })
      .catch(function (err) {
        if (err) {
          if (err.name === "MongoError" && err.code === 11000) {
            // Duplicate username
            // return message.channel.send("User already exists!");
            return message.channel.send(err.message);
          }

          // Some other error
          return message.channel.send(err.message);
        }
      });
  },
};
