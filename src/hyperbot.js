
discord =      require("discord.js");
express =      require("express");
path =         require("path");
fs =           require("fs");
EventEmitter = require("events");
bodyParser =   require("body-parser");
chalk =        require("chalk");

Commands =     require("./commands");

chalk.enabled = true;

var module_path = path.join(__dirname, "modules");
var modules = [];

fs.readdir(module_path, (err, files) => {
	files.forEach((file) => {
		modules.push(require("./modules/" + file));
	});
});

module.exports = class Bot {
	constructor(options) {
		this.options = options;
		this.online = false;
		this.events = new EventEmitter();
		this.commands = new Commands(this);
		this.app = express();
	}

	start() {
		this.log("starting bot...");
		this.app.listen(this.options.port, () => {
			this.log(`bot binded to port ${ this.options.port }`);

			// load discord bot
		 	// ================

			this.log("logging into discord...");
			this.discord_client = new discord.Client();
			this.discord_client.on("ready", () => {
				this.log("bot is online");
				this.online = true;
				this.events.emit("ready");
				modules.forEach((module) => { this.loadModule(new module()); });
			});

			// command listener

			this.discord_client.on("message", (message) => {
				var args = message.content.split(" ");
				if (args.length > 0) {
					var root = args[0];
					args.splice(0, 1); // remove first argument
					this.commands.run(root, message.author, message.channel, args);
				}
			});

			this.discord_client.login(this.options.discord_bot_token);
		});
	}

	on(event, callback) {
		this.events.on(event, callback);
	}

	log(prefix, message) {
		if(arguments.length == 1) {
			message = prefix;
			prefix = "bot";
		}
		console.log(chalk.green(prefix) + " | " + message);
	}

	loadModule(module) {
		this.log(`loading module \"${ module.name() }\"`);
		module.start(this);
	}
}
