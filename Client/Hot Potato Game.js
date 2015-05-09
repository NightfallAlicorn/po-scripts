/*
Hot Potato Game Client Script v1.01
Edited by Nightfall Alicorn
Remade by <anonymous>
Original script idea by Cirno

- Introduction -
    This is a fun game script that is basically pass the bomb.
    
    The game sets a random range timer 15 to 60 seconds by default. The
    player, who is currently holding the potato, has to pass it to another
    player in the channel that is in the game. Eventually someone will get
    /ck when the bomb explodes on them.
    
    Of course. People can't cheat with bots by instant passing to another user
    since the bomb will go off instantly.
    
    Commands:
    ******** ******** ********
    -potato / Starts the game's sign up process.
    -join / To join the game.
    -unjoin / Leave the game during sign ups.
    -pass [user] / Pass the potato to that user.
    -help / Display list of commands.
    
    Bot Auth Commands:
    ******** ******** ********
    -endpotato

- Installing -
    1. Copy all this text.
    2. On Pokemon Online, go to "Plugins" and "Plugin Manager".
    3. Check the check box for "Script Window" and click "OK".
    4. Go to "Plugins" again and this time "Script Window".
    5. Paste the code in the "Client scripts" text window.
    6. To avoid problems, uncheck "Safe Scripts" and check "Show Warnings".
    7. Finally, click "OK".
    
    If you are already logged on the server. You should see the message:
    (00:00:00) ++Client Bot: Script updated.
    (00:00:00) ++Client Bot: Type -help for list of commands for Hot Potato.

- Notes -
    For safety reasons, the Hot Potato Game bot won't work in official channels
    by default.
*/

// JSLINT GLOBAL PRE-DEFINE
/*global client, print, sys*/

// GLOBAL VARIABLES
// ******** ******** ********
var vgBotName = "++Client Bot: ";
var vgCommandSymbol = "?";
var vgBotMsgPrefix = "";
var vgOfficalChannelArray = ["Blackjack", "Developer's Den", "Evolution Game", "Hangman", "Indigo Plateau", "Mafia", "Mafia Review", "Tohjo Falls", "Tohjo v2", "Tournaments", "TrivReview", "Trivia", "Victory Road", "Watch"];

print(vgBotName + "Script updated.");
print(vgBotName + "Type " + vgCommandSymbol + "help for list of commands for Hot Potato.");

// RESET ALL TIMERS
// ******** ******** ********
sys.unsetAllTimers();

// POTATO GLOBALS
// ******** ******** ********
var vgPotatoPlayerArray = [],
    vgPotatoPlayerUncasedArray = [],
    vgPotatoSignup = false,
    vgPotatoStarted = false,
    vgPotatoCooldown = false,
    vgPotatoVictim,
    vgPotatoChannel,
    vgPotatoSignUpWait = 30, // SECONDS UNTIL SIGNUP IS OVER
    vgPotatoExplodeWaitMin = 15, // MINIMUM SECONDS UNTIL IT CAN POSSIBLY BLOW
    vgPotatoExplodeWaitMax = 60, // MAXIMUM SECONDS TILL IT HAS TO BLOW
    vgPotatoCooldownWait = 1500, // MILLISECONDS FOR HOW LONG TO HOLD THE POTATO OR ELSE IT EXPLODES PASSING TOO SOON
    vgPotatoAuthArray = [client.ownName().toLowerCase()],
    vgPotatoTimerSignUp,
    vgPotatoTimerExplode,
    vgPotatoTimerCooldown;

// POTATO FUNCTIONS
// ******** ******** ********
function funPotatoEnd() {
    "use strict";
    vgPotatoPlayerArray = [];
    vgPotatoPlayerUncasedArray = [];
    vgPotatoSignup = false;
    vgPotatoStarted = false;
    vgPotatoCooldown = false;
    vgPotatoVictim = undefined;
    vgPotatoChannel = undefined;
}
function funPotatoStart(channel, vZero) {
    "use strict";
    if (vgPotatoPlayerArray.length < 2) {
        client.network().sendChanMessage(channel, vgBotMsgPrefix + "Game over! Not enough players have signed up!");
        funPotatoEnd();
    } else {
        var vPlayerRng = Math.floor((Math.random() * vgPotatoPlayerUncasedArray.length) + vZero);
        var vPotatoExplodeLengthRng = Math.floor((Math.random() * vgPotatoExplodeWaitMax) + vgPotatoExplodeWaitMin);
        var vPlayersJoined = vgPotatoPlayerUncasedArray
                .toString()
                .replace(/\,/g, ", ");
        vgPotatoVictim = vgPotatoPlayerUncasedArray[vPlayerRng];
        client.network().sendChanMessage(channel, vgBotMsgPrefix + "Players playing: " + vPlayersJoined);
        client.network().sendChanMessage(channel, vgBotMsgPrefix + vgPotatoPlayerUncasedArray[vPlayerRng] + " is holding the potato! Use " + vgCommandSymbol + "pass <username> to pass the potato!");
        vgPotatoStarted = true;
        vgPotatoTimerExplode = sys.setTimer(function () {
            client.network().sendChanMessage(channel, vgBotMsgPrefix + "The potato exploded on " + vgPotatoVictim + "!");
            client.network().sendChanMessage(channel, "/ck " + vgPotatoVictim);
            funPotatoEnd();
        }, vPotatoExplodeLengthRng * 1000, false);
        vgPotatoCooldown = true;
        vgPotatoTimerCooldown = sys.setTimer(function () {
            vgPotatoCooldown = false;
        }, vgPotatoCooldownWait, false);
    }
    return;
}

