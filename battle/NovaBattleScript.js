/*global battle, print, sys*/
/*jshint strict: false, shadow: true, evil: true, laxcomma: true*/
/*jslint sloppy: true, vars: true, evil: true, plusplus: true*/
var ROOT = this;
var TEMP = {
    player: [
        {confused: 0, critical: 0, flinch: 0, frozen: 0, miss: 0, name: "", paralyzed: 0, slept: 0},
        {confused: 0, critical: 0, flinch: 0, frozen: 0, miss: 0, name: "", paralyzed: 0, slept: 0}
    ],
    tier: "",
    turn: 0
};
var SAVED_DATA_DIR = "NovaBattleScriptSavedData.json";
var SAVED_DATA = {
    tierRating: {}
};
var NEW_TIER_RATING = {win: 0, lose: 0, tie: 0, battle: 0, longestTurn: 0};
var PO_BATTLE_EVENT;

function init() {
    if (sys.isSafeScripts() === true) {
        sendBotMsg("Unable to load or save script data due to Safe Scripts being enabled.");
    }
    loadData();
    showCurrentTierRating();
    if (SAVED_DATA.tierRating[TEMP.tier] === undefined) {
        SAVED_DATA.tierRating[TEMP.tier] = deepCopyObject(NEW_TIER_RATING);
    }
    TEMP.player[battle.me].name = battle.data.team(battle.me).name;
    TEMP.player[battle.opp].name = battle.data.team(battle.opp).name;
    return;
}
function loadData() {
    if (sys.isSafeScripts() === true) {
        return;
    }
    sys.appendToFile(SAVED_DATA_DIR, "");
    if (sys.getFileContent(SAVED_DATA_DIR) === "") {
        saveData();
        sendBotMsg("Created battle save data for first time use.");
    } else {
        try {
            var loadedObjData = JSON.parse(sys.getFileContent(SAVED_DATA_DIR));
            fillObject(SAVED_DATA, loadedObjData);
            SAVED_DATA = loadedObjData;
        } catch (error) {
            sendBotMsg("Unknown error occurred. The saved data might be corrupted.");
            sendBotMsg("Debug information: " + error);
        }
    }
}
function saveData() {
    if (sys.isSafeScripts() === true) {
        return;
    }
    sys.writeToFile(SAVED_DATA_DIR, JSON.stringify(SAVED_DATA));
    return;
}
function fillObject(from, to) {
    for (var key in from) {
        if (from.hasOwnProperty(key)) {
            if (Object.prototype.toString.call(from[key]) === "[object Object]") {
                if (!to.hasOwnProperty(key)) {
                    to[key] = {};
                    sendBotMsg("Creating missing saved data object: " + key);
                }
                fillObject(from[key], to[key]);
            }
            else if (!to.hasOwnProperty(key)) {
                to[key] = from[key];
                sendBotMsg("Creating missing saved data perimeter: " + key);
            }
        }
    }
    return;
}
function sendBotMsg(message) {
    print("[bot]: " + message);
    return;
}
function sendChatMsg(message) {
    battle.battleMessage(battle.id, "[bot]: " + message);
    return;
}
function deepCopyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function commmandHandlerPrivate(commmand, commandData) {
    if (commmand === "eval") {
        eval(commandData);
        return;
    }
    if (commmand === "obj") {
        try {
            var x, objKeys = Object.keys(eval(commandData));
            sendBotMsg("Printing " + commandData + ".keys");
            for (x = 0; x < objKeys.length; x++) {
                print("//" + objKeys[x] + ": " + eval(commandData)[objKeys[x]]);
            }
            sendBotMsg("Done.");
        } catch (error) {
            print(error);
        }
        return;
    }
    if (commmand === "stat" || commmand === "stats") {
        showBattleStats();
        return;
    }
}
function pokesRemaining(team) { // battle.me / battle.opp
    var x, count = 0;
    for (x = 0; x < 6; x++) {
        if (battle.data.team(team).poke(x).isKoed() === false) {
            count++;
        }
    }
    return count;
}
function showBattleStats() {
    var x = TEMP.player[battle.me], y = TEMP.player[battle.opp];
    sendChatMsg(x.name + ": Confused " + x.confused + ", Criticals " + x.critical + ", Frozen " + x.frozen + ", Flinches " + x.flinch + ", Misses " + x.miss + ", Paralyzed " + x.paralyzed + ", Slept " + x.slept);
    sendChatMsg(y.name + ": Confused " + y.confused + ", Criticals " + y.critical + ", Frozen " + y.frozen + ", Flinches " + y.flinch + ", Misses " + y.miss + ", Paralyzed " + y.paralyzed + ", Slept " + y.slept);
    return;
}
function showCurrentTierRating() {
    if (SAVED_DATA.tierRating[TEMP.tier] === undefined) {
        sendChatMsg("No data exists for this tier.");
        return;
    }
    var x = SAVED_DATA.tierRating[TEMP.tier];
    sendChatMsg("Tier Stats: Wins " + x.win + ", Loses " + x.lose + ", Ties " + x.tie + ", Battle " + x.battle + ", Longest Turn " + x.longestTurn);
    return;
}
function updateBattleRecord(result, winner) {
    // result: 0 forfeit, 1 win/lose/timeout, 2 tie
    if ((result === 0 || result === 1) && winner === battle.me) {
        SAVED_DATA.tierRating[TEMP.tier].win++;
    } else if ((result === 0 || result === 1) && winner === battle.opp) {
        SAVED_DATA.tierRating[TEMP.tier].lose++;
    } else if (result === 2) {
        SAVED_DATA.tierRating[TEMP.tier].tie++;
    }
    SAVED_DATA.tierRating[TEMP.tier].battle++;
    if (TEMP.turn > SAVED_DATA.tierRating[TEMP.tier].longestTurn) {
        SAVED_DATA.tierRating[TEMP.tier].longestTurn = TEMP.turn;
    }
    return;
}

