/*
Truth or Dare
By Nightfall Alicorn

*/

/*global client, print, sys*/
/*jshint strict: false, shadow: true, evil: true, laxcomma: true*/
/*jslint sloppy: true, vars: true, evil: true, plusplus: true*/

// TIMERS RESET
sys.unsetAllTimers();

// GLOBAL VARIABLES
// ******** ******** ********
var ROOT = this;
var OFFICIAL_CHANNELS_ARRAY = ["Blackjack", "Developer's Den", "Evolution Game", "Hangman", "Indigo Plateau", "Mafia", "Mafia Review", "Tohjo Falls", "Tohjo v2", "Tournaments", "TrivReview", "Trivia", "Victory Road", "Watch"];
var HAD_OTHER_BOT_ERROR = false;

var TRUTH_OR_DARE_PLAYERS = [];

var SETTINGS = {};
SETTINGS.botName = "ClientBot";
SETTINGS.commandSymbolOther = "?";
SETTINGS.commandSymbolOwner = "-";

var PO_CLIENT_SCRIPT;

// COMMAND HANDLER OWNER
function commandHandlerOwner(command, commandData, channelId, channelName) {
    // ADD BOTS YOU ONLY WANT TO USE HERE
    // EXAMPLE OWNER TEST COMMAND
    if (command === "test") {
        sendBotMsg("Owner test command detected with commandData: " + commandData);
        return
    }
    
} // END OF commandHandlerOwner

