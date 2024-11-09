const axios = require("axios")

const BotTemplate = require("../template")
const config = require("../config")
const utils = require("../utils")


class SA24Bot extends BotTemplate {
    constructor() {
        super()
        this.helpFileName = "sa24_help.txt"
    }

    static getRoundMessage(data, roundNumber) {
        let resTxt = `ROUND ${roundNumber}\n\n`

        for (const match of data) {
            resTxt += `${match.id}) `
            if (Boolean(match.played))
                resTxt += `${match.home_team_name} ${match.home_team_score} - ${match.away_team_score} ${match.away_team_name}`
            else
                resTxt += `${match.home_team_name} vs ${match.away_team_name}`
            resTxt += "\n\n"
        }
        return resTxt
    }

    async matches(ctx) {
        try {
            const data = await utils.fetch(`${config.FBL_APP_API}/sa_cup_24/get_matches_last_date`)
            const round = data[0].round
            ctx.reply(SA24Bot.getRoundMessage(data, round))
        } catch (error) {
            console.error(error)
            ctx.reply("Error al obtener los datos. Intente mas tarde.")
        }
    }
    
    async allMatches(ctx) {
        const data = await utils.fetch(`${config.FBL_APP_API}/sa_cup_24/get_all_matches`)
        let resTxt = ""
        let index = 0

        for (const match of data) {
            if (Boolean(match.played))
                resTxt += `${match.home_team_name} ${match.home_team_score} - ${match.away_team_score} ${match.away_team_name}`
            else
                resTxt += `${match.home_team_name} vs ${match.away_team_name}`
            resTxt += "\n\n"

            index++
            if (index > 15)
                break
        }

        ctx.reply(resTxt)

    }

    async result(ctx) {
        const message = ctx.message.text.split("/result ")[1]
        const id = parseInt(message.split(" ")[0])
        const homeTeamScore = parseInt(message.split(" ")[1].split("-")[0])
        const awayTeamScore = parseInt(message.split(" ")[1].split("-")[1])

        try {
            const url = `${config.FBL_APP_API}/sa_cup_24/update_match`
            const body = {
                "id": id,
                "home_team_score": homeTeamScore,
                "away_team_score": awayTeamScore
            }
            const resp = await utils.fetch(url, utils.TypeRequest.POST, body)
            console.log(resp)
            ctx.reply("¡Datos actualizados!")
        } catch (error) {
            console.error(error)
            ctx.reply("Se produjo un error inesperado. No se pudo actualizar la información.")
        }
    }

    async statistics(ctx) {
        // const lang = ctx.from.language_code
        const url = `${config.FBL_APP_API}/sa_cup_24/statistics_img?language=en`
        try {
            const response = await axios({
                method: "GET",
                url: url,
                responseType: "arraybuffer"
            });
            const buffer = Buffer.from(response.data, "binary")
            await ctx.replyWithPhoto({ source: buffer })
        } catch (error) {
            console.error(error)
            ctx.reply("Error al obtener las estadisticas")
        }

    }

     async round(ctx) {
        const roundNumber = parseInt(ctx.message.text.split("/round ")[1])
        try {
            const url = `${config.FBL_APP_API}/sa_cup_24/round/${roundNumber}`
            const data = await utils.fetch(url, utils.TypeRequest.GET)
            ctx.reply(SA24Bot.getRoundMessage(data, roundNumber))
        } catch (error) {
            console.error(error)
            ctx.reply("Error al obtener los datos. Intente mas tarde.")
        }
    }

    async team(ctx) {
        // TODO implement this!
    }

    main() {
        this.bot.help(this.helpController)
        this.bot.command("all", this.allMatches)
        this.bot.command("matches", this.matches)
        this.bot.command("result", this.result)
        this.bot.command("statistics", this.statistics)
        this.bot.command("round", this.round)
        // this.bot.command("team", this.team)
        this.bot.hears(/.*/, this.hearsHandle)
        console.log("Running bot...")
        this.bot.launch()
    }
}


if (require.main === module)
    new SA24Bot().main()
