const registered_roles = require("../../db/roles.json")

module.exports = {
  event: "messageReactionAdd",
  once: false,
  run(messageReaction, user) {
    const { role_channel } = require("../config.json")

    if (messageReaction.message.channel.id != role_channel) return
    if (user.bot) return

    let is_registered = false
    registered_roles.forEach((role) => {
      if (role.emoji == messageReaction._emoji.name) is_registered = true
    })

    if (!is_registered) messageReaction.remove()
  },
}