// COMMAND HANDLER OTHER
function commandHandlerOther(command, commandData, myName, userSentName, userSentMessage, userSentId, userSentAuth, userSentColor, channelId, channelName) {
    // ADD BOTS YOU WANT OTHERS TO USE HERE
    // EXAMPLE OTHER TEST COMMAND
    if (command === "join") {
        if (TRUTH_OR_DARE_PLAYERS.indexOf(userSentName.toLowerCase()) !== -1) {
            sendChanBotMsg(channelId, "Your already in the game. Use " + SETTINGS.commandSymbolOther + "unjoin to unjoin.");
            return;
        }
        TRUTH_OR_DARE_PLAYERS.push(userSentName.toLowerCase());
        sendChanBotMsg(channelId, userSentName + " joined the Truth or Dare game.");
        return;
    }
    if (command === "unjoin") {
        if (TRUTH_OR_DARE_PLAYERS.indexOf(userSentName.toLowerCase()) === -1) {
            sendChanBotMsg(channelId, "Your currently not in the game. Use " + SETTINGS.commandSymbolOther + "join to join.");
            return;
        }
        TRUTH_OR_DARE_PLAYERS.splice(TRUTH_OR_DARE_PLAYERS.indexOf(userSentName.toLowerCase), 1);
        sendChanBotMsg(channelId, userSentName + " has unjoined the Truth or Dare game.");
        return;
    }
    if (command === "dare") {
        if (TRUTH_OR_DARE_PLAYERS.length < 2) {
            sendChanBotMsg(channelId, "There are currently not enough players in the game. Needs at least 2 to play.");
            return;
        }
        if (TRUTH_OR_DARE_PLAYERS.indexOf(userSentName.toLowerCase()) === -1) {
            sendChanBotMsg(channelId, "Your not in the game. Use " + SETTINGS.commandSymbolOther + "join to join.");
            return;
        }
        var rngNameOne = TRUTH_OR_DARE_PLAYERS[toolRng(0, TRUTH_OR_DARE_PLAYERS.length - 1)];
        while (rngNameOne.toLowerCase() === userSentName.toLowerCase()) {
            var rngNameOne = TRUTH_OR_DARE_PLAYERS[toolRng(0, TRUTH_OR_DARE_PLAYERS.length - 1)];
        }
        sendChanBotMsg(channelId, userSentName + " dares " + rngNameOne);
        return;
    }
    if (command === "truth") {
        if (TRUTH_OR_DARE_PLAYERS.length < 2) {
            sendChanBotMsg(channelId, "There are currently not enough players in the game. Needs at least 2 to play.");
            return;
        }
        if (TRUTH_OR_DARE_PLAYERS.indexOf(userSentName.toLowerCase()) === -1) {
            sendChanBotMsg(channelId, "Your not in the game. Use " + SETTINGS.commandSymbolOther + "join to join.");
            return;
        }
        var rngNameOne = TRUTH_OR_DARE_PLAYERS[toolRng(0, TRUTH_OR_DARE_PLAYERS.length - 1)];
        while (rngNameOne.toLowerCase() === userSentName.toLowerCase()) {
            var rngNameOne = TRUTH_OR_DARE_PLAYERS[toolRng(0, TRUTH_OR_DARE_PLAYERS.length - 1)];
        }
        sendChanBotMsg(channelId, userSentName + " asks " + rngNameOne + " for truth.");
        return;
    }
    if (command === "random") {
        if (TRUTH_OR_DARE_PLAYERS.length < 2) {
            sendChanBotMsg(channelId, "There are currently not enough players in the game. Needs at least 2 to play.");
            return;
        }
        if (TRUTH_OR_DARE_PLAYERS.indexOf(userSentName.toLowerCase()) === -1) {
            sendChanBotMsg(channelId, "Your not in the game. Use " + SETTINGS.commandSymbolOther + "join to join.");
            return;
        }
        var rngNameOne = TRUTH_OR_DARE_PLAYERS[toolRng(0, TRUTH_OR_DARE_PLAYERS.length - 1)];
        while (rngNameOne.toLowerCase() === userSentName.toLowerCase()) {
            var rngNameOne = TRUTH_OR_DARE_PLAYERS[toolRng(0, TRUTH_OR_DARE_PLAYERS.length - 1)];
        }
        var rngTruthOrDare = toolRng(0, 1);
        if (rngTruthOrDare === 0) {
            sendChanBotMsg(channelId, userSentName + " asks " + rngNameOne + " for truth.");
            return;
        }
        if (rngTruthOrDare === 1) {
            sendChanBotMsg(channelId, userSentName + " asks " + rngNameOne + " for dare.");
            return;
        }
    }
    if (command === "end" || command === "endgame") {
        if (TRUTH_OR_DARE_PLAYERS.length < 1) {
            sendChanBotMsg(channelId, "No game in progress.");
            return;
        }
        if (myName !== userSentName) {
            sendChanBotMsg(channelId, "Only bot owner can use this command.");
            return;
        }
        TRUTH_OR_DARE_PLAYERS = [];
        sendChanBotMsg(channelId, "Game ended.")
        return;
    }
    if (command === "player" || command === "players") {
        if (TRUTH_OR_DARE_PLAYERS.length < 1) {
            sendChanBotMsg(channelId, "No players in the game.");
            return;
        }
        sendChanMsg(channelId, "/me ++" + SETTINGS.botName + ": Players in Truth or Dare are: " + TRUTH_OR_DARE_PLAYERS.join(", "));
        return;
    }
    if (command === "help") {
        var x;
        var commandsString = "";
        var helpArray = [
            "join"
            ,"unjoin"
            ,"dare"
            ,"truth"
            ,"random"
            ,"player(s)"
            ,"end(game)"
            ,"help"
        ];
        for (x = 0; x < helpArray.length; x++) {
            commandsString += SETTINGS.commandSymbolOther + helpArray[x] + " ";
        }
        sendChanBotMsg(channelId, "Truth or Dare Commands: " + commandsString);
        return;
    }
    
} // END OF commandHandlerOther

function print(message, channelId) {
    if (channelId === undefined) {
        channelId = client.currentChannel();
    }
    client.printChannelMessage(message, channelId, false);
    return;
}
// PRINT HTML
function printHtml(message, channelId) {
    if (channelId === undefined) {
        channelId = client.currentChannel();
    }
    client.printChannelMessage(message, channelId, true);
}
// SEND CHANNEL MESSAGE
function sendChanMsg(channelId, message) {
    client.network().sendChanMessage(channelId, message);
    return;
}
// SEND CHANNEL BOT MESSAGE
function sendChanBotMsg(channelId, message) {
    client.network().sendChanMessage(channelId, "++" + SETTINGS.botName + ": " + message);
    return;
}
// SEND BOT MESSAGE
function sendBotMsg(message, channelId) {
    if (channelId === undefined) {
        channelId = client.currentChannel();
    }
    client.printChannelMessage("++" + SETTINGS.botName + ": " + message, channelId, false);
    return;
}
// SEND BOT HTML MESSAGE
function sendBotHtmlMsg(message, channelId) {
    if (channelId === undefined) {
        channelId = client.currentChannel();
    }
    client.printChannelMessage("<font color='" + SETTINGS.botColor + "'><timestamp/><b>" + "++" + SETTINGS.botName + ":</font></b> " + message, channelId, true);
    return;
}

