
BotModule =  require("./../bot_module");
request =    require("request");
bodyParser = require("body-parser");

module.exports = class Trello extends BotModule {
	constructor() {
		super();
		this.webhook_url = "https://api.trello.com/1/webhooks";
		this.output_channel = null;
	}

	name() { return "Trello"; }

	start(bot) {
		// register commands
		// ================

		bot.commands.new("!hft", {
			callback: (author, channel, args) => {
				if(args.length === 2 && args[0] === "add")
					var modelId = args[1];
					this.addWebhook(modelId);
					this.output_channel = channel;
					channel.sendMessage(":ok_hand:");
			}
		});


		// register app routes
		// ===================

		bot.app.get("/webhooks/trello", (req, res) => {
			res.sendStatus(200);
		});

		bot.app.post("/webhooks/trello", bodyParser.json(), (req, res) => {
			res.sendStatus(200);
			var model = req.body.model;
			var action = req.body.action;

			bot.log("trello", `recieved payload from ${ action.id } (type: ${ action.type })`);

			if (bot.online && this.output_channel != null) {
				var link = model.url;
				var member = action.memberCreator;
				var board = action.data.board;
				var list = action.data.list;
				var card = action.data.card;

				if (action.type == "createCard") {
					this.output_channel.sendMessage(`trello | ${ member.fullName } created a new card in **${ board.name }**: ${ link }`);
				}
			}
		});

		this.bot = bot;
	}

	addWebhook(modelId) {
		this.bot.log("trello", `attempting to register webhook for ${ modelId }`);
		request.post(this.webhook_url, {
			json: true,
			body: {
				description: "test",
				callbackURL: `${ process.env.HEROKU_URL }/webhooks/trello`,
				idModel: modelId,
				key: process.env.TRELLO_APP_KEY,
				token: process.env.TRELLO_APP_TOKEN
			},
		}, (err, res, body) => {
			if(err != null) {
				console.log(err);
			}
			else {
				console.log(body);
			}
		});
	}

}