PO_BATTLE_EVENT = {
    onBattleEnd: function (result, winner) {
        updateBattleRecord(result, winner);
        showBattleStats();
        saveData();
        return;
    },
    onBeginTurn: function (turn) {
        TEMP.turn = turn;
        return;
    },
    onCriticalHit: function (spot) {
        if ([0, 2, 4].indexOf(spot) !== -1) {
            TEMP.player[0].critical++;
        }
        if ([1, 3, 5].indexOf(spot) !== -1) {
            TEMP.player[1].critical++;
        }
        return;
    },
    onFlinch: function (spot) {
        if ([0, 2, 4].indexOf(spot) !== -1) {
            TEMP.player[0].flinch++;
        }
        if ([1, 3, 5].indexOf(spot) !== -1) {
            TEMP.player[1].flinch++;
        }
        return;
    },
    onMiss: function (spot) {
        if ([0, 2, 4].indexOf(spot) !== -1) {
            TEMP.player[0].miss++;
        }
        if ([1, 3, 5].indexOf(spot) !== -1) {
            TEMP.player[1].miss++;
        }
        return;
    },
    onPlayerMessage: function (spot, message) {
        if (spot === battle.me) {
            var commmand = "", commandData = "";
            if (["-"].indexOf(message.charAt(0)) !== -1) {
                var split = message.indexOf(" ");
                if (split !== -1) {
                    commmand = message.substring(1, split).toLowerCase();
                    commandData = message.substr(split + 1);
                } else {
                    commmand = message.substr(1).toLowerCase();
                }
            }
            try {
                commmandHandlerPrivate(commmand, commandData);
            } catch (error) {
                sendBotMsg("commmandHandlerPrivate() error on line " + error.lineNumber + ", " + error.message);
            }
        }
        return;
    },
    onStatusDamage: function (spot, status) {
        if ([0, 2, 4].indexOf(spot) !== -1 && status === 6) {
            TEMP.player[0].confused++;
        }
        if ([1, 3, 5].indexOf(spot) !== -1 && status === 6) {
            TEMP.player[1].confused++;
        }
        return;
    },
    onStatusNotification: function (spot, status) {
        if ([0, 2, 4].indexOf(spot) !== -1 && status === 1) {
            TEMP.player[0].paralyzed++;
        }
        if ([1, 3, 5].indexOf(spot) !== -1 && status === 1) {
            TEMP.player[1].paralyzed++;
        }
        if ([0, 2, 4].indexOf(spot) !== -1 && status === 2) {
            TEMP.player[0].slept++;
        }
        if ([1, 3, 5].indexOf(spot) !== -1 && status === 2) {
            TEMP.player[1].slept++;
        }
        if ([0, 2, 4].indexOf(spot) !== -1 && status === 3) {
            TEMP.player[0].frozen++;
        }
        if ([1, 3, 5].indexOf(spot) !== -1 && status === 3) {
            TEMP.player[1].frozen++;
        }
        return;
    },
    onTierNotification: function (tier) {
        TEMP.tier = tier;
        try {
            init();
        } catch (error) {
            sendBotMsg("init() error on line " + error.lineNumber + ", " + error.message);
        }
        return;
    }
};
