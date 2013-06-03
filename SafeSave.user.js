// ==UserScript==
// @name        Safe Save
// @namespace   e3e6.entellitrak
// @include     *.entellitrak.com/*/page.*.request.do*
// @include     *.entellitrak.com/*/cfg.scriptobject.*.request.do*
// @version     1.2
// ==/UserScript==


//TODO: Fix installing jQuery
//var jq = document.createElement("script");
//    jq.src = "http://localhost:801/external/jquery-1.9.1.min.js"; 
//document.getElementsByTagName("head")[0].appendChild(jq);


var script = document.createElement("script");
    //script.src = "http://localhost:801/external/safeSave.js"; //my internal link for development
    script.src = "https://ae-yoda.atlassian.net/wiki/download/attachments/3604521/safeSave.js";

document.getElementsByTagName("head")[0].appendChild(script);
