chrome.storage.sync.get(["database"], result => {
	var kw = result.database.keywords;
	Object.keys(kw, date => {
		document.write("<b>" + date + "</b>");
		for (const [keyword, score] of Object.entries(kw))
			document.write(keyword + ": " + score + " điểm");
	})
});