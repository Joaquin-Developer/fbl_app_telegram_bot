const BotTemplate = require("../template")


class MyBot extends BotTemplate {

}


if (require.main === module)
    new MyBot().main()
