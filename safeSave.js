var openObjectLastModified = '';
var labelEl;
var _objectType;

/**
 * 
 */
function manualRequest(url, params, currentLastModif)
{
  var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
	    	debug('Response: '/* + xmlhttp.responseText*/);

	    	processSafeSave(xmlhttp.responseText, currentLastModif);

	    }else{
	    	//error
	    	debug('Error processing reponse');
	    }
	};
	
	

	//xmlhttp.open("POST", url + '?r='+Math.random(), true);
	//xmlhttp.send(params);
	xmlhttp.open("GET", url /*+ '?' + params*/ + '&r='+Math.random(), true);
	xmlhttp.send();
}

/**
 *
 */
function processSafeSave(response, currentLastModif){
	updateLabel('Checking...');
	var remoteDate = parseDateFromResponse(response);		
			
     debug('processHttpResponse | currentLastModif[' + openObjectLastModified + '] response[' + remoteDate + ']');

     if(openObjectLastModified === remoteDate)
     {
    	debug('.save');
    	updateLabel('Save...');
     	
     	//Entellitrak save
     	eval(getEntellitrakSaveFunctionName() + '()');

     	updateLabel('Saved.');
     }
     else if(remoteDate == null)
     {
		updateLabel('ERROR: Remote Date is [' + remoteDate + '] ' + getUnsafeButtonHTML());
     }
     else if(openObjectLastModified == null)
     {
		updateLabel('ERROR: Current Date [' + openObjectLastModified + '] ' + getUnsafeButtonHTML());
     }
     else
     {
     	updateLabel('ERROR: Save ABORTED. The Object was modified. <a href="#" target="_blank" style="border: 1px outset #FFFFFF;">Open Object</a>&nbsp;&nbsp;' 
     				+ getUnsafeButtonHTML());
     }
}


function getEntellitrakSaveFunctionName(){
	if(getObjectType() === OBJECT_TYPE_SCRIPT){
		return "saveScript";
	}else if(getObjectType() === OBJECT_TYPE_PAGE){
		return "save";
	}

}


function getUnsafeButtonHTML(){
	return'<a href="javascript:' 
			+ getEntellitrakSaveFunctionName() 
			+ '()" style="border: 1px outset #FFFFFF; background-color: #FFCCCC; ">Unsafe Save</a>'; 
}

/**
 * 
 * 
 */
function parseDateFromResponse(response){
	
	if(getObjectType() === OBJECT_TYPE_PAGE){
		var searchStr = '<span id="updatedOnSpan">';
		var str = response.substr(response.indexOf(searchStr) + searchStr.length, 100);
		
		var date = str.substring(str.indexOf('(')+1, str.indexOf(')'));
		
		return date;
	}else if(getObjectType() === OBJECT_TYPE_SCRIPT){
		var searchStr = '<label class="second" for="updatedBy">';

		var str = response.substr(response.indexOf(searchStr) + searchStr.length, 200);

		str = str.substr(str.indexOf('<td>'));
	
		date = str.substring(str.lastIndexOf('(') + 1, str.lastIndexOf(')'));

		return date; 
	}
}

/**
 * Define current Object Type: Script/Page/etc...
 */
function getObjectType(){
	if(_objectType == undefined){
		 
		if(document.getElementById('scriptObjectForm')){
			 _objectType = OBJECT_TYPE_SCRIPT;
		}else if(document.getElementById('pageForm')){
	 		 _objectType = OBJECT_TYPE_PAGE;
		}
	}

	return _objectType;
}

var OBJECT_TYPE_PAGE = 'page';
var OBJECT_TYPE_SCRIPT = 'script';

/**
 * Parse Last Modified date from current Page's page
 */
function parseLastModifFromPage(){
	var lastModifInp = document.getElementById('updatedOnSpan');

	  if(lastModifInp){
	  	var lastModif = lastModifInp.innerHTML;

	  		lastModif = lastModif.substring(lastModif.indexOf('(') + 1, lastModif.indexOf(')'));
	  }

	  return lastModif;
}

/**
 * Parse Last Modified date from current Script Object's page
 */
function parseLastModifFromScript(){
	var lastModifInp = document.getElementById('updatedOnSpan');

	dataTable = document.getElementsByClassName('data-entry');

	if(dataTable.length == 0){
		debug("parseLastModifFromScript | Can't find HTML element with last modified data. Table [data-entry] not found.");
		return -1;
	}


	updatedByTd = dataTable[0].getElementsByTagName('td');

	if(updatedByTd.length < 10){
		debug("parseLastModifFromScript | Can't find HTML element with last modified data. TD #9 not found.");
		return -1;
	}

	lastModifText =  updatedByTd[9].innerHTML;
	

	return lastModifText.substring(lastModifText.lastIndexOf('(') + 1, lastModifText.lastIndexOf(')'));
}

/**
 * Send request to get actual last modified
 */
