const fs = require("fs")
const path = require("path")
const db = require("../../db/roles.json")

module.exports = {
  name: "set_role",
  description: "registrar nuevo rol",
  args: "2",
  usage: "<nombre del rol> <emoji del rol>",
  execute(message, args) {
    let object = {
      role: args[0],
      emoji: args[1],
    }
    db.push(object)

    fs.writeFileSync(
      path.join(path.dirname(path.dirname(__dirname)), "db/roles.json"),
      JSON.stringify(db, null, 2)
    )

    const { role_channel } = require("../config.json")
    const channel = message.guild.channels.cache.get(role_channel)

    channel.messages
      .fetch(channel.lastMessageID)
      .then((msg) => msg.react(args[1]))
  },
}
