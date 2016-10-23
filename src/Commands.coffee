
module.exports = class Commands
	constructor: (@bot) ->
		@commandMap = new Map()

	new: (root, options) ->
		@commandMap.set root, options
		@bot.log "new command added: " + root

	run: (root, author, channel, args) ->
		if @commandMap.has root
			@commandMap.get(root).callback(author, channel, args)

	has: (root) -> @commandMap.has root
