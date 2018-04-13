var debug = false;
var arrayClasses = [ "table-primary", "table-success", "table-danger", "table-info", "table-warning", "table-active", "table-secondary", "table-light" ];
var extra_host = {};
var arraySites = [ "flagAmazonIt", "flagAmazonCom", "flagEbayIt", 
	"flagEbayCom", "flagAmazonUk", "flagAmazonEs", "flagAmazonFr",
	"flagAmazonDe", "flagAmazonJp", "flagZavvi", "flagAnimeClick",
	"flagGameUk", "flagAliExpress", "flagYoutube", "flagGearBest", 
	"flagFacebook", "flagMyAnimeList" ];
var arraySitesDefaultFlags = { 
	"flagTogetherMenus": false, "flagAmazonIt": true, "flagAmazonCom": true, "flagEbayIt": true, 
	"flagEbayCom": true, "flagAmazonUk": true, "flagAmazonEs": false, "flagAmazonFr": false,
	"flagAmazonDe": false, "flagAmazonJp": false, "flagZavvi": true, "flagAnimeClick": false,
	"flagGameUk": false, "flagAliExpress": false, "flagYoutube": false, "flagGearBest": false, 
	"flagFacebook": false, "flagMyAnimeList": false 
	};
var arraySitesIDs = { };
var indexSites = null;	
var searchLabel = chrome.i18n.getMessage("extensionLabelSearch");