/*
Battle Notification Script v1.01
By Nightfall Alicorn

- Introduction -
    This is a small script that sends an alert notification in the
    taskbar when you do not have the battle window selected. It alerts
    when they make a move and when they send a message. Text art examples
    below.
    
    OPPORENT MADE A MOVE ALERT:
    
     ====================================
    = @ Battle                         X =
    = Turn: 5                            =
    = Time: 300 / 300 seconds            =
    = Nightfall Alicorn made their move. =
     ====================================
                                    = =
                                      =
    
    OPPORENT SENT A MESSAGE ALERT:
    
     ====================================
    = @ Battle                         X =
    = Turn: 5                            =
    = Time: 300 / 300 seconds            =
    = Nightfall Alicorn sent a message.  =
     ====================================
                                    = =
                                      =
                                      
- Installing -
    1. Copy all this text.
    2. On Pokemon Online, go to "Plugins" and "Plugin Manager".
    3. Check the check box for "Script Window" and click "OK".
    4. Go to "Plugins" again and this time "Script Window".
    5. Paste the code in the "Battle scripts" text window.
    6. To avoid problems, uncheck "Safe Scripts" and check "Show Warnings".
    7. Finally, click "OK".

- Editing -
    Most of the messages can be easily edited by changing the text between
    the double-quotes in the global variables section.
    
    If you want do more than you may want to study JavaScript.

- Notes -
    This script is JSHint & JSLint clean.
    
    I'm looking for a way to detect a boolean of "Flash when a move is done"
    check box, in battle. Since it no longer functions on latest version of
    Pokemon Online. It can be ideally used as a switch for this script.
    
*/

// GLOBAL VARS + JSHint & JSLint SETTINGS
/*global battle, client*/
/*jshint strict: false, shadow: true, evil: true, laxcomma: true*/
/*jslint sloppy: true, vars: true, evil: true, plusplus: true*/

// GLOBAL VARIABLES
var TURN = 0;

var PO_BATTLE_SCRIPT;
PO_BATTLE_SCRIPT = ({
    onBeginTurn: function (turn) {
        TURN = turn;
        var myTime = battle.data.team(battle.me).time;
        var opponentName = battle.data.team(1 - battle.me).name;
        var opponentTime = battle.data.team(1 - battle.me).time;
        if (battle.isActiveWindow === false) {
            client.trayMessage("Battle", "Turn: " + TURN + "\n" + "Time: " + myTime + " / " + opponentTime + " seconds\n" + opponentName + " made their move.");
        }
    }, // END OF onBeginTurn

    onPlayerMessage: function (spot, message) {
        var myTime = battle.data.team(battle.me).time;
        var opponentName = battle.data.team(1 - battle.me).name;
        var opponentTime = battle.data.team(1 - battle.me).time;
        if (battle.isActiveWindow === false) {
            client.trayMessage("Battle", "Turn: " + TURN + "\n" + "Time: " + myTime + " / " + opponentTime + " seconds\n" + opponentName + " sent a message.");
        }
    } // END OF onPlayerMessage

}); // END OF objPoBattleScript
