require("dotenv").config();
const API = require("call-of-duty-api")();

module.exports = {
  name: "test",
  syntax: "",
  description: "test command",
  include: false,
  args: false,
  execute(message) {
    API.login(process.env.COD_EMAIL, process.env.COD_PASSWORD).then((data) => {
      API.MWwz("TT Cudi", "xbl")
        .then((data) => {
          console.log(data.lifetime.itemData);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
};
