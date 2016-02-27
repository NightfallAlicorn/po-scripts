/*global Bot, client, CONFIG, exports: true, isBotChannel, Memory, print, sendBotHtml, sendMessage, sys*/
/*jshint strict: false, shadow: true, evil: true, laxcomma: true*/
/*jslint sloppy: true, vars: true, evil: true, plusplus: true*/
function Plugin() {
    var responseMemory = new Memory("response");
    if (responseMemory.msgArray === undefined) {
        responseMemory.msgArray = [];
    }
    this.help = {
        name: "response",
        header: "Response",
        listArray: [
            "reponse [message]: Adds a message to respond when flashed.",
            "reponseoff [entry]: Removes response.",
            "responses: View response entries.",
            "responseclear: Clear all responses."
        ]
    };
    this.privateCommands = function (command, commandData, channelName, channelId) {
        if (command === "response") {
            if (commandData === "") {
                sendBotHtml("Please enter a message.");
                return;
            }
            if (responseMemory.msgArray > 10) {
                sendBotHtml("You already have 10 responses. Try removing some.");
                return;
            }
            sendBotHtml("<b>" + commandData.htmlEscape() + "</b> added to responses.");
            responseMemory.msgArray.push(commandData);
            responseMemory.save();
            return;
        }
        if (command === "responseoff") {
			var entry = parseInt(commandData, 10);
            if (commandData === "") {
				sendBotHtml("Please enter the entry number to remove.");
				return;
			}
			if (parseInt(commandData, 10) > -1 && entry < responseMemory.msgArray.length) {
				responseMemory.msgArray.splice(entry, 1);
				sendBotHtml("Response " + entry + " deleted.");
                responseMemory.save();
			} else {
				sendBotHtml("Entry out of range of the list or not an integer.");
			}
            return;
		}
        if (command === "responses") {
            var x, length = responseMemory.msgArray.length;
			if (length === 0) {
				sendBotHtml("No reponses.");
				return;
			}
            sendBotHtml("<b>*** Responses ***</b>");
			for (x = 0; x < length; x++) {
				sendBotHtml("<b>Entry " + x + ":</b> " + responseMemory.msgArray[x].htmlEscape());
			}
            return;
		}
        if (command === "responseclear") {
			responseMemory.msgArray = [];
			responseMemory.save();
			sendBotHtml("Responses cleared.");
			return;
		}
        return false;
    };
    this.beforeChannelMessage = function (fullMessage, channelId, isHtml) {
        if (isHtml) {
            return;
        }

        var channelName = client.channelName(channelId);

        if (!isBotChannel(channelName)) {
            return;
        }

        if (responseMemory.msgArray.length === 0) {
            return;
        }
        var srcMessage = fullMessage.substr(fullMessage.indexOf(":") + 2);
        if (srcMessage.toLowerCase() === client.ownName().toLowerCase()) {
            sendMessage(channelId, responseMemory.msgArray.random());
        }
        return;
    };
}
exports = new Plugin();
