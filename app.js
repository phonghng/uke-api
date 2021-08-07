const express = require('express');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const cors = require('cors');
const uke = require("phonghng-url-kw-extractor");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(cors({
    origin: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.get('/', timeout('30s'), function(req, res, next) {
    res.writeHead(302, {
        Location: "https://www.npmjs.com/package/phonghng-url-kw-extractor"
    });
    res.end();
});

app.get('/supportlang', timeout('30s'), function(req, res, next) {
    res.json({ "support-lang": uke.support_lang });
}); 

app.post('/kwurl', timeout('30s'), function(req, res, next) {
    uke.get_keyword(req.body.url, keywords => {
        res.json(keywords);
    });
});

app.post('/kwhtml', timeout('30s'), function(req, res, next) {
    uke.get_keyword_from_html(req.body.html, keywords => {
        res.json(keywords);
    });
});

app.post('/kwstring', timeout('30s'), function(req, res, next) {
    uke.get_keyword_from_string(req.body.string, keywords => {
        res.json({ "keywords": keywords });
    });
});

const server = app.listen(process.env.PORT || 5000);
