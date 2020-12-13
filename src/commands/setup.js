const Discord = require("discord.js")
const fs = require("fs")
const path = require("path")
const config = require("../config.json")
const db = require("../../db/roles.json")

module.exports = {
  name: "setup",
  description: "setup inicial",
  args: "0",
  usage: "",
  execute(message) {
    //creacion canal roles
    message.guild.channels
      .create("roles", {
        type: "text",
        parent: "786269301577089075",
        permissionOverwrites: [
          {
            id: "785860569746898972",
            deny: ["SEND_MESSAGES"],
          },
        ],
      })
      .then((ch) => {
        config.role_channel = ch.id
        fs.writeFileSync(
          path.join(path.dirname(__dirname), "config.json"),
          JSON.stringify(config, null, 2)
        )

        const embed = new Discord.MessageEmbed()
          .setTitle("Asignacion de roles")
          .setDescription(
            "Escoja los lenguajes o tecnologias de su preferencia reaccionando a los emojis"
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
