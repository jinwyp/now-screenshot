
// Koa application is now a class and requires the new operator.


const path            = require('path')
const Koa             = require('koa')
const logger          = require('koa-logger')
const XResponseTime   = require('koa-response-time')
const koaStaticServer = require('koa-static')
const mount           = require('koa-mount')
const ejs             = require('koa-ejs')
const router          = require('koa-router')()
const bodyParser      = require('koa-bodyparser')
const userAgent       = require('koa-useragent')
const cors            = require('@koa/cors')
const helmet          = require('koa-helmet')


const apiRoute = require('./routes/api.js')
const screenshotsController = require('./controllers/screenshot.js')

const app   = new Koa();


app.use(logger())     // 记录所用方式与时间
app.use(helmet())
app.use(XResponseTime())     // 设置Header
app.use(bodyParser())     // POST请求 body 解析
app.use(cors())     // 跨域资源共享 CORS
app.use(userAgent)     //请求Header 的 user agent 信息


// 静态文件夹
app.use(mount('/static', koaStaticServer(path.join(__dirname, '../dist'), {
    maxage : 1000 * 60 * 60,
    hidden : false, // 默认不返回隐藏文件
    gzip : true
})))

app.use(mount('/static/download', koaStaticServer(path.join(__dirname, './static/download'), {
    maxage : 1000 * 60 * 60,
    hidden : false, // 默认不返回隐藏文件
    gzip : true
})))


// 设置渲染引擎
ejs(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: false
})





// Start Router 路由

app.use(apiRoute.routes()).use(apiRoute.allowedMethods());



// Start listening on specified port
app.listen(3008, () => {
    console.log("----- Server Koa 2.0 listening on port 3008");
});

module.exports = app.callback()





