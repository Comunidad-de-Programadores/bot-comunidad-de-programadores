module.exports = {
  name: "setup",
  description: "setup inicial",
  args: "0",
  usage: "",
  execute(message) {
    //creacion canal roles
    message.guild.channels.create("roles", {
      type: "text",
      parent: "786269301577089075",
      permissionOverwrites: [
        {
          id: "785860569746898972",
          deny: ["SEND_MESSAGES"]
        }
      ]
    }).then(message.channel.send("Canal creado con exito!"))
      .catch(console.error)

  },
}
