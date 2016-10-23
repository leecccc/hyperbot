
Bot = require "./Bot"

bot = new Bot
	port: process.env.PORT ? 5000
	discord_bot_token: process.env.BOT_TOKEN

bot.start()
