/*
Pokemon Online Client Script Template v1.0
By Nightfall Alicorn
Edited by Silone

Note: This script is outdated. I've kept it for archive reasons
for code beginners. If you want to make more advance scripts. You
can get latest from Pokemon Online Forums or my GitHub page.

Everyone is free to use and edit this script, even take bits to make
your own scripts

This is an auto respond bot template for Pokemon Online client script plugin.

This version was posted by Silone from my based script, which doesn't
include Moogle's Client Scripts, but I've edited it to include an
on and off switch feature. Even with it off, it will still trigger for
you, except for others when you want it to.

"var vBotSwitch = true;" having this variable set to true will have the
bots on at the start for others, while false will have them disabled instead.

To turn the bots on for others, enter "-boton" and "-botoff" to have them off.
You can edit the command trigger word and message if you wish to your preference.

*/

// GLOBAL VARIABLES
// ******** ******** ********
var vBotSwitch = true;

var ObjPoClientScript;
ObjPoClientScript = ({
beforeChannelMessage: function (message, channel, html) {
// #### #### #### #### ####
// MY ADD SCRIPT - AUTO RESPOND MESSAGE
// #### #### #### #### ####
    // VARIABLES
    // ******** ******** ********
    var vMessage = message;
    var vChannel = client.channelName(channel);
    var vMyName = client.ownName();
    var vUserSent = vMessage.substring(0, vMessage.indexOf(':'));

    // EXTRACT MESSAGE BY TAKING OUT THE NAME
    if (vMessage.indexOf(':') >= 0) {vMessage = vMessage.substr(vMessage.indexOf(':') + 2); }
    // SET THE MESSAGE TEXT TO LOWERCASE
    vMessage = vMessage.toLowerCase();

    // CHANNELS ALLOWED FOR BOTS
    // ******** ******** ********
    var vBotChannelAllow = ["Alicorn Sandbox"];

	// CHECK CHANNELS ALLOWED
	if (vBotChannelAllow.indexOf(vChannel) !== -1) {
		// CHECK IF BOT IS ON FOR OTHERS OR IF YA SENT BOT TRIGGER
		if ( (vBotSwitch === true) || (vMyName === vUserSent) ) {
			// RESPOND: My Name
			if (vMessage === vMyName.toLowerCase()) {
				client.network().sendChanMessage(channel, "Respond to your name message here.");
				}
			
			// RESPOND TO: Pichu / Pikachu / Raichu
			if (["pichu", "pikachu", "raichu"].indexOf(vMessage) !== -1){
				var vName = "±Pikachu: ";
				var vMsg = [];
				vMsg[0] = "Thunderbolt!";
				vMsg[1] = "Volt Tackle!";
				vMsg[2] = "Iron Tail!";
				var vRNG = Math.floor((Math.random() * vMsg.length) + 0);
				client.network().sendChanMessage(channel, vName + vMsg[vRNG]);
				}
			}

		// SWITCHES
		if ((vMyName === vUserSent) && (vMessage === "-boton")) {
			vBotSwitch = true;
			client.network().sendChanMessage(channel, "±Bot: Bots turned on.");
			}
		if ( (vMyName === vUserSent) && (vMessage === "-botoff") ){
			vBotSwitch = false;
			client.network().sendChanMessage(channel, "±Bot: Bots turned off.");
			}

		}
// #### #### #### #### ####
// END OF ADD SCRIPT
// #### #### #### #### ####
}
});
