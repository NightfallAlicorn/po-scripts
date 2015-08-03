/*
Script Name: Nova's Client Script (Auto Updater)
File Name: NovaScriptAutoUpdater.js
File ID: 8f21e96707057df31c4c5119f325db118eaf7716
Author: Nightfall Alicorn

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
