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
 
    if(output == null) {
      platformID = args[0];
      platform = args[1];
    } else {
      platformID = output[0];
      count = output[0].split(" ").length;
      platform = args[count];
    }

    message.channel.send(
      `Your platformID ${platformID}\nis now being tracked from platform ${platform}`
    );

    Player.create({
      discordID: `${message.author.id}`,
      platformID: platformID,
      platform: platform,
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
