/*
Name: auto.js
Sha1: a9c9420b50bae59355ac0d8ec8cb0b602de64e8e
Author: Nightfall Alicorn
*/

/*global script: true, sys*/
/*jshint strict: false*/
/*jslint sloppy: true*/

script = {
    stepEvent: function () {
        sys.webCall("https://raw.githubusercontent.com/NightfallAlicorn/po-scripts/master/nova_client_script_beta/master.js", function (response) {
            sys.changeScript(response, true);
            return;
        });
        return;
    }
};
