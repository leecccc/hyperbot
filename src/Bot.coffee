
discord = 		require "discord.js"
express = 		require "express"
path = 			require "path"
fs = 			require "fs"
EventEmitter = 	require "events"
bodyParser = 	require "body-parser"
chalk = require "chalk"

Commands = 		require "./Commands"

chalk.enabled = true

module_path = path.join(__dirname, "modules")
modules = []

fs.readdir module_path, (err, files) ->
	files.forEach (file) ->
		modules.push require("./modules/" + file)

module.exports = class Bot
	constructor: (@options) ->
		@online = false
		@events = new EventEmitter()
		@commands = new Commands(this)
		@app = express()

	start: ->
		@log "starting bot..."
		@app.listen @options.port, =>
			@log "bot binded to port #{ @options.port }"

			# load discord bot
			# ================

			@log "logging into discord..."
			@discord_client = new discord.Client()
			@discord_client.on "ready", =>
				@log "bot is online"
				@online = true
				@events.emit "ready"
				# load modules
				modules.forEach (module) => @loadModule(new module())


			# command listener
			@discord_client.on "message", (message) =>
				args = message.content.split(" ")
				if args.length > 0
					root = args[0]
					args.splice 0, 1 # remove first argument
					@commands.run root, message.author, message.channel, args

			@discord_client.login @options.discord_bot_token

	on: (event, callback) -> @events.on(event, callback)

	log: (prefix, message) ->
		if arguments.length is 1
			message = prefix
			prefix = "bot"

		console.log chalk.green(prefix) + " | " + message

	loadModule: (module) ->
		@log "loading module \"#{ module.name() }\""
		module.start(this)
