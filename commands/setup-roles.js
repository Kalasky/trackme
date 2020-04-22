var objRoles = require("../roles.json");

module.exports = {
  name: "setup-roles",
  aliases: ["sr"],
  cooldown: 5,
  description: "Creates setup roles in server.",
  execute(message, args) {
    message.channel.send("Roles setup completed.");

    let roles = Object.keys(objRoles);

    roles.map((x) => {
      console.log(objRoles[x]);
      message.guild.roles
        .create({
          data: {
            name: objRoles[x].role_name,
            color: objRoles[x].role_color,
          },
        })
        .then(console.log)
        .catch(console.error);
    });
  },
};