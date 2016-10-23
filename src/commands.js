
module.exports = class Commands {
	constructor(bot) {
		this.bot = bot;
		this.commandMap = new Map();
	}

	new(root, options) {
		this.commandMap.set(root, options);
		this.bot.log("new command added: " + root);
	}

	run(root, author, channel, args) {
		if(this.has(root)) {
			this.commandMap.get(root).callback(author, channel, args);
		}
	}

	has(root) { return this.commandMap.has(root); }
}