var objPoScript;
objPoScript = ({
    beforeChannelMessage: function (message, channel, html) {
        "use strict";
        // VARIABLES
        // ******** ******** ********
        var x, y, z,
            vMyName = client.ownName(),
            vUserSentName = message.substring(0, message.indexOf(':')),
            vUserSentMessage = message.substr(message.indexOf(':') + 2),
            vUserSentId = client.id(message.substring(0, message.indexOf(':'))),
            vUserSentAuth = client.auth(client.id(message.substring(0, message.indexOf(':')))),
            vUserSentColor = client.color(client.id(message.substring(0, message.indexOf(':')))),
            vChannelName = client.channelName(channel),
            vChannelId = channel,
            vChannelCurrentlyViewingId = client.currentChannel(),
            vChannelCurrentlyViewingName = client.channelName(client.currentChannel()),
            vZero = 0;

        // PREVENT GAME WORKING IN OFFICIAL CHANNELS
        // ******** ******** ********
        if (vgOfficalChannelArray.indexOf(vChannelName) !== -1) {
            return;
        }

        // COMMAND + COMMAND DATA SETUP
        // ******** ******** ********
        var vCommand = "", vCommandData = "";
        if (vgCommandSymbol === vUserSentMessage.charAt(0)) {
        //    print("command symbol detected");
            var vSplit = vUserSentMessage.indexOf(" ");
            if (vSplit !== -1) {
                vCommand = vUserSentMessage.substring(1, vSplit).toLowerCase();
                vCommandData = vUserSentMessage.substr(vSplit + 1);
            } else {
                vCommand = vUserSentMessage.substr(1).toLowerCase();
            }
        }

        // START POTATO SIGNUPS
        // ******** ******** ********
        if ((vCommand === "potato") && (vgPotatoSignup === false) && (vgPotatoStarted === false)) {
            vgPotatoChannel = vChannelName;
            client.network().sendChanMessage(channel, vgBotMsgPrefix + "A new game of Hot Potato has started! Type " + vgCommandSymbol + "join to join! Signups will be over in " + vgPotatoSignUpWait + " seconds!");
            client.network().sendChanMessage(channel, vgBotMsgPrefix + "Caution: Do not join if you are unprepared to be kicked from the channel.");
            vgPotatoSignup = true;
            vgPotatoTimerSignUp = sys.setTimer(function () {
                vgPotatoSignup = false;
                funPotatoStart(channel, vZero);
            }, vgPotatoSignUpWait * 1000, false);
        } else if ((vCommand === "potato") && (vgPotatoSignup === true) && (vgPotatoStarted === false)) {
            if (vChannelName !== vgPotatoChannel) {
                client.network().sendChanMessage(channel, vgBotMsgPrefix + "A game is currently in signups in #" + vgPotatoChannel + "!");
            } else {
                client.network().sendChanMessage(channel, "/me A game is currently in signups here! Use " + vgCommandSymbol + "join to join!");
            }
        } else if ((vCommand === "potato") && (vgPotatoSignup === false) && (vgPotatoStarted === true)) {
            if (vChannelName !== vgPotatoChannel) {
                client.network().sendChanMessage(channel, vgBotMsgPrefix + "A game is already playing in #" + vgPotatoChannel + "!");
            } else {
                client.network().sendChanMessage(channel, vgBotMsgPrefix + "A game is already playing here!");
            }
        }

        // JOIN
        // ******** ******** ********
        if ((vCommand === "join") && (vgPotatoSignup === true)) {
            if (vChannelName !== vgPotatoChannel) { // PREVENTS JOINING GAME IN ANOTHER CHANNEL
                client.network().sendChanMessage(channel, vgBotMsgPrefix + "A game of Hot Potato is in signups in #" + vgPotatoChannel + "!");
                return;
            }
            if (vgPotatoPlayerArray.indexOf(vUserSentName.toLowerCase()) !== -1) { // PREVENT DUPLICATE ALTS JOINING
                client.network().sendChanMessage(channel, vgBotMsgPrefix + vUserSentName + " has already joined!");
                return;
            }
            vgPotatoPlayerArray.push(vUserSentName.toLowerCase());
            vgPotatoPlayerUncasedArray.push(vUserSentName);
            // vgPotatoPlayerUncasedArray IS SO ACTUAL NAME CAN BE PRINTED LATER
            client.network().sendChanMessage(channel, vgBotMsgPrefix + vUserSentName + " joined the game!");
            return;
        }

        // UNJOIN
        // ******** ******** ********
        if ((vCommand === "unjoin") && (vgPotatoSignup === true)) {
            if (vChannelName !== vgPotatoChannel) { // PREVENTS UNJOINING GAME IN ANOTHER CHANNEL
                // DO NOTHING
                return;
            }
            if (vgPotatoPlayerArray.indexOf(vUserSentName.toLowerCase()) !== -1) {
                vgPotatoPlayerArray.splice(vgPotatoPlayerArray.indexOf(vUserSentName.toLowerCase), 1);
                vgPotatoPlayerUncasedArray.splice(vgPotatoPlayerUncasedArray.indexOf(vUserSentName), 1);
                client.network().sendChanMessage(channel, vgBotMsgPrefix + vUserSentName + " unjoined the game!");
                return;
            }
            client.network().sendChanMessage(channel, vgBotMsgPrefix + vUserSentName + " isn't in the game!");
            return;
        }

        // PASS
        // ******** ******** ********
        if ((vCommand === "pass") && (vgPotatoStarted === true) && (vUserSentName.toLowerCase() === vgPotatoVictim.toLowerCase())) {
            if (vChannelName !== vgPotatoChannel) { // PREVENTS CHEATING BY PASSING IN ANOTEHR CHANNEL
                client.network().sendChanMessage(channel, vgBotMsgPrefix + "Don't cheat by passing in another channel!");
                return;
            }
            if (vgPotatoPlayerArray.indexOf(vCommandData.toLowerCase()) === -1) { // PREVENT PASSING TO A USER NOT IN THE GAME
                client.network().sendChanMessage(channel, vgBotMsgPrefix + "That user is not in the game!");
                return;
            }
            if (vgPotatoVictim.toLowerCase() === vCommandData.toLowerCase()) { // USER KEEPS HOLD OF THE POTATO
                client.network().sendChanMessage(channel, vgBotMsgPrefix + vUserSentName + " wanted to mysteriously keep hold of the potato for some reason!");
                return;
            }
            if (vgPotatoCooldown === true) { // EXPLODE THE POTATO EARLY, FOR PASSING TOO SOON
                client.network().sendChanMessage(channel, vgBotMsgPrefix + "The potato exploded on " + vgPotatoVictim + " due to passing too soon!");
                client.network().sendChanMessage(channel, "/ck " + vgPotatoVictim);
                if (vgPotatoStarted === true) {
                    sys.unsetTimer(vgPotatoTimerExplode);
                }
                sys.unsetTimer(vgPotatoTimerCooldown);
                funPotatoEnd();
                return;
            }
            vgPotatoVictim = vCommandData.toLowerCase();
            client.network().sendChanMessage(channel, vgBotMsgPrefix + vUserSentName + " passed the potato to " + vgPotatoVictim + "!");
            vgPotatoCooldown = true;
            vgPotatoTimerCooldown = sys.setTimer(function () {
                vgPotatoCooldown = false;
            }, vgPotatoCooldownWait, false);
        }

        // END POTATO
        // ******** ******** ********
        if ((vCommand === "endpotato") && (vgPotatoAuthArray.indexOf(vUserSentName.toLowerCase()) !== -1)) {
            if ((vgPotatoSignup === true) || (vgPotatoStarted === true)) {
                client.network().sendChanMessage(channel, vgBotMsgPrefix + "The game of Hot Potato has ended!");
                if (vgPotatoSignup === true) {
                    sys.unsetTimer(vgPotatoTimerSignUp);
                }
                if (vgPotatoStarted === true) {
                    sys.unsetTimer(vgPotatoTimerExplode);
                }
                if (vgPotatoCooldown === true) {
                    sys.unsetTimer(vgPotatoTimerCooldown);
                }
                funPotatoEnd();
                return;
            }
        }

        // HELP POTATO
        // ******** ******** ********
        if (vCommand === "help") {
            var vMessage = vgBotMsgPrefix + "Potato Commands: ";
            var vList = [
                "potato",
                "join",
                "pass [username]",
                "(Bot Auth)",
                "endpotato"
            ];
            for (x = 0; x < vList.length; x++) {
                vMessage = vMessage + vgCommandSymbol + vList[x] + " / ";
            }
            client.network().sendChanMessage(channel, vgBotName + vMessage);
            return;
        }

    } // END OF beforeChannelMessage
}); // END OF objPoScript
