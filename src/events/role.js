const db = require("../../db/roles.json")

module.exports = {
  event: "messageReactionAdd",
  once: false,
  async run(messageReaction, user) {
    const { role_channel } = require("../config.json")

    if (messageReaction.message.channel.id != role_channel) return

    let is_registered = false
    db.forEach((role) => {
      if (role.emoji == messageReaction._emoji.name) is_registered = true
    })

    if (!is_registered) messageReaction.remove()

    const db_role = db.find((role) => role.emoji == messageReaction._emoji.name)

    if (messageReaction.message.guild.roles.cache.find((role) => role.name == db_role.role) == undefined) {
      await messageReaction.message.guild.roles.create({
        data: {
          name: db_role.role,
          hoist: false,
          mentionable: true,
        },
        reason: "Geek Bot",
      })
    }

    const role = messageReaction.message.guild.roles.cache.find((role) => role.name == db_role.role)

    const member = messageReaction.message.guild.members.cache.get(user.id)

    if (member.user.bot) return

    member.roles.add(role)
  },
}
