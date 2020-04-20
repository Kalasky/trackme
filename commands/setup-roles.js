module.exports = {
  name: "setup-roles",
  aliases: ["sr"],
  cooldown: 5,
  description: "Creates setup roles in server.",
  execute(message, args) {
    message.channel.send("Roles setup completed.");

    let objRoles = [
      {
        role_name: "PLEB",
        role_color: "BROWN",
      },
      {
        role_name: "NOOB",
        role_color: "BLUE",
      },
      {
        role_name: "1KD",
        role_color: "GREEN",
      },
      {
        role_name: "2KD",
        role_color: "ORANGE",
      },
      {
        role_name: "3KD",
        role_color: "RED",
      },
      {
        role_name: "4KD",
        role_color: "PURPLE",
      },
      {
        role_name: "5KD",
        role_color: "YELLOW",
      },
      {
        role_name: "6KD",
        role_color: "PINK",
      },
    ];

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

// check if the user inputed battlenet ID is valid?
