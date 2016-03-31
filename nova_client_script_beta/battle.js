/*global battle, print, script: true, sys*/
/*jshint strict: false, shadow: true, evil: true, laxcomma: true*/
/*jslint sloppy: true, vars: true, evil: true, plusplus: true*/

function battleCommands(command, commandData) {
    if (command === "eval" || command === "evalp") {
        if (!commandData) {
            sendBotMsg("Enter a script value to print. Proceed with caution using this.");
            return;
        }
        try {
            sendBotMsg("Eval: " + commandData);
            var value = eval(commandData);
            if (command === "evalp") {
                sendBotMsg("Type: '" + (typeof value) + "'");
                sendBotMsg("Value: '" + value + "'");
            }
        } catch (error) {
            sendBotMsg(error);
        }
        return;
    }
    if (command === "obj" || command === "objp") {
        if (!commandData) {
            sendBotMsg("Enter an object to print. Example: global or sys.");
            return;
        }
        try {
            var x, objKeys = Object.keys(eval(commandData)), length = objKeys.length;
            sendBotMsg("Printing " + commandData + ".keys");
            for (x = 0; x < length; x++) {
                print("." + objKeys[x] + (command === "objp" ? ": " + eval(commandData)[objKeys[x]] : ""));
            }
            sendBotMsg("Done.");
        } catch (error) {
            sendBotMsg(error);
        }
        return;
    }
    return false;
}

function require(fileDir) {
    var exports = {};
    try {
        eval(sys.getFileContent(fileDir));
        return exports;
    } catch (error) {
        print("++Require: Error, unable to eval the file: " + fileDir + ", " + error.lineNumber + ", " + error.message);
        return {};
    }
}

function sendBattleMsg(message) {
    battle.battleMessage(battle.id, "[bot]: " + message);
    return;
}

function sendBotMsg(message) {
    print("[bot]: " + message);
    return;
}

// DECLARE CLASSES
var SCRIPT_DIR = "C:/Documents and Settings/Nova/My Documents/SD Card Storage/Pokemon Online Scripts/Nova Script Beta/";
var Bot = require(SCRIPT_DIR + "bot.js").Bot,
    MemoryManager = require(SCRIPT_DIR + "memory_manager.js").MemoryManager;

var CONSTANTS = {
    configFile: "Nova Script Beta/client_config.json",
    pluginDir: "Nova Script Beta/plugins/",
    pluginDataDir: "Nova Script Beta/plugin_data/"
};

var PLUGINS = {
    cache: {},
    call: function (event) {
        var x, length = arguments.length, newArg = [];
        for (x = 0; x < length; x++) {
            newArg[x] = arguments[x];
        }
        newArg.splice(0, 1);
        for (x in this.cache) {
            if (this.cache.hasOwnProperty(x)) {
                if (this.cache[x][event] !== undefined) {
                    try {
                        this.cache[x][event].apply(this, newArg);
                    } catch (error) {
                        delete this.cache[x];
                        print("Plugin: Error, " +  x + " disabled, " + error.lineNumber + ", " + error.message);
                    }
                }
            }
        }
        return false;
    },
    loadAll: function () {
        var x,
            fileNameArray = sys.filesForDirectory(CONSTANTS.pluginDir),
            length = fileNameArray.length,
            loadedArray = [];
        for (x = 0; x < length; x++) {
            this.cache[fileNameArray[x]] = require(CONSTANTS.pluginDir + fileNameArray[x]);
            loadedArray.push(fileNameArray[x]);
        }
        if (loadedArray.length > 0) {
            // print("++Plugin: " + loadedArray.join(", ") + " loaded.");
        }
        return;
    }
};
PLUGINS.loadAll();

script = {
    onBattleEnd: function (result, winner) {
        PLUGINS.call("onBattleEnd", result, winner);
        return;
    },
    onBeginTurn: function (turn) {
        PLUGINS.call("onBeginTurn", turn);
        return;
    },
    onCriticalHit: function (spot) {
        PLUGINS.call("onCriticalHit", spot);
        return;
    },
    onFlinch: function (spot) {
        PLUGINS.call("onFlinch", spot);
        return;
    },
    onMiss: function (spot) {
        PLUGINS.call("onMiss", spot);
        return;
    },
    onPlayerMessage: function (spot, message) {
        PLUGINS.call("onPlayerMessage", spot, message);
        if (spot === battle.me) {
            var command = "",
                commandData = "",
                split = message.indexOf(" ");
            if (["?"].indexOf(message.charAt(0)) !== -1) {
                if (split !== -1) {
                    command = message.substring(1, split).toLowerCase();
                    commandData = message.substr(split + 1);
                } else {
                    command = message.substr(1).toLowerCase();
                }
            }
            try {
                battleCommands(command, commandData);
                PLUGINS.call("battleCommands", command, commandData);
            } catch (error) {
                sendBotMsg("battleCommands() error on line " + error.lineNumber + ", " + error.message);
            }
        }
        return;
    },
    onStatusDamage: function (spot, status) {
        PLUGINS.call("onStatusDamage", spot, status);
        return;
    },
    onStatusNotification: function (spot, status) {
        PLUGINS.call("onStatusNotification", spot, status);
        return;
    },
    onTierNotification: function (tier) {
        PLUGINS.call("onTierNotification", tier);
        return;
    }
};
