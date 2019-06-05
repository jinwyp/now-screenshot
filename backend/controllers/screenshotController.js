const path      = require('path')
const fs = require('fs');
const screenshot  = require('../lib/shot')

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


    // const picName = requestBody.url.replace(/(^\w+:|^)\/\//, '') + '.png';
    // const picPath = path.join(__dirname, '../static/download/' + picName)
    // const picPath = path.join(__dirname, '../../tmp/' + picName)


    try {
        const file = await screenshot( requestBody.url );
        console.log('===== file: ', file)


        ctx.attachment(file.filename)

        // ctx.set('Content-Type', `image/jpeg`);

        ctx.statusCode = 200;
        ctx.body = fs.createReadStream(file.path);

    } catch (error) {
        console.log('===== error: ', error)
        ctx.statusCode = 400;
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


