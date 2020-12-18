const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, ".env") })
const Discord = require("discord.js")

const client = new Discord.Client()
client.commands = new Discord.Collection()
const fs = require("fs")

const commandFiles = fs.readdirSync(path.join(__dirname, "./commands")).filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
  const command = require(path.join(__dirname, `./commands/${file}`))

  client.commands.set(command.name, command)
}

client.on("ready", () => {
  console.log("Bot listo!")
})

client.on("message", (message) => {})

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
