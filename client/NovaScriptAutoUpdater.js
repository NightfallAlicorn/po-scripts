/*
NovaScript (Auto Updater)
By Nightfall Alicorn

*/

/*global client, print, sys*/
/*jshint strict: false, shadow: true, evil: true, laxcomma: true*/
/*jslint sloppy: true, vars: true, evil: true, plusplus: true*/

var RAW_LINK = "https://raw.githubusercontent.com/NightfallAlicorn/po-scripts/master/client/NovaScript.js";
var PO_CLIENT_SCRIPT;
PO_CLIENT_SCRIPT = ({
    stepEvent: function () {
        sys.changeScript(String(sys.synchronousWebCall(RAW_LINK)), false);
    }
});
