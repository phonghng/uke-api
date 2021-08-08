const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const uke = require("phonghng-url-kw-extractor");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/', async function(req, res, next) {
    res.writeHead(302, {
        Location: "https://www.npmjs.com/package/phonghng-url-kw-extractor"
    });
    res.end();
});

app.post('/kwurl', async function(req, res, next) {
    try {
        uke.get_keyword(req.body.url, false, keywords => res.json(keywords));
    } catch (error) {
        console.error(error);
    }
});

app.post('/kwhtml', async function(req, res, next) {
    try {
        uke.get_keyword_from_html(req.body.html, false, keywords => res.json(keywords));
    } catch (error) {
        console.error(error);
    }
});

app.post('/kwstring', async function(req, res, next) {
    try {
        uke.get_keyword_from_string(req.body.string, keywords => res.json(keywords));
    } catch (error) {
        console.error(error);
    }
});

app.post('/kwurl-twowords', async function(req, res, next) {
    try {
        uke.get_keyword(req.body.url, false, keywords => {
            var filtered = Object.keys(keywords)
                .filter(key => key.split(" ").length <= 2)
                .reduce((obj, key) => {
                    obj[key] = keywords[key];
                    return obj;
                }, {});
            res.json(filtered)
        });
    } catch (error) {
        console.error(error);
    }
});

app.listen(3000, () => console.log(`Server running on 3000, http://localhost:3000`));