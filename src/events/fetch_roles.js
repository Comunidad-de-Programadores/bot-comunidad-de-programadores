const db = require("../../db/roles.json")

module.exports = {
  event: "ready",
  once: false,
  run(client) {
    const { role_channel } = require("../config.json")
    const channel = client.channels.cache.get(role_channel)

    try {
      channel.messages.fetch(channel.lastMessageID).then((msg) => {
        db.forEach((role) => {
          msg.react(role.emoji)
        })
      })
    } catch (e) {
      if (e instanceof TypeError) return
      console.log(e)
    }
  },
}
