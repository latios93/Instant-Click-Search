function logError(e) {
	console.error(e);
}

function checkError() {
	if (chrome.runtime.lastError) {
		console.error(chrome.runtime.lastError);
		return true;
	}
	return false;
}

function loadPreference() {
	chrome.storage.sync.get({
		"myHost": extra_host
	}, function(items) {
		if(checkError()) return;
		// Start block
		// Restore hosts saved by user
		extra_host = items.myHost;
		if(debug) console.log("MyHost 4 "+getJsonFromObject(extra_host));
		// End block
	});
}

function getSite(site) {
	let default_site = "Site";
	switch( site ) {
		case 'flagAmazonIt':
			return "Amazon.it";	
			break;
		case 'flagAmazonCom':
			return "Amazon.com";				
			break;
		case 'flagEbayIt':
			return "Ebay.it";				
			break;
		case 'flagEbayCom':
			return "Ebay.com";					
			break;
		case 'flagAmazonUk':
			return "Amazon.co.uk";	
			break;
		case 'flagAmazonEs':
			return "Amazon.es";				
			break;
		case 'flagAmazonFr':
			return "Amazon.fr";	
			break;
		case 'flagAmazonDe':
			return "Amazon.de";		
			break;
		case 'flagAmazonJp':
			return "Amazon.co.jp";			
			break;
		case 'flagZavvi':
			return "Zavvi.it";				
			break;
		case 'flagAnimeClick':
			return "AnimeClick.it";			
			break;
		case 'flagGameUk':
			return "Game.co.uk";		
			break;
		case 'flagAliExpress':
			return "AliExpress.com";			
			break;
		case 'flagYoutube':
			return "Youtube.it";					
			break;
		case 'flagFacebook':
			return "Facebook.com";		
			break;
		case 'flagGearBest':
			return "GearBest.com";			
			break;
		case 'flagMyAnimeList':			
			return "MyAnimeList.net";	
			break;
		default:
			//
	}
	return default_site;
}

function searchSite(info, tab) {
	switch( info.menuItemId ) {
		case 'flagAmazonIt':
			searchAmazonIt(info);	
			break;
		case 'flagAmazonCom':
			searchAmazonCom(info);			
			break;
		case 'flagEbayIt':
			searchEbayIt(info);				
			break;
		case 'flagEbayCom':
			searchEbayCom(info);				
			break;
		case 'flagAmazonUk':
			searchAmazonUk(info);		
			break;
		case 'flagAmazonEs':
			searchAmazonEs(info);			
			break;
		case 'flagAmazonFr':
			searchAmazonFr(info);
			break;
		case 'flagAmazonDe':
			searchAmazonDe(info);	
			break;
		case 'flagAmazonJp':
			searchAmazonJp(info);		
			break;
		case 'flagZavvi':
			searchZavvi(info);				
			break;
		case 'flagAnimeClick':
			searchAnimeClick(info);			
			break;
		case 'flagGameUk':
			searchGameUk(info);	
			break;
		case 'flagAliExpress':
			searchAliExpress(info);		
			break;
		case 'flagYoutube':
			searchYoutube(info);				
			break;
		case 'flagFacebook':
			searchFacebook(info);	
			break;
		case 'flagGearBest':
			searchGearBest(info);		
			break;
		case 'flagMyAnimeList':			
			searchMyAnimeList(info);
			break;
	}
}

/* Aggiunge un item al ContextMenu */
function addMenu( site ) {
	switch( site ) {
		case 'myHost':
			chrome.storage.sync.get( "myHost", function(items) {
				if(debug) console.log("MyHost "+getJsonFromObject(items));
				if(checkError()) return;
				if( items.myHost !== null && typeof items.myHost === 'string' ) {
					let listHosts = JSON.parse(items.myHost);
					if(debug) console.log("MyHost 2 "+getJsonFromObject(listHosts));
					for (var key in listHosts) {
						if (listHosts.hasOwnProperty(key) && listHosts[key].enable === true && !arraySitesIDs.hasOwnProperty(listHosts[key].hash)) {
							arraySitesIDs[listHosts[key].hash] = chrome.contextMenus.create({id: listHosts[key].hash,title: searchLabel+" in "+listHosts[key].name, contexts:["selection"], onclick: searchMyHost});
						}
					}
				}
			});				
			break;
		default:
			chrome.storage.sync.get( site, function(items) {
				if(debug) console.log(site+" "+items[site]);
				if(checkError()) return;
				/* "items.flagAmazonIt == null" return true if "items.flagAmazonIt" is null or undefined! */
				if( items[site] === true || (items[site] == null && arraySitesDefaultFlags[site]) ) {
					if (!arraySitesIDs.hasOwnProperty(site)) {
						arraySitesIDs[site] = chrome.contextMenus.create({id: site,title: searchLabel+" in "+getSite(site), contexts:["selection"], onclick: searchSite});
					}
				}
			});	
	}	
}

