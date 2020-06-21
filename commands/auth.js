let Player = require("../models/player");
const Discord = require("discord.js");
const API = require("call-of-duty-api")();


module.exports = {
  name: "signin",
  description: "",
  syntax: "!signin <email> <password>",
  include: true,
  args: true,
  execute(message, args) {
    let email, password;

    email = args[0];
    password = args[1];

    API.login(email, password).then((data) => {
      console.log(data);
    });

  },
};
