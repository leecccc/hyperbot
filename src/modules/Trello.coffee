
BotModule = require "./../BotModule"
request = require "request"
bodyParser = require "body-parser"

module.exports = class Trello extends BotModule
	constructor: ->
		@webhook_url = "https://api.trello.com/1/webhooks"
		@output_channel = null

	name: -> "Trello"

	start: (bot) ->
		# register commands
		# ================

		bot.commands.new "!hft",
			callback: (author, channel, args) =>
				if args.length is 2 and args[0] is "add"
					modelId = args[1]
					@addWebhook modelId
					@output_channel = channel
					channel.sendMessage ":ok_hand:"

		# register app routes
		# ===================

		bot.app.get "/webhooks/trello", (req, res) ->
			res.sendStatus(200)

		bot.app.post "/webhooks/trello", bodyParser.json(), (req, res) =>
			res.sendStatus(200)
			model = req.body.model
			action = req.body.action

			bot.log "trello", "recieved payload from #{ action.id } (type: #{ action.type })"

			if bot.online and @output_channel?
				link = model.url
				member = action.memberCreator
				board = action.data.board
				list = action.data.list
				card = action.data.card

				if action.type is "createCard"
					@output_channel.sendMessage("trello | #{ member.fullName } created a new card in **#{ board.name }**: #{ link }")

	addWebhook: (modelId) ->
		bot.log "trello", "attempting to register webhook for #{ modelId }"
		request.post @webhook_url,
			json: true
			body: {
				description: "test",
				callbackURL: "#{ process.env.HEROKU_URL }/webhooks/trello",
				idModel: modelId,
				key: process.env.TRELLO_APP_KEY,
				token: process.env.TRELLO_APP_TOKEN
			},
			(err, res, body) ->
				if err?
					console.log err
				else
					console.log body
