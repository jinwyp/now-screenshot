const puppeteer = require('puppeteer-core')
const chrome = require('chrome-aws-lambda')
const { parse, URL } = require('url');


async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * ( max - min + 1 ) + min);
}


async function screenShot (url) {

    console.log('===== screenShot url original: ', url)

    let sourceUrl = url || 'https://www.baidu.com';

    const lastText = sourceUrl.slice(-1);
    if (lastText === '/') {
        sourceUrl = sourceUrl.substring(0, sourceUrl.length - 1);
    }

    if (!/^https?:\/\//i.test(sourceUrl)) {
        sourceUrl = 'http://' + sourceUrl;
    }


    const tempUrl = new URL(sourceUrl);
    const tempHostname = tempUrl.hostname + '-' + randomIntFromInterval(100000, 999999).toString() + '.jpg';
    const tempPath = '/tmp/' + tempHostname


    // const picName = requestBody.url.replace(/(^\w+:|^)\/\//, '') + '.png';
    // const picPath = path.join(__dirname, '../static/download/' + picName)
    // const picPath = path.join(__dirname, '../../tmp/' + picName)

    console.log('===== screenShot url : ', sourceUrl, tempPath)


    // await chrome.font('https://raw.githack.com/googlei18n/noto-cjk/master/NotoSansTC-Regular.otf');
    // await chrome.font('https://raw.githack.com/googlei18n/noto-cjk/master/NotoSansHK-Regular.otf');

    await chrome.font('https://raw.githack.com/googlei18n/noto-cjk/master/NotoSansKR-Regular.otf');
    await chrome.font('https://raw.githack.com/googlei18n/noto-cjk/master/NotoSansJP-Regular.otf');
    await chrome.font('https://raw.githack.com/googlei18n/noto-cjk/master/NotoSansSC-Regular.otf');


    async function autoScroll(page){
        return await page.evaluate( () => {
            return new Promise((resolve, reject) => {
                let totalHeight = 0
                const distance = 500
                const maxHeight = 10000

                let timeInterval = 300

                const timer = setInterval( () => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    console.log('==== totalHeight: ', scrollHeight,  totalHeight)
                    if((totalHeight >= scrollHeight) || ( totalHeight >= maxHeight) ){
                        console.log('==== clearInterval: ')
                        clearInterval(timer);
                        return resolve(scrollHeight);
                    }

                }, timeInterval);
            });
        });
    }




    let browser = null

    const argumentTemp = [
        // '--disable-background-timer-throttling',
        // '--disable-breakpad',
        // '--disable-client-side-phishing-detection',
        // '--disable-cloud-import',
        // '--disable-default-apps',
        // '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gesture-typing',
        '--disable-hang-monitor',
        '--disable-infobars',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-offer-upload-credit-cards',
        // '--disable-popup-blocking',
        // '--disable-print-preview',
        // '--disable-prompt-on-repost',
        // '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--disable-tab-for-desktop-share',
        '--disable-translate',
        '--disable-voice-input',
        '--disable-wake-on-wifi',
        '--enable-async-dns',
        '--enable-simple-cache-backend',
        '--enable-tcp-fast-open',
        '--enable-webgl',
        // '--hide-scrollbars',
        // '--ignore-gpu-blacklist',
        // '--media-cache-size=33554432',
        // '--metrics-recording-only',
        // '--mute-audio',
        // '--no-default-browser-check',
        // '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        // '--no-zygote',
        // '--password-store=basic',
        // '--prerender-from-omnibox=disabled',
        // '--use-gl=swiftshader',
        // '--use-mock-keychain',
        // '--memory-pressure-off',
        // '--single-process',
        '--lang=en-US' ]


    const options = [...chrome.args, '--lang=en-US']

    console.log('===== chrome.executablePath: ', await chrome.executablePath, chrome.headless, chrome.defaultViewport)
    console.log('===== chrome.args: ', options)


    browser = await puppeteer.launch({
        args: options,
        // defaultViewport: {
        //     width: 1920,
        //     height: 2160
        // },
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
    });

    const page = await browser.newPage();
    page.on('console', msg => {
        console.log(msg.text());
    });

    let tempHeight = 1080;

    await page.setViewport({ width: 1920, height: tempHeight});
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US',
        'Cookie': 'language=en'
    });


    await page.goto(sourceUrl);

    tempHeight = await autoScroll(page);

    console.log('===== tempHeight: ', tempHeight)

    await page.setViewport({ width: 1920, height: tempHeight});

    await page.screenshot({
        path: tempPath,
        type: 'jpeg',
        quality: 30,
        fullPage: false
    });


    await browser.close();

    return {
        filename: tempHostname,
        path: tempPath
    } ;

}



module.exports = screenShot
