/* eslint-disable semi */
const prefix = process.env.PREFIX;

const { MessageEmbed, Client } = require("discord.js");

const client = new Client();

module.exports = {
  name: "help",
  description: "Conoce mis comandos",
  admin: false,
  usage: "<nombre del comando>",
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      let embedMessage = new MessageEmbed()
        .setTitle(`${client.user.username} | Comandos`)
        .setDescription("Estos son todos mis comandos:")
        .addField(commands.map((command) => command.name).join(", "))
        .setFooter(
          `Envie: \`${prefix}help <nombre del comando>\` para obtener informacion de un comando especifico!`
        );
      data.push("Estos son todos mis comandos:");
      data.push(commands.map((command) => command.name).join(", "));
      data.push(
        `\nEnvie: \`${prefix}help <nombre del comando>\` para obtener informacion de un comando especifico!`
      );

      return message.author
        .send(embedMessage)
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply("Le he enviado un MD con todos mis comandos!");
        })
        .catch((error) => {
          console.error(
            `Could not send help DM to ${message.author.tag}.\n`,
            error
          );
          message.reply(
            "No pude enviarle un MD con mis comandos, tiene los MD desactivados?"
          );
        });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name);

    if (!command) {
      return message.reply("ese no es un comando valido!");
    }

    data.push(`**Nombre:** ${command.name}`);
    if (command.description)
      data.push(`**Descripcion:** ${command.description}`);
    if (command.usage)
      data.push(`**Uso:** ${prefix}${command.name} ${command.usage}`);

    message.channel.send(data, { split: true });
  },
};