function getObjectLastModified(businessKey, currentLastModif){
	var url = "page.request.do";
	var ctrlPage = "utils.get.last.modified";

	//var params = 'page=' + encodeURIComponent(ctrlPage) + '&' + objectType + '=' + encodeURIComponent(businessKey);
	
	debug('getObjectLastModified | key[' + businessKey + ']');

	//manualRequest(url, params, currentLastModif);
	updateLabel('Receiving Last Updated...');
	manualRequest(window.location, '', currentLastModif);
}

/**
 * TODO: refactor this
 */
function safeSave(){
	debug('safeSave...');

	if(getObjectType() === OBJECT_TYPE_SCRIPT){
		
		openObjectLastModified = parseLastModifFromScript();
		bkHtmlElementName = "name";

	}else if(getObjectType() === OBJECT_TYPE_PAGE){

		openObjectLastModified = parseLastModifFromPage();
	  	bkHtmlElementName = "businessKey";

	}

	debug("safeSave |  [" + getObjectType() + "] currentLastModif [" + openObjectLastModified + "]");

	bkHtmlElement = document.getElementById(bkHtmlElementName);


	if(bkHtmlElement){
	  	getObjectLastModified(bkHtmlElement.value);
	}else{
		debug("safeSave | Element with ID [" + bkHtmlElementName + "] Not Found");
	}
}

/**
 * Update Info Label
 * 
 * Label will be created on first call
 */
function updateLabel(text){

	

	if(labelEl === undefined){
		// label = document.createElement("label"); 
  //                 label.setAttribute('id', 'safeLabel');
  //                 label.setAttribute('style', 'vertical-align: middle;');
  //                 label.appendChild(document.createTextNode('Safe Save'));

		hint = document.createElement("li"); 
                  hint.setAttribute('id', 'safeSave');
                  hint.setAttribute('style', 'padding-left: 0.5em; color: blue; font-decoration: italic; '); //float: right;
                  hint.appendChild(document.createTextNode('...'));


		separator = document.createElement('img');
			separator.setAttribute('src', 'web-pub/component/grid/images/seperator.jpg');
			separator.setAttribute('class', 'separator');

		sepLi = document.createElement("li"); 
        	sepLi.appendChild(separator);



    	toolbar = document.getElementById('toolbar').getElementsByTagName('ul')[0];

		toolbar.appendChild(sepLi);
    	toolbar.appendChild(hint);		
	}

	labelEl = document.getElementById('safeSave');

	labelEl.innerHTML = text;

}


/**
 *
 */
function installSaveListener(){
	buttons = document.getElementById('toolbar').getElementsByTagName('li');

	btn = buttons[getButtonIndex()].getElementsByTagName('a')[0];

	debug('Save Button : ' + btn);

	btn.style.border='2px inset red';
	btn.style.paddingLeft = '6px';
	btn.href="javascript:safeSave()";


	updateLabel('Safe Save Initiated.');
                  //document.body.insertBefore(hint, document.getElementsByClassName('titleBar')[0]);


/*

	var label = document.createElement("label"); 
                  label.setAttribute('style', 'vertical-align: middle;');
                  label.appendChild(document.createTextNode('Safe Save'));



	var hint = document.createElement("div"); 
                  hint.setAttribute('class', 'dev-hint');
                  hint.setAttribute('style', ' padding: 0.5em; background-color: #FFFFCC; position: relative;'+
                  							 ' color: black; text-align: right; vertical-align: middle;');
                  hint.appendChild(label);

                  document.body.insertBefore(hint, document.getElementsByClassName('titleBar')[0]);

    */              

    //Ctrl-S Handler
    // document.onkeydown=function(e){ 
    // 	if(e.which == 17) {
    // 		isCtrl=true; 
    // 	}else{
    // 		isCtrl=false;
    // 	}
    // 	if(e.which == 83 && isCtrl == true) { 
    //  		//run code for CTRL+S -- ie, save! 
    //  		safeSave();
    //  		return false; 
    //  	} 
    // }

    var isCtrl = false; 
    document.onkeyup=function(e){ 
    	if(e.which == 17) isCtrl=false; 
    } 
    document.onkeydown=function(e){ 
    	if(e.which == 17) isCtrl=true; 
    	if(e.which == 83 && isCtrl == true) { 
    		//run code for CTRL+S -- ie, save! 
    		isCtrl = false;
    		safeSave();
    		return false; 
   		} 
	}
}

/**
 * Get Button index position for current Object
 */
function getButtonIndex(){
	if(getObjectType() === OBJECT_TYPE_PAGE){
		return 2;
	}else if(getObjectType() === OBJECT_TYPE_SCRIPT){
		return 0;
	}
}

/**
 * Safe debug out
 */
function debug(msg){
  if(window.console){
    window.console.log(">> " + msg);
  }
}


/**
 * Entry
 */
installSaveListener();
