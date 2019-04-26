import 'reflect-metadata'
import {createKoaServer, Action} from 'routing-controllers'
import {Context} from "koa";
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'

import {distPath, configs} from './config'
import UserInfo from './models/user/user-info';
import {Places, Routines} from "./models/geo/cities";
import {Roles} from "./types/user-info";
import init from "./models/init";


const app = createKoaServer({

    authorizationChecker: async (action: Action, roles: Roles) => {
        return true;
    }, controllers: [`${__dirname}/controllers/**/*{.js,.ts}`],
    cors: true
})
init().then(function () {

});
app.use(function (ctx: Context) {
    ctx.res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "x-requested-with,x-ui-request,lang",
        'Access-Control-Allow-Methods': 'OPTIONS, GET, PUT, POST, DELETE',
        'Access-Control-Allow-Credentials': "true"
    })
});
app.use(serve(distPath))
app.use(bodyParser())

console.log(__dirname);

export default app
