/*
Urban Dictionary Client Script v1.00
Edited by Nightfall Alicorn
Original script provided by jenora

- Introduction -
    This is a script that prints entries from http://www.urbandictionary.com/
    
    Note the stuff it shows may not be appropriate. This is just the mini
    working version of the script without any of the defines being blocked.
    
    Example:
    Typing "-define pokemon online", without the double quotes, will print:
        (00:00:00) Nightfall Alicorn: ++Client Bot: (Downloading) "pokemon online" (0/0): Pokemon
        Online is an app that you do online pokemon battles with your own team and this also in
        includes a chat which you can create a channel were you and your friends can hang out Ex:
        Mahomie Roleplay that's a channel where I hang out of you can find me then I'll tell you
        more about this place btw my name is Spawn
    
- Installing -
    1. Copy all this text.
    2. On Pokemon Online, go to "Plugins" and "Plugin Manager".
    3. Check the check box for "Script Window" and click "OK".
    4. Go to "Plugins" again and this time "Script Window".
    5. Paste the code in the "Client scripts" text window.
    6. To avoid problems, uncheck "Safe Scripts" and check "Show Warnings".
    7. Finally, click "OK".
    
    If you are already logged on the server. You should see the message:
    (00:00:00) ++Client Bot: Scripts updated.
    (00:00:00) ++Client Bot: Commands:
    (00:00:00) ++Client Bot: // -setbot [off/on]
    (00:00:00) ++Client Bot: // -define [word]:[entry number]
    
    ... in the current channel you are in,
    to confirm the script has updated.
    
- Notes -
    For safety reasons, Urban Dictionary bot won't work in official channels
    by default.
*/

// GLOBAL VARIABLES
// ******** ******** ********
var vgBotName = "++Client Bot: ";
var vgCommandSymbol = "-";
var vgBotEnabled = true;
var vgOfficalChannelArray = ["Blackjack", "Developer's Den", "Evolution Game", "Hangman", "Indigo Plateau", "Mafia", "Mafia Review", "Tohjo Falls", "Tohjo v2", "Tournaments", "TrivReview", "Trivia", "Victory Road", "Watch"];

// DEFINE CACHE MEMORY
var vgDefineCacheWord, vgDefineCacheData;

// PRINT
// ******** ******** ********
function print(message) {
    // THIS OVERWRITES THE BUILT-IN PRINT FUNCTION TO ONLY DISPLAY MESSAGE IN CURRENT CHANNEL
    client.printChannelMessage(message, client.currentChannel(), false);
}

print(vgBotName + "Scripts updated.");
print(vgBotName + "Commands:");
print(vgBotName + "// -setbot [off/on]");
print(vgBotName + "// -define [word]:[entry number]");

