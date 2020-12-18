const { countries } = require("countries-list")
const { capitalize } = require("../functions/string")

module.exports = {
  name: "register",
  description: "registrarse para el evento de frameworks de javascript",
  admin: false,
  md: true,
  async execute(message) {
    //el usuario manda md al bot y responde preguntas para inscripcion
    //fecha, id, username y tag, link cuenta github, nacionalidad, trabajo grupal, experiencia, tecnologias, framework

    let messageRepeatProcces =
      "Ha ingresado un dato erroneo, por favor ejecute el comando `!!register` para intentarlo de nuevo"
    //filtros para las respuestas
    const teamWorkFilter = (res) => {
      const response = res.content.toLowerCase()
      if (response == "si" || response == "no") return true

      return false
    }

    const countryFilter = (res) => {
      return countryArray.includes(capitalize(res.content))
    }

    const experienceFilter = (res) => {
      const response = res.content.charCodeAt(0)

      if (response >= 49 && response <= 53) {
        return true
      }

      return false
    }

    const githubUserLinkFilter = (res) => {
      const regex = /^(https?:\/\/)?(www\.)?github\.com\/(?!-)(?:[A-z0-9-]){1,39}[^-]\/?$/

      return regex.test(res.content)
    }

    //objeto usuario
    const date = new Date()
    const countryArray = Object.values(countries)

    const user = {
      date: date.toDateString(),
      id: message.author.id,
      username: message.author.username,
      tag: message.author.discriminator,
      country: undefined,
      technologies: undefined,
      experience: undefined,
      teamWork: undefined,
      githubAccount: undefined,
    }

    countryArray.forEach((country, i) => {
      countryArray[i] = country.name
    })

    //preguntas
    message.reply(
      `Hola ${message.author.username}. A continuación, necesito que respondas las siguientes preguntas con completa honestidad.`
    )

    let goOn = true

    await message.channel.send("¿De qué país eres?").then(async (msg) => {
      const collection = await msg.channel.awaitMessages(countryFilter, {
        max: 1,
        maxProcessed: 1,
        error: ["maxProcessed"],
      })

      if (collection.size == 0) {
        goOn = false
        return
      }

      const country = capitalize(collection.array()[0].content)
      user.country = country
      console.log(user)
    })

    if (!goOn) {
      message.reply(messageRepeatProcces)
      return
    }

    await message.channel
      .send(
        "¿Qué tecnologías manejas o estás aprendiendo? (Todas en el mismo mensaje y separadas por coma)"
      )
      .then(async (msg) => {
        const collection = await msg.channel.awaitMessages(() => true, {
          max: 1,
          maxProcessed: 1,
        })

        if (collection.size == 0) {
          goOn = false
          return
        }

        const technologies = collection.array()[0].content
        user.technologies = technologies
        console.log(user)
      })

    if (!goOn) {
      message.reply(messageRepeatProcces)
      return
    }

    await message.channel
      .send(
        "¿Cual es tu nivel de experiencia con la programacion? (Responda con el numero correspondiente a cada nivel)\n\n**1** - Apenas aprendiendo\n**2** - Novato\n**3** - Nivel Medio\n**4** - Nivel Avanzado\n**5** - Experto"
      )
      .then(async (msg) => {
        const collection = await msg.channel.awaitMessages(experienceFilter, {
          max: 1,
          maxProcessed: 1,
        })

        if (collection.size == 0) {
          goOn = false
          return
        }

        const experience = collection.array()[0].content
        user.experience = experience
        console.log(user)
      })

    console.log(goOn)
    if (!goOn) {
      console.log("me salgo")
      message.channel.send(messageRepeatProcces)
      return
    }

    await message.channel
      .send("¿Has trabajado en equipo antes? (Si/No)")
      .then(async (msg) => {
        const collection = await msg.channel.awaitMessages(teamWorkFilter, {
          max: 1,
          maxProcessed: 1,
        })

        if (collection.size == 0) {
          goOn = false
          return
        }

        const teamWork = collection.array()[0].content
        let teamWorkBool = false

        if (teamWork.toLowerCase() == "si") {
          teamWorkBool == true
        }

        user.teamWork = teamWorkBool
        console.log(user)
      })

    if (!goOn) {
      message.reply(messageRepeatProcces)
      return
    }

    await message.channel
      .send("¿Cuál es el link a su perfil de GitHub?")
      .then(async (msg) => {
        const collection = await msg.channel.awaitMessages(
          githubUserLinkFilter,
          { max: 1, maxProcessed: 1 }
        )

        if (collection.size == 0) {
          goOn = false
          return
        }

        const githubUserLink = collection.array()[0].content

        user.githubAccount = githubUserLink
        console.log(user)
      })

    if (!goOn) {
      message.reply(messageRepeatProcces)
      return
    }

    message.reply("Se ha inscrito al evento satisfactoriamente")
    //comprueba si el usuario ya esta registrado
    //temporalmente guarda los datos en un objeto
    //guarda los datos en un excel
  },
}
