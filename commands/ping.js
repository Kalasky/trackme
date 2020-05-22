const Discord = require("discord.js");
const client = new Discord.Client();
let CronJob = require("cron").CronJob;

var job = new CronJob(
  "* * * * * *",
  function () {
    client.on("message", (message) => {
      console.log("You will see this message every second");
      message.channel.send("Pong.");
    });
  },
  null,
  true,
  "America/Los_Angeles"
);

module.exports = {
  name: "ping",
  cooldown: 5,
  description: "Ping!",
  execute(message, args) {
    // message.channel.send("Pong.");
    job.start();
  },
};
