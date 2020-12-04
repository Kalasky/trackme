module.exports = {
  name: "args-info",
  syntax: "!args-info",
  description: "Information about the arguments provided.",
  include: true,
  args: true,
  execute(message, args) {
    if (args[0] === "foo") {
      return message.channel.send("bar");
    }

    message.channel.send(
      `Arguments: ${args}\nArguments length: ${args.length}`
    );
  },
};
