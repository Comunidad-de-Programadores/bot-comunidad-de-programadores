const checkArgs = require("../functions/check_args")

module.exports = {
  event: "message",
  once: false,
  run(message, client) {
    if (message.author == client || !message.content.startsWith(process.env.PREFIX)) return

    const args = message.content.slice(process.env.PREFIX.length).trim().split(" ")
    const commandName = args.shift()

    if (!client.commands.has(commandName)) {
      message.reply("No hemos encontrado el comando")
      return
    }

    const command = client.commands.get(commandName)

    if (!command.md && message.channel.type === "dm") {
      message.reply("Este comando no puede ser usado en MD")
      return
    }

    if (command.md && message.channel.type !== "dm") {
      message.reply("Este comando solo puede ser usado en MD")
      return
    }

    if (command.admin) {
      if (message.channel.id != "788072130310438963") {
        message.reply("no puede utilizar este comando")
        return
      }
    }

    if (command.args) {
      if (!checkArgs(command.args, args.length)) {
        message.reply(
          `Comando invalido\nEl uso correcto de este comando es: \`${process.env.PREFIX}${command.name} ${command.usage}\``
        )
        return
      }
    }

    try {
      command.execute(message, args)
    } catch (err) {
      console.log(err)
      message.reply("Ha ocurrido un error")
    }
  },
}
