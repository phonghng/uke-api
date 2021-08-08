const express = require('express')
const logger = require('morgan')
const uke = require('phonghng-url-kw-extractor')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = process.env.PORT || 5000

express()
    .use(logger('dev'))
    .use(express.json())
    .use(cors())
    .use(express.urlencoded({ extended: false }))
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
    .post('/kwurl-twowords', async function(req, res) {
        try {
            uke.get_keyword(req.body.url, false, keywords => {
                var filtered = Object.keys(keywords)
                    .filter(key => [2, 3].includes(key.split(" ").length))
                    .reduce((obj, key) => {
                        obj[key] = keywords[key];
                        return obj;
                    }, {});
                res.json(filtered)
            });
        } catch (error) {
            console.error(error);
        }
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))