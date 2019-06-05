const Router = require('koa-router');

const router = new Router({
    prefix: ''
});

const screenshotsController = require('../controllers/screenshot.js')


// web page
router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        body : 'Hello ejs template!'
    });
})


// api
router.get('/api/screenshot', screenshotsController.shot)



module.exports = router