/* Funzione di avvio */
function readOptions()
{
	var i = 0;	
	for( i = 0; i < arraySites.length; i++ )
	{
		addMenu(arraySites[i]);
	}	
	addMenu("myHost");
}

function removeAllItems(start)
{
	if( start == null || start < 0 || start >= arraySites.length )
	{
		start = 0;
	}
	var i = start;	
	for( i = start; i < arraySites.length; i++ )
	{
		removeItem(arraySites[i]);
	}	
	for (var key in extra_host) {
		if (extra_host.hasOwnProperty(key)) {
			removeItem(key);
		}
	}
}

/* Rimuove un item dal ContextMenu */
function removeItem(menuItemId)
{
	if (arraySitesIDs.hasOwnProperty(menuItemId)) {
		chrome.contextMenus.remove(menuItemId);
		delete arraySitesIDs[menuItemId];
	}
}

function searchMyHost(info, tab)
{
	chrome.storage.sync.get({
		"myHost": JSON.stringify(extra_host)
	}, function(items) {
		if(checkError()) return;
		// Start block
		// Restore hosts saved by user
		extra_host = JSON.parse(items.myHost);
		if(debug) console.log("MyHost 3 "+getJsonFromObject(extra_host));
		if (extra_host.hasOwnProperty(info.menuItemId)) {
			var searchstring = info.selectionText;
			var host_1 = extra_host[info.menuItemId].host_part_1;
			var host_2 = extra_host[info.menuItemId].host_part_2;
			var parsedUrl = new URL(host_1 + searchstring + host_2);
			chrome.tabs.create({url: parsedUrl.href});
		}
		// End block
	});
}

function searchAmazonIt(info)
{
	var searchstring = info.selectionText;
	var host_1 = "http://www.amazon.it/s/ref=nb_sb_noss?__mk_it_IT=AMAZON&url=search-alias%3Daps&field-keywords=";
	var host_2 = "&rh=i%3Aaps%2Ck%3A";
	var parsedUrl = new URL(host_1 + searchstring + host_2);
 	chrome.tabs.create({url: parsedUrl.href});
}

