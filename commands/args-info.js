require("dotenv").config();
const API = require("call-of-duty-api")();

module.exports = {
  name: "args-info",
  syntax: "!args-info",
  description: "Information about the arguments provided.",
  include: true,
  args: false,
  execute(message, args) {
    API.login(process.env.COD_EMAIL, process.env.COD_PASSWORD).then((data) => {
      API.CWmp("kal#2498559", "acti").then((data) => {
        console.log(data.lifetime.itemData.weapon_smg);
      });
    });

    message.channel.send(
      `Arguments: ${args}\nArguments length: ${args.length}`
    );
  },
};
