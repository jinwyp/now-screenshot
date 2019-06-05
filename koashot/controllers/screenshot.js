const puppeteer = require('puppeteer')
const path      = require('path')

exports.shot = async (ctx, next) => {

    console.log('===== request Body: ', ctx.request.body)
    console.log('===== request Query: ', ctx.query)

    const requestBody = {
        url : 'https://www.baidu.com'
    };


    if (ctx.request.body && ctx.request.body.url) {

        if (ctx.request.body.url) {
            requestBody.url = ctx.request.body.url
        }
    } else if (ctx.query) {
        if (ctx.query.url) {
            requestBody.url = ctx.query.url
        }
    }

    // 去除网址的最后的字符 "/"
    const lastText = requestBody.url.slice(-1);
    if (lastText === '/') {
        requestBody.url = requestBody.url.substring(0, requestBody.url.length - 1);
    }

    // 给 网址 添加 http 前缀
    if (!/^https?:\/\//i.test(requestBody.url)) {
        requestBody.url = 'http://' + requestBody.url;
    }


    // const picName = requestBody.url.replace(/(^\w+:|^)\/\//, '') + '.png';
    // const picPath = path.join(__dirname, '../static/download/' + picName)
    // const picPath = path.join(__dirname, '../../tmp/' + picName)

    console.log('===== request URL : ', requestBody)



    let browser = null

    // const options = [...chrome.args, '--lang=en-US']
    // console.log('===== chrome.executablePath: ', await chrome.executablePath, chrome.headless, chrome.defaultViewport, options)



    async function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 滚动截图
     *
     * https://blog.petehouston.com/take-website-screenshot-on-ajax-loading-page-using-puppeteer/
     * https://github.com/GoogleChrome/puppeteer/issues/338
     *
     * https://github.com/chenxiaochun/blog/issues/38
     *
     * @param page
     * @returns {Promise<void>}
     */
    async function autoScroll(page){
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                let totalHeight = 0
                const distance = 600
                const maxHeight = 10000

                let timeInterval = 500

                const timer = setInterval(async () => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    console.log('==== totalHeight: ', scrollHeight,  totalHeight)
                    if((totalHeight >= scrollHeight) || ( totalHeight >= maxHeight) ){
                        console.log('==== clearInterval: ')
                        clearInterval(timer);
                        resolve();
                    }

                }, timeInterval);
            });
        });
    }



    try {
        browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();

        page.on('console', msg => {
            console.log(msg.text());
        });

        await page.setViewport({ width: 1920, height: 2160});
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US',
            'Cookie': 'language=en'
        });
        await page.goto(requestBody.url);
        // await timeout(1000)

        await autoScroll(page);

        const file = await page.screenshot({
            type: 'jpeg',
            quality: 50,
            fullPage: true
        });

        await browser.close();

        ctx.statusCode = 200;
        ctx.set('Content-Type', `image/jpeg`);
        ctx.body = file

    } catch (error) {
        console.log('===== error: ', error)
        return ctx.body = {
            success : false,
            error : error
        };
    } finally {
        console.log('===== End browser =====')
    }



    // ctx.res.end(file)

    // ctx.body = {
    //     success : true,
    //     error : null,
    //     data : {
    //         picPath : picPath
    //     }
    // }

}


