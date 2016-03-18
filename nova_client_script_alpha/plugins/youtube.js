/*global Bot, client, exports: true, isInChannel, isOffcialChannel, Memory, print, sendBotHtml, sys*/
/*jshint strict: false, shadow: true, evil: true*/
/*jslint sloppy: true, vars: true, evil: true, plusplus: true*/
function Plugin() {
    var youtubeBot = new Bot("Abra", "#4d004c");
    var memory = new Memory("youtube");
    if (memory.enabled === undefined) {
        memory.enabled = true;
    }
    if (memory.ignoreArray === undefined) {
        memory.ignoreArray = [];
    }

    this.afterChannelMessage = function (fullMessage, channelId, isHtml) {
        if (!isHtml) {
            return;
        }
        if (!memory.enabled) {
            return;
        }
        var srcMessage = fullMessage.substr(fullMessage.indexOf(":") + 2),
            channelName = client.channelName(channelId);
        if (isOffcialChannel(channelName) && client.auth(client.id(client.ownName())) === 0) {
            return;
        }
        if ((srcMessage.indexOf("youtube.com") > -1 && srcMessage.indexOf("watch?v=") > -1) || srcMessage.indexOf("youtu.be/") > -1) {
            var x, videoId;
            for (x = 0; x < memory.ignoreArray.length; x++) {
                if (isInChannel(client.id(memory.ignoreArray[x]), channelId)) {
                    youtubeBot.sendBotHtml(memory.ignoreArray[x] + " is in " + channelName + ". YouTube stats cancelled.", channelId);
                    return;
                }
            }
            // PC LINK
            if (srcMessage.indexOf("youtube.com") > -1) {
                videoId = srcMessage.substr(srcMessage.indexOf("watch?v=") + 8, 11).trim();
            }
            // MOBILE LINK
            if (srcMessage.indexOf("youtu.be/") > -1) {
                videoId = srcMessage.substr(srcMessage.indexOf("youtu.be/") + 9, 11).trim();
            }
            try {
                sys.webCall("http://crystal.moe/youtube?id=" + videoId, function (response) {
                    var x = JSON.parse(response).items[0],
                        title = x.snippet.localized.title,
                        uploader = x.snippet.channelTitle,
                        comments = x.statistics.commentCount,
                        duration = x.contentDetails.duration
                            .toLowerCase().substr(2).replace("h", "h ").replace("m", "m ").replace("s", "s"),
                        views = x.statistics.viewCount,
                        likes = parseInt(x.statistics.likeCount, 10),
                        dislikes = parseInt(x.statistics.dislikeCount, 10),
                        ratio = Math.round(likes / (likes + dislikes) * 100);
                    youtubeBot.sendBotMessage(channelId, "Title: " + title + ", Uploader: " + uploader + ", Comments: " + comments + ", Duration: " + duration + ", Views: " + views + ", Likes: " + ratio + "%");
                });
            } catch (error) {
                youtubeBot.sendBotMessage(channelId, "YouTube video data load failed.");
            }
        }
        return;
    };
    this.help = {
        header: "YouTube",
        name: "youtube",
        privateArray: [
            "youtube [on/off]: Enable/Disables YouTube stats.",
            "youtubeclear: Clear all ignores",
            "youtubeignore[off] [user]: Add/Remove user to ignore.",
            "youtubeignores: Shows users not to send bot message if in channel."
        ],
        publicArray: []
    };
    this.privateCommands = function (command, commandData, channelName, channelId) {
        if (command === "youtube") {
            if (commandData === "on") {
                memory.enabled = true;
                sendBotHtml("YouTube stats <b>on</b>");
                memory.save();
                return;
            }
            if (commandData === "off") {
                memory.enabled = false;
                sendBotHtml("YouTube stats <b>off</b>");
                memory.save();
                return;
            }
            sendBotHtml("YouTube stats currently: <b>" + (memory.enabled ? "on" : "off") + "</b>");
            return;
        }
        if (command === "youtubeclear") {
            sendBotHtml("All YouTube ignores cleared.");
            memory.ignoreArray = [];
            memory.save();
            return;
        }
        if (command === "youtubeignore") {
            if (!commandData) {
                sendBotHtml("Enter a user to YouTube ignore.");
                return;
            }
            if (memory.ignoreArray.add(commandData)) {
                sendBotHtml("<b>" + commandData + "</b> added to youtube ignore.");
            } else {
                sendBotHtml("<b>" + commandData + "</b> already youtube ignored.");
            }
            memory.save();
            return;
        }
        if (command === "youtubeignoreoff") {
            if (!commandData) {
                sendBotHtml("Enter a user to YouTube ignore off.");
                return;
            }
            if (memory.ignoreArray.remove(commandData)) {
                sendBotHtml("<b>" + commandData + "</b> removed from youtube ignore.");
            } else {
                sendBotHtml("<b>" + commandData + "</b> isn't currently youtube ignored.");
            }
            memory.save();
			return;
        }
        if (command === "youtubeignores") {
            if (memory.ignoreArray.length === 0) {
                sendBotHtml("No YouTube stat ignores.");
                return;
            }
            sendBotHtml("YouTube users ignored: " + memory.ignoreArray.sort().join(", "));
            return;
        }
        return false;
    };
}
exports = new Plugin();