var objPoScript;
objPoScript = ({
    beforeChannelMessage: function (message, channel, html) {
        // VARIABLES
        // ******** ******** ********
        var x,
            vMyName = client.ownName(),
            vUserSentName = message.substring(0, message.indexOf(':')),
            vUserSentMessage = message.substr(message.indexOf(':') + 2).toLowerCase(),
            vChannelName = client.channelName(channel);

        // COMMAND + COMMAND DATA SETUP
        // ******** ******** ********
        var vCommand = "", vCommandData = "", vSplit;
        if (vgCommandSymbol === vUserSentMessage.charAt(0)) {
            vSplit = vUserSentMessage.indexOf(" ");
            if (vSplit !== -1) {
                vCommand = vUserSentMessage.substring(1, vSplit).toLowerCase();
                vCommandData = vUserSentMessage.substr(vSplit + 1);
            } else {
                vCommand = vUserSentMessage.substr(1).toLowerCase();
            }
        }

        // BOT OWNER COMMANDS
        // ******** ******** ********
        if (vMyName === vUserSentName) {
            // AUTO RESPOND SWITCH
            // ******** ******** ********
            if (vCommand === "setbot") {
                if (vCommandData === "on") {
                    vgBotEnabled = true;
                    client.network().sendChanMessage(channel, vgBotName + "Bots enabled.");
                }
                if (vCommandData === "off") {
                    vgBotEnabled = false;
                    client.network().sendChanMessage(channel, vgBotName + "Bots disabled.");
                }
            }
        }

        // DEFINE (CODE PROVIDED BY JINORA + EDITED BY NIGHTFALL ALICORN)
        // ******** ******** ********
        if (vgBotEnabled === true) {
            if (vgOfficalChannelArray.indexOf(vChannelName) === -1) {
                if (vCommand === "define") {
                    // DECLAIRE COMMAND VARIABLES
                    var vSplit,
                        vDefineWord = "",
                        vDefineEntry = "0",
                        vDefineStatus = "",
                        vDefineData;
                    // -- CHECK IF NO COMMAND DATA EXIST AND ALERT USER --
                    if ((vCommandData === undefined) || (vCommandData === "")) {
                        client.network().sendChanMessage(channel, vgBotName + "Please enter a word to define after the command.");
                        return;
                    }
                    // CHECK FOR SECONDARY COMMAND DATA
                    if (vCommandData.indexOf(":") !== -1) {
                        // SPLIT
                        vSplit = vCommandData.split(":", 2);
                        vDefineWord = vSplit[0];
                        vDefineEntry = vSplit[1];

                        // MAKE SURE vDefineEntry IS AN INTEGER AND FLOOR
                        vDefineEntry = Math.floor(parseInt(vDefineEntry, 10));
                        if (vDefineEntry !== parseInt(vDefineEntry, 10)) {
                            vDefineEntry = 0;
                        }
                    } else {
                        vDefineWord = vCommandData;
                        vDefineEntry = 0;
                    }

                    // IF WORD IS STORED IN CACHED READ CURRENTLY DOWNLOAD ONE
                    if (vgDefineCacheWord === vDefineWord) {
                        vDefineData = vgDefineCacheData;
                        vDefineStatus = "(Cached)";
                    }
                    // IF WORD NOT CURRENTLY STORED IN CACHED DOWNLOAD IT
                    if (vgDefineCacheWord !== vDefineWord) {
                        // GET RESULT FROM URBAN DICTIONARY AND STORE DATA
                        vDefineData = JSON.parse(sys.synchronousWebCall("http://api.urbandictionary.com/v0/define?term=" + (encodeURIComponent(vDefineWord))));
                        vgDefineCacheWord = vDefineWord;
                        vgDefineCacheData = vDefineData;
                        vDefineStatus = "(Downloading)";
                    }

                    // CHECK IF DEFINITION DOESNT EXIST
                    if (vDefineData.result_type !== "exact") {
                        client.network().sendChanMessage(channel, vgBotName + "\"" + vDefineWord.toLowerCase() + "\"" + " is not defined!");
                        return;
                    }
                    // BUILD AND COUNT DEFINITIONS AVAILABLE
                    var vDefineStringArray = [],
                        vDefineLength = -1,
                        vCheckedLength = false;
                    for (x = 0; vCheckedLength === false; x++) {
                        try {
                            vDefineStringArray[x] = vDefineData.list[x].definition;
                            vDefineLength++;
                        } catch (error) {
                            vCheckedLength = true;
                        }
                    }

                    // DEFINE SELECTION RANGE CHECK
                    if (vDefineEntry > vDefineLength) {
                        vDefineEntry = vDefineLength;
                    }
                    if (vDefineEntry < 0) {
                        vDefineEntry = 0;
                    }

                    // OBTAIN STRING TO ALLOW LENGTH CHECK
                    var vStringLimit = 4900, // String Limit is 4900
                        vStringToPrint = vDefineStringArray[vDefineEntry];

                    // MESSAGE FORMAT
                    var vDefMessageWord = "\"" + vDefineWord.toLowerCase() + "\"",
                        vDefMessageInfo = vStringToPrint,
                        vDefMessageSelection = "(" + vDefineEntry + "/" + vDefineLength + ")",
                        vDefMessageLimitReached = "[String Limit of " + vStringLimit + " Reached]";

                    // STRING LIMIT CHECK
                    if (vStringToPrint.length <= vStringLimit) {
                        client.network().sendChanMessage(channel, vgBotName + " " + vDefineStatus + " " + vDefMessageWord + " " + vDefMessageSelection + ": " + vDefMessageInfo);
                    }
                    if (vStringToPrint.length > vStringLimit) {
                        client.network().sendChanMessage(channel, vgBotName + " " + vDefineStatus + " " + vDefMessageWord + " " + vDefMessageSelection + ": " + vDefMessageInfo.substring(0, vStringLimit) + " " + vDefMessageLimitReached);
                    }
                }
            }
        }

    } // END OF beforeChannelMessage
});