// TOOL - RANDOM NUMBER GENERATOR
function toolRng(minNumber, maxNumber) {
    return Math.floor(Math.random() * (1 + parseInt(maxNumber, 10) - parseInt(minNumber, 10))) + parseInt(minNumber, 10);
}

// TOOL - RETURN CHANNEL PLAYER NAME LIST ARRAY
// ******** ******** ********
function toolChannelPlayerNamesArray(channelId) {
    var x,
        channelPlayerId = client.channel(parseInt(channelId, 10)).players(),
        channelPlayerNameArray = [];
    for (x = 0; x < channelPlayerId.length; x++) {
        channelPlayerNameArray[x] = client.name(channelPlayerId[x]);
    }
    return channelPlayerNameArray;
}

// INITIZE NOTIFATION
sendBotMsg("Use ?help for commands.");

PO_CLIENT_SCRIPT = ({
    beforeChannelMessage: function (fullMessage, channelId, html) {
        // TEMP VARIABLES
        // ******** ******** ********
        var myName = client.ownName();
        var userSentName = fullMessage.substring(0, fullMessage.indexOf(':'));
        var userSentMessage = fullMessage.substr(fullMessage.indexOf(':') + 2);
        var userSentId = client.id(fullMessage.substring(0, fullMessage.indexOf(':')));
        var userSentAuth = client.auth(client.id(fullMessage.substring(0, fullMessage.indexOf(':'))));
        var userSentColor = client.color(client.id(fullMessage.substring(0, fullMessage.indexOf(':'))));
        var channelName = client.channelName(channelId);
        // COMMAND + COMMAND DATA SETUP
        // ******** ******** ********
        var command = "", commandData = "";
        if (SETTINGS.commandSymbolOther.indexOf(userSentMessage.charAt(0)) !== -1) {
            var split = userSentMessage.indexOf(" ");
            if (split !== -1) {
                command = userSentMessage.substring(1, split).toLowerCase();
                commandData = userSentMessage.substr(split + 1);
            } else {
                command = userSentMessage.substr(1).toLowerCase();
            }
        }
        // CALL OTHER COMMAND HANDLER
        // ******** ******** ********
        try {
            commandHandlerOther(command, commandData, myName, userSentName, userSentMessage, userSentId, userSentAuth, userSentColor, channelId, channelName);
        } catch (error) {
            if (HAD_OTHER_BOT_ERROR === false) {
                HAD_OTHER_BOT_ERROR = true;
                // ALERT NON-BOT OWNER ON ERROR BEEN REPORTED
                if (client.ownName() !== userSentName) {
                    sendChanBotMsg(channelId, "Script error occurred. The bot owner been alerted about it.");
                }
                sendBotMsg("commandHandlerOther error on line " + error.lineNumber + ", " + error.message + ", to prevent client crashes only one error will be given");
            }
        }
    }, // END OF beforeChannelMessage
    beforeSendMessage: function (sentMessage, channelId) {
        // COMMAND + COMMAND DATA SETUP
        // ******** ******** ********
        var command = "", commandData = "";
        if (SETTINGS.commandSymbolOwner === sentMessage.substring(0, SETTINGS.commandSymbolOwner.length)) {
            var split = sentMessage.indexOf(" ");
            if (split !== -1) {
                command = sentMessage.substring(SETTINGS.commandSymbolOwner.length, split).toLowerCase();
                commandData = sentMessage.substr(split + 1);
            } else {
                command = sentMessage.substr(SETTINGS.commandSymbolOwner.length).toLowerCase();
            }
        }
        // PREVENT OWNER COMMANDS BEING SEEN, EVEN TYPO ONES
        // ******** ******** ********
        if (command.length > 0) {
            sys.stopEvent();
        }
        // CALL OWNER COMMAND HANDLER
        // ******** ******** ********
        try {
            commandHandlerOwner(command, commandData, channelId, client.channelName(channelId));
        } catch (error) {
            sendBotMsg("commandHandlerOwner error on line " + error.lineNumber + ", " + error.message);
        }
    } // END OF beforeSendMessage
});
