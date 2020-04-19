module.exports = {
  name: "setup-roles",
  aliases: ["sr"],
  cooldown: 5,
  description: "Creates setup roles in server.",
  execute(message, args) {
    message.channel.send("Roles setup completed.");

    let objRoles = {
      noob: {
        role_name: "Noob",
        role_color: "BLUE",
      },
      one_kd: {
        role_name: "1kd",
        role_color: "RED",
      },
      two_kd: {
        role_name: "2kd",
        role_color: "GREEN",
      },
    };

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

    roles.find({});
  },
};

// check if the user inputed battlenet ID is valid?
// Create a new role with data and a reason
