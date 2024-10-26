const { Telegraf } = require("telegraf")

const config = require("./config")
const utils = require("./utils")


class BotTemplate {
    constructor() {
        this.bot = new Telegraf(config.DEFAULT_TELEGRAM_TOKEN)
        this.commands = ["helloworld", "example"]
        this.helpFileName = "help.txt"
    }

    helpController(ctx) {
        try {
            ctx.reply(utils.readFile(`files/${this.helpFileName}`))
        } catch (error) {
            console.error(error)
            ctx.reply("Internal error.")
        }
    }

    async helloWorldController(ctx) {
        ctx.reply("Hello!")
    }

    async hearsHandle(ctx) {
        const username = ctx.message.from.first_name
        ctx.reply(`Hola ${username}\nPara saber como usarme escribí /help`)
    }

    main() {
        this.bot.help(this.helpController)
        this.bot.command("helloworld", this.helloWorldController)
        this.bot.hears(/.*/, this.hearsHandle)
        console.log("Running bot...")
        this.bot.launch()
    }
}


module.exports = BotTemplate
