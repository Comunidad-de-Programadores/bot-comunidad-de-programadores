const prefix = process.env.PREFIX

module.exports = {
  name: "help",
  description: "Conoce mis comandos",
  admin: false,
  usage: "<nombre del comando>",
  execute(message, args) {
    const data = []
    const { commands } = message.client

    if (!args.length) {
      data.push("Estos son todos mis comandos:")
      data.push(commands.map((command) => command.name).join(", "))
      data.push(
        `\nEnvie: \`${prefix}help <nombre del comando>\` para obtener informacion de un comando especifico!`
      )

      return message.author
        .send(data, { split: true })
        .then(() => {
          if (message.channel.type === "dm") return
          message.reply("Le he enviado un MD con todos mis comandos!")
        })
        .catch((error) => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
          message.reply("No pude enviarle un MD con mis comandos, tiene los MD desactivados?")
        })
    }

    const name = args[0].toLowerCase()
    const command = commands.get(name)

    if (!command) {
      return message.reply("ese no es un comando valido!")
    }

    data.push(`**Nombre:** ${command.name}`)
    if (command.description) data.push(`**Descripcion:** ${command.description}`)
    if (command.usage) data.push(`**Uso:** ${prefix}${command.name} ${command.usage}`)

    message.channel.send(data, { split: true })
  },
}
