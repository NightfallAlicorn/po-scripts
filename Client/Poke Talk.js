/*
Poke Talk Client Script v1.02
By Nightfall Alicorn

- Introduction -
    This is a fun script that sends messages with a random Pokemon speech in
    them, when you talk in Pokemon Online's channels. This is an idea I got from
    from seeing people roleplaying as Pokemon.
    
    Example:
    Saying "Hello." in a channel while using this Pikachu template script
    will say a random Pokemon message like "Pika" with your message between
    circler brackets automatically.
        (00:00:00) Nightfall Alicorn: Pika. (Hello.)
    
- Installing -
    1. Copy all this text.
    2. On Pokemon Online, go to "Plugins" and "Plugin Manager".
    3. Check the check box for "Script Window" and click "OK".
    4. Go to "Plugins" again and this time "Script Window".
    5. Paste the code in the "Client scripts" text window.
    6. To avoid problems, uncheck "Safe Scripts" and check "Show Warnings".
    7. Finally, click "OK".
    
    If you are already logged on the server. You should see the message:
    "±Poke Talk Bot: Scripts updated." in the current channel you are in,
    to confirm the script has updated.

    I've made Pikachu as the main Poke Talk speech as a template. But you can
    edit it to whatever Pokemon you want.
    
- Notes -
    For safety reasons, Poke Talk won't work in official channels
    by default.
    
- Setting Up Your Own Message -
    On/Off Switch:
    Just change the value for "var vgBotOn = true;" to true or false. Be
    careful not to touch the semicolon.

    Message:
    Under the "var vgPokeTalkSpeech = [" line, you should see
    Pikachu's lines. Simply edit the text between the double quotes
    to your liking. The first one doesn't need a comma at the start
    but the others do. You can edit the first one and delete the others
    if you want. But don't touch the lines with the square brackets in-between.
    Also make sure the double quotes have a start and close to them or 
    errors will happen.

    Adding More Command Symbols:
    You shouldn't really need to touch this since it's setup to
    ignore Pokemon Online Server's command symbols. I've added
    my bot command symbol and Alice's bot command symbol as well
    so you can use all the bots without worry. If you want or need
    to add more just make another line and add a comma with the
    single character symbol in-between double quotes.
        ,"symbol here"

    Changing Script Update Message
    Just simply edit the message between the double quotes.
        print("±Poke Talk Bot: Scripts updated.");
*/

// GLOBAL VARIABLES - SETTINGS
// ******** ******** ********
// Bot Switch
var vgBotOn = true;

// Poke Talk Messages
var vgPokeTalkSpeech = [
    "Pi.",
    "Pika.",
    "Pika pi.",
    "Chu.",
    "Pikachu."
];

// Command Symbols
var vgCommandSymbol = [
    "/", // Default Pokemon Online Server Command Symbol
    "!", // Default Pokemon Online Server Command Symbol
    ".", // Used for Connection Test on Pokemon Online
    "-", // Nightfall Alicorn's Bots Command Symbol
    "?" // Alice's Bots Command Symbol
];

// Script Update Alert Message
print("±Poke Talk Bot: Scripts updated.");

// IGNORE EVERYTHING BELOW HERE UNLESS YA WANNA MAKE ADVANACED CHANGES TO THE SCRIPT
// **** **** **** **** **** **** **** **** **** **** **** **** **** **** **** **** ****

// DO NOT TOUCH THIS
// PREVENTS POKE TALK WORKING IN POKEMON ONLINE OFFICIAL CHANNELS
var vgOfficalChannelArray = ["Blackjack", "Developer's Den", "Evolution Game", "Hangman", "Indigo Plateau", "Mafia", "Mafia Review", "Tohjo Falls", "Tohjo v2", "Tournaments", "TrivReview", "Trivia", "Victory Road", "Watch"];

var objPoScript;
objPoScript = ({
    beforeSendMessage: function (message, channel) {
        // VARIABLES
        // ******** ******** ********
        var vYourSentMessage = message,
            vChannelName = client.channelName(channel),
            vZero = 0;

        // POKE TALK
        // ******** ******** ********
        // CHECK IF YOU SENT MESSAGE IN AN OFFICIAL CHANNEL AND BLOCK POKE TALK IF YOU DID
        if (vgOfficalChannelArray.indexOf(vChannelName) === -1) {
            // CHECK FOR COMMAND SYMBOLS SO POKE TALK WONT FUNCTION BY ACCIDENT
            if (vgCommandSymbol.indexOf(vYourSentMessage.charAt(0)) === -1) {
                // STOP CURRENT MESSAGE BEING SENT
                sys.stopEvent();
                // GENERATE A RANDOM NUMBER ENTRY FOR POKE TALK MESSAGE VARIABLE ARRAY
                var vRng = Math.floor((Math.random() * vgPokeTalkSpeech.length) + vZero);
                // SEND POKE TALK MESSAGE WITH YOUR MESSAGE
                client.network().sendChanMessage(channel, vgPokeTalkSpeech[vRng] + " (" + vYourSentMessage + ")");
            }
        }
    }
});
