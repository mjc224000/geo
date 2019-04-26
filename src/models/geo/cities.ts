//https://www.npmjs.com/package/sequelize-typescript#one-to-many
import {Model, Table, Column, ForeignKey, BelongsTo, HasMany, HasOne} from "sequelize-typescript"
import {Transaction} from 'sequelize';
import {PlaceData} from "../../types/geo";

@Table({
    tableName: 'places'
})
export class Places extends Model<Places> {
    @Column({
        comment: '自增ID',
        autoIncrement: true,
        primaryKey: true,
    })
    uid: number

    @Column({
        comment: "地点名称",
    })
    name: string

    @Column({
        comment: '地理坐标'
    })
    geo_coor: string
    @HasMany(() => Routines, 'originId')
    routines: Routines[]
}

@Table({tableName: 'routines'})
export class Routines extends Model<Routines> {
    @Column({
        comment: '自增ID',
        autoIncrement: true,
        primaryKey: true,
    })
    uid: number
    @ForeignKey(() => Places)
    @Column({comment: '起始地'})
    originId: number
    @BelongsTo(() => Places, 'originId')
    origin: Places
    @ForeignKey(() => Places)
    @Column({
        comment: '目的地'
    })
    destinationId: number
    @BelongsTo(() => Places, "destinationId")
    destination: Places
    @Column({comment: '数值'})
    value: number

}

export async function createPlace(place: PlaceData): Promise<Boolean> {
    let {name, geo_coor} = place;
    if (name && geo_coor && 0) {
        let [place, created] = await Places.findOrCreate({where: {name: name, geo_coor: geo_coor}});
        if (created) {
            return true
        }
    }
    return false;
}

export async function addRoutine(name: string, dest: string, val: number): Promise<Boolean> {
    let place = await Places.findOne({where: {name}, raw: true});
    let des = await Places.findOne({where: {name: dest}, raw: true});
    if (!place || !des) {
        return false
    }
    let [routine, create] = await Routines.findOrCreate({where: {originId: place.uid, destinationId: des.uid}});
    if (routine) {
        //  routine && routine.$set('value',val);
        routine.value = val
        routine.save();
        return true
    }
    return false
}
