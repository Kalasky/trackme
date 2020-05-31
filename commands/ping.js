module.exports = {
  name: "ping",
  cooldown: 5,
  description: "Ping!",
  include: false,
  execute(message, args) {
    message.channel.send("Pong.");
  },
};
