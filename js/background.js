arraySites.sort();

/* prepareIndex() solo per Firefox! No per Chrome! */
prepareIndex();

readOptions();

/* Aggiunge un event listener alle preferenze */
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		var storageChange = changes[key];
		if( !storageChange.newValue ) /* Se falso, tolgo l'item dal contextMenu */	
		{
			removeItem(key);
		}
		else /* Aggiungo l'item */
		{
			/* 	
				Rimuovo gli elementi a partire da questo indice, così una volta inseriti sono ordinati. 
				Su chrome vengono ordinati in automatico. 
			*/
			if(indexSites!=null){
				removeAllItems(indexSites[key]);
			}
			else {
				removeAllItems();
			}
			readOptions();
		}
	}
});

//console.log("Host caricati! "+getJsonFromObject(extra_host));