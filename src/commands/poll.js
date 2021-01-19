// Copyright (c) 2019 Saanu Reghunadh https://github.com/saanuregh/discord.js-poll-embed

const { MessageEmbed } = require("discord.js")

const defEmojiList = [
  "\u0031\u20E3",
  "\u0032\u20E3",
  "\u0033\u20E3",
  "\u0034\u20E3",
  "\u0035\u20E3",
  "\u0036\u20E3",
  "\u0037\u20E3",
  "\u0038\u20E3",
  "\u0039\u20E3",
  "\uD83D\uDD1F",
]

const pollEmbed = async (
  msg,
  title,
  question,
  options,
  emojiList = defEmojiList.slice(),
  forceEndPollEmoji = "\u2705"
) => {
  if (!msg && !msg.channel) return msg.reply("Channel is inaccessible.")
  if (!title) return msg.reply("No ha proporcionado un titulo")
  if (!options) return msg.reply("No ha proporcionado opciones")
  if (options.length < 2) return msg.reply("Por favor proporcione mas de una opcion")
  if (options.length > emojiList.length)
    return msg.reply(`Por favor de ${emojiList.length} o menos opciones`)

  let text = `*Para votar, reaccione con el emoji correspondiente.\nEl creador de la encuesta la podra terminar reaccionando a ${forceEndPollEmoji}.*\nLa pregunta es:\n${question}\n\n`
  const emojiInfo = {}
  for (const option of options) {
    const emoji = emojiList.splice(0, 1)
    emojiInfo[emoji] = { option: option, votes: 0 }
    text += `${emoji} : \`${option}\`\n\n`
  }
  const usedEmojis = Object.keys(emojiInfo)
  usedEmojis.push(forceEndPollEmoji)

  const poll = await msg.channel.send(embedBuilder(title, msg.author.tag).setDescription(text))
  for (const emoji of usedEmojis) await poll.react(emoji)

  const reactionCollector = poll.createReactionCollector(
    (reaction, user) => usedEmojis.includes(reaction.emoji.name) && !user.bot,
    {}
  )
  const voterInfo = new Map()
  reactionCollector.on("collect", (reaction, user) => {
    if (usedEmojis.includes(reaction.emoji.name)) {
      if (reaction.emoji.name === forceEndPollEmoji && msg.author.id === user.id)
        return reactionCollector.stop()
      if (!voterInfo.has(user.id)) voterInfo.set(user.id, { emoji: reaction.emoji.name })
      const votedEmoji = voterInfo.get(user.id).emoji
      if (votedEmoji !== reaction.emoji.name) {
        const lastVote = poll.reactions.resolve(votedEmoji)
        lastVote.count -= 1
        lastVote.users.remove(user.id)
        emojiInfo[votedEmoji].votes -= 1
        voterInfo.set(user.id, { emoji: reaction.emoji.name })
      }
      emojiInfo[reaction.emoji.name].votes += 1
    }
  })

  reactionCollector.on("dispose", (reaction, user) => {
    if (usedEmojis.includes(reaction.emoji.name)) {
      voterInfo.delete(user.id)
      emojiInfo[reaction.emoji.name].votes -= 1
    }
  })

  reactionCollector.on("end", () => {
    text = "*La encuesta acabo\n Los resultados son:*\n\n"
    for (const emoji in emojiInfo)
      text += `\`${emojiInfo[emoji].option}\` - \`${emojiInfo[emoji].votes}\`\n\n`
    poll.delete()
    msg.channel.send(embedBuilder(title, msg.author.tag).setDescription(text))
  })
}

const embedBuilder = (title, author) => {
  return new MessageEmbed().setTitle(`Poll - ${title}`).setFooter(`Poll created by ${author}`)
}

module.exports = {
  name: "poll",
  description: "Encuesta",
  admin: true,
  usage: "<titulo> / <pregunta> / <opcion1> / <opcion2> / etc",
  execute(message) {
    const args = message.content.split(" / ")
    const title = args[0].slice(5)
    const question = args[1]
    const options = args.slice(2)
    pollEmbed(message, title, question, options)
  },
}
