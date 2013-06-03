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


//var script = document.createElement("script");
   // script.src = "http://localhost:801/external/safeSave.js"; //my internal link for development
//    script.src = "https://ae-yoda.atlassian.net/wiki/download/attachments/3604521/safeSave.js";

//document.getElementsByTagName("head")[0].appendChild(script);

/**
 * Add codemirror
 */

var scriptsLocal = ["http://localhost:801/external/safeSave.js"];


var scripts = ["https://raw.github.com/e3e6/SafeSave/master/safeSave.js",
  //             "http://localhost:801/external/codemirror.js",
 //              "http://localhost:801/external/codemirror-ui.js",

 //              "http://localhost:801/external/javascript.js"
//                              ,"http://localhost:801/external/init-mirror.js"
              ];
var csss = ["http://localhost:801/external/codemirror.css",
            "http://localhost:801/external/codemirror-ui.css"
           ]; 
/**
 * Inser script element to page
 */ 
function insertScriptSrc(scriptsList){
  var length = scriptsList.length;
  var element = null;
  for (var i = 0; i < length; i++) {
    element = scriptsList[i];
    debug(">> append: " + element);
    var script = document.createElement("script");
        script.src = element;

    document.getElementsByTagName("head")[0].appendChild(script);
  }
}
/**
 * 
 */
function insertCssSrc(scriptsList){
  var length = scriptsList.length;
  var element = null;
  for (var i = 0; i < length; i++) {
    element = scriptsList[i];
    debug(">> append: " + element);
    var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", element);
          
    document.getElementsByTagName("head")[0].appendChild(fileref);
  }
}

/**
 * Write to console if exist
 */
function debug(text){
  if(window.console){
    console.info(text);
  }
}

/**
 * Entry
 */
insertScriptSrc(scripts);
//insertScriptSrc(scriptsLocal);
//insertCssSrc(csss); 
