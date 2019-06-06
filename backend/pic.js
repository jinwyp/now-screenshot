const { parse, URL } = require('url');
const screenshot  = require('./lib/shot');
const fs = require('fs');

module.exports = async function (req, res) {

    const { query = {} } = parse(req.url, true);

    console.log( '===== request query: ', query)


    const requestBody = {
        url : 'https://www.baidu.com',
        wailTime: 1300,
        intervalTime: 90,
        intervalScroll: 300,
    };

    if (query && query.url) {
        requestBody.url = query.url
    }

    if (query && query.waitTime) {
        requestBody.waitTime = Number(query.waitTime)
    }

    if (query && query.intervalTime) {
        requestBody.intervalTime = Number(query.intervalTime)
    }

    if (query && query.intervalScroll) {
        requestBody.intervalScroll = Number(query.intervalScroll)
    }



    if (!/^https?:\/\//i.test(requestBody.url)) {
        requestBody.url = 'http://' + requestBody.url;
    }


    function isValidUrl(str) {
        try {
            const url = new URL(str);
            return url.hostname.includes('.');
        } catch(e) {
            console.log('===== isValidUrl error: ', e.message);
            return false;
        }
    }


    if (!isValidUrl(requestBody.url)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<h1>Bad Request</h1><p>The url <em>${requestBody.url}</em> is not valid.</p>`);
    } else {

        try {
            const file = await screenshot(requestBody.url, requestBody);

            console.log('===== file: ', file)

            res.setHeader('Content-disposition', 'attachment; filename=' + file.filename);
            res.setHeader('Content-type', `image/jpeg`);

            const filestream = fs.createReadStream(file.path);
            filestream.pipe(res);

            // res.statusCode = 200;
            // res.setHeader('Content-Type', `image/jpeg`);
            // res.end(file);

        } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<h1>Server Error</h1><p>${e.message}</p>`);
            console.log('===== error: ', e.message);
        }


    }



};
