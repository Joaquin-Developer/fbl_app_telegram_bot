const { Telegraf } = require("telegraf")

const config = require("./config")
const utils = require("./utils")


class BotTemplate {
    constructor() {
        this.bot = new Telegraf(config.TELEGRAM_TOKEN)
        this.commands = ["helloworld", "example"]
        this.helpFileName = "help.txt"
    }

    static helpController(ctx) {
        try {
            ctx.reply(utils.readFile(this.helpFileName))
        } catch (error) {
            console.error(error)
            ctx.reply(":)")
        }
    }

    static async helloWorldController(ctx) {
        ctx.reply("Hello!")
    }

    static async hearsHandle(ctx) {
        ctx.reply("Use /help")
    }

    main() {
        this.bot.help(this.helpController)
        this.bot.command("helloworld", this.helloWorldController)
        this.bot.hears(/.*/, botEvents.hearsHandle)
        console.log("Running bot...")
        this.bot.launch()
    }
}


module.exports = BotTemplate
