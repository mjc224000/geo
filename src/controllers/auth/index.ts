import {Ctx, Param, Get, JsonController, Action, QueryParam} from 'routing-controllers'
import { Context } from 'koa'
import UserInfo from '../../models/user/user-info'

@JsonController('/auth')
export default class Auth {
    @Get('/')
    async auth( @QueryParam('token') token:string){

      return 'aa'
    }
}