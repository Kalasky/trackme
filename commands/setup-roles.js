var objRoles = require("../roles.json");

module.exports = {
  name: "setup-roles",
  aliases: ["sr"],
  cooldown: 5,
  description: "Creates setup roles in server.",
  syntax: "!setup-roles",
  include: true,
  execute(message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send("You must be an admin to execute this command.");
      return false;
    }

    let getRole = (roleString) => {
      // Find discord role object
      let role = message.guild.roles.cache.find((data) => {
        return data.name == roleString;
      });
      return role;
    };

    let roleList = objRoles.map(function (elem) {
      return elem.role_name;
    });
    // .filter(function(role_name) {
    //   return role_name != "1KD";
    // })
    // .join(", ");

    let roleCreated = []; //this is the container for the roles that is created, meaning its not on discord

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
        roleCreated.push(objRoles[i].role_name);
      }
    }

    let difference = roleList.filter((x) => roleCreated.indexOf(x) === -1);
    if (difference.length == 0) {
      message.channel.send("All 8 roles have been created.");
    } else if (roleCreated.length > 0) {
      message.channel.send(
        `Role \`${difference.toString()}\` already exists and was not created to prevent duplication.`
      );
    } else {
      message.channel.send(
        "BITCH, all roles has been created. dont fcking try to create anymore"
      );
    }
  },
};
