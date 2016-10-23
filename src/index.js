
var HyperBot = require("./hyperbot");

var bot = new HyperBot({
	port: process.env.PORT || 5000,
	discord_bot_token: process.env.BOT_TOKEN
});

bot.start();
