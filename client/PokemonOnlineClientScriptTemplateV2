/*
Pokemon Online Client Script Template v2.1
By Nightfall Alicorn

Everyone is free to use and edit this script, even take
bits to make your own scripts.
*/

// GLOBAL VARIABLES
// ******** ******** ********
	var vgCommandSymbol = "-";
	var vgBotName = "±Bot: ";
	var vgBotEnabled = true;
	var vgOfficialChannelArray = ["Blackjack", "Hangman", "Mafia", "Tohjo Falls", "Tournaments", "Trivia"];

// SCRIPT UPDATE NOTIFICATION
// ******** ******** ********
	print(vgBotName + "Client script updated!");
	print(vgBotName + "Use -help / -commands for list of commands!");

// PO SCRIPT
// ******** ******** ********
var objPoScript;
objPoScript = ({
	beforeChannelMessage: function (message, channel, html) {
		// VARIABLES
		// ******** ******** ********
		var vMyName	= client.ownName();
		var vUserSentName = message.substring(0, message.indexOf(':'));
		var vUserSentMessage = message.substr(message.indexOf(':') + 2);
		var vUserSentId = client.id(message.substring(0, message.indexOf(':')));
		var vChannelName = client.channelName(channel);
		var vChannelId = channel;
		var vChannelCurrentlyViewingName = client.channelName(client.currentChannel());
		var vChannelCurrentlyViewingId = client.currentChannel();

		// COMMAND + COMMAND DATA SETUP
		// ******** ******** ********
		if (vgCommandSymbol === vUserSentMessage.charAt(0)) {
			var vCommand, vCommandData;
            var vSplit = vUserSentMessage.indexOf(' ');
            if (vSplit !== -1) {
                vCommand = vUserSentMessage.substring(1, vSplit).toLowerCase();
                vCommandData = vUserSentMessage.substr(vSplit + 1);
				}
            else {
                vCommand = vUserSentMessage.substr(1).toLowerCase();
				}
			}

		// OWNER ONLY COMMANDS
		// ******** ******** ********
		if (vUserSentName === vMyName) {
			// BOT SWITCH
			// ******** ******** ********
			if (vCommand === "bot") {
				// CHECK IF THERE WAS NO COMMAND DATA ADDED
				if (vCommandData === undefined) {
					// ALERT THAT BOT IS CURRENTLY ON
					if (vgBotEnabled === true) {
						client.network().sendChanMessage(channel, vgBotName + "Bots are currently enabled!");
						return;
						}
					// ALERT THAT BOT IS CURRENTLY OFF
					if (vgBotEnabled === false) {
						client.network().sendChanMessage(channel, vgBotName + "Bots are currently disabled!");
						return;
						}
					}
				// TURN THE BOT ON
				if (vCommandData === "on") {
					vgBotEnabled = true;
					client.network().sendChanMessage(channel, vgBotName + "Bots enabled!");
					return;
					}
				// TURN THE BOT OFF
				if (vCommandData === "off") {
					vgBotEnabled = false;
					client.network().sendChanMessage(channel, vgBotName + "Bots disabled!");
					return;
					}
				}
			} // END OF OWNER ONLY COMMANDS

		//BOTS
		// ******** ******** ********
		if (vgBotEnabled === true) {
			if (vgOfficialChannelArray.indexOf(vChannelName) === -1) {
				// === PUT YOUR RESPOND BOTS BELOW HERE ===

				// EXAMPLE 1 - HELP COMMANDS
				if (vCommand === "help" || vCommand === "commands") {
					client.network().sendChanMessage(channel, vgBotName + "//Owner: -bot [on/off] //User: -help, -commands, -test, test, [owner's alt], -attack [target], -transform, pichu, pikachu, raichu, -pair");
					return;
					}

				// EXAMPLE 2 - TEST
				if (vCommand === "test" || vUserSentMessage.toLowerCase() === "test") {
					client.network().sendChanMessage(channel, vgBotName + "Connection successful, " + vUserSentName + "!");
					return;
					}

				// EXAMPLE 3 - AUTO REPOND WHEN SOMEONE SAYS YOUR NAME
				if (vUserSentMessage.toLowerCase() === vMyName.toLowerCase()) {
					client.network().sendChanMessage(channel, vgBotName + "Hello.");
					return;
					}

				// EXAMPLE 4 - ATTACK COMMAND
				if (vCommand === "attack") {
					if (vCommandData === undefined) {
						client.network().sendChanMessage(channel, vgBotName + "Please enter a target to attack!");
						return;
						}
					// SETUP MOVE ARRAY
					var vMoveNameArray = [];
					var vMoveNameDone = false;
					for (x = 0; vMoveNameDone === false; x++) {
						vMoveNameArray[x] = sys.move(x);
						if (vMoveNameArray[x] === undefined) {
							vMoveNameDone = true;
							// REMOVE FIRST ENTRY(No Move)
							vMoveNameArray.shift();
							// REMOVE LAST ENTRY undefined
							vMoveNameArray.pop();
							}
						}
					// GET RANDOM MOVE FROM THE MOVE ARRAY
					var vRngMove = vMoveNameArray[Math.floor((Math.random() * vMoveNameArray.length) + 0)];
					// GENERATE RANDOM DAMAGE
					var vRngDamage = Math.floor((Math.random() * 10000) + 0);
					// SEND MESSAGE
					client.network().sendChanMessage(channel, "/me " + vUserSentName + " attacked " + vCommandData + " with " + vRngMove + "! Dealing " + vRngDamage + " damage!");
					return;
					}

				// EXAMPLE 5 - TRANSFORM COMMAND
				if (vCommand === "transform") {
					// SETUP POKEMON NAME ARRAY
					var vPokeNameArray = [];
					var vPokeNameDone = false;
					for (x=0; vPokeNameDone == false; x++) {
						vPokeNameArray[x] = sys.pokemon(x);
						// SKIP FIRST MISSINGNO AND STOP AT LAST ONES
						if ( (x > 0) && (vPokeNameArray[x] == "Missingno") ) {
							vPokeNameDone = true;
							// REMOVE LAST ENTRY Missingno
							vPokeNameArray.pop();
							}
						}
					// GET RANDOM MOVE FROM THE GLOBAL MOVE ARRAY
					var vRngPoke = vPokeNameArray[Math.floor((Math.random()*vPokeNameArray.length)+0)];
					// SEND MESSAGE
					client.network().sendChanMessage(channel, "/me " + vUserSentName + " was magically transformed into " + vRngPoke + "!");
					return;
					}
					
				// EXAMPLE 6 - PIKACHU RANDOM ATTACK MESSAGE
				if (["pichu", "pikachu", "raichu"].indexOf(vUserSentMessage.toLowerCase()) !== -1) {
					var vBotName = "Pikachu";
					var vMessageArray = [
						"Iron Tail"
						,"Quick Attack"
						,"Thunderbolt"
						,"Volt Tackle"
						];
					var vRngArrayEntry = Math.floor((Math.random()*vMessageArray.length)+0);
					client.network().sendChanMessage(channel, "/me " + vBotName + " used " + vMessageArray[vRngArrayEntry] + "!");
					return;
					}
					
				// EXAMPLE 7 - PAIR
				// ******** ******** ********
				if (vCommand === "pair") {
					var vBotName = "±Fortune Teller: ";
					// GET ALL PLAYER ID IN CHANNEL + BUILD AND COLLECT NAME ARRAY
					var vChannelPlayerIdArray = client.channel(channel).players();						
					var vChannelPlayerNameArray = [];
					for (var x = 0; x < vChannelPlayerIdArray.length; x++) {
						vChannelPlayerNameArray[x] = client.name(vChannelPlayerIdArray[x]);
						}
					// NO vCommandData INPUT
					if (vCommandData === undefined) {
						// PICK 2 RANDOM PLAYERS IN CHANNEL
						if (vChannelPlayerNameArray.length >= 2) {
							var vRngName1 = vChannelPlayerNameArray[Math.floor((Math.random()*vChannelPlayerNameArray.length)+0)];
							var vRngName2 = vChannelPlayerNameArray[Math.floor((Math.random()*vChannelPlayerNameArray.length)+0)];
							// CHANGE vRngName2 IF RNG vRngName1 & vRngName2 ARE THE SAME
							while (vRngName1 == vRngName2) {
								var vRngName2 = vChannelPlayerName[Math.floor((Math.random()*vChannelPlayerName.length)+0)];
								}
							client.network().sendChanMessage(channel, vBotName + vRngName1 + " and " + vRngName2 + " are possible pair.");
							}
						else {
							client.network().sendChanMessage(channel, vBotName + "Your the only person here.");
							}
						}
					// vCommandData BEEN INPUT
					else {
						// PICK 1 RANDOM PLAYERS IN CHANNEL
						var vRngName2 = vChannelPlayerNameArray[Math.floor((Math.random()*vChannelPlayerNameArray.length)+0)];
						client.network().sendChanMessage(channel, vBotName + vCommandData + " and " + vRngName2 + " are possible pair.");
						}
						return;
					}
				
				// === PUT YOUR RESPOND BOTS ABOVE HERE ===
				}	// END OF BOTS
			}
			
		}	// END OF beforeChannelMessage
	});