function searchAmazonCom(info)
{
	var searchstring = info.selectionText;
	var host = "http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=";
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchEbayIt(info)
{
	var searchstring = info.selectionText;
	var host_1 = "http://www.ebay.it/sch/i.html?_from=R40&_trksid=p2050601.m570.l1313.TR10.TRC0.A0.H0.XYYYYYY.TRS0&_nkw=";
	var host_2 = "&_sacat=0";
	var parsedUrl = new URL(host_1 + searchstring + host_2);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchEbayCom(info)
{
	var searchstring = info.selectionText;
	var host_1 = "http://www.ebay.com/sch/i.html?_from=R40&_trksid=p2050601.m570.l1313.TR12.TRC2.A0.H0.XYYYYYY.TRS0&_nkw=";
	var host_2 = "&_sacat=0";
	var parsedUrl = new URL(host_1 + searchstring + host_2);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchAmazonUk(info)
{
	var searchstring = info.selectionText;
	var host = "http://www.amazon.co.uk/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=";
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchAmazonEs(info)
{
	var searchstring = info.selectionText;
	var host = "http://www.amazon.es/s/ref=nb_sb_noss_2?__mk_es_ES=AMAZON&url=search-alias%3Daps&field-keywords=";
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchAmazonFr(info)
{
	var searchstring = info.selectionText;
	var host = "http://www.amazon.fr/s/ref=nb_sb_noss_2?__mk_fr_FR=AMAZON&url=search-alias%3Daps&field-keywords=";
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchAmazonDe(info)
{
	var searchstring = info.selectionText;
	var host = "http://www.amazon.de/s/ref=nb_sb_noss_1/279-5937593-1058824?__mk_de_DE=AMAZON&url=search-alias%3Daps&field-keywords=";
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchAmazonJp(info)
{
	var searchstring = info.selectionText;
	var host = "http://www.amazon.co.jp/s/ref=nb_sb_noss/378-2664731-3254428?__mk_ja_JP=????&url=search-alias%3Daps&field-keywords=";
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchZavvi(info)
{
	var searchstring = info.selectionText;
	var host = "http://www.zavvi.com/elysium.search?search=";
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchAnimeClick(info)
{
	var searchstring = info.selectionText;
	var host = "http://www.animeclick.it/cerca?tipo=tutto&name=";
	searchstring = searchstring.replace(/( )/gi,"+");
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchGameUk(info)
{
	var searchstring = info.selectionText;
	var host_1 = "https://www.game.co.uk/webapp/wcs/stores/servlet/AjaxCatalogSearch?storeId=10151&catalogId=10201&langId=44&inStockOnly=[Ljava.lang.String%3B%402220222&pageSize=&beginIndex=0&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&predictiveSearchURL=&searchTerm=";
	var host_2 = "&searchBtn=z";
	var parsedUrl = new URL(host_1 + searchstring + host_2);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchAliExpress(info)
{
	var searchstring = info.selectionText;
	var host = "http://aliexpress.com/wholesale?catId=0&initiative_id=SB_20160226025103&SearchText=";
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchYoutube(info)
{
	var searchstring = info.selectionText;
	var host = "https://www.youtube.com/results?search_query=";
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchFacebook(info)
{
	var searchstring = info.selectionText;
	var host = "https://www.facebook.com/search/top/?init=quick&q=";
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchGearBest(info)
{
	var searchstring = info.selectionText;
	var host_1 = "http://www.gearbest.com/";
	var host_2 = "-_gear/";
	var parsedUrl = new URL(host_1 + searchstring + host_2);
	chrome.tabs.create({url: parsedUrl.href});
}

function searchMyAnimeList(info)
{
	var searchstring = info.selectionText;
	var host = "https://myanimelist.net/search/all?q=";
	var parsedUrl = new URL(host + searchstring);
	chrome.tabs.create({url: parsedUrl.href});
}

function prepareIndex()
{
	var i = 0;	
	indexSites = new Array();
	for( i = 0; i < arraySites.length; i++ )
	{
		indexSites[arraySites[i]] = i;
	}
}

// Generates a json string from a obj (associative array)
function getJsonFromObject(obj) {
	let tempArr = [];
	Object.keys(obj).forEach(function(key){
		let keys = {};
		keys[key] = obj[key];
		tempArr.push(keys);
	});
	let json = JSON.stringify(tempArr);
	return json;
}

// Saves options to chrome.storage
function save_options() {
	var TogetherMenus = document.getElementById('TogetherMenus').checked;
	var AmazonIt = document.getElementById('AmazonIt').checked;
	var AmazonCom = document.getElementById('AmazonCom').checked;
	var AmazonUk = document.getElementById('AmazonUk').checked;
	var AmazonEs = document.getElementById('AmazonEs').checked;
	var AmazonFr = document.getElementById('AmazonFr').checked;
	var AmazonDe = document.getElementById('AmazonDe').checked;
	var AmazonJp = document.getElementById('AmazonJp').checked;
	var GameUk = document.getElementById('GameUk').checked;
	var Zavvi = document.getElementById('Zavvi').checked;
	var EbayIt = document.getElementById('EbayIt').checked;
	var EbayCom = document.getElementById('EbayCom').checked;
	var AliExpress = document.getElementById('AliExpress').checked;
	var Youtube = document.getElementById('Youtube').checked;
	var AnimeClick = document.getElementById('AnimeClick').checked;
	var GearBest = document.getElementById('GearBest').checked;
	var Facebook = document.getElementById('Facebook').checked;
	var MyAnimeList = document.getElementById('MyAnimeList').checked;
	$('table.my-host > tbody > tr > td > input:checkbox').each(function (index, elem) {
		let id = $(elem).attr('id');
		extra_host[id].enable = $(elem).is(':checked');
		if(debug) console.log("Checkbox: "+id+" - "+extra_host[id].enable);
	});
	chrome.storage.sync.set({
		"myHost": JSON.stringify(extra_host),
		"flagTogetherMenus": TogetherMenus,
		"flagAmazonIt": AmazonIt,
		"flagAmazonCom": AmazonCom,
		"flagAmazonUk": AmazonUk,
		"flagAmazonEs": AmazonEs,
		"flagAmazonFr": AmazonFr,
		"flagAmazonDe": AmazonDe,
		"flagAmazonJp": AmazonJp,
		"flagGameUk": GameUk,
		"flagZavvi": Zavvi,
		"flagEbayIt": EbayIt,
		"flagEbayCom": EbayCom,
		"flagAliExpress": AliExpress,
		"flagYoutube": Youtube,
		"flagAnimeClick": AnimeClick,
		"flagGearBest": GearBest,
		"flagFacebook": Facebook,
		"flagMyAnimeList": MyAnimeList
	}, function() {
		$('div#msg').removeClass('invisible');
		$('#status').text(chrome.i18n.getMessage("extensionSettingDescriptionSaved"));
	});
}

// Save hosts in local
function saveMyHost(enable=true) {
	chrome.storage.sync.set({
		"myHost": JSON.stringify(extra_host)
	}, function() {
		//console.log("Salvati host! "+getJsonFromObject(extra_host));
		if(!enable) return;
		$('div#msg').removeClass('invisible');
		$('#status').text(chrome.i18n.getMessage("extensionSettingDescriptionSaved"));
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		"myHost": JSON.stringify(extra_host),
		"flagTogetherMenus": arraySitesDefaultFlags["flagTogetherMenus"],
		"flagAmazonIt": arraySitesDefaultFlags["flagAmazonIt"],
		"flagAmazonCom": arraySitesDefaultFlags["flagAmazonCom"],
		"flagAmazonUk": arraySitesDefaultFlags["flagAmazonUk"],
		"flagAmazonEs": arraySitesDefaultFlags["flagAmazonEs"],
		"flagAmazonFr": arraySitesDefaultFlags["flagAmazonFr"],
		"flagAmazonDe": arraySitesDefaultFlags["flagAmazonDe"],
		"flagAmazonJp": arraySitesDefaultFlags["flagAmazonJp"],
		"flagGameUk": arraySitesDefaultFlags["flagGameUk"],
		"flagZavvi": arraySitesDefaultFlags["flagZavvi"],
		"flagEbayIt": arraySitesDefaultFlags["flagEbayIt"],
		"flagEbayCom": arraySitesDefaultFlags["flagEbayCom"],
		"flagAliExpress": arraySitesDefaultFlags["flagAliExpress"],
		"flagYoutube": arraySitesDefaultFlags["flagYoutube"],
		"flagAnimeClick": arraySitesDefaultFlags["flagAnimeClick"],
		"flagFacebook": arraySitesDefaultFlags["flagFacebook"],
		"flagGearBest": arraySitesDefaultFlags["flagGearBest"],
		"flagMyAnimeList": arraySitesDefaultFlags["flagMyAnimeList"]
	}, function(items) {
		document.getElementById('TogetherMenus').checked = items.flagTogetherMenus;
		document.getElementById('AmazonIt').checked = items.flagAmazonIt;
		document.getElementById('AmazonCom').checked = items.flagAmazonCom;
		document.getElementById('AmazonUk').checked = items.flagAmazonUk;
		document.getElementById('AmazonEs').checked = items.flagAmazonEs;
		document.getElementById('AmazonFr').checked = items.flagAmazonFr;
		document.getElementById('AmazonDe').checked = items.flagAmazonDe;
		document.getElementById('AmazonJp').checked = items.flagAmazonJp;
		document.getElementById('GameUk').checked = items.flagGameUk;
		document.getElementById('Zavvi').checked = items.flagZavvi;
		document.getElementById('EbayIt').checked = items.flagEbayIt;
		document.getElementById('EbayCom').checked = items.flagEbayCom;
		document.getElementById('AliExpress').checked = items.flagAliExpress;
		document.getElementById('Youtube').checked = items.flagYoutube;
		document.getElementById('AnimeClick').checked = items.flagAnimeClick;
		document.getElementById('Facebook').checked = items.flagAnimeClick;
		document.getElementById('GearBest').checked = items.flagAnimeClick;
		document.getElementById('MyAnimeList').checked = items.flagMyAnimeList;
		// Start block
		// Restore hosts saved by user
		extra_host = JSON.parse(items.myHost);
		for (var key in extra_host) {
			if (extra_host.hasOwnProperty(key)) {
				$('#hostList').append(getNewHost(extra_host[key],extra_host[key].enable));
			}
		}
		$('.delete-my-host').click(delete_extra);
		bindClick();
		// End block
	});
}

// Return div element containing a new host cell.
function getNewHost(host,state=true) {
	if(state===true) {
		state = 'checked';
	}
	else {
		state = '';
	}
	return '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 my-host" id="my-host-'+host.hash+'">'+
				'<table class="table table-hover table-custom my-host">'+
					'<tr>'+
						'<td>'+
							'<label class="host-name" for="'+host.hash+'" data-toggle="tooltip" title="'+host.name+'">'+
								host.name+					
							'</label>'+
						'</td>'+
						'<td class="td-width-custom30"><div class="hidden-box"></div><input type="checkbox" class="mx-auto" id="'+host.hash+'" '+state+'></td>'+
						'<td class="td-width-custom60"></div><button class="btn btn-success text-center mx-auto delete-my-host" id="delete-my-host-'+host.hash+'"><i class="fas fa-trash-alt"></i></button></td>'+
					'</tr>'+
				'</table>'+
			'</div>';
}

// Delete a div element containing a new host cell. 
function delete_extra() {
	let id = this.id.substring("delete-my-host-".length);
	delete extra_host[id];
	let id_div = this.id.substring("delete-".length);
	$('#'+id_div).remove();
	saveMyHost(false);
	removeItem(id);
}

// Show an alert with msg
function writeAlert(msg) {
	$('div#msg').removeClass('invisible');
	$('#status').text(msg);
}

// Save a new host inserted by the user.
function save_extra() {
	var host = {
		name: $('#host_name').val().trim(),
		host_part_1: $('#host_part_1').val().trim(),
		host_part_2: $('#host_part_2').val().trim(),
		enable: true,
		hash: ''
	};	
	
	// Sporco ma il primo restituisce vero per '', null, undefined, 0, NaN e false. Tutto insieme, veloce e semplice.
	if(!host.name) {
		writeAlert(chrome.i18n.getMessage("extensionSettingAddHostErrorHostName"));
		return false;
	}
	if(!host.host_part_1 || !is_url(host.host_part_1)) {
		writeAlert(chrome.i18n.getMessage("extensionSettingAddHostErrorURL"));
		return false;
	}
	
	host.hash = md5(host.name);	
	if(extra_host[host.hash] !== undefined) {
		writeAlert(chrome.i18n.getMessage("extensionSettingAddHostErrorNameDuplicated"));
		return false;
	}
	extra_host[host.hash] = host;
	$('#hostList').append(getNewHost(host));
	$('.delete-my-host').click(delete_extra);
	bindClick();
	// Save local hosts
	saveMyHost();
	// A listener adds automatically this host to contextmenu. The listeners is written in background.js
	// addMenu("myHost");
	
	$('#host_name').val('');
	$('#host_part_1').val('');
	$('#host_part_2').val('');
	$('#msg').scrollToMe();	
}

// Random color options's table
function randomColor(start,range) {
	return Math.floor((Math.random() * range) + start);
}

function selectAllCheckbox() {
	var value = $('#TogetherMenus').is(':checked');
	$('table > tbody > tr > td > input:checkbox').each(function (index, elem) {
		$(elem).prop('checked', value);
	});
}

// Return true if str is a url, otherwise false.
function is_url(str)
{
	regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/gi;
	if (regexp.test(str))
	{
	  return true;
	}
	else
	{
	  return false;
	}
}

// Bind each tr to its input:checkbox with a click event
function bindClick() {
	$('div.my-host > table > tbody').click(function(event){
		$(this).find('tr > td > input:checkbox').each(function (index, elem) {
			$(elem).click();
		});
	});
}