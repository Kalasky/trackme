let Player = require("../models/player");

module.exports = {
  name: "trackme",
  description: "Track users battlenet ID",
  args: true,
  execute(message, args) {
    message.channel.send(
      `Your platformID ${args[0]}\nis now being tracked from platform ${args[1]}`
    );

    Player.create({
      discordID: `${message.author.id}`,
      platformID: `${args[0]}`,
      platform: `${args[1]}`,
      currentRole: "TBD",
    }) // storing users discord ID and battlenet ID in db
      .then(function (dbPlayer) {
        // If saved successfully, print the new Player document to the console
        console.log(dbPlayer);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },
};

// check if the user inputed battlenet ID is valid?
