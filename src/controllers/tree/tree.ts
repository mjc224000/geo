import {
    Ctx,
    Param,
    Get,
    JsonController,
    QueryParam,
    Action,
    Authorized,
    Post,
    BodyParam,
    Body, Put, Delete,
} from 'routing-controllers'
import {Context} from 'koa'
import {getTree, setFather, add, deleteNode} from "../../models/tree/tree-model";

@JsonController('/tree')
export default class {
    @Get('/')
    async router() {
        return await getTree();
    }

    @Put('/')
    async putRouter(@Ctx()ctx: Context,
    ) {
        let {fn, cn} = ctx.query;
        let res = await setFather(fn, cn);

        return res ? 'ok' : "bad"
    }

    @Post('/')
    async add(@Body() node: any) {
        let res = await add(node.name);
        return 'res'
    }

    @Delete('/')
    async d(@QueryParam('name')name: string) {
        let res = await deleteNode(name);
        return res ? 'ok' : 'no ok';
    }
}