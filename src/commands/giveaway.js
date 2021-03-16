/* eslint-disable semi */
const { MessageEmbed } = require("discord.js");
const ms = require("ms");
module.exports = {
  name: "giveaway",
  description: "Crea un sorteo sencillo",
  usage: "<tiempo> <canal> <premio>",
  category: "fun",
  run: async (bot, message, args) => {
    if (!args[0]) return message.channel.send("Debes especificar un tiempo");
    if (
      !args[0].endsWith("d") &&
      !args[0].endsWith("h") &&
      !args[0].endsWith("m")
    )
      return message.channel.send("Formato incorrecto.");
    if (isNaN(args[0][0]))
      return message.channel.send("El dato ingresado no es un número.");
    let channel = message.mentions.channels.first();
    if (!channel) return message.channel.send("No tengo acceso a este canal.");
    let prize = args.slice(2).join(" ");
    if (!prize) return message.channel.send("Sin premio especificado!");
    message.channel.send(`*Sorteo creado en ${channel}*`);
    let Embed = new MessageEmbed()
      .setTitle(`${prize}!`)
      .setDescription(
        "Creado por: ${message.author}\nReacciona con ``🎉`` para participar"
      )
      .setTimestamp(Date.now() + ms(args[0]))
      .setColor("BLUE");
    let m = await channel.send(Embed);
    m.react("🎉");
    setTimeout(() => {
      if (m.reactions.cache.get("🎉").count <= 1) {
        message.channel.send(
          `Reacciones: ${m.reactions.cache.get("🎉").count}`
        );
        return message.channel.send(
          "No hubieron suficientes reacciones para realizar el sorteo."
        );
      }

      let winner = m.reactions.cache
        .get("🎉")
        .users.cache.filter((u) => !u.bot)
        .random();
      channel.send(
        `Ganador de **${prize}** es...\n ${winner} ¡¡Felicidades!!🥳🥳 `
      );
    }, ms(args[0]));
  },
};
