module.exports = {
  name: "trackme",
  cooldown: 5,
  description: "Tracks a users data in Warzone",
  execute(message, args) {
    message.channel.send("Pong.");
  }
};
// if user does not have batt net connected to their discord account
// bot should send them a message telling them to connect it
