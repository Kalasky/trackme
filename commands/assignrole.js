let Roles = require("../models/roles");

module.exports = {
  name: "assignrole",
  cooldown: 5,
  description: "Add role for Warzone data",
  execute(message, args) {
    // let role = message.guild.roles.cache.find(x => {
    //   return x.name == '1kd';
    // })
    // let member = message.mentions.members.first();
    // member.roles.add(role);
  }
};