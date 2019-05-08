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
import {getTree, setFather, add, deleteNode, updateTree} from "../../models/tree/tree-model";
import {TreeData} from "geo";

@JsonController('/tree')
export default class {
    @Get('/')
    async router() {
        return await getTree();
    }

    @Put('/')
    async putRouter(@Ctx()ctx: Context,
    ) {
        console.log(ctx.request.body, 'p body');
        let data: TreeData = ctx.request.body;
        let {name, fatherName, uid} = data;
        let res = await updateTree({fatherName, name, uid});
        return res ? 'ok' : "bad"
    }

    @Post('/')
    async add(@Body() node: any) {
        console.log(node, 'add node');
        let res = await add(node);
        return res
    }

    @Delete('/')
    async d(@QueryParam('name')name: string) {
        let res = await deleteNode(name);
        return res ? 'ok' : 'no ok';
    }
}