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

    let str = objRoles
      .filter(function (elem) {
        console.log(elem.role_name);
        return elem.role_name != "1KD";
      })
      .join(", ");

    for (let i = 0; i < objRoles.length; i++) {
      if (!getRole(objRoles[i]["role_name"])) {
        console.log(objRoles[i]["role_name"], "has just been created!");
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
        // console.log(str, "already exists");
        message.channel.send(
          `Role \`${str}\` already exists and was not created to prevent duplication.`
        );
        break;
      }
    }
  },
};
