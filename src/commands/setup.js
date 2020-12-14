const Discord = require("discord.js")
const fs = require("fs")
const path = require("path")
const config = require("../config.json")
const db = require("../../db/roles.json")

module.exports = {
  name: "setup",
  description: "setup inicial",
  args: "0",
  admin: true,
  usage: "",
  execute(message) {
    //creacion canal roles
    message.guild.channels
      .create("roles", {
        type: "text",
        parent: "775907617595719750",
        permissionOverwrites: [
          {
            id: "775907616986890261",
            deny: ["SEND_MESSAGES"],
          },
        ],
      })
      .then((ch) => {
        config.role_channel = ch.id
        fs.writeFileSync(path.join(path.dirname(__dirname), "config.json"), JSON.stringify(config, null, 2))

        const embed = new Discord.MessageEmbed()
          .setTitle("Asignacion de roles")
          .setDescription(
            "Reaccione a los emojis, para obtener los roles respectivos.\n1 - Frontend developer\n2 - Backend developer\n3 - UI / UX designer\n4 - Game developer\n5 - Mobile developer\n6 - Database developer"
          )

        ch.send(embed).then((msg) => {
          db.forEach((role) => {
            msg.react(role.emoji)
          })
        })

        message.channel.send("Canal creado con exito!")
      })
      .catch(console.error)
  },
}
