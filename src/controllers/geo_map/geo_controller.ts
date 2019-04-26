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
    Body,
} from 'routing-controllers'
import {Context} from 'koa'
import {Places, Routines} from "../../models/geo/cities";
import {PlaceData, RotineData} from "../../types/geo";
import fs from 'fs';
import * as path from "path";
import {GeoCoordMap} from "./geo_interface";

@Authorized('gust')
@JsonController('/geo')
export default class {
    @Get('/')
    async router() {
        let a = await Places.findAll({raw: true});
        let places = await Places.findAll();
        places.map(async function (place) {
            return await place.$get('rotines')
        })
        return a
    }

    @Get('/coor_map')
    async geoCoorMap() {
        let places = await Places.findAll({raw: true});
        let ret: GeoCoordMap = {};
        places.forEach(function (item) {
            let {name, geo_coor} = item;
            let coor = [...geo_coor.split(',')];
            ret[name] = [coor[0], coor[1]];
        })
        return ret
    }

    @Get('/rotines')
    async getRoutine() {
        let ret: any = {};
        let places: any = await Places.findAll({
            include: [{model: Routines, required: false}],
            raw: true
        });
        places.forEach(function (place: any) {
            let destinationId = place['routines.destinationId'];
           place.value = place['routines.value'];
            if (destinationId) {
                let dest = places.find(function (item: any) {
                    return item['uid'] === destinationId;
                });
                place['dest'] = dest.name;
                ret[place['name']]=ret[place['name']]||[];
                ret[place['name']].push({dest:dest.name,value:place['value']});
            }
        })
        console.log(ret);
        return ret;
    }

    @Post('/')
    async insertGeo(@Ctx() ctx: Context, @Body() place: PlaceData) {
        let isOk = await createPlace(place);

        return isOk
    }

    @Post('/routines')
    async insertRoutines(@Ctx() ctx: Context, @Body() rotine: RotineData) {
            let {origin,destination,value}=rotine;

            return 'ok'
    }

    @Get('/pdf')
    async getPdf(@Ctx() ctx: Context) {
        let pdf = await fs.readFileSync(path.resolve('assets/普林斯顿微积分读本(修订版).pdf'));
        ctx.res.writeHead(200, {'Content-Type': 'application/pdf'})
        return pdf
    }

}

async function createPlace(place: PlaceData): Promise<Boolean> {
    let {name, geo_coor} = place;
    if (name && geo_coor && 0) {
        let [place, created] = await Places.findOrCreate({where: {name: name, geo_coor: geo_coor}});
        if (created) {
            return true
        }
    }
    return false;
}

