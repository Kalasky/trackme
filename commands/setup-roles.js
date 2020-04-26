var objRoles = require("../roles.json");

module.exports = {
  name: "setup-roles",
  aliases: ["sr"],
  cooldown: 5,
  description: "Creates setup roles in server.",
  execute(message, args) {
    message.channel.send("Roles setup completed.");

    let getRole = (roleString) => {
      // Find discord role object
      let role = message.guild.roles.cache.find((data) => {
        return data.name == roleString;
      });
      return role;
    };

    for (let i = 0; i < objRoles.length; i++) {
      if (!getRole(objRoles[i]["role_name"])) {
        console.log(objRoles[i]["role_name"], "does not exist");
        message.guild.roles
          .create({
            data: {
              name: objRoles[i].role_name,
              color: objRoles[i].role_color,
            },
          })
          .then(console.log)
          .catch(console.error);
      } else {
        console.log(objRoles[i]["role_name"], "already exists");
      }
    }
  },
};
