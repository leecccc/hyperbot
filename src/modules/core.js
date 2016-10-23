
var BotModule = require("./../bot_module");
var pkg =       require("./../../package.json");
var git =       require("git-rev");

module.exports = class CoreModule extends BotModule {
	constructor() {
		super();
	}

	start(bot) {
		bot.commands.new("!version", {
			callback: (author, channel, args) => {
				git.short((hash) => {
					channel.sendMessage(`This bot is currently @ version ${ pkg.version }-${ hash }`)
				});
			}
		});
	}
}
