browser.storage.sync.get().then(result => {
	const replaceUrl = function(setting){
		switch(setting){
			case "8":
				return url => url.replace(/^https?\:\/\/docs\.oracle\.com\/javase\/(?:[678]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))/g, "https://docs.oracle.com/javase/8");
			default:
				return url => url.replace(/^https?\:\/\/docs\.oracle\.com\/(javafx\/2|(javafx|javase)\/(?:[6789]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/(docs|javafx))/g, "https://docs.oracle.com/javase/9/docs");
		}
	}(result['java-version']);

	browser.webRequest.onBeforeRequest.addListener(details => {
		const redirectionTarget = replaceUrl(details.url);
		if(redirectionTarget !== details.url){
			const request = new XMLHttpRequest();
			request.open('HEAD', redirectionTarget, false);
			request.send(null);
			if(request.status === 200 && request.responseURL === redirectionTarget){
			  return {redirectUrl: redirectionTarget};
			}
		}
		return {};
	}, {urls: ["*://docs.oracle.com/*"]}, ["blocking"]);
});
