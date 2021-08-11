var database = { waiting_list: {}, keywords: {} };

function get_date_formated() {
	var date = new Date(),
		month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return date.getDate() + "-" + month[date.getMonth()] + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
}

function get_keyword(date, url) {
	$.post("https://uke-api.herokuapp.com/kwurl", { url: url }, keywords => {
		for (const [keyword, score] of Object.entries(keywords)) {
			var url_date = date.split(" ")[0];
			if(database.keywords[url_date] == undefined)
				database.keywords[url_date] = {};
			if(database.keywords[url_date][keyword] == undefined)
				database.keywords[url_date][keyword] = 0;
			database.keywords[url_date][keyword] += score;
		}
		delete database.waiting_list[date];
		chrome.storage.local.set({ database: database });
		added_keyword();
	});
}

function add_waiting_list(url) {
	if(!Object.values(database.waiting_list).includes(url) && url.startsWith("http")) {
		database.waiting_list[get_date_formated()] = url;
		chrome.storage.local.set({ database: database });
		get_keyword(get_date_formated(), url);
	}
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => setTimeout(() => add_waiting_list(tab.url), 16000) );
Object.keys(database.waiting_list).forEach(date => get_keyword(date, database.waiting_list[date]));
get_db("get_and_set");

/* DEV FUNCTIONS */

function get_db(action = "get_only", callback = null) {
	switch(action) {
		case "get_and_cb":
			chrome.storage.local.get(["database"], result => callback(result.database));
			break;
		case "get_and_set":
			chrome.storage.local.get(["database"], result => database = (result.database == undefined) ? { waiting_list: {}, keywords: {} } : result.database);
			break;
		case "get_and_log":
			chrome.storage.local.get(["database"], result => console.log(result.database));
			break;
	}
}

function reset_db() {
	chrome.storage.local.set({ database: { waiting_list: {}, keywords: {} } });
	get_db("get_and_set");
}

function added_keyword() {
	console.log(database);
}
