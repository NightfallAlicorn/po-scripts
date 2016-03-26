/*global Bot, client, CONFIG, exports: true, isBotChannel, sys*/
/*jshint strict: false, shadow: true, evil: true, laxcomma: true*/
/*jslint sloppy: true, vars: true, evil: true, plusplus: true*/
function Plugin() {
    var bot = new Bot("Voltorb", "#303030"),
        playerArray = [],
        isSignup = false,
        isStarted = false,
        isCooldown = false,
        playerVictum = "",
        channelPlaying = "",
        signupDelay = 30, // SECONDS UNTIL SIGNUP IS OVER
        explodeDelayMin = 15, // MINIMUM SECONDS UNTIL IT CAN POSSIBLY BLOW
        explodeDelayMax = 60, // MAXIMUM SECONDS TILL IT HAS TO BLOW
        antiPassDelay = 1500, // MILLISECONDS FOR HOW LONG TO HOLD THE VOLTORB OR ELSE IT EXPLODES PASSING TOO SOON
        timerSignup,
        timerExplode,
        timerCooldown,
        symbol = "";

    function end() {
        playerArray = [];
        isSignup = false;
        isStarted = false;
        isCooldown = false;
        playerVictum = "";
        channelPlaying = "";
        return;
    }
    function start(channelId) {
        if (playerArray.length < 2) {
            bot.sendBotMessage(channelId, "Game over! Not enough players have signed up!");
            end();
        } else {
            var potatoExplodeRng = sys.rand(explodeDelayMin, explodeDelayMax);
            playerVictum = playerArray.random();
            bot.sendBotMessage(channelId, "Players playing: " + playerArray.sort().join(", "));
            bot.sendBotMessage(channelId, playerVictum + " is holding the voltorb! Use " + symbol + "pass <username> to pass it. Use " + symbol + "view to see who's playing.");
            isStarted = true;
            timerExplode = sys.setTimer(function () {
                bot.sendBotMessage(channelId, "The voltorb exploded on " + playerVictum + "!");
                bot.sendMessage(channelId, "/ck " + playerVictum);
                end();
            }, potatoExplodeRng * 1000, false);
            isCooldown = true;
            timerCooldown = sys.setTimer(function () {
                isCooldown = false;
            }, antiPassDelay, false);
        }
        return;
    }

    this.help = {
        header: "Voltorb",
        name: "voltorb",
        privateArray: [],
        publicArray: ["voltorb", "join", "unjoin", "pass target", "view", "push target (owner only)", "endvoltorb"]
    };
    this.publicCommands = function (command, commandData, srcName, src, channelName, channelId) {
        if (!isBotChannel(channelName)) {
            return false;
        }

        symbol = CONFIG.publicCommandSymbol;
        if (command === "voltorb") {
            if (!isSignup && !isStarted) {
                channelPlaying = channelName;
                bot.sendBotMessage(channelId, "A new game of Voltorb has started! Type " + symbol + "join to join! Signups will be over in " + signupDelay + " seconds! Caution: Do not join if you are unprepared to be kicked from the channel.");
                isSignup = true;
                playerArray.add(srcName);
                bot.sendBotMessage(channelId, srcName + " joined the game!");
                timerSignup = sys.setTimer(function () {
                    isSignup = false;
                    start(channelId);
                }, signupDelay * 1000, false);
            } else if (isSignup && !isStarted) {
                if (channelName !== channelPlaying) {
                    bot.sendBotMessage(channelId, "A game is currently in signups in #" + channelPlaying + ".");
                } else {
                    bot.sendBotMessage(channelId, "Use " + symbol + "join to join before signups over.");
                }
            } else if (!isSignup && isStarted) {
                if (channelName !== channelPlaying) {
                    bot.sendBotMessage(channelId, "A game is already playing in #" + channelPlaying + ".");
                } else {
                    bot.sendBotMessage(channelId, "A game is already playing here.");
                }
            }
            return;
        }
        if (command === "join" && isSignup) {
            if (channelName !== channelPlaying) {
                return;
            }
            if (playerArray.contains(srcName.toLowerCase())) {
                bot.sendBotMessage(channelId, srcName + " has already joined!");
                return;
            }
            playerArray.add(srcName);
            bot.sendBotMessage(channelId, srcName + " joined the game!");
            return;
        }
        if (command === "unjoin" && isSignup) {
            if (channelName !== channelPlaying) {
                return;
            }
            if (playerArray.contains(srcName.toLowerCase())) {
                playerArray.remove(srcName);
                bot.sendBotMessage(channelId, srcName + " unjoined the game!");
                return;
            }
            bot.sendBotMessage(channelId, srcName + " isn't in the game!");
            return;
        }
        if (command === "pass" && isStarted && srcName.toLowerCase() === playerVictum) {
            if (channelName !== channelPlaying) {
                bot.sendBotMessage(channelId, "Don't cheat by passing the voltorb in another channel. >:I");
                return;
            }
            if (!playerArray.contains(commandData.toLowerCase())) {
                bot.sendBotMessage(channelId, "That user is not in the game.");
                return;
            }
            if (playerVictum === commandData.toLowerCase()) {
                bot.sendBotMessage(channelId, srcName + " mysteriously kept hold of the voltorb for some reason.");
                return;
            }
            if (isCooldown) {
                bot.sendBotMessage(channelId, "The voltorb exploded on " + playerVictum + " due to passing too soon.");
                bot.sendMessage(channelId, "/ck " + playerVictum);
                if (isStarted) {
                    sys.unsetTimer(timerExplode);
                }
                sys.unsetTimer(timerCooldown);
                end();
                return;
            }
            playerVictum = commandData.toLowerCase();
            bot.sendBotMessage(channelId, srcName + " passed the voltorb to " + playerVictum + ".");
            isCooldown = true;
            timerCooldown = sys.setTimer(function () {
                isCooldown = false;
            }, antiPassDelay, false);
        }
        if (command === "view" && isStarted) {
            bot.sendBotMessage(channelId, "Players in Voltorb game are: " + playerArray.join(", "));
            return;
        }

        if (srcName !== client.ownName()) {
            return false;
        }

        if (command === "push" && (isSignup || isStarted)) {
            if (client.ownName().toLowerCase() !== srcName.toLowerCase()) {
                return;
            }
            if (playerArray.contains(commandData.toLowerCase())) {
                bot.sendBotMessage(channelId, commandData.toLowerCase() + " is already in the game.");
                return;
            }
            playerArray.add(commandData);
            bot.sendBotMessage(channelId, commandData.toLowerCase() + " was pushed into the game.");
            return;
        }
        if (command === "endvoltorb" && (isSignup || isStarted)) {
            bot.sendBotMessage(channelId, "The game of Voltorb has ended!");
            if (isSignup) {
                sys.unsetTimer(timerSignup);
            }
            if (isStarted) {
                sys.unsetTimer(timerExplode);
            }
            if (isCooldown) {
                sys.unsetTimer(timerCooldown);
            }
            end();
            return;
        }
        return false;
    };
}
exports = new Plugin();
