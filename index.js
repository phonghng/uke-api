const uke = require('phonghng-url-kw-extractor')
const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const jsdom = require("jsdom")

const PORT = process.env.PORT || 5000;

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;
global.document = document;
const $ = (jQuery = require("jquery")(window));

express()
    .use(logger('dev'))
    .use(express.json())
    .use(cors())
    .use(express.urlencoded({
        extended: false
    }))
    .use(cookieParser())
    .get('/', (req, res) => {
        res.writeHead(302, {
            Location: "https://www.npmjs.com/package/phonghng-url-kw-extractor"
        });
        res.end();
    })
    .post('/kwurl', async function(req, res) {
        try {
            uke.get_keyword(req.body.url, false, keywords => res.json(keywords));
        } catch (error) {
            console.error(error);
        }
    })
    .post('/kwhtml', async function(req, res) {
        try {
            uke.get_keyword_from_html(req.body.html, false, keywords => res.json(keywords));
        } catch (error) {
            console.error(error);
        }
    })
    .post('/kwstring', async function(req, res) {
        try {
            uke.get_keyword_from_string(req.body.string, keywords => res.json(keywords));
        } catch (error) {
            console.error(error);
        }
    })
    .get("/kwurl-twowords/:url", async function(req, res, next) {
        try {
            uke.get_keyword(decodeURIComponent(req.params.url), false, keywords => {
                var filtered = Object.keys(keywords)
                    .filter(key => key.split(" ").length <= 3)
                    .reduce((obj, key) => {
                        obj[key] = keywords[key];
                        return obj;
                    }, {});
                res.json(Object.keys(filtered));
            });
        } catch (error) {
            console.log(error);
        }
    })
    .listen(PORT, () => console.log("Listening on " + PORT))