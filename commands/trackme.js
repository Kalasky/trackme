let Player = require("../models/player");

module.exports = {
  name: "trackme",
  description: "Track users battlenet ID",
  args: true,
  execute(message, args) {
    message.channel.send(
      `Arguments: ${args[0]}\nYour Battlenet ID is now being tracked.`
    );

    Player.create({
      discordID: `${message.author.id}`,
      battlenetID: `${args[0]}`,
    }) // storing users discord ID and battlenet ID in db
      .then(function (dbPlayer) {
        // If saved successfully, print the new Player document to the console
        console.log(dbPlayer);
      })
      .catch(function (err) {
        // If an error occurs, print it to the console
        console.log(err.message);
      });
  },
};

// check if the user inputed battlenet ID is valid?
