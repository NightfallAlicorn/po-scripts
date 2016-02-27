/*global client, exports: true, isBotChannel, Memory, print, sendBotHeader, sendBotHtml, sendMessage*/
/*jshint strict: false, shadow: true, evil: true*/
/*jslint sloppy: true, vars: true, evil: true, plusplus: true*/
function Plugin() {
    var memory = new Memory("response");
    if (memory.messageArray === undefined) {
        memory.messageArray = [];
    }
    
    this.help = {
        header: "Response",
        name: "response",
        privateArray: [
            "reponse [message]: Adds a message to respond when flashed.",
            "reponseoff [entry]: Removes response.",
            "responses: View response entries.",
            "responseclear: Clear all responses."
        ],
        publicArray: []
    };
    this.privateCommands = function (command, commandData, channelName, channelId) {
        if (command === "response") {
            if (commandData === "") {
                sendBotHtml("Please enter a message.");
                return;
            }
            if (memory.messageArray > 10) {
                sendBotHtml("You already have 10 responses. Try removing some.");
                return;
            }
            sendBotHtml("<b>" + commandData.htmlEscape() + "</b> added to responses.");
            memory.messageArray.push(commandData);
            memory.save();
            return;
        }
        if (command === "responseoff") {
			var entry = parseInt(commandData, 10);
            if (commandData === "") {
				sendBotHtml("Please enter the entry number to remove.");
				return;
			}
			if (parseInt(commandData, 10) > -1 && entry < memory.messageArray.length) {
				memory.messageArray.splice(entry, 1);
				sendBotHtml("Response " + entry + " deleted.");
                memory.save();
			} else {
				sendBotHtml("Entry out of range of the list or not an integer.");
			}
            return;
		}
        if (command === "responses") {
            var x, length = memory.messageArray.length;
			if (length === 0) {
				sendBotHtml("No reponses.");
				return;
			}
            sendBotHeader("Responses");
			for (x = 0; x < length; x++) {
				sendBotHtml("<b>Entry " + x + ":</b> " + memory.messageArray[x].htmlEscape());
			}
            return;
		}
        if (command === "responseclear") {
			memory.messageArray = [];
			memory.save();
			sendBotHtml("Responses cleared.");
			return;
		}
        return false;
    };
    this.beforeChannelMessage = function (fullMessage, channelId, isHtml) {
        if (isHtml) {
            return;
        }

        var channelName = client.channelName(channelId),
            srcMessage = fullMessage.substr(fullMessage.indexOf(":") + 2);
        if (!isBotChannel(channelName)) {
            return;
        }
        if (memory.messageArray.length === 0) {
            return;
        }
        if (srcMessage.toLowerCase() === client.ownName().toLowerCase()) {
            sendMessage(channelId, memory.messageArray.random());
        }
        return;
    };
}
exports = new Plugin();
