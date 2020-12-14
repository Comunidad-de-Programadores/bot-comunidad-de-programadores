const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, ".env") })
const Discord = require("discord.js")

const client = new Discord.Client()
client.commands = new Discord.Collection()
const fs = require("fs")

const checkArgs = require("./functions/check_args")

const commandFiles = fs.readdirSync(path.join(__dirname, "./commands")).filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
  const command = require(path.join(__dirname, `./commands/${file}`))

  client.commands.set(command.name, command)
}

client.on("ready", () => {
  console.log("Bot listo!")
})

client.on("message", (message) => {
  if (message.author == client || !message.content.startsWith(process.env.PREFIX)) return

  const args = message.content.slice(process.env.PREFIX.length).trim().split(" ")
  const commandName = args.shift()

  if (!client.commands.has(commandName)) {
    message.reply("No hemos encontrado el comando")
    return
  }

  const command = client.commands.get(commandName)

  if (command.admin) {
    if (message.channel.id != "775926844175155201") {
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
})

fs.readdir("./src/events/", (err, files) => {
  if (err) return console.error(err)

  files.forEach((file) => {
    const eventFunction = require(`./events/${file}`)
    if (eventFunction.disabled) return

    const event = eventFunction.event || file.split(".")[0]
    const emitter =
      (typeof eventFunction.emitter === "string" ? client[eventFunction.emitter] : eventFunction.emitter) ||
      client

    const once = eventFunction.once

    try {
      emitter[once ? "once" : "on"](event, (...args) => eventFunction.run(...args, client))
    } catch (error) {
      console.error(error.stack)
    }
  })
})

client.login(process.env.TOKEN)
