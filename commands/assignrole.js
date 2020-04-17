let Roles = require("../models/roles");
let Player = require("../models/player");
const API = require("call-of-duty-api")();

module.exports = {
  name: "assignrole",
  cooldown: 5,
  description: "Add role for Warzone data",
  execute(message, args) {
    API.login("kalaskyr@gmail.com", "776655ygt").then((data) => {
      Player.find({}, function (err, docs) {
            docs.map(x => {
              API.MWwz(x.battlenetID, API.platforms.battle)
                .then(data => {
                  //start adding roles
                  let role = message.guild.roles.cache.find(x => {
                    return x.name == 'noob';
                  })
                  
                  message.guild.members.fetch(x.discordID).then(data => {
                    data.roles.add(role)
                  });
                  //end
                })
                .catch(err => {
                  console.log(err);
                });
            });
         });
    }).catch(() => {
    });
  }
};